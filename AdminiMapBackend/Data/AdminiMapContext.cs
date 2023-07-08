using Microsoft.EntityFrameworkCore;
using AdminiMapBackend.Entities;

namespace AdminiMapBackend.Data
{
  /// <summary>
  /// DbContext for AdminiMap application.
  /// </summary>
  public class AdminiMapContext : DbContext
  {
    public AdminiMapContext(DbContextOptions<AdminiMapContext> options)
        : base(options) { }

    public DbSet<Note> Notes => Set<Note>();
    public DbSet<User> Users => Set<User>();
  }
}
