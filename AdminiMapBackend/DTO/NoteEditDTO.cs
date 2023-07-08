namespace AdminiMapBackend.DTO
{
  /// <summary>
  /// DTO for edit note.
  /// </summary>
  public class NoteEditDTO
  {
    /// <summary>
    /// Note number.
    /// </summary>
    public string? Number { get; set; }

    /// <summary>
    /// Markdown text.
    /// </summary>
    public string Text { get; set; } = string.Empty;
  }
}
