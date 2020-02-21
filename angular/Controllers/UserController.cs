using System;
using System.Collections.Generic;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AdoNetAppSchemaTest.DAL;
using AdoNetTestApp.DAL.Models;
using angular.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
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
        private readonly ILogger<UserController> _logger;

        public UserController(IOptions<AppSettings> settings, ILogger<UserController> logger )
        {
            _context = new DbContext();
            _userManager = new UserManager(_context);
            _roleManager = new RoleManager(_context);
            _settings = settings.Value;
            _logger = logger;
        }

        [HttpGet("[action]")]
        [AllowAnonymous]
        // Get: api/User/GetRoles
        public IEnumerable<string> GetRoles()
        {
            return _roleManager.GetAllRoles();
        }

        [HttpGet("[action]")]
        [AllowAnonymous]
        // Get: api/User/GetUsers
        public IEnumerable<User> GetUsers()
        {
            return _userManager.GetAllUsers();
        }


        [HttpPost("[action]")]
        [AllowAnonymous]
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
        [AllowAnonymous]
        // POST: api/User/Login
        public IActionResult Login([FromBody]LoginModel model)
        {
            var user = _userManager.GetByEmail(model.Email);
            if (user != null && _userManager.CheckPassword(user, model.Password))
            {
                var roles = _roleManager.GetAllRolesByUserId(user.Id);
                var claims = new List<Claim>();
                foreach (var role in roles)
                {
                    claims.Add(new Claim(ClaimTypes.Role, role));
                }
                claims.Add(new Claim("UserId", user.Id.ToString()));

                var tokenDescriptor = new SecurityTokenDescriptor
                {

                    Subject = new ClaimsIdentity(claims),
                    Expires = DateTime.UtcNow.AddHours(1),
                    SigningCredentials = new SigningCredentials(
                        new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings.JwtSecret)),
                        SecurityAlgorithms.HmacSha256Signature)
                };
                var tokenHandler = new JwtSecurityTokenHandler();
                var securityToken = tokenHandler.CreateToken(tokenDescriptor);
                var token = tokenHandler.WriteToken(securityToken);

                return Ok(new { token, roles });
            }
            else
            {
                return BadRequest(new { message = "Incorrect Email or Password." });
            }
        }

        [HttpGet("[action]")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Admin")]
        public async Task<object> GetUsersActionInfo()
        {
            var date = DateTime.Today.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);
            string path = $"C:/Users/Vladislav/source/repos/angular/angular/Logs/nlog-{date}.log";
            StringBuilder sb = new StringBuilder();

            try
            {
                using (StreamReader sr = new StreamReader(path))
                {
                    sb.Append(await sr.ReadToEndAsync());
                }
                return new { info = sb.ToString() };
            }
            catch (Exception e)
            {
                return null;
            }
        }

        [HttpGet("[action]")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "User")]
        public object GetUserProfile()
        {
            try
            {
                int userId = int.Parse(User.Claims.First(c => c.Type == "UserId").Value);
                var user = _userManager.GetById(userId);
                return new
                {
                    user.Id,
                    user.Email,
                    user.UserName,
                    user.FirstName,
                    user.SecondName,
                    user.LastName,
                    user.RegistrationDate,
                    user.Password,
                    Roles = _roleManager.GetAllRolesByUserId(userId)
                };
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpPut("[action]")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles ="User")]
        public IActionResult UpdateProfile([FromBody]UpdateUser user)
        {
            System.Diagnostics.Debug.WriteLine($"{user.Email} {user.FirstName} {user.SecondName} {user.LastName} {user.Roles}");
            var u = _userManager.GetByEmail(user.Email);
            if (u != null)
            {
                if (u.FirstName != user.FirstName)
                {
                    _logger.LogInformation($"User[{u.Email}], Changed FirstName: [{u.FirstName}] -> [{user.FirstName}] |");
                    u.FirstName = user.FirstName;
                }

                if (u.SecondName != user.SecondName)
                {
                    _logger.LogInformation($"User[{u.Email}], Changed SecondName: [{u.SecondName}] -> [{user.SecondName}] |");
                    u.SecondName = user.SecondName;
                }
                   
                if (u.LastName != user.LastName)
                {
                    _logger.LogInformation($"User[{u.Email}], Changed LastName: [{u.LastName}] -> [{user.LastName}] |");
                    u.LastName = user.LastName;
                }

                var rolesBefore = _roleManager.GetAllRolesByUserId(u.Id);
                _userManager.RemoveFromRoles(u.Email, rolesBefore.ToList());
                var rolesAfter = user.Roles;
                _userManager.AddToRoles(u.Email, rolesAfter.ToList());
                rolesAfter = _roleManager.GetAllRolesByUserId(u.Id);
                _userManager.UpdateUser(u);
                return Ok();
            }
            return BadRequest(new { message = "No such user." });
        }

    }
}