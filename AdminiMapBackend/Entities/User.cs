namespace AdminiMapBackend.Entities
{
  /// <summary>
  /// User access levels.
  /// </summary>
  public enum AccessLevels
  {
    /// <summary>User access level.</summary>
    User,
    /// <summary>Admin access level.</summary>
    Admin
  }

  /// <summary>
  ///  Entity for user.
  /// </summary>
  public class User
  {
    /// <summary>User Id.</summary>
    public int Id { get; set; }

    /// <summary>User name.</summary>
    public string Name { get; set; }

    /// <summary>User password.</summary>
    public string Password { get; set; }

    /// <summary>Access level.</summary>
    public int AccessLevel { get; set; }

    /// <summary>Authentication token.</summary>
    public string? Token { get; set; }

    /// <summary>Token expiration time.</summary>
    public DateTime ExpirationTime { get; set; }
  }
}
