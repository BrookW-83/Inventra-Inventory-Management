namespace InventoryManagement.Application.Interfaces;

public interface IStripeService
{
    Task<CreateCheckoutSessionResult> CreateCheckoutSessionAsync(Guid purchaseId, Guid userId);
    Task<bool> HandleWebhookAsync(string json, string signature);
}

public class CreateCheckoutSessionResult
{
    public string SessionId { get; set; } = string.Empty;
    public string SessionUrl { get; set; } = string.Empty;
}
