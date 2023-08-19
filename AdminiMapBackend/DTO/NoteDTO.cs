using AdminiMapBackend.Entities;

namespace AdminiMapBackend.DTO
{
  public class NoteDTO
  {
    /// <summary>Note number.</summary>
    public string Number { get; set; }

    /// <summary>Note title.</summary>
    public string Title { get; set; }

    /// <summary>Sum of note tag numbers.</summary>
    public int Tags { get; set; }

    /// <summary>Note author user name.</summary>
    public string UserName { get; set; }

    /// <summary>The latitude of the place in the note.</summary>
    public double Latitude { get; set; }

    /// <summary>The longitude of the place in the note.</summary>
    public double Longitude { get; set; }

    /// <summary>The time the note was last updated.</summary>
    public DateTime LastUpdate { get; set; }

    public NoteDTO(Note note, User user)
    {
      this.Number = note.Number;
      this.Title = note.Title;
      this.Tags = note.Tags;
      this.Latitude = note.Latitude;
      this.Longitude = note.Longitude;
      this.LastUpdate = note.LastUpdate;
      this.UserName = user.Name;
    }
  }
}
