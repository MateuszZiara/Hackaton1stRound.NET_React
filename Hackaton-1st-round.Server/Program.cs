using System;
using System.Reflection;
using System.Security.Claims;
using FluentAssertions.Common;
using FluentMigrator.Runner;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Diagnostics;
using Microsoft.AspNetCore.Cors.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// Adding CORS headers

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder =>
        {
            builder.WithOrigins("https://localhost:5173");
            builder.AllowCredentials();
            builder.AllowAnyHeader();
            builder.AllowAnyMethod();
        });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
/*
builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlServer(
        "Server=localhost\\SQLEXPRESS;Database=Kwiaciarnia;Integrated Security=SSPI;Application Name=Kwiaciarnia; TrustServerCertificate=true;"));
builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<AspNetUsers>()
    .AddEntityFrameworkStores<DataContext>();
*/
builder.Services.AddFluentMigratorCore() // Move FluentMigrator registration here
    .ConfigureRunner(c =>
    {
        c.AddSqlServer2016()
            .WithGlobalConnectionString("Server=localhost\\SQLEXPRESS;Database=Hackaton;Integrated Security=SSPI;Application Name=Hackaton; TrustServerCertificate=true;")
            .ScanIn(Assembly.GetExecutingAssembly()).For.All();
    })
    .AddLogging(config => config.AddFluentMigratorConsole());

var app = builder.Build();
//app.MapIdentityApi<AspNetUsers>();
using var scope = app.Services.CreateScope();
//var migrator = scope.ServiceProvider.GetService<IMigrationRunner>();

//if (migrator != null)
//{
   // migrator.ListMigrations();
   // migrator.MigrateUp();
//}
//else
//{
  //  throw new Exception("Migration fault");
//}
app.UseCors("AllowAllOrigins");
app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();

/*class DataContext : IdentityDbContext<AspNetUsers>
{
    public DataContext(DbContextOptions<DataContext> options) : base(options){}
}*/