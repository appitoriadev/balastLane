namespace ExpenseTracker.Application.DTOs;

public record LoginRequest(
    string Username,
    string Password
);
