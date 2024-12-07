namespace ITInventorySystem.DTO.Client;

public class ClientCreateDto
{
    public string IdDoc { get; set; } // CPF/CNPJ

    public string Name { get; set; }

    public string Email { get; set; }

    public string Street { get; set; }

    public string City { get; set; }

    public string State { get; set; }

    public string PostalCode { get; set; }

    public string PhoneNumber { get; set; }
}