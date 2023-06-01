using AdminiMapBackend.Entities;
using Markdig;
using Markdig.Extensions.Yaml;
using Markdig.Syntax;
using System.Text;
using System.Text.RegularExpressions;
using YamlDotNet.Serialization;

namespace AdminiMapBackend.Services
{
  /// <summary>
  /// Service for manage markdown files.
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
      foreach (var markdownFile in markdownFiles)
      {
        var markdown = File.ReadAllText(markdownFile.FullName, Encoding.UTF8);
        var markdownFrontMatter = GetFrontMatter<NoteFrontMatter>(markdown);
        if (markdownFrontMatter is null)
          continue;

        var note = new Note() 
        { 
          Title = markdownFrontMatter.Title,
          Number = markdownFile.Directory.Name,
          UserName = markdownFrontMatter.UserName,
          Longitude = markdownFrontMatter.Longitude,
          Latitude = markdownFrontMatter.Latitude,
          LastUpdate = markdownFile.LastWriteTimeUtc
        };
        noteList.Add(note);
        
        markdown = ChangeImagePaths(markdown, note.Number);
        var html = Markdown.ToHtml(markdown, Pipeline);
        var targetHtmlPath = FileService.GetHtmlPathFromMarkdownPath(markdownFile.FullName);
        var targetDirectory = Path.GetDirectoryName(targetHtmlPath);
        if (targetDirectory is null)
          continue;

        Directory.CreateDirectory(targetDirectory);
        File.WriteAllText(targetHtmlPath, html, Encoding.UTF8);
      }

      return noteList;
    }

    /// <summary>
    /// Change image paths in markdown text to display correctly on the client side. 
    /// </summary>
    /// <param name="markdownText">Markdown text.</param>
    /// <param name="noteNumber">Note subfolder name.</param>
    /// <returns>Edited markdown text.</returns>
    private static string ChangeImagePaths(string markdownText, string noteNumber)
    {
      MatchCollection matches = new Regex("!\\[.*\\]\\(.*\\)").Matches(markdownText);
      if (matches.Count == 0)
        return markdownText;

      var relativeDirectory = $"notes/{noteNumber}/";
      foreach (Match match in matches)
      {
        var newMarkdownImageLine = match.Value;
        newMarkdownImageLine = newMarkdownImageLine.Insert(newMarkdownImageLine.IndexOf('(') + 1, relativeDirectory);
        markdownText = markdownText.Replace(match.Value, newMarkdownImageLine);
      }
      return markdownText;
    }
  }
}
