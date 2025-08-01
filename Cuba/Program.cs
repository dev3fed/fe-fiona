using DotNetEnv;
var builder = WebApplication.CreateBuilder(args);

Env.Load();
// Add services to the container.
builder.Services.AddControllersWithViews();
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5085); // Replace with your desired port
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Authentication}/{action=LoginSimple}/{id?}");

app.Run();