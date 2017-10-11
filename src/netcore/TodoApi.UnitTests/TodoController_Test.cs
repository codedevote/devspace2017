using System;
using TodoApi.Models;
using Xunit;
using Microsoft.EntityFrameworkCore;
using TodoApi.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace TodoApi.UnitTests
{
    public class TodoController_Test
    {
        private TodoContext CreateContext()
        {
            var options = 
                new DbContextOptionsBuilder<TodoContext>()
                      .UseInMemoryDatabase(Guid.NewGuid().ToString())
                      .Options;

            return new TodoContext(options);
        } 

        [Fact]
        public void Create_PassingNull_ReturnsBadRequest()
        {
            using(var context = CreateContext())
            using(var sut = new TodoController(context))
            {
                var result = sut.Create(null);
                Assert.True(result is BadRequestResult);
            }
        }

        [Fact]
        public void Create_PassingValidTodoItem_ReturnsCreated()
        {
            using(var context = CreateContext())
            using(var sut = new TodoController(context))
            {
                var todo = new TodoItem
                {
                    Name = "drink a beer after workshop"
                };
                
                var result = sut.Create(todo) as CreatedAtRouteResult;
                Assert.NotNull(result);

                Assert.Equal(1, result.RouteValues["id"]);  // first item always gets id == 1
            }
        }
    }
}
