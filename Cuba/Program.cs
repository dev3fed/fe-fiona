using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using DotNetEnv;
using Microsoft.AspNetCore.Authentication;

var builder = WebApplication.CreateBuilder(args);

// 🌱 Load environment variables from .env
Env.Load();

// Get OIDC config from environment
var authority = Environment.GetEnvironmentVariable("AUTH_AUTHORITY") ?? "https://your-idp.com";
var clientId = Environment.GetEnvironmentVariable("AUTH_CLIENT_ID") ?? "your-client-id";
var clientSecret = Environment.GetEnvironmentVariable("AUTH_CLIENT_SECRET") ?? "your-client-secret";

// ✅ HTTPS redirection port
builder.Services.AddHttpsRedirection(options =>
{
    options.HttpsPort = 7085;
});

// ✅ Kestrel server config
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5085); // HTTP
    options.ListenAnyIP(7085, listenOptions =>
    {
        listenOptions.UseHttps(); // HTTPS
    });
});

// ✅ OIDC + Cookie Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
})
.AddCookie()
.AddOpenIdConnect(OpenIdConnectDefaults.AuthenticationScheme, options =>
{
    options.Authority = authority;
    options.ClientId = clientId;
    options.ClientSecret = clientSecret;
    options.ResponseType = "code"; // Authorization Code Flow
    options.RequireHttpsMetadata = false; // 👈 penting agar HTTP lokal diizinkan
    options.SaveTokens = true;

    options.GetClaimsFromUserInfoEndpoint = true;

    options.Scope.Add("openid");
    options.Scope.Add("profile");
    options.Scope.Add("email");

    options.TokenValidationParameters = new TokenValidationParameters
    {
        NameClaimType = "name",
        RoleClaimType = "role"
    };

    options.CallbackPath = "/signin-oidc"; // default OIDC callback
    options.SignedOutRedirectUri = "https://localhost:7085/";

    options.Events = new OpenIdConnectEvents
    {
        OnRemoteFailure = context =>
        {
            Console.WriteLine($"❌ OIDC Error: {context.Failure?.Message}");

            context.HandleResponse(); // Hentikan redirect bawaan
            context.Response.Redirect("/error?message=" + Uri.EscapeDataString(context.Failure?.Message ?? "Unknown error"));

            return Task.CompletedTask;
        }
    };
});

// ✅ Authorization
builder.Services.AddAuthorization();

// ✅ MVC support
builder.Services.AddControllersWithViews();

var app = builder.Build();

// ✅ Exception & HSTS
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseAuthentication(); // ⬅️ Wajib sebelum authorization
app.UseAuthorization();

// ✅ Default controller route
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

// ✅ Optional: login & logout route
app.MapGet("/login", () =>
    Results.Challenge(new AuthenticationProperties { RedirectUri = "/homePage/Index" },
        [OpenIdConnectDefaults.AuthenticationScheme]));

// app.MapGet("/logout", async (HttpContext context) =>
// {
//     await context.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
//     await context.SignOutAsync(OpenIdConnectDefaults.AuthenticationScheme);
//     return Results.Redirect("/");
// });

app.MapGet("/logout", async (HttpContext context) =>
{
    // Logout dari cookie ASP.NET
    await context.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
    
    // Redirect ke logout Auth0 (OIDC provider)
    var auth0Domain = Environment.GetEnvironmentVariable("AUTH_AUTHORITY")?.TrimEnd('/');
    var clientId = Environment.GetEnvironmentVariable("AUTH_CLIENT_ID");
    var returnTo = "https://localhost:7085/";

    var logoutUrl = $"{auth0Domain}/v2/logout?client_id={clientId}&returnTo={Uri.EscapeDataString(returnTo)}";
    context.Response.Redirect(logoutUrl);
});

app.MapGet("/", context =>
{
    context.Response.Redirect("/homepage/index");
    return Task.CompletedTask;
});
app.Run();
