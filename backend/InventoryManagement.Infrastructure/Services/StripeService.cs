using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Stripe;
using Stripe.Checkout;
using InventoryManagement.Application.Interfaces;
using InventoryManagement.Domain.Enums;
using InventoryManagement.Infrastructure.Data;

namespace InventoryManagement.Infrastructure.Services;

public class StripeService : IStripeService
{
    private readonly AppDbContext _context;
    private readonly StripeSettings _settings;
    private readonly ILogger<StripeService> _logger;

    public StripeService(
        AppDbContext context,
        IOptions<StripeSettings> settings,
        ILogger<StripeService> logger)
    {
        _context = context;
        _settings = settings.Value;
        _logger = logger;
    }

    public async Task<CreateCheckoutSessionResult> CreateCheckoutSessionAsync(Guid purchaseId, Guid userId)
    {
        var purchase = await _context.Purchases
            .Include(p => p.PurchaseItems)
            .FirstOrDefaultAsync(p => p.Id == purchaseId && p.UserId == userId);

        if (purchase == null)
        {
            throw new InvalidOperationException("Purchase not found");
        }

        if (purchase.PaymentStatus == PaymentStatus.Paid)
        {
            throw new InvalidOperationException("Purchase has already been paid");
        }

        var lineItems = purchase.PurchaseItems.Select(item => new SessionLineItemOptions
        {
            PriceData = new SessionLineItemPriceDataOptions
            {
                Currency = "usd",
                ProductData = new SessionLineItemPriceDataProductDataOptions
                {
                    Name = item.ItemName,
                    Description = string.IsNullOrEmpty(item.Description) ? null : item.Description
                },
                UnitAmountDecimal = item.UnitPrice * 100 // Stripe uses cents
            },
            Quantity = item.Quantity
        }).ToList();

        var options = new SessionCreateOptions
        {
            PaymentMethodTypes = new List<string> { "card" },
            LineItems = lineItems,
            Mode = "payment",
            SuccessUrl = _settings.SuccessUrl,
            CancelUrl = _settings.CancelUrl,
            Metadata = new Dictionary<string, string>
            {
                { "purchase_id", purchaseId.ToString() },
                { "user_id", userId.ToString() }
            }
        };

        var service = new SessionService();
        var session = await service.CreateAsync(options);

        // Update purchase with session ID
        purchase.StripeSessionId = session.Id;
        purchase.PaymentStatus = PaymentStatus.PendingPayment;
        purchase.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        _logger.LogInformation("Created Stripe checkout session {SessionId} for purchase {PurchaseId}",
            session.Id, purchaseId);

        return new CreateCheckoutSessionResult
        {
            SessionId = session.Id,
            SessionUrl = session.Url
        };
    }

    public async Task<bool> HandleWebhookAsync(string json, string signature)
    {
        try
        {
            var stripeEvent = EventUtility.ConstructEvent(json, signature, _settings.WebhookSecret);

            _logger.LogInformation("Received Stripe webhook event: {EventType}", stripeEvent.Type);

            switch (stripeEvent.Type)
            {
                case Events.CheckoutSessionCompleted:
                    var completedSession = stripeEvent.Data.Object as Session;
                    if (completedSession != null)
                    {
                        await HandleCheckoutSessionCompletedAsync(completedSession);
                    }
                    break;

                case Events.CheckoutSessionExpired:
                    var expiredSession = stripeEvent.Data.Object as Session;
                    if (expiredSession != null)
                    {
                        await HandleCheckoutSessionExpiredAsync(expiredSession);
                    }
                    break;

                default:
                    _logger.LogInformation("Unhandled Stripe event type: {EventType}", stripeEvent.Type);
                    break;
            }

            return true;
        }
        catch (StripeException ex)
        {
            _logger.LogError(ex, "Stripe webhook signature verification failed");
            throw;
        }
    }

    private async Task HandleCheckoutSessionCompletedAsync(Session session)
    {
        if (!session.Metadata.TryGetValue("purchase_id", out var purchaseIdStr) ||
            !Guid.TryParse(purchaseIdStr, out var purchaseId))
        {
            _logger.LogWarning("Could not extract purchase_id from session metadata");
            return;
        }

        var purchase = await _context.Purchases.FindAsync(purchaseId);
        if (purchase == null)
        {
            _logger.LogWarning("Purchase {PurchaseId} not found for completed session", purchaseId);
            return;
        }

        purchase.PaymentStatus = PaymentStatus.Paid;
        purchase.StripePaymentIntentId = session.PaymentIntentId;
        purchase.PaidAt = DateTime.UtcNow;
        purchase.Status = PurchaseStatus.Active; // Move to Active status after payment
        purchase.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        _logger.LogInformation("Purchase {PurchaseId} marked as paid", purchaseId);
    }

    private async Task HandleCheckoutSessionExpiredAsync(Session session)
    {
        if (!session.Metadata.TryGetValue("purchase_id", out var purchaseIdStr) ||
            !Guid.TryParse(purchaseIdStr, out var purchaseId))
        {
            _logger.LogWarning("Could not extract purchase_id from expired session metadata");
            return;
        }

        var purchase = await _context.Purchases.FindAsync(purchaseId);
        if (purchase == null)
        {
            _logger.LogWarning("Purchase {PurchaseId} not found for expired session", purchaseId);
            return;
        }

        purchase.PaymentStatus = PaymentStatus.Failed;
        purchase.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        _logger.LogInformation("Purchase {PurchaseId} payment session expired", purchaseId);
    }
}

// Settings class for DI
public class StripeSettings
{
    public string SecretKey { get; set; } = string.Empty;
    public string PublishableKey { get; set; } = string.Empty;
    public string WebhookSecret { get; set; } = string.Empty;
    public string SuccessUrl { get; set; } = string.Empty;
    public string CancelUrl { get; set; } = string.Empty;
}
