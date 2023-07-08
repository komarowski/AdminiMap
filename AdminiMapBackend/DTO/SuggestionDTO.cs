namespace AdminiMapBackend.DTO
{
  /// <summary>
  /// DTO for note suggestions.
  /// </summary>
  public class SuggestionDTO
  {
    /// <summary>Note number.</summary>
    public string Number { get; set; } = string.Empty;

    /// <summary>Note title.</summary>
    public string Title { get; set; } = string.Empty;
  }
}
