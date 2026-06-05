using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace GuessNumberGame.Middleware
{
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;
        public JwtMiddleware(RequestDelegate next) { _next = next; }
        public async Task Invoke(HttpContext context)
        {
            // Placeholder - using built-in JwtBearer in Program.cs instead.
            await _next(context);
        }
    }
}