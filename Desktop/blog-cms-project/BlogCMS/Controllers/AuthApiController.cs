using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OrchardCore.Users;
using OrchardCore.Users.Models;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Text.Json;

namespace BlogCMS.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthApiController : ControllerBase
    {
        private readonly UserManager<IUser> _userManager;

        public AuthApiController(UserManager<IUser> userManager)
        {
            _userManager = userManager;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login()
        {
            using var reader = new System.IO.StreamReader(Request.Body);
            var body = await reader.ReadToEndAsync();
            var loginRequest = JsonSerializer.Deserialize<LoginRequest>(body);

            if (loginRequest == null || string.IsNullOrEmpty(loginRequest.Username) || string.IsNullOrEmpty(loginRequest.Password))
            {
                return BadRequest(new { message = "Username and password are required" });
            }

            var user = await _userManager.FindByNameAsync(loginRequest.Username) as User;
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid username or password" });
            }

            var result = await _userManager.CheckPasswordAsync(user, loginRequest.Password);
            if (!result)
            {
                return Unauthorized(new { message = "Invalid username or password" });
            }

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.NameIdentifier, user.UserId),
                new Claim("UserId", user.UserId)
            };

            var roles = await _userManager.GetRolesAsync(user);
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var claimsPrincipal = new ClaimsPrincipal(claimsIdentity);

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, claimsPrincipal);

            var userRole = roles.Count > 0 ? roles[0] : (user.UserName == "admin" ? "Administrator" : "Viewer");

            return Ok(new
            {
                message = "Login successful",
                user = new
                {
                    username = user.UserName,
                    email = user.Email,
                    role = userRole,
                    userId = user.UserId
                }
            });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok();
        }

        [HttpGet("current")]
        public async Task<IActionResult> GetCurrentUser()
        {
            if (!User.Identity?.IsAuthenticated ?? false)
            {
                return Unauthorized();
            }

            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized();
            }

            var roles = await _userManager.GetRolesAsync(user);
            var role = roles.Count > 0 ? roles[0] : (user.UserName == "admin" ? "Administrator" : "Viewer");

            return Ok(new
            {
                username = user.UserName,
                email = (user as User)?.Email ?? "",
                role = role,
                userId = (user as User)?.UserId ?? ""
            });
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}