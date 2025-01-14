using ITInventorySystem.Data;
using ITInventorySystem.DTO.Client;
using ITInventorySystem.Models;
using ITInventorySystem.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ITInventorySystem.Repositories.Services;

public class ClientService(AppDbContext context) : IClientInterface
{
    public async Task<Client> AddAsync(ClientCreateDto client)
    {
        var clt = new Client
        {
            Name        = client.Name,
            IdDoc       = client.IdDoc,
            PhoneNumber = client.PhoneNumber,
            Email       = client.Email,
            State       = client.State,
            Street      = client.Street,
            City        = client.City,
            PostalCode  = client.PostalCode
        };

        context.Add(clt);
        await context.SaveChangesAsync();

        return clt;
    }

    public async Task DeleteAsync(int id)
    {
        try
        {
            var clt = await context.Clients
                                   .FirstOrDefaultAsync(cltDb => cltDb.Id == id);

            if (clt == null) throw new KeyNotFoundException("Client not found!");

            clt.IsDeleted = true;
            await context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("An error occurred while deleting the client.", ex);
        }
    }

    public async Task<IEnumerable<Client>> GetAllAsync(bool includeDeleted)
    {
        if (includeDeleted)
        {
            return await context.Clients.ToListAsync();
        }
        return await context.Clients.Where(c => !c.IsDeleted).ToListAsync();
    } 

    public async Task<Client> GetByIdAsync(int id)
    {
        var client = await context.Clients.FindAsync(id);
        if (client == null) throw new KeyNotFoundException("Client not found!");
        return client;
    }

    public async Task UpdateAsync(int id, ClientUpdateDto client)
    {
        var clt = await context.Clients
                               .FirstOrDefaultAsync(cltDb => cltDb.Id == id);

        if (clt == null) throw new KeyNotFoundException("Client not found!");

        clt.Name        = client.Name;
        clt.Email       = client.Email;
        clt.IdDoc       = client.IdDoc;
        clt.State       = client.State;
        clt.Street      = client.Street;
        clt.City        = client.City;
        clt.PostalCode  = client.PostalCode;
        clt.PhoneNumber = client.PhoneNumber;
        clt.UpdatedAt   = DateTime.Now;

        context.Update(clt);
        await context.SaveChangesAsync();
    }
}