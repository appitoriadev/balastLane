using ExpenseTracker.Application.DTOs;
using ExpenseTracker.Application.Interfaces;
using ExpenseTracker.Application.Services;
using ExpenseTracker.Domain.Entities;
using ExpenseTracker.Domain.Interfaces;
using FluentAssertions;
using Moq;

namespace ExpenseTracker.Tests.Unit.Services;

public class ExpenseServiceTests
{
    private readonly Mock<IExpenseRepository> _mockRepository;
    private readonly IExpenseService _service;

    public ExpenseServiceTests()
    {
        _mockRepository = new Mock<IExpenseRepository>();
        _service = new ExpenseService(_mockRepository.Object);
    }

    #region GetAllAsync Tests

    [Fact]
    public async Task GetAllAsync_WithValidExpenses_ReturnsAllExpenses()
    {
        var expenses = new List<Expense>
        {
            new() { Id = 1, Title = "Lunch", Amount = 15.50m, Category = "Food", Date = DateTime.Now },
            new() { Id = 2, Title = "Gas", Amount = 45.00m, Category = "Transportation", Date = DateTime.Now.AddDays(-1) }
        };

        _mockRepository.Setup(r => r.GetAllAsync()).ReturnsAsync(expenses);

        var result = await _service.GetAllAsync();

        result.Should().HaveCount(2);
        result.First().Title.Should().Be("Lunch");
        _mockRepository.Verify(r => r.GetAllAsync(), Times.Once);
    }

    [Fact]
    public async Task GetAllAsync_WithNoExpenses_ReturnsEmptyCollection()
    {
        _mockRepository.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<Expense>());

        var result = await _service.GetAllAsync();

        result.Should().BeEmpty();
        _mockRepository.Verify(r => r.GetAllAsync(), Times.Once);
    }

    #endregion

    #region GetByIdAsync Tests

    [Fact]
    public async Task GetByIdAsync_WithValidId_ReturnsExpense()
    {
        var expense = new Expense
        {
            Id = 1,
            Title = "Lunch",
            Amount = 15.50m,
            Category = "Food",
            Date = DateTime.Now
        };

        _mockRepository.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(expense);

        var result = await _service.GetByIdAsync(1);

        result.Should().NotBeNull();
        result!.Title.Should().Be("Lunch");
        result.Amount.Should().Be(15.50m);
        _mockRepository.Verify(r => r.GetByIdAsync(1), Times.Once);
    }

    [Fact]
    public async Task GetByIdAsync_WithInvalidId_ReturnsNull()
    {
        _mockRepository.Setup(r => r.GetByIdAsync(999)).ReturnsAsync((Expense?)null);

        var result = await _service.GetByIdAsync(999);

        result.Should().BeNull();
        _mockRepository.Verify(r => r.GetByIdAsync(999), Times.Once);
    }

    #endregion

    #region CreateAsync Tests

    [Fact]
    public async Task CreateAsync_WithValidDto_CreatesAndReturnsExpense()
    {
        var dto = new CreateExpenseDto("Coffee", 5.50m, "Food", DateTime.Now);

        var createdExpense = new Expense
        {
            Id = 1,
            Title = dto.Title,
            Amount = dto.Amount,
            Category = dto.Category,
            Date = dto.Date
        };

        _mockRepository.Setup(r => r.AddAsync(It.IsAny<Expense>())).ReturnsAsync(createdExpense);

        var result = await _service.CreateAsync(dto);

        result.Should().NotBeNull();
        result.Title.Should().Be("Coffee");
        result.Amount.Should().Be(5.50m);
        result.Category.Should().Be("Food");
        _mockRepository.Verify(r => r.AddAsync(It.IsAny<Expense>()), Times.Once);
    }

    [Fact]
    public async Task CreateAsync_MapsPropertiesCorrectly()
    {
        var dto = new CreateExpenseDto("Dinner", 45.99m, "Dining", new DateTime(2026, 4, 26));

        Expense? capturedExpense = null;
        _mockRepository.Setup(r => r.AddAsync(It.IsAny<Expense>()))
            .Callback<Expense>(e => capturedExpense = e)
            .ReturnsAsync(new Expense { Id = 1, Title = dto.Title, Amount = dto.Amount, Category = dto.Category, Date = dto.Date });

        await _service.CreateAsync(dto);

        capturedExpense.Should().NotBeNull();
        capturedExpense!.Title.Should().Be(dto.Title);
        capturedExpense.Amount.Should().Be(dto.Amount);
        capturedExpense.Category.Should().Be(dto.Category);
        capturedExpense.Date.Should().Be(dto.Date);
    }

    #endregion

    #region UpdateAsync Tests

    [Fact]
    public async Task UpdateAsync_WithValidExpense_UpdatesAndReturnsExpense()
    {
        var existingExpense = new Expense { Id = 1, Title = "Old Title", Amount = 10m, Category = "Old", Date = DateTime.Now };
        var updateDto = new UpdateExpenseDto("New Title", 20m, "New", DateTime.Now);
        var updatedExpense = new Expense { Id = 1, Title = "New Title", Amount = 20m, Category = "New", Date = DateTime.Now };

        _mockRepository.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(existingExpense);
        _mockRepository.Setup(r => r.UpdateAsync(It.IsAny<Expense>())).ReturnsAsync(updatedExpense);

        var result = await _service.UpdateAsync(1, updateDto);

        result.Should().NotBeNull();
        result!.Title.Should().Be("New Title");
        result.Amount.Should().Be(20m);
        _mockRepository.Verify(r => r.GetByIdAsync(1), Times.Once);
        _mockRepository.Verify(r => r.UpdateAsync(It.IsAny<Expense>()), Times.Once);
    }

    [Fact]
    public async Task UpdateAsync_WithInvalidId_ReturnsNull()
    {
        var updateDto = new UpdateExpenseDto("Title", 10m, "Cat", DateTime.Now);

        _mockRepository.Setup(r => r.GetByIdAsync(999)).ReturnsAsync((Expense?)null);

        var result = await _service.UpdateAsync(999, updateDto);

        result.Should().BeNull();
        _mockRepository.Verify(r => r.UpdateAsync(It.IsAny<Expense>()), Times.Never);
    }

    #endregion

    #region DeleteAsync Tests

    [Fact]
    public async Task DeleteAsync_WithValidId_CallsRepositoryDelete()
    {
        _mockRepository.Setup(r => r.DeleteAsync(1)).ReturnsAsync(true);

        var result = await _service.DeleteAsync(1);

        result.Should().BeTrue();
        _mockRepository.Verify(r => r.DeleteAsync(1), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_WithInvalidId_ReturnsFalse()
    {
        _mockRepository.Setup(r => r.DeleteAsync(999)).ReturnsAsync(false);

        var result = await _service.DeleteAsync(999);

        result.Should().BeFalse();
    }

    #endregion
}
