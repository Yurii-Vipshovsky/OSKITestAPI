using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileSystemGlobbing.Internal;
using Microsoft.IdentityModel.Tokens;
using OSKITestAPI.Data;
using OSKITestAPI.Models;

namespace OSKITestAPI.Controllers
{
    public class RegisterUser
    {
        public string name { get; set; }
        public string email { get; set; }
        public string password { get; set; }
    }

    public class LoginUser
    {
        public string email { get; set; }
        public string password { get; set; }
    }

    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly OSKIDBContext _context;
        private readonly IConfiguration _configuration;
        private const int TOKEN_LIFE_TIME = 15;//in minutes

        public UsersController(OSKIDBContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        private ClaimsIdentity GetIdentity(string email, string password)
        {
            User user = _context.Users.FirstOrDefault(x => x.Email == email && x.Password == password);
            if (user != null)
            {
                var claims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Email, user.Email),
                    new Claim("userId", user.Id.ToString()),
                    new Claim("userRole", user.UserRole),
                    new Claim(ClaimsIdentity.DefaultRoleClaimType, user.UserRole)
                };
                ClaimsIdentity claimsIdentity =
                new ClaimsIdentity(claims, "Token");
                return claimsIdentity;
            }
            return null;
        }

        /// <summary>
        /// Only for admin users
        /// </summary>
        /// <returns>List with all users</returns>
        /// <response code="200">Return list with all users</response> 
        /// <response code="401">If unautorized user or not admin user</response> 
        [HttpGet("/api/GetAllUsers")]
        [Authorize(Roles = "admin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public IActionResult GetAllUsers()
        {
            return Ok(_context.Users.ToList());
        }

        /// <summary>
        /// User login using Email and Password
        /// Creates JWT Token for 15 minutes with user info
        /// </summary>
        /// <param name="loginUser"></param>
        /// <returns>Access token</returns>
        /// <response code="200">If login successful</response> 
        /// <response code="400">If invalid username or password</response>
        [HttpPost("/api/Login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult Login([FromForm] LoginUser loginUser)
        {
            var identity = GetIdentity(loginUser.email, loginUser.password);
            if (identity == null)
            {
                return BadRequest("Invalid username or password.");
            }
            var now = DateTime.UtcNow;
            var jwt = new JwtSecurityToken(
                    issuer: _configuration["JwtSetting:Issuer"],
                    audience: _configuration["JwtSetting:Audience"],
                    notBefore: now,
                    claims: identity.Claims,
                    expires: now.Add(TimeSpan.FromMinutes(TOKEN_LIFE_TIME)),
                    signingCredentials: new SigningCredentials(
                                        new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_configuration["JwtSetting:Key"])),
                                        SecurityAlgorithms.HmacSha256));
            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            var response = new
            {
                access_token = encodedJwt,
            };
            return Ok(response);
        }

        /// <summary>
        /// Register new user in "user" Role
        /// Create user with admin Role impossible only change in data base
        /// </summary>
        /// <param name="getUser"></param>
        /// <response code="200">If User registered successful</response> 
        /// <response code="400">If User with same email is already registered, or invalid email</response> 
        [HttpPost("/api/Register")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Register([FromForm] RegisterUser getUser)
        {
            User user = new User() { Email = getUser.email, Password = getUser.password, UserName = getUser.name, UserRole = "user" };
            if ((_context.Users?.Any(e => e.Email == getUser.email)).GetValueOrDefault())
            {
                return BadRequest("User with this email is already registered");
            }
            string emailPattern = @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$";
            if (!Regex.IsMatch(getUser.email, emailPattern))
            {
                return BadRequest("Invalid Email");
            }
            user.Id = Guid.NewGuid();
            _context.Add(user);
            await _context.SaveChangesAsync();
            return Ok(user.Email);
        }
    }
}