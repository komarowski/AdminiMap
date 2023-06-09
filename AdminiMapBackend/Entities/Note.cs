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
    public string Number { get; set; }

    /// <summary>Note title.</summary>
    public string Title { get; set; }

    /// <summary>Note tags.</summary>
    public int Tags { get; set; }

    /// <summary>Note tags string.</summary>
    public string TagsString { get; set; }

    /// <summary>Note author username.</summary>
    public string UserName { get; set; }

    /// <summary>The latitude of the place in the note.</summary>
    public double Latitude { get; set; }

    /// <summary>The longitude of the place in the note.</summary>
    public double Longitude { get; set; }

    /// <summary>The time the note was last updated.</summary>
    public DateTime LastUpdate { get; set; }
  }
}
