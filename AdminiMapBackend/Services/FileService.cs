namespace AdminiMapBackend.Services
{
  /// <summary>
  /// Service for work with files.
  /// </summary>
  public static class FileService
  {
    public static string RootFolder = Directory.GetCurrentDirectory();

    private const string TargetStaticFolder = "wwwroot\\notes";

    private const string SourceStaticFolder = "MarkdownFiles";

    private const string MarkdownFileName = "index.md";

    private const string HtmlFileName = "index.html";

    /// <summary>
    ///  Get list of markdown files.
    /// </summary>
    /// <returns>Array of markdown files.</returns>
    public static FileInfo[] GetMarkdownFiles()
    {
      return new DirectoryInfo(SourceStaticFolder)
        .GetFiles(MarkdownFileName, SearchOption.AllDirectories);
    }

    /// <summary>
    /// Convert json filename to corresponding html filename.
    /// </summary>
    /// <param name="jsonPath">json filename.</param>
    /// <returns>html filename.</returns>
    public static string GetHtmlPathFromMarkdownPath(string jsonPath)
    {
      return jsonPath.Replace(MarkdownFileName, HtmlFileName)
        .Replace(SourceStaticFolder, TargetStaticFolder);
    }

    /// <summary>
    /// Convert source filename to target filename.
    /// </summary>
    /// <param name="path">Source filename.</param>
    /// <returns>Target filename.</returns>
    private static string GetTargetPathFromSourcePath(string path)
    {
      return path.Replace(SourceStaticFolder, TargetStaticFolder);
    }

    /// <summary>
    /// Get list of images.
    /// </summary>
    /// <returns>List of image file names.</returns>
    private static string[] GetImageFiles()
    {
      return Directory.GetFiles(SourceStaticFolder, "*.*", SearchOption.AllDirectories)
        .Where(file => file.EndsWith(".jpeg") || file.EndsWith(".jpg") || file.EndsWith(".png") || file.EndsWith(".gif"))
        .ToArray();
    }

    /// <summary>
    /// Copy images to target subfolders.
    /// </summary>
    public static void CopyImages()
    {
      var files = GetImageFiles();
      foreach (var sourcePath in files)
      {
        var tarhetPath = GetTargetPathFromSourcePath(sourcePath);
        File.Copy(sourcePath, tarhetPath, true);
      }
    }
  }
}
