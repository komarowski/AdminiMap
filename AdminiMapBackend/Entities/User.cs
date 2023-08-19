using System.ComponentModel.DataAnnotations;

namespace AdminiMapBackend.Entities
{
  /// <summary>
  /// User roles.
  /// </summary>
  public enum Roles
  {
    /// <summary>User role.</summary>
    User,
    /// <summary>Admin role.</summary>
    Admin
  }

  /// <summary>
  ///  Entity for user.
  /// </summary>
  public class User
  {
    /// <summary>User Id.</summary>
    public int Id { get; set; }

    /// <summary>User number.</summary>
    [MaxLength(4)]
    public string Number { get; set; }

    [MaxLength(20)]
    /// <summary>User name.</summary>
    public string Name { get; set; }

    [MaxLength(20)]
    /// <summary>User password.</summary>
    public string Password { get; set; }

    /// <summary>User role.</summary>
    public int Role { get; set; }
  }
}
