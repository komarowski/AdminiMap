using Microsoft.EntityFrameworkCore;
using AdminiMapBackend.Services;
using AdminiMapBackend.Entities;

namespace AdminiMapBackend.Data
{
  /// <summary>
  /// To generate initial data.
  /// </summary>
  public static class InitialData
  {
    /// <summary>
    /// Generate initial data.
    /// </summary>
    /// <param name="serviceProvider"></param>
    public static void Initialize(IServiceProvider serviceProvider)
    {
      using var context = new AdminiMapContext(
          serviceProvider.GetRequiredService<
              DbContextOptions<AdminiMapContext>>());

      var noteList = MarkdownService.ConvertMarkdownToHtml();
      if (noteList.Count > 0)
      {
        context.Notes.AddRange(noteList);
        FileService.CopyImages();
      }

      context.Users.Add(new User() { Name = "test", Password = "0000", AccessLevel = (int)AccessLevels.Admin });
      context.SaveChanges();
    }

    /// <summary>
    /// Tags array.
    /// </summary>
    public static readonly Tag[] Tags = 
      { 
        new Tag() { Number = 1, Title = "mytravel"},
        new Tag() { Number = 2, Title = "attractions"},
        new Tag() { Number = 4, Title = "walkingplaces"},
        new Tag() { Number = 8, Title = "forinstagram"},
      };
  }
}
