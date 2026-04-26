namespace ExpenseTracker.Application.DTOs;

public record AuthResponse(
    Guid UserId,
    string Username,
    string Token,
    string RefreshToken,
    DateTime ExpiresAt
);
