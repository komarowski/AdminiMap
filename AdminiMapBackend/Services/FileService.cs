using System.IO.Compression;
using System.Text;

namespace AdminiMapBackend.Services
{
  /// <summary>
  /// Service for file management.
  /// </summary>
  public static class FileService
  {
    /// <summary>
    /// Current working directory of application.
    /// </summary>
    public readonly static string RootFolder = Directory.GetCurrentDirectory();

    private const string SourceFolder = "source";

    private const string BackupZip = "backup.zip";

    private const string TargetNoteFolder = "wwwroot\\notes";

    private const string TargetImageFolder = "wwwroot\\images";

    private const string SourceNoteFolder = "source\\markdown";

    private const string SourceImageFolder = "source\\images";

    private static readonly DirectoryInfo SourceNoteFolderInfo = new(SourceNoteFolder);

    private static readonly DirectoryInfo TargetImageFolderInfo = new(TargetImageFolder);

    private static readonly DirectoryInfo SourceImageFolderInfo = new(SourceImageFolder);

    /// <summary>
    /// Get markdown filename from note number.
    /// </summary>
    /// <param name="number">Note number.</param>
    /// <returns>Markdown filename.</returns>
    public static string GetMarkdownPath(string number)
    {
      return Path.Combine(SourceNoteFolder, number + ".md");
    }

    /// <summary>
    /// Get html filename from note number.
    /// </summary>
    /// <param name="number">Note number.</param>
    /// <returns>Html filename.</returns>
    public static string GetHtmlPath(string number)
    {
      return Path.Combine(TargetNoteFolder, number + ".html");
    }

    /// <summary>
    /// Get array of markdown files.
    /// </summary>
    /// <returns>Array of markdown files.</returns>
    public static FileInfo[] GetMarkdownFiles()
    {
      return SourceNoteFolderInfo.GetFiles("*.md", SearchOption.TopDirectoryOnly);
    }

    /// <summary>
    /// Get array of image files.
    /// </summary>
    /// <param name="folder">Image folder.</param>
    /// <returns>IEnumerable of image files.</returns>
    private static IEnumerable<FileInfo> GetImageFiles(DirectoryInfo folder)
    {
      return folder
        .GetFiles("*.*", SearchOption.TopDirectoryOnly)
        .Where(file => file.Extension == ".jpeg" || file.Extension == ".jpg" || file.Extension == ".png" || file.Extension == ".gif");
    }

    /// <summary>
    /// Get array of all note images.
    /// </summary>
    /// <param name="number">Note number.</param>
    /// <returns>Array of image files.</returns>
    public static FileInfo[] GetAllNoteImageFiles(string number)
    {
      var imageList = GetImageFiles(TargetImageFolderInfo).ToList();
      imageList.AddRange(GetImageFiles(SourceImageFolderInfo).ToList());
      return imageList
        .Where(file => file.Name.StartsWith($"{number}_"))
        .ToArray();
    }

    /// <summary>
    /// Get array of target note image names.
    /// </summary>
    /// <param name="number">Note number.</param>
    /// <returns>Array of image file names.</returns>
    public static string[] GetTargetNoteImageNames(string number)
    {
      var images = GetImageFiles(TargetImageFolderInfo);
      return images
        .Where(file => file.Name.StartsWith($"{number}_"))
        .Select(image => image.Name)
        .ToArray();
    }

    /// <summary>
    /// Get array of all source image files.
    /// </summary>
    /// <returns>Array of image files.</returns>
    private static FileInfo[] GetSourceImageFiles()
    {
      return GetImageFiles(SourceImageFolderInfo).ToArray();
    }

    /// <summary>
    /// Saving note images.
    /// </summary>
    /// <param name="files">File collection.</param>
    /// <param name="number">Note number.</param>
    /// <returns>Task.</returns>
    public static async Task SaveImagesAsync(IFormFileCollection files, string number)
    {
      foreach (var file in files)
      {
        var fileName = $"{number}_{file.FileName}";
        string filePath = Path.Combine(TargetImageFolder, fileName);
        await SaveFileAsync(file, filePath);
        filePath = Path.Combine(SourceImageFolder, fileName);
        await SaveFileAsync(file, filePath);
      }
    }

    /// <summary>
    /// Saving image.
    /// </summary>
    /// <param name="file">Image file.</param>
    /// <param name="path">Image path.</param>
    /// <returns>Task.</returns>
    public static async Task SaveFileAsync(IFormFile file, string path)
    {
      using Stream fileStream = new FileStream(path, FileMode.Create);
      await file.CopyToAsync(fileStream);
    }

    /// <summary>
    /// Create directory if not exist.
    /// </summary>
    /// <param name="folder"></param>
    private static void CreateDirectory(string folder)
    {
      if (!Directory.Exists(folder))
      {
        Directory.CreateDirectory(folder);
      }
    }

    /// <summary>
    /// Create target directories for notes and images.
    /// </summary>
    public static void CreateTargetDirectories()
    {
      CreateDirectory(TargetNoteFolder);
      CreateDirectory(TargetImageFolder);
    }

    /// <summary>
    /// Get note markdown text.
    /// </summary>
    /// <param name="number">Note number.</param>
    /// <returns>Markdown text or null if not exist.</returns>
    public static string? GetMarkdown(string number)
    {
      var markdownPath = GetMarkdownPath(number);
      return File.Exists(markdownPath) 
        ? File.ReadAllText(markdownPath, Encoding.UTF8) 
        : null;
    }

    /// <summary>
    /// Delete note and all related files.
    /// </summary>
    /// <param name="number">Note number.</param>
    public static void DeleteNote(string number)
    {
      var targetPath = GetHtmlPath(number);
      File.Delete(targetPath);
      var sourcePath = GetMarkdownPath(number);
      File.Delete(sourcePath);
      var noteImages = GetAllNoteImageFiles(number);
      foreach (var image in noteImages)
      {
        File.Delete(image.FullName);
      }
    }

    /// <summary>
    /// Delete image.
    /// </summary>
    /// <param name="imageName">Image name.</param>
    public static void DeleteImage(string imageName)
    {
      var path = Path.Combine(TargetImageFolder, imageName);
      File.Delete(path);
      path = Path.Combine(SourceImageFolder, imageName);
      File.Delete(path);
    }

    /// <summary>
    /// Copy images from source to target folder.
    /// </summary>
    public static void CopyImages()
    {
      var files = GetSourceImageFiles();
      foreach (var file in files)
      {
        var targetPath = file.FullName.Replace(SourceImageFolder, TargetImageFolder);
        File.Copy(file.FullName, targetPath, true);
      }
    }

    /// <summary>
    /// Get backup zip folder.
    /// </summary>
    /// <returns>Byte array.</returns>
    public static async Task<byte[]> GetBackupAsync()
    {
      ZipFile.CreateFromDirectory(SourceFolder, BackupZip);
      return await File.ReadAllBytesAsync(BackupZip);
    }
  }
}
