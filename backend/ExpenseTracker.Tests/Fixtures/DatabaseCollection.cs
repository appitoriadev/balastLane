namespace ExpenseTracker.Tests.Fixtures;

[CollectionDefinition("Database collection")]
public class DatabaseCollection : ICollectionFixture<DatabaseFixture>
{
    // This class is used to define a shared fixture for all database tests
}
