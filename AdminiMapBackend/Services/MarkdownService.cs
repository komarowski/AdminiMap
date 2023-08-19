using AdminiMapBackend.Data;
using AdminiMapBackend.Entities;
using Markdig;
using Markdig.Extensions.Yaml;
using Markdig.Syntax;
using System.Text;
using YamlDotNet.Serialization;

namespace AdminiMapBackend.Services
{
  /// <summary>
  /// Service for markdown files management.
  /// </summary>
  public static class MarkdownService
  {
    private static readonly IDeserializer YamlDeserializer = new DeserializerBuilder()
      .IgnoreUnmatchedProperties()
      .Build();

    private static readonly MarkdownPipeline Pipeline = new MarkdownPipelineBuilder()
      .UseAdvancedExtensions()
      .UseYamlFrontMatter()
      .Build();

    /// <summary>
    /// Get markdown file metadata.
    /// </summary>
    /// <typeparam name="T">Metadata format.</typeparam>
    /// <param name="markdown">Markdown text.</param>
    /// <returns>Metadata.</returns>
    public static T? GetFrontMatter<T>(this string markdown)
    {
      var document = Markdown.Parse(markdown, Pipeline);
      var yamlBlock = document
        .Descendants<YamlFrontMatterBlock>()
        .FirstOrDefault();

      if (yamlBlock is null)
        return default;

      var yaml = yamlBlock
        .Lines
        .Lines
        .OrderByDescending(x => x.Line)
        .Select(x => $"{x}\n")
        .ToList()
        .Select(x => x.Replace("---", string.Empty))
        .Where(x => !string.IsNullOrWhiteSpace(x))
        .Aggregate((s, agg) => agg + s);

      return YamlDeserializer.Deserialize<T>(yaml);
    }

    /// <summary>
    /// Converting markdown to html and saving html files with images.
    /// </summary>
    /// <returns>List of notes.</returns>
    public static List<Note> ConvertMarkdownToHtml()
    {
      var noteList = new List<Note>();
      FileInfo[] markdownFiles = FileService.GetMarkdownFiles();
      FileService.CreateTargetDirectories();
      foreach (var markdownFile in markdownFiles)
      {
        var markdown = File.ReadAllText(markdownFile.FullName, Encoding.UTF8);
        var markdownFrontMatter = GetFrontMatter<NoteFrontMatter>(markdown);
        if (markdownFrontMatter is null)
          continue;

        var noteNumber = Path.GetFileNameWithoutExtension(markdownFile.Name);
        var note = new Note() 
        { 
          Title = markdownFrontMatter.Title,
          Number = noteNumber,
          Tags = markdownFrontMatter.Tags,
          UserNumber = markdownFrontMatter.UserNumber,
          Longitude = markdownFrontMatter.Longitude,
          Latitude = markdownFrontMatter.Latitude,
          LastUpdate = markdownFile.LastWriteTimeUtc
        };
        noteList.Add(note);
        
        var html = Markdown.ToHtml(markdown, Pipeline);
        var targetHtmlPath = FileService.GetHtmlPath(noteNumber);
        File.WriteAllText(targetHtmlPath, html, Encoding.UTF8);
      }

      return noteList;
    }

    /// <summary>
    /// Converting markdown to html and saving markdown and html files.
    /// </summary>
    /// <param name="number">Note number.</param>
    /// <param name="markdown">Markdown text.</param>
    /// <returns>Note or null.</returns>
    public static Note? ConvertMarkdownToHtml(string? number, string markdown)
    {
      var markdownFrontMatter = GetFrontMatter<NoteFrontMatter>(markdown);
      if (markdownFrontMatter is null)
        return null;

      var noteNumber = number is null ? GetNewNumber() : number;
      var note = new Note()
      {
        Title = markdownFrontMatter.Title,
        Number = noteNumber,
        Tags = markdownFrontMatter.Tags,
        UserNumber = markdownFrontMatter.UserNumber,
        Longitude = markdownFrontMatter.Longitude,
        Latitude = markdownFrontMatter.Latitude,
        LastUpdate = DateTime.UtcNow
      };

      var html = Markdown.ToHtml(markdown, Pipeline);
      var targetPath = FileService.GetHtmlPath(noteNumber);
      File.WriteAllText(targetPath, html, Encoding.UTF8);
      var sourcePath = FileService.GetMarkdownPath(noteNumber);
      File.WriteAllText(sourcePath, markdown, Encoding.UTF8);
      return note;
    }

    /// <summary>
    /// Get integer from string.
    /// </summary>
    /// <param name="number">String integer.</param>
    /// <returns>Parse integer or 0 if it can't be parsed.</returns>
    private static int GetIntFromString(string number)
    {
      if (int.TryParse(number, out int result))
        return result;
      return 0;
    }

    /// <summary>
    /// Get note new unique number.
    /// </summary>
    /// <returns>Note number.</returns>
    private static string GetNewNumber()
    {
      var maxNumber = FileService.GetMarkdownFiles()
        .Select(file => GetIntFromString(Path.GetFileNameWithoutExtension(file.Name)))
        .Max();
      maxNumber++;
      return maxNumber
        .ToString()
        .PadLeft(4, '0');
    }
  }
}
