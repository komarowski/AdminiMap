using AdminiMapBackend;
using AdminiMapBackend.Data;
using AdminiMapBackend.DTO;
using AdminiMapBackend.Services;
using Microsoft.EntityFrameworkCore;
using System.Net;

var builder = WebApplication.CreateBuilder(args);
builder.Services
  .AddEndpointsApiExplorer()
  .AddSwaggerGen()
  .AddDbContext<AdminiMapContext>(opt => opt.UseInMemoryDatabase("AdminiMapDatabase"))
  .AddScoped<UserService>()
  .AddScoped<NoteService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

using var scope = app.Services.CreateScope();
{
  InitialData.Initialize(scope.ServiceProvider);
}

#region react endpoints

app.MapGet("/", async (HttpContext ctx) =>
{
  ctx.Response.Headers.ContentType = new Microsoft.Extensions.Primitives.StringValues("text/html; charset=UTF-8");
  await ctx.Response.SendFileAsync("wwwroot/index.html");
});

app.MapGet("/login", async (HttpContext ctx) =>
{
  ctx.Response.Headers.ContentType = new Microsoft.Extensions.Primitives.StringValues("text/html; charset=UTF-8");
  await ctx.Response.SendFileAsync("wwwroot/index.html");
});

app.MapGet("/profile", async (HttpContext ctx) =>
{
  ctx.Response.Headers.ContentType = new Microsoft.Extensions.Primitives.StringValues("text/html; charset=UTF-8");
  await ctx.Response.SendFileAsync("wwwroot/index.html");
});

#endregion

#region public endpoints

app.MapGet("/api/notes", async (NoteService noteService, string? query, int? tags) =>
{
  return await noteService.GetNotesAsync(query, tags);
});

app.MapGet("/api/notes/{number}", async (NoteService noteService, string? number) =>
{
  var note = await noteService.GetNoteAsync(number);
  return note is null
    ? Results.NotFound()
    : Results.Ok(note);
});

app.MapGet("/api/mapnotes", async (NoteService noteService, string? query, int? tags, double? zoom, double? lon, double? lat) =>
{
  return await noteService.GetNotesAsync(query, tags, zoom, lon, lat);
});

app.MapGet("/api/suggestions", async (NoteService noteService, string? start) =>
{
  return await noteService.GetSuggestionsAsync(start);
});

app.MapPost("/api/login", async (UserService userService, LoginDTO loginDTO) =>
{
  return await userService.SignInAsync(loginDTO.Login, loginDTO.Password);
});
#endregion

#region private user endpoints

app.MapGet("/api/admin0/user/{name}", (UserService userService, string name) =>
{
  return userService.GetUser(name);
});

app.MapGet("api/admin0/notes/{number}", (NoteService noteService, string number) =>
{
  //if (number == "null") 
  //  return string.Empty;
  return FileService.GetMarkdown(number);
});

app.MapPost("api/admin0/notes", async (NoteService noteService, NoteEditDTO note) =>
{
  return await noteService.SaveNote(note.Number, note.Text);
});

app.MapDelete("api/admin0/notes/{number}", async (NoteService noteService, string number) =>
{
  return await noteService.DeleteNoteAsync(number);
});

app.MapGet("api/admin0/images/{number}", (string number) =>
{
  return FileService.GetTargetNoteImageNames(number);
});

app.MapPost("api/admin0/images/{number}", async (HttpRequest request, string number) =>
{
  await FileService.SaveImagesAsync(request.Form.Files, number);
  return FileService.GetTargetNoteImageNames(number); ;
});

app.MapDelete("api/admin0/images/{name}/{number}", (string name, string number) =>
{
  FileService.DeleteImage(name);
  return FileService.GetTargetNoteImageNames(number);
});

#endregion

#region private admin endpoints

app.MapGet("/api/admin1/regenerate", async (AdminiMapContext context) =>
{
  var noteList = MarkdownService.ConvertMarkdownToHtml();
  if (noteList.Count > 0)
  {
    context.Notes.RemoveRange(context.Notes);
    await context.Notes.AddRangeAsync(noteList);
    await context.SaveChangesAsync();
    FileService.CopyImages();
  }
  return noteList;
});

app.MapGet("/api/admin1/backup", async () =>
{
  var bytes = await FileService.GetBackupAsync();
  return Results.File(bytes, contentType: "application/zip", "backup.zip");
});

#endregion

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
app.UseMiddleware<AuthMiddleware>();

app.Run();
