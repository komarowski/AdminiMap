using System.ComponentModel.DataAnnotations;

namespace AdminiMapBackend.Entities
{
  /// <summary>
  /// Entity for tag.
  /// </summary>
  public class Tag
  {
    /// <summary>Tag Id.</summary>
    public int Id { get; set; }

    /// <summary>Tag number.</summary>
    public int Number { get; set; }

    /// <summary>Tag title.</summary>
    [MaxLength(20)]
    public string Title { get; set; }
  }
}
