using ITInventorySystem.Data;
using ITInventorySystem.Repositories.Implementations;
using ITInventorySystem.Repositories.Interfaces;
using ITInventorySystem.Repositories.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Adicionar os serviços ao contêiner.
builder.Services.AddControllers();

// Configuração de CORS para permitir a origem do frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        // Ajuste o URL do seu frontend. Aqui está configurado para localhost:3000
        policy.WithOrigins("http://localhost:5173") // URL do seu frontend (ajuste conforme necessário)
              .AllowAnyMethod()   // Permite qualquer método HTTP (GET, POST, PUT, DELETE, etc.)
              .AllowAnyHeader()   // Permite qualquer cabeçalho
              .AllowCredentials(); // Permite enviar cookies ou credenciais
    });
});

// Configuração do Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Injeção de dependências para os serviços
builder.Services.AddScoped<IUserInterface, UserService>();
builder.Services.AddScoped<IClientInterface, ClientService>();
builder.Services.AddScoped<IWorkOrderInterface, WorkOrderService>();
builder.Services.AddScoped<IProductInterface, ProductService>();

// Configuração do banco de dados com SQL Server
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

var app = builder.Build();

// Configuração do pipeline HTTP.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Habilitar CORS com a política definida
app.UseCors("AllowFrontend");

// Configuração de autorização
app.UseAuthorization();

// Mapear os controllers
app.MapControllers();

// Inicia a aplicação
app.Run();
