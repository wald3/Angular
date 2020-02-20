using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AdoNetAppSchemaTest.DAL;
using AdoNetTestApp.DAL.Models;
using angular.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace angular.Controllers
{
    [Route("api/[controller]")]
    public class AccountController : Controller
    {
         
        private DbContext _context;
        private UserManager _userManager;
        private RoleManager _roleManager;
        private readonly AppSettings _settings;
        private readonly NLog.Logger _logger;

        public AccountController(IOptions<AppSettings> settings, NLog.Logger logger)
        {
            _context = new DbContext();
            _userManager = new UserManager(_context);
            _roleManager = new RoleManager(_context);
            _settings = settings.Value;
            _logger = logger;
        }

        [HttpGet("[action]")]
        [Authorize(Roles = "Admin")]
        public string ForAdminRole()
        {
            return "for admin role";
        }

        [HttpGet("[action]")]
        [Authorize(Roles = "User")]
        public string ForUserRole()
        {
            return "for user role";
        }

        [HttpPost("[action]")]
        [Authorize(Roles ="User")]
        public IActionResult Update(User user)
        {
            var u = _userManager.GetByEmail(user.Email);
            if (u != null)
            {
                if (u.FirstName != user.FirstName)
                    _logger.Debug($"User[{u.Id}], Change FirstName: [{u.FirstName}] -> [{user.FirstName}]");
                if (u.SecondName != user.SecondName)
                    _logger.Debug($"User[{u.Id}], Change FirstName: [{u.SecondName}] -> [{user.SecondName}]");
                if (u.LastName != user.LastName)
                    _logger.Debug($"User[{u.Id}], Change FirstName: [{u.LastName}] -> [{user.LastName}]");

                _userManager.UpdateUser(user);
                return Ok();
            }
            return BadRequest(new { message = "No such user." });
        }

    }
}