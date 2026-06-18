using System;
using System.Security.Cryptography;
using System.Text;

namespace PrepArena.Api.Services
{
    public static class PasswordHasher
    {
        public static string HashPassword(string password)
        {
            var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(password));
            return Convert.ToHexString(bytes);
        }

        public static bool VerifyPassword(string password, string hash)
        {
            return HashPassword(password).Equals(hash, StringComparison.OrdinalIgnoreCase);
        }
    }
}
