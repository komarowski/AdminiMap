using Microsoft.EntityFrameworkCore;
using AdminiMapBackend.Services;

namespace AdminiMapBackend.Data
{
  /// <summary>
  /// To generate initial data.
  /// </summary>
  public class InitialData
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
        context.SaveChanges();
      }
      FileService.CopyImages();
    }
  }
}
