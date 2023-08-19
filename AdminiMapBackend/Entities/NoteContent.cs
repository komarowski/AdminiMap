using System.ComponentModel.DataAnnotations;

namespace AdminiMapBackend.Entities
{
  public class NoteContent
  {
    /// <summary>Note content Id.</summary>
    public int Id { get; set; }

    /// <summary>Note Id.</summary>
    public int NoteId { get; set; }

    /// <summary>Markdown content.</summary>
    public string Content { get; set; }
  }
}
