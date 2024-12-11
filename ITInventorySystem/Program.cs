using System.Text;
using ITInventorySystem.Data;
using ITInventorySystem.Models;
using ITInventorySystem.Repositories.Interfaces;
using ITInventorySystem.Repositories.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

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
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key)
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
builder.Services.AddSwaggerGen();

// Injeção de dependências para os serviços
builder.Services.AddScoped<IUserInterface, UserService>();
builder.Services.AddScoped<IClientInterface, ClientService>();
builder.Services.AddScoped<IAuthenticationInterface, AuthenticationService>();
builder.Services.AddScoped<IWorkOrderInterface, WorkOrderService>();
builder.Services.AddScoped<IProductInterface, ProductService>();

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