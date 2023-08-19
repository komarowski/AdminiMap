using AdminiMapBackend.Data;
using AdminiMapBackend.DTO;
using AdminiMapBackend.Entities;
using Microsoft.EntityFrameworkCore;

namespace AdminiMapBackend.Services
{
  /// <summary>
  /// Service for note entity management.
  /// </summary>
  public class NoteService
  {
    private readonly AdminiMapContext context;

    /// <summary>
    /// Service for note entity management.
    /// </summary>
    /// <param name="context">Database context.</param>
    public NoteService(AdminiMapContext context)
    {
      this.context = context;
    }

    /// <summary>
    /// Save a new note or edit an existing one.
    /// </summary>
    /// <param name="number">Note number or null if this is a new note.</param>
    /// <param name="text">Note markdown text.</param>
    /// <returns>Saved note or null.</returns>
    public async Task<Note?> SaveNote(string? number, string text)
    {
      Note? note = MarkdownService.ConvertMarkdownToHtml(number, text);
      if (note is null)
        return null;

      if (number is null)
      {
        await context.Notes.AddAsync(note);
      }
      else
      {
        var editNote = await context.Notes.FirstOrDefaultAsync(note => note.Number == number);
        if (editNote is null)
          return null;

        editNote.Tags = note.Tags;
        editNote.Title = note.Title;
        editNote.Longitude = note.Longitude;
        editNote.Latitude = note.Latitude;
        editNote.LastUpdate = note.LastUpdate;
        //editNote.TagsString = note.TagsString;
        //editNote.UserName = note.UserName;
      }
      await context.SaveChangesAsync();
      return note;
    }

    /// <summary>
    /// Delete note.
    /// </summary>
    /// <param name="number">Note number.</param>
    /// <returns>Deleted note or null.</returns>
    public async Task<Note?> DeleteNoteAsync(string number)
    {
      var deleteNote = await context.Notes.FirstOrDefaultAsync(note => note.Number == number);
      if (deleteNote is null)
        return null;

      context.Notes.Remove(deleteNote);
      await context.SaveChangesAsync();
      FileService.DeleteNote(number);
      return deleteNote;
    }

    /// <summary>
    /// Get note by number.
    /// </summary>
    /// <param name="number">Note number.</param>
    /// <returns>Note or null.</returns>
    public async Task<Note?> GetNoteAsync(string? number)
    {
      if (!string.IsNullOrEmpty(number))
      {
        return await context.Notes.FirstOrDefaultAsync(note => note.Number == number);
      }
      return null;
    }

    /// <summary>
    /// Get a note array for a search query.
    /// <para>The search is performed by tags and note title or
    /// by username if query starts with "u/".</para> 
    /// If search query is null return last 5 updated notes.
    /// </summary>
    /// <param name="query">Search query.</param>
    /// <param name="tags">Tag sum.</param>
    /// <returns>Note array.</returns>
    public async Task<NoteDTO[]> GetNotesAsync(string? query, int? tags)
    {
      IQueryable<NoteDTO> contextQuery = GetJoinQuery();
      contextQuery = FilterByTags(contextQuery, tags);

      if (string.IsNullOrEmpty(query))
      {
        return await contextQuery
        .OrderByDescending(note => note.LastUpdate)
        .Take(5)
        .ToArrayAsync();
      }

      if (query.StartsWith("u/"))
      {
        contextQuery = FilterByUserName(contextQuery, query);
        return await contextQuery.ToArrayAsync();
      }

      contextQuery = FilterByTitle(contextQuery, query);
      return await contextQuery.ToArrayAsync();
    }

