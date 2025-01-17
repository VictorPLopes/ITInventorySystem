using System.Text;
using ITInventorySystem.Data;
using ITInventorySystem.Models;
using ITInventorySystem.Repositories.Interfaces;
using ITInventorySystem.Repositories.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Adicionar os serviços ao contêiner.
builder.Services.AddControllers();

//Add configuration to use JWT
var key = Encoding.ASCII.GetBytes(Settings.Secret);

builder.Services.AddAuthorizationBuilder()
       .SetDefaultPolicy(new AuthorizationPolicyBuilder()
                         .RequireAuthenticatedUser()
                         .Build());
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme    = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken            = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer           = false,
        ValidateAudience         = false,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey         = new SymmetricSecurityKey(key)
    };
});

// Configuração de CORS para permitir a origem do frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        // Ajuste o URL do seu frontend. Aqui está configurado para localhost:3000
        policy.WithOrigins("http://localhost:5173") // URL do seu frontend (ajuste conforme necessário)
              .AllowAnyMethod() // Permite qualquer método HTTP (GET, POST, PUT, DELETE, etc.)
              .AllowAnyHeader() // Permite qualquer cabeçalho
              .AllowCredentials(); // Permite enviar cookies ou credenciais
    });
});

// Configuração do Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description =
            "JWT Authorization header using the Bearer scheme.\n\nEnter 'Bearer <your-token>' in the text box below.\n\nExample: \"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\"",
        Name   = "Authorization", // Name of the HTTP header
        In     = ParameterLocation.Header, // The location where the token is sent
        Type   = SecuritySchemeType.Http, // Type of the scheme
        Scheme = "Bearer" // Scheme name
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id   = "Bearer"
                }
            },
            [] // No scopes are required for now
        }
    });
});


// Injeção de dependências para os serviços
builder.Services.AddScoped<IUserInterface, UserService>();
builder.Services.AddScoped<IClientInterface, ClientService>();
builder.Services.AddScoped<IAuthenticationInterface, AuthenticationService>();
builder.Services.AddScoped<IWorkOrderInterface, WorkOrderService>();
builder.Services.AddScoped<IProductInterface, ProductService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IStockMovementInterface, StockMovementService>();

// Configuração do banco de dados com SQL Server
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration
                                .GetConnectionString("DefaultConnection"));
});

var app = builder.Build();

// Configuração do pipeline HTTP.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Habilitar CORS com a política definida
app.UseCors("AllowFrontend");

// Configuração de autorização
app.UseHttpsRedirection();
app.UseAuthentication(); //Add configuration to use JWT
app.UseAuthorization(); //Add configuration to use JWT

// Mapear os controllers
app.MapControllers();

// Inicia a aplicação
app.Run();