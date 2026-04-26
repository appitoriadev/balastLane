using Npgsql;
using Testcontainers.PostgreSql;

namespace ExpenseTracker.Tests.Fixtures;

public class DatabaseFixture : IAsyncLifetime
{
    private PostgreSqlContainer _container = null!;
    private NpgsqlConnection _connection = null!;

    public string ConnectionString { get; private set; } = string.Empty;

    public async Task InitializeAsync()
    {
        _container = new PostgreSqlBuilder("postgres:17-alpine")
            .Build();

        await _container.StartAsync();

        ConnectionString = _container.GetConnectionString();
        _connection = new NpgsqlConnection(ConnectionString);
        await _connection.OpenAsync();

        await InitializeDatabaseSchema();
    }

    public async Task DisposeAsync()
    {
        if (_connection.State == System.Data.ConnectionState.Open)
        {
            await _connection.CloseAsync();
        }

        await _container.StopAsync();
        await _container.DisposeAsync();
    }

    private async Task InitializeDatabaseSchema()
    {
        using var cmd = _connection.CreateCommand();

        cmd.CommandText = """
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                username VARCHAR(255) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                first_name VARCHAR(255),
                last_name VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS categories (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name VARCHAR(100) NOT NULL UNIQUE,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS expenses (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                amount NUMERIC(18, 2) NOT NULL,
                category VARCHAR(100) NOT NULL,
                date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS user_expenses (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                expense_id INT NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date DESC);
            CREATE INDEX IF NOT EXISTS idx_user_expenses_user_id ON user_expenses(user_id);
            """;

        await cmd.ExecuteNonQueryAsync();
    }
}
