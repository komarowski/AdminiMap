namespace AdminiMapBackend.DTO
{
  /// <summary>
  /// DTO for entry.
  /// </summary>
  public class LoginDTO
  {
    /// <summary>
    /// User name.
    /// </summary>
    public string Login { get; set; } = string.Empty;

    /// <summary>
    /// User password.
    /// </summary>
    public string Password { get; set; } = string.Empty;
  }
}
