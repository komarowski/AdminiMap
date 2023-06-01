using AdminiMapBackend.Entities;

namespace AdminiMapBackend.DTO
{
  /// <summary>
  /// DTO for note marker.
  /// </summary>
  public class NoteMarkerDTO
  {
    /// <summary>Note number.</summary>
    public string Number { get; set; }

    /// <summary>Note title.</summary>
    public string Title { get; set; }

    /// <summary>Note author username.</summary>
    public string UserName { get; set; }

    /// <summary>The latitude of the place in the note.</summary>
    public double Latitude { get; set; }

    /// <summary>The longitude of the place in the note.</summary>
    public double Longitude { get; set; }

    /// <summary>
    /// DTO for note marker.
    /// </summary>
    /// <param name="note">Contains all important information about the note.</param>
    public NoteMarkerDTO(Note note)
    {
      this.Number = note.Number;
      this.Title = note.Title;
      this.UserName = note.UserName;
      this.Latitude = note.Latitude;
      this.Longitude = note.Longitude;
    }
  }
}
