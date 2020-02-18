using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AdoNetAppSchemaTest.DAL;
using angular.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace angular.Controllers
{
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private UserManager _userManager;
        private readonly AppSettings _settings;

        public UserController(UserManager userManager, IOptions<AppSettings> settings)
        {
            _userManager = userManager;
            _settings = settings.Value;
        }

        [HttpPost]
        [Route("Login")]
        // POST: api/User/Login
        public IActionResult Login(LoginModel model)
        {
            var user = _userManager.GetByEmail(model.Email);
            if (user != null && _userManager.CheckPassword(user, model.Password))
            {
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]{
                        new Claim("UserId", user.Id.ToString())
                    }),
                    Expires = DateTime.UtcNow.AddMinutes(2),
                    SigningCredentials = new SigningCredentials(
                        new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings.JwtSecret)),
                        SecurityAlgorithms.HmacSha256Signature)
                };
                var tokenHandler = new JwtSecurityTokenHandler();
                var securityToken = tokenHandler.CreateToken(tokenDescriptor);
                var token = tokenHandler.WriteToken(securityToken);
                return Ok(new { token });
            }
            else
            {
                return BadRequest(new { message = "Incorrect Email or Password." });
            }
        }
    }
}