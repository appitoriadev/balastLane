using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using ExpenseTracker.Application.DTOs;
using ExpenseTracker.Application.Interfaces;
using ExpenseTracker.Domain.Entities;
using ExpenseTracker.Domain.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace ExpenseTracker.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;

    public AuthService(IUserRepository userRepository, IConfiguration configuration)
    {
        _userRepository = userRepository;
        _configuration = configuration;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        var byUsername = await _userRepository.GetByUsernameAsync(request.Username);
        if (byUsername is not null)
            throw new InvalidOperationException("Username is already taken.");

        var byEmail = await _userRepository.GetByEmailAsync(request.Email);
        if (byEmail is not null)
            throw new InvalidOperationException("Email is already registered.");

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
        return BuildResponse(created, refreshToken);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await _userRepository.GetByUsernameAsync(request.Username)
            ?? throw new InvalidOperationException("Invalid credentials.");

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new InvalidOperationException("Invalid credentials.");

        var (refreshToken, expiry) = NewRefreshToken();
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiry = expiry;

        await _userRepository.UpdateAsync(user);
        return BuildResponse(user, refreshToken);
    }

    public async Task<AuthResponse> RefreshTokenAsync(string refreshToken)
    {
        var allUsers = await _userRepository.GetAllAsync();
        var user = allUsers.FirstOrDefault(u => u.RefreshToken == refreshToken)
            ?? throw new InvalidOperationException("Invalid refresh token.");

        if (user.RefreshTokenExpiry < DateTime.UtcNow)
            throw new InvalidOperationException("Refresh token has expired.");

        var (newRefresh, expiry) = NewRefreshToken();
        user.RefreshToken = newRefresh;
        user.RefreshTokenExpiry = expiry;

        await _userRepository.UpdateAsync(user);
        return BuildResponse(user, newRefresh);
    }

    #region Private Methods

    private AuthResponse BuildResponse(User user, string refreshToken)
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

    private string GenerateJwtToken(User user, DateTime expires)
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

    private static (string token, DateTime expiry) NewRefreshToken()
    {
        var bytes = RandomNumberGenerator.GetBytes(64);
        return (Convert.ToBase64String(bytes), DateTime.UtcNow.AddDays(7));
    }

    #endregion
}
