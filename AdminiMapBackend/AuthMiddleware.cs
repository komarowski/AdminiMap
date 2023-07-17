using AdminiMapBackend.Data;
using AdminiMapBackend.Entities;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace AdminiMapBackend
{
  /// <summary>
  /// Authentication middleware.
  /// </summary>
  public class AuthMiddleware
  {
    private readonly RequestDelegate next;

    private readonly static Dictionary<string, AccessLevels> accessPaths = new() 
    { 
      { "/api/admin0", AccessLevels.User },
      { "/api/admin1", AccessLevels.Admin }
    };

    /// <summary>
    /// Authentication middleware.
    /// </summary>
    /// <param name="next">Next request.</param>
    public AuthMiddleware(RequestDelegate next)
    {
      this.next = next;
    }

    public async Task Invoke(HttpContext context, AdminiMapContext dbContext)
    {
      var requsetPath = context.Request.Path;
      foreach (var accessPath in accessPaths)
      {
        if (requsetPath.StartsWithSegments(accessPath.Key))
        {
          var isAccess = await CheckAccessRightsAsync(context.Request, dbContext, accessPath.Value);
          if (!isAccess)
          {
            context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
            await context.Response.CompleteAsync();
            return;
          }

          await this.next.Invoke(context);
          return;
        }
      }

      await this.next.Invoke(context);
    }

    /// <summary>
    /// Check access right by request header parameters.
    /// </summary>
    /// <param name="request">Request data.</param>
    /// <param name="dbContext">Database context.</param>
    /// <param name="requiredAccessLevel">Required access level</param>
    /// <returns>
    /// <para>true - have access</para>
    /// <para>false - does not have access</para>
    /// </returns>
    private static async Task<bool> CheckAccessRightsAsync(HttpRequest request, AdminiMapContext dbContext, AccessLevels requiredAccessLevel)
    {
      var token = request.Headers["AuthToken"].ToString();
      var userName = request.Headers["AuthName"].ToString();
      if (string.IsNullOrEmpty(token) || string.IsNullOrEmpty(userName))
        return false;

      var user = await dbContext.Users
           .FirstOrDefaultAsync(user => user.Name == userName && user.Token == token && DateTime.Now < user.ExpirationTime);
      if (user is null || user.AccessLevel < (int)requiredAccessLevel)
        return false;

      return true;
    }
  }
}
