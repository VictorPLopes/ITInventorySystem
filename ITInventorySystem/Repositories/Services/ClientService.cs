using ITInventorySystem.Data;
using ITInventorySystem.DTO.Client;
using ITInventorySystem.Models;
using ITInventorySystem.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.IO;

namespace ITInventorySystem.Repositories.Implementations;

public class ClientService : IClientInterface
{
    private readonly AppDbContext _context;

    public ClientService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Client> AddAsync(ClientCreateDTO client)
    {
        var clt = new Client()
        {
            Name = client.Name,
            IdDoc = client.IdDoc,
            PhoneNumber = client.PhoneNumber,
            Email = client.Email,
            State = client.State,
            Street = client.Street,
            City = client.City,
            PostalCode = client.PostalCode
        };

        _context.Add(clt);
        await _context.SaveChangesAsync();

        return clt;
    }

    public async Task DeleteAsync(int id)
    {
        try
        {
            var clt = await _context.Clients
                .FirstOrDefaultAsync(cltDB => cltDB.Id == id);

            if (clt == null)
            {
                throw new KeyNotFoundException("Client not found!");
            }

            _context.Clients.Remove(clt);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {

            throw new InvalidOperationException("An error occurred while deleting the client.", ex);
        }
    }

    public async Task<IEnumerable<Client>> GetAllAsync()
    {
        return await _context.Clients.ToListAsync();
    }

    public async Task<Client> GetByIdAsync(int id)
    {
        var client = await _context.Clients.FindAsync(id);
        if (client == null)
        {
            throw new KeyNotFoundException("Client not found!");
        }
        return client;
    }

    public async Task UpdateAsync(ClientUpdateDTO client)
    {
        var clt = await _context.Clients
               .FirstOrDefaultAsync(cltDB => cltDB.Id == client.Id);

        if (clt == null)
        {
            throw new KeyNotFoundException("Client not found!");
        }

        clt.Name = client.Name;
        clt.Email = client.Email;
        clt.IdDoc = client.IdDoc;
        clt.State = client.State;
        clt.Street = client.Street;
        clt.City = client.City;
        clt.PostalCode = client.PostalCode;
        clt.UpdatedAt = DateTime.Now;

        _context.Update(clt);
        await _context.SaveChangesAsync();
    }
}