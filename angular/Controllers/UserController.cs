using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AdoNetAppSchemaTest.DAL;
using AdoNetTestApp.DAL.Models;
using angular.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace angular.Controllers
{
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private DbContext _context;
        private UserManager _userManager;
        private RoleManager _roleManager;
        private readonly AppSettings _settings;

        public UserController(IOptions<AppSettings> settings)
        {
            _context = new DbContext();
            _userManager = new UserManager(_context);
            _roleManager = new RoleManager(_context);
            _settings = settings.Value;
        }

        [HttpGet("[action]")]
        // Get: api/User/GetRoles
        public IEnumerable<string> GetRoles()
        {
            return _roleManager.GetAllRoles();
        }

        [HttpGet("[action]")]
        // Get: api/User/GetUsers
        public IEnumerable<User> GetUsers()
        {
            return _userManager.GetAllUsers();
        }


        [HttpPost("[action]")]
        // POST: api/User/Registration
        public object Registration([FromBody]RegistrationModel model)
        {
            if (model != null)
            {
                var user = new User
                {
                    UserName = model.UserName,
                    FirstName = model.FirstName,
                    SecondName = model.SecondName,
                    LastName = model.LastName,
                    Password = model.Password,
                    Email = model.Email,
                    RegistrationDate = DateTime.UtcNow.ToString()
                };

                try
                {
                    var isCreated = _userManager.CreateUser(user);
                    if (!isCreated)
                    {
                        return BadRequest(new { message = "User with such [Email] or [UserName] already exists" });
                    }
                    _userManager.AddToRoles(user.Email, model.Roles.ToList());
                    return Ok(_userManager.GetByEmail(user.Email));
                }
                catch(Exception e)
                {
                    throw e;
                }
          
            }
            return BadRequest(new { message = "Bad model json" });

        }

        [HttpPost("[action]")]
        // POST: api/User/Login
        public IActionResult Login([FromBody]LoginModel model)
        {
            var user = _userManager.GetByEmail(model.Email);
            if (user != null && _userManager.CheckPassword(user, model.Password))
            {
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
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