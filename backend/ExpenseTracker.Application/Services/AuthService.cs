using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using ExpenseTracker.Application.DTOs;
using ExpenseTracker.Application.Interfaces;
using ExpenseTracker.Domain.Entities;
using ExpenseTracker.Domain.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;

namespace ExpenseTracker.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthService> _logger;

    public AuthService(IUserRepository userRepository, IConfiguration configuration, ILogger<AuthService> logger)
    {
        _userRepository = userRepository;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        try
        {
            if (request is null)
                throw new ArgumentNullException(nameof(request), "Registration data is required");

            var byUsername = await _userRepository.GetByUsernameAsync(request.Username);
            if (byUsername is not null)
            {
                _logger.LogWarning("Registration attempt with existing username: {Username}", request.Username);
                throw new InvalidOperationException("Username is already taken.");
            }

            var byEmail = await _userRepository.GetByEmailAsync(request.Email);
            if (byEmail is not null)
            {
                _logger.LogWarning("Registration attempt with existing email: {Email}", request.Email);
                throw new InvalidOperationException("Email is already registered.");
            }

            var (refreshToken, expiry) = NewRefreshToken();

            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                FirstName = request.FirstName,
                LastName = request.LastName,
                CreatedAt = DateTime.UtcNow,
                RefreshToken = refreshToken,
                RefreshTokenExpiry = expiry
            };

            var created = await _userRepository.AddAsync(user);
            _logger.LogInformation("User {Username} registered successfully", created.Username);
            return BuildResponse(created, refreshToken);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Registration validation failed");
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during user registration");
            throw;
        }
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        try
        {
            if (request is null)
                throw new ArgumentNullException(nameof(request), "Login data is required");

            var user = await _userRepository.GetByUsernameAsync(request.Username);
            if (user is null)
            {
                _logger.LogWarning("Login attempt with non-existent username: {Username}", request.Username);
                throw new InvalidOperationException("Invalid credentials.");
            }

            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                _logger.LogWarning("Failed login attempt for user: {Username}", request.Username);
                throw new InvalidOperationException("Invalid credentials.");
            }

            var (refreshToken, expiry) = NewRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiry = expiry;

            await _userRepository.UpdateAsync(user);
            _logger.LogInformation("User {Username} logged in successfully", user.Username);
            return BuildResponse(user, refreshToken);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Login failed");
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login");
            throw;
        }
    }

    public async Task<AuthResponse> RefreshTokenAsync(string refreshToken)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(refreshToken))
                throw new ArgumentNullException(nameof(refreshToken), "Refresh token is required");

            var allUsers = await _userRepository.GetAllAsync();
            var user = allUsers.FirstOrDefault(u => u.RefreshToken == refreshToken);
            if (user is null)
            {
                _logger.LogWarning("Refresh token request with invalid token");
                throw new InvalidOperationException("Invalid refresh token.");
            }

            if (user.RefreshTokenExpiry < DateTime.UtcNow)
            {
                _logger.LogWarning("Refresh token expired for user: {UserId}", user.Id);
                throw new InvalidOperationException("Refresh token has expired.");
            }

            var (newRefresh, expiry) = NewRefreshToken();
            user.RefreshToken = newRefresh;
            user.RefreshTokenExpiry = expiry;

            await _userRepository.UpdateAsync(user);
            _logger.LogInformation("Token refreshed successfully for user: {UserId}", user.Id);
            return BuildResponse(user, newRefresh);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Token refresh failed");
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during token refresh");
            throw;
        }
    }

    #region Private Methods

    private AuthResponse BuildResponse(User user, string refreshToken)
    {
        try
        {
            var expiryMinutes = int.Parse(Environment.GetEnvironmentVariable("JWT_EXPIRYMINUTES") ?? "60");
            var expiresAt = DateTime.UtcNow.AddMinutes(expiryMinutes);
            return new AuthResponse(
                UserId: user.Id,
                Username: user.Username,
                Token: GenerateJwtToken(user, expiresAt),
                RefreshToken: refreshToken,
                ExpiresAt: expiresAt
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error building auth response");
            throw;
        }
    }

    private string GenerateJwtToken(User user, DateTime expires)
    {
        try
        {
            var key = Environment.GetEnvironmentVariable("JWT_KEY")
                ?? throw new InvalidOperationException("JWT Key is not configured.");
            var issuer = Environment.GetEnvironmentVariable("JWT_ISSUER")
                ?? throw new InvalidOperationException("JWT Issuer is not configured.");
            var audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE")
                ?? throw new InvalidOperationException("JWT Audience is not configured.");

            var creds = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
                SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: expires,
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating JWT token");
            throw;
        }
    }

    private static (string token, DateTime expiry) NewRefreshToken()
    {
        var bytes = RandomNumberGenerator.GetBytes(64);
        return (Convert.ToBase64String(bytes), DateTime.UtcNow.AddDays(7));
    }

    #endregion
}
