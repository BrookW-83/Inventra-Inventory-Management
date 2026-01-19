namespace InventoryManagement.Application.DTOs;

public class CreateCheckoutSessionResponse
{
    public string SessionId { get; set; } = string.Empty;
    public string SessionUrl { get; set; } = string.Empty;
}

public class PaymentConfigResponse
{
    public string PublishableKey { get; set; } = string.Empty;
}
