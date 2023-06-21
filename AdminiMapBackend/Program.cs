using Microsoft.EntityFrameworkCore;
using AdminiMapBackend.Data;
using AdminiMapBackend.DTO;
using AdminiMapBackend.Entities;
using AdminiMapBackend.Services;
using System.Net;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<AdminiMapContext>(opt => opt.UseInMemoryDatabase("AdminiMapDatabase"));
var app = builder.Build();

using var scope = app.Services.CreateScope();
{
  InitialData.Initialize(scope.ServiceProvider);
}

/*
 * Setting index.html as default page.
 */
app.MapGet("/", async (HttpContext ctx) =>
{
  ctx.Response.Headers.ContentType = new Microsoft.Extensions.Primitives.StringValues("text/html; charset=UTF-8");
  await ctx.Response.SendFileAsync("wwwroot/index.html");
});

/*
 * Get a list of notes for a search query.
 * The search is performed by note title or 
 * by username (if the query starts with "u/").
 * If search query is null return last updated notes.
 */
app.MapGet("/api/notes", async (string? query, int? tags, AdminiMapContext context) =>
{
  IQueryable<Note> contextQuery = context.Notes.AsQueryable();
  if (tags is not null && tags > 0)
  {
    contextQuery = contextQuery
    .Where(note => (note.Tags & tags) == tags);
  }

  if (string.IsNullOrEmpty(query))
  {
    return await contextQuery
    .OrderByDescending(note => note.LastUpdate)
    .Take(5)
    .ToArrayAsync();
  }
  
  if (query.StartsWith("u/"))
  {
    var userNameQuery = query[2..];
    return await contextQuery
    .Where(note => note.UserName.ToLower().StartsWith(userNameQuery))
    .ToArrayAsync();
  }

  return await contextQuery
  .Where(note => note.Title.ToLower().Contains(query))
  .ToArrayAsync();
});


/*
 * Get a note by its number.
 */
app.MapGet("/api/note", async (string? number, AdminiMapContext context) =>
{
  Note? note = null;
  if (!string.IsNullOrEmpty(number))
  {
    note = await context.Notes.FirstOrDefaultAsync(note => note.Number == number);   
  }

  if (note is null)
  {
    return Results.NotFound();
  }
  return Results.Ok(note);
});

/*
 * Get a list of suggested notes for a search query.
 * The search is performed by note title or 
 * by username (if the query starts with "u/").
 */
app.MapGet("/api/search", async (string? start, AdminiMapContext context) =>
{
  if (string.IsNullOrEmpty(start))
  {
    return Array.Empty<SuggestionDTO>();
  }

  if (start.StartsWith("u/"))
  {
    var userNameStart = start[2..];
    return await context.Notes
    .Select(note => note.UserName)
    .Where(userName => userName.ToLower().StartsWith(userNameStart))
    .Distinct()

    .Take(4)
    .Select(userName => new SuggestionDTO() { Number = "u/" + userName, Title = "u/" + userName })
    .ToArrayAsync();
  }

  return await context.Notes
  .Where(note => note.Title.ToLower().Contains(start))
  .Take(4)
  .Select(note => new SuggestionDTO() { Number = note.Number, Title = note.Title })
  .ToArrayAsync();
});

/*
 * Get a list of markers for the current state of the map.
 */
app.MapGet("/api/markers", async (string? query, int? tags, double? zoom, double? lon, double? lat, AdminiMapContext context) => {
  if (zoom is null || lon is null || lat is null)
  {
    return Array.Empty<Note>();
  }

  IQueryable<Note> contextQuery = context.Notes.AsQueryable();
  if (tags is not null && tags > 0)
  {
    contextQuery = contextQuery
    .Where(note => (note.Tags & tags) == tags);
  }

  if (!string.IsNullOrEmpty(query))
  {
    if (query.StartsWith("u/"))
    {
      var userNameQuery = query[2..];
      contextQuery = contextQuery
      .Where(note => note.UserName.ToLower().StartsWith(userNameQuery));
    } 
    else
    {
      contextQuery = contextQuery
      .Where(note => note.Title.ToLower().Contains(query));
    }
  }

  double delta = 0.0015 * Math.Pow(2, 19 - zoom.Value);
  double latTop = Math.Min(lat.Value + delta, 90.0);
  double latBottom = Math.Max(lat.Value - delta, -90.0);
  double longLeft = Math.Max(lon.Value - delta, -180.0);
  double longRight = Math.Min(lon.Value + delta, 180.0);
  return await contextQuery
  .Where(note => note.Latitude >= latBottom & note.Latitude <= latTop && note.Longitude >= longLeft && note.Longitude <= longRight)
  .ToArrayAsync();
});

/*
 * Regenerate markdown files.
 */
app.MapGet("/api/generate", async (AdminiMapContext context) => {
  var noteList = MarkdownService.ConvertMarkdownToHtml();
  if (noteList.Count > 0)
  {
    context.Notes.RemoveRange(context.Notes);
    await context.Notes.AddRangeAsync(noteList);
    await context.SaveChangesAsync();
  }
  FileService.CopyImages();
  return Task.CompletedTask;
});

// Set up a custom page for HTTP 404 response.
app.Use(async (context, next) =>
{
  await next();
  if (context.Response.StatusCode == (int)HttpStatusCode.NotFound)
  {
    var buffer = File.ReadAllBytes("wwwroot\\notfound.html");
    context.Response.ContentType = "text/html";
    context.Response.ContentLength = buffer.Length;
    using var stream = context.Response.Body;
    await stream.WriteAsync(buffer);
    await stream.FlushAsync();
  }
});

app.UseStaticFiles();

app.Run();
