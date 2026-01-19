using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.Options;
using InventoryManagement.Application.DTOs;
using InventoryManagement.Application.Interfaces;
using InventoryManagement.API.Configuration;
using Stripe;

namespace InventoryManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentController : ControllerBase
{
    private readonly IStripeService _stripeService;
    private readonly StripeSettings _stripeSettings;
    private readonly ILogger<PaymentController> _logger;

    public PaymentController(
        IStripeService stripeService,
        IOptions<StripeSettings> stripeSettings,
        ILogger<PaymentController> logger)
    {
        _stripeService = stripeService;
        _stripeSettings = stripeSettings.Value;
        _logger = logger;
    }

    [HttpPost("create-checkout-session/{purchaseId}")]
    [Authorize]
    [EnableRateLimiting("strict")]
    public async Task<ActionResult<CreateCheckoutSessionResponse>> CreateCheckoutSession(Guid purchaseId)
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                          ?? User.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
        {
            return Unauthorized();
        }

        try
        {
            var result = await _stripeService.CreateCheckoutSessionAsync(purchaseId, userId);
            return Ok(new CreateCheckoutSessionResponse
            {
                SessionId = result.SessionId,
                SessionUrl = result.SessionUrl
            });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Failed to create checkout session for purchase {PurchaseId}", purchaseId);
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating checkout session for purchase {PurchaseId}", purchaseId);
            return StatusCode(500, new { message = "Failed to create checkout session" });
        }
    }

    [HttpPost("webhook")]
    [AllowAnonymous] // Stripe webhooks are verified via signature, not JWT
    public async Task<IActionResult> Webhook()
    {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        var signature = Request.Headers["Stripe-Signature"].ToString();

        if (string.IsNullOrEmpty(signature))
        {
            _logger.LogWarning("Stripe webhook received without signature");
            return BadRequest("Missing Stripe signature");
        }

        try
        {
            await _stripeService.HandleWebhookAsync(json, signature);
            return Ok();
        }
        catch (StripeException ex)
        {
            _logger.LogError(ex, "Stripe webhook signature verification failed");
            return BadRequest("Invalid signature");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing Stripe webhook");
            return StatusCode(500);
        }
    }

    [HttpGet("config")]
    public ActionResult<PaymentConfigResponse> GetConfig()
    {
        return Ok(new PaymentConfigResponse
        {
            PublishableKey = _stripeSettings.PublishableKey
        });
    }
}