    /// <summary>
    /// Get a note array for a search query and the current state of the map.
    /// <para>The search is performed by coordinates, tags and note title or
    /// by username if query starts with "u/".</para>
    /// It will return an empty array if there are no map state parameters.
    /// </summary>
    /// <param name="query">Search query.</param>
    /// <param name="tags">Tag sum.</param>
    /// <param name="zoom">Map zoom.</param>
    /// <param name="lon">Map center longitude.</param>
    /// <param name="lat">Map center latitude.</param>
    /// <returns>Note array.</returns>
    public async Task<NoteDTO[]> GetNotesAsync(string? query, int? tags, double? zoom, double? lon, double? lat)
    {
      if (zoom is null || lon is null || lat is null)
      {
        return Array.Empty<NoteDTO>();
      }

      IQueryable<NoteDTO> contextQuery = GetJoinQuery();
      contextQuery = FilterByTags(contextQuery, tags);

      if (!string.IsNullOrEmpty(query))
      {
        contextQuery = query.StartsWith("u/") 
          ? FilterByUserName(contextQuery, query) 
          : FilterByTitle(contextQuery, query);
      }

      double delta = 0.0015 * Math.Pow(2, 19 - zoom.Value);
      double latTop = Math.Min(lat.Value + delta, 90.0);
      double latBottom = Math.Max(lat.Value - delta, -90.0);
      double longLeft = Math.Max(lon.Value - delta, -180.0);
      double longRight = Math.Min(lon.Value + delta, 180.0);
      return await contextQuery
      .Where(note => note.Latitude >= latBottom & note.Latitude <= latTop && note.Longitude >= longLeft && note.Longitude <= longRight)
      .ToArrayAsync();
    }

    /// <summary>
    /// Get a array of suggested notes for a search query.
    /// <para>The search is performed by note title or
    /// by username if query starts with "u/".</para> 
    /// </summary>
    /// <param name="start">Search query start.</param>
    /// <returns>Array of note suggestions.</returns>
    public async Task<SuggestionDTO[]> GetSuggestionsAsync(string? start)
    {
      if (string.IsNullOrEmpty(start))
      {
        return Array.Empty<SuggestionDTO>();
      }

      if (start.StartsWith("u/"))
      {
        var userNameStart = start[2..];

        return await context.Users
          .Select(user => user.Name)
          .Where(userName => userName.ToLower().StartsWith(userNameStart))
          .Take(4)
          .Select(userName => new SuggestionDTO() { Number = "u/" + userName, Title = "u/" + userName })
          .ToArrayAsync();
      }

      return await context.Notes
      .Where(note => note.Title.ToLower().Contains(start))
      .Take(4)
      .Select(note => new SuggestionDTO() { Number = note.Number, Title = note.Title })
      .ToArrayAsync();
    }

    /// <summary>
    /// Filter by tags.
    /// </summary>
    /// <param name="contextQuery">Database context query.</param>
    /// <param name="tagSum">Tag sum.</param>
    /// <returns>Filtered query.</returns>
    private static IQueryable<NoteDTO> FilterByTags(IQueryable<NoteDTO> contextQuery, int? tagSum)
    {
      if (tagSum is not null && tagSum > 0)
      {
        return contextQuery
          .Where(note => (note.Tags & tagSum) == tagSum);
      }
      return contextQuery;
    }

    /// <summary>
    /// Filter by user name.
    /// </summary>
    /// <param name="contextQuery">Database context query.</param>
    /// <param name="userNameStart">User name start.</param>
    /// <returns>Filtered query.</returns>
    private IQueryable<NoteDTO> FilterByUserName(IQueryable<NoteDTO> contextQuery, string userNameStart)
    {
      var userName = userNameStart.ToLower()[2..];
      if (userName.Length > 0)
      {
        return contextQuery
          .Where(note => note.UserName.ToLower().StartsWith(userName));       
      }
      return contextQuery;
    }

    /// <summary>
    /// Filter by title.
    /// </summary>
    /// <param name="contextQuery">Database context query.</param>
    /// <param name="title">Note title start.</param>
    /// <returns>Filtered query.</returns>
    private static IQueryable<NoteDTO> FilterByTitle(IQueryable<NoteDTO> contextQuery, string title)
    {
      return contextQuery = contextQuery
        .Where(note => note.Title.ToLower().Contains(title)); ;
    }

    /// <summary>
    /// Get tags string from tag sum.
    /// </summary>
    /// <param name="tagsSum">Tag sum.</param>
    /// <returns>Tags string.</returns>
    private string GetTagsString(int tagsSum)
    {
      var tags = this.context.Tags
        .Where(tag => (tagsSum & tag.Number) == tag.Number)
        .Select(tag => tag.Title)
        .ToArray();

      return string.Join(", ", tags);
    }

    private IQueryable<NoteDTO> GetJoinQuery()
    {
      return this.context.Notes
        .Join(context.Users,
        note => note.UserNumber,
        user => user.Number,
        (note, user) => new NoteDTO(note, user));
    }
  }
}
