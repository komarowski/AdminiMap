using AdminiMapBackend.Data;
using AdminiMapBackend.DTO;

namespace AdminiMapBackend.Services
{
  /// <summary>
  /// Service for user management.
  /// </summary>
  public class UserService
  {
    private readonly AdminiMapContext context;
    private const int TokenExpirationTimeInDays = 3;

    /// <summary>
    /// Service for user management.
    /// </summary>
    /// <param name="context">Database context.</param>
    public UserService(AdminiMapContext context)
    {
      this.context = context;
    }

    /// <summary>
    /// Sign in user.
    /// </summary>
    /// <param name="login">User name.</param>
    /// <param name="password">User password.</param>
    /// <returns>UserDTO or null if the login information is not valid.</returns>
    public async Task<UserDTO?> SignInAsync(string login, string password)
    {
      var user = context.Users
        .FirstOrDefault(user => user.Name == login && user.Password == password);

      if (user is not null)
      {
        var newToken = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
        user.Token = newToken;
        user.ExpirationTime = DateTime.Now.AddDays(TokenExpirationTimeInDays);
        await context.SaveChangesAsync();
        return new UserDTO { Name = user.Name, AccessLevel = user.AccessLevel, Token = user.Token};
      }

      return null;
    }

    /// <summary>
    /// Get user by user name.
    /// </summary>
    /// <param name="userName">User name.</param>
    /// <returns>UserDTO or null.</returns>
    public UserDTO? GetUser(string userName)
    {
      var user = context.Users.FirstOrDefault(user => user.Name == userName);

      if (user is not null)
      {
        return new UserDTO { Name = user.Name, AccessLevel = user.AccessLevel, Token = user.Token };
      }

      return null;
    }
  }
}
