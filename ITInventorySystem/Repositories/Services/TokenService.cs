using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ITInventorySystem.Models;
using Microsoft.IdentityModel.Tokens;

namespace ITInventorySystem.Repositories.Services;

public static class TokenService
{
    public static string GenerateToken(User user)
    {
        SecurityToken? token = null;
        var            id    = $"{user.Id}";

        var tokenHandler = new JwtSecurityTokenHandler();
        var key          = Encoding.ASCII.GetBytes(Settings.Secret);

        try
        {
            var tokenDescriptor = new SecurityTokenDescriptor

            {
                Subject = new ClaimsIdentity([
                                                 new Claim(ClaimTypes.Name,  user.Name),
                                                 new Claim(ClaimTypes.Role,  user.Type.ToString()),
                                                 new Claim(ClaimTypes.Email, user.Email),
                                                 new Claim("ID",             id)
                                             ]),
                Expires = DateTime.UtcNow.AddHours(8),
                SigningCredentials =
                    new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            token = tokenHandler.CreateToken(tokenDescriptor);
        }
        catch (Exception ex)
        {
            var erro = ex.Source + ex.Message + ex.StackTrace;
        }

        return tokenHandler.WriteToken(token);
    }
}