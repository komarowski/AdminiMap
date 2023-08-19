namespace AdminiMapBackend.DTO
{
  public enum AlertAction
  {
    Add,
    Edit,
    Delete,
    Sync,
    Error,
    Unknown
  }

  public class AlertDTO
  {
    private const string SuccessTitle = "Success!";
    private const string WarningTitle = "Warning!";
    private const string ErrorTitle = "Error!";

    private const string SuccessColor = "w3-green";
    private const string WarningColor = "w3-yellow";
    private const string ErrorColor = "w3-red";

    public string Title { get; set; }

    public string Text { get; set; }

    public string Color { get; set; }

    public AlertDTO(string title, string text, string color)
    {
      this.Title = title;
      this.Text = text;
      this.Color = color;
    }

    public static AlertDTO? GetAlertDTO(AlertAction mode) => mode switch
    {
      AlertAction.Add => new AlertDTO(SuccessTitle, "Item added.", SuccessColor),
      AlertAction.Edit => new AlertDTO(SuccessTitle, "Item changed.", SuccessColor),
      AlertAction.Delete => new AlertDTO(SuccessTitle, "Item deleted.", SuccessColor),
      AlertAction.Sync => new AlertDTO(SuccessTitle, "Static files are synced.", SuccessColor),
      AlertAction.Error => new AlertDTO(ErrorTitle, "Operation failed.", ErrorColor),
      _ => null,
    };
  }
}
