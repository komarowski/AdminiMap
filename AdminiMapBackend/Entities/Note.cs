using System.ComponentModel.DataAnnotations;

namespace AdminiMapBackend.Entities
{
  /// <summary>
  /// Note entity for database.
  /// </summary>
  public class Note
  {
    /// <summary>Note Id.</summary>
    public int Id { get; set; }

    /// <summary>Note number.</summary>
    [MaxLength(4)]
    public string Number { get; set; }

    /// <summary>Note title.</summary>
    [MaxLength(30)]
    public string Title { get; set; }

    /// <summary>Sum of note tag numbers.</summary>
    public int Tags { get; set; }

    /// <summary>User number.</summary>
    [MaxLength(4)]
    public string UserNumber { get; set; }

    /// <summary>The latitude of the place in the note.</summary>
    public double Latitude { get; set; }

    /// <summary>The longitude of the place in the note.</summary>
    public double Longitude { get; set; }

    /// <summary>The time the note was last updated.</summary>
    public DateTime LastUpdate { get; set; }
  }
}
