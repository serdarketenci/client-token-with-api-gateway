using System;

namespace Middleware
{
    public interface IJwtBuilder
    {
        string GetToken(Guid userId, string role);
        Guid ValidateToken(string token);
    }
}
