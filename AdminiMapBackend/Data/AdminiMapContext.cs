using AdminiMapBackend.Entities;
using Microsoft.EntityFrameworkCore;

namespace AdminiMapBackend.Data
{
  /// <summary>
  /// DbContext for AdminiMap application.
  /// </summary>
  public class AdminiMapContext : DbContext
  {
    public AdminiMapContext (DbContextOptions<AdminiMapContext> options)
        : base(options)
    {
    }

    public DbSet<Note> Notes => Set<Note>();

    public DbSet<NoteContent> NotesContent => Set<NoteContent>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Tag> Tags => Set<Tag>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      //modelBuilder.Entity<User>()
      //    .HasMany<Note>()
      //    .WithOne()
      //    .HasForeignKey(e => e.UserId)
      //    .IsRequired();

      modelBuilder.Entity<Note>()
        .HasOne<NoteContent>()
        .WithOne()
        .HasForeignKey<NoteContent>(noteContent => noteContent.NoteId)
        .IsRequired();

      modelBuilder.Entity<Note>()
        .HasAlternateKey(note => note.Number);
    }
  }
}
