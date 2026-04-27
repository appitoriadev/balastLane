using System.Net;
using System.Text.Json;

namespace ExpenseTracker.Api.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var transactionId = context.TraceIdentifier;
        context.Items["TransactionId"] = transactionId;

        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception occurred. TransactionId: {TransactionId}", transactionId);
            await HandleExceptionAsync(context, ex, transactionId);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception, string transactionId)
    {
        context.Response.ContentType = "application/json";

        var response = new ErrorResponse
        {
            Message = "An unexpected error occurred. Please try again later.",
            TransactionId = transactionId,
            Timestamp = DateTime.UtcNow
        };

        var (statusCode, userMessage) = GetStatusCodeAndMessage(exception);
        context.Response.StatusCode = statusCode;

        if (exception is ValidationException validationEx)
        {
            response.Message = validationEx.Message;
            response.Errors = validationEx.Errors;
        }
        else if (exception is NotFoundException notFoundEx)
        {
            response.Message = notFoundEx.Message;
        }
        else if (exception is UnauthorizedAccessException)
        {
            response.Message = "You are not authorized to perform this action.";
        }
        else
        {
            response.Message = userMessage;
        }

        return context.Response.WriteAsJsonAsync(response);
    }

    private static (int StatusCode, string Message) GetStatusCodeAndMessage(Exception exception) =>
        exception switch
        {
            ValidationException => ((int)HttpStatusCode.BadRequest, "Validation failed."),
            NotFoundException => ((int)HttpStatusCode.NotFound, "Resource not found."),
            UnauthorizedAccessException => ((int)HttpStatusCode.Unauthorized, "Unauthorized."),
            ArgumentException => ((int)HttpStatusCode.BadRequest, "Invalid argument provided."),
            _ => ((int)HttpStatusCode.InternalServerError, "An internal server error occurred.")
        };
}

public class ErrorResponse
{
    public string Message { get; set; } = string.Empty;
    public string TransactionId { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public Dictionary<string, string[]>? Errors { get; set; }
}

public class ValidationException : Exception
{
    public Dictionary<string, string[]> Errors { get; set; }

    public ValidationException(string message, Dictionary<string, string[]>? errors = null)
        : base(message)
    {
        Errors = errors ?? new();
    }
}

public class NotFoundException : Exception
{
    public NotFoundException(string message) : base(message) { }
}
