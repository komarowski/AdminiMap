using AdminiMapBackend.Services;

namespace AdminiMapBackend.API
{
  public class ReactEndpoints
  {
    private readonly NoteService noteService;

    public ReactEndpoints(NoteService noteService)
    {
      this.noteService = noteService;
    }

    public void RegisterReactAPIs(WebApplication app)
    {
      app.MapGet("/api/notes", async (string? query, int? tags) =>
      {
        return await noteService.GetNotesAsync(query, tags);
      });

      app.MapGet("/api/notes/{number}", async (string? number) =>
      {
        var note = await noteService.GetNoteAsync(number);
        return note is null
          ? Results.NotFound()
          : Results.Ok(note);
      });

      app.MapGet("/api/mapnotes", async (string? query, int? tags, double? zoom, double? lon, double? lat) =>
      {
        return await noteService.GetNotesAsync(query, tags, zoom, lon, lat);
      });

      app.MapGet("/api/suggestions", async (string? start) =>
      {
        return await noteService.GetSuggestionsAsync(start);
      });
    }
  }
}
