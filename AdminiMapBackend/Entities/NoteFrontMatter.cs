using YamlDotNet.Serialization;

namespace AdminiMapBackend.Entities
{
  /// <summary>
  /// Metadata in Markdown files.
  /// </summary>
  public class NoteFrontMatter
  {
    [YamlMember(Alias = "title")]
    public string Title { get; set; }

    [YamlMember(Alias = "usernumber")]
    public string UserNumber { get; set; }

    [YamlMember(Alias = "tags")]
    public int Tags { get; set; }

    [YamlMember(Alias = "latitude")]
    public double Latitude { get; set; }

    [YamlMember(Alias = "longitude")]
    public double Longitude { get; set; }
  }
}
