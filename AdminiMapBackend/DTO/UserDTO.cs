namespace AdminiMapBackend.DTO
{
  /// <summary>
  /// DTO for user.
  /// </summary>
  public class UserDTO
  {
    /// <summary>
    /// User name.
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Access level.
    /// </summary>
    public int AccessLevel { get; set; }

    /// <summary>
    /// Authentication token.
    /// </summary>
    public string? Token { get; set; }
  }
}
