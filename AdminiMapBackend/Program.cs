using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using AdminiMapBackend.Data;
using AdminiMapBackend.Services;
using AdminiMapBackend.API;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services
  .AddEndpointsApiExplorer()
  .AddSwaggerGen();
builder.Services.AddDbContext<AdminiMapContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("AdminiMapContext") 
    ?? throw new InvalidOperationException("Connection string 'AdminiMapContext' not found.")));
builder.Services
  .AddScoped<NoteService>()
  .AddScoped<ReactEndpoints>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
  var service = scope.ServiceProvider.GetService<ReactEndpoints>();
  service.RegisterReactAPIs(app);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  //app.UseSwaggerUI();
  app.UseSwaggerUI(c =>
  {
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
  });
}
else
{
  app.UseExceptionHandler("/Error");
  // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
  app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapRazorPages();

app.Run();
