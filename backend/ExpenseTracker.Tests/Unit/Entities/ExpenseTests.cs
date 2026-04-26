using ExpenseTracker.Domain.Entities;
using FluentAssertions;

namespace ExpenseTracker.Tests.Unit.Entities;

public class ExpenseTests
{
    [Fact]
    public void Expense_CreatedWithValidValues_ShouldHaveCorrectProperties()
    {
        var date = DateTime.Now;
        var expense = new Expense
        {
            Id = 1,
            Title = "Test Expense",
            Amount = 50.00m,
            Category = "Testing",
            Date = date
        };

        expense.Id.Should().Be(1);
        expense.Title.Should().Be("Test Expense");
        expense.Amount.Should().Be(50.00m);
        expense.Category.Should().Be("Testing");
        expense.Date.Should().Be(date);
    }

    [Fact]
    public void Expense_AllowsNegativeAmount_ForRefunds()
    {
        var expense = new Expense
        {
            Id = 1,
            Title = "Refund",
            Amount = -25.00m,
            Category = "Refunds",
            Date = DateTime.Now
        };

        expense.Amount.Should().Be(-25.00m);
    }

    [Fact]
    public void Expense_DefaultStringsAreEmpty()
    {
        var expense = new Expense();

        expense.Title.Should().Be(string.Empty);
        expense.Category.Should().Be(string.Empty);
    }

    [Fact]
    public void Expense_CanBeModified()
    {
        var expense = new Expense { Title = "Original" };
        expense.Title = "Modified";

        expense.Title.Should().Be("Modified");
    }
}
