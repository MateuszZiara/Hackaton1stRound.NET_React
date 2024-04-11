using Xunit;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hackaton_1st_round.Server.Controllers.AspNetUsers;
using Hackaton_1st_round.Server.Models.AspNetUsers;
using NUnit.Framework;

namespace Hackaton_1st_round.Server.Tests.Controllers
{
    public class AspNetUsersControllerTest
    {
        private readonly AspNetUsersController _controller;

        public AspNetUsersControllerTest()
        {
            _controller = new AspNetUsersController();
        }

        [Fact]
        public void GetAll_ReturnsOkResult()
        {
            // Act
            var result = _controller.GetAll();

            // Assert
            var okResult = Xunit.Assert.IsType<OkObjectResult>(result.Result);
            var aspNetUsers = Xunit.Assert.IsAssignableFrom<IEnumerable<AspNetUsers>>(okResult.Value);
            Xunit.Assert.NotEmpty(aspNetUsers);
        }

        [Fact]
        public void GetById_ReturnsNotFoundResult_WhenIdDoesNotExist()
        {
            // Arrange
            Guid id = Guid.NewGuid();

            // Act
            var result = _controller.GetById(id);

            // Assert
            Xunit.Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task Logout_ReturnsOkResult()
        {
            // Act
            var result = await _controller.Logout();

            // Assert
            var okResult = Xunit.Assert.IsType<OkObjectResult>(result);
            Xunit.Assert.Equal("Identity cookies deleted successfully.", okResult.Value);
        }

        [Fact]
        public void GetUserInfo_ReturnsOkResult_WhenUserIsAuthenticated()
        {
            // Arrange
            // You may need to mock HttpContext for this test

            // Act
            var result = _controller.GetUserInfo();

            // Assert
            Xunit.Assert.IsType<OkObjectResult>(result.Result);
        }

        [Fact]
        public void GetUserInfo_ReturnsUnauthorizedResult_WhenUserIsNotAuthenticated()
        {
            // Arrange
            // You may need to mock HttpContext for this test

            // Act
            var result = _controller.GetUserInfo();

            // Assert
            Xunit.Assert.IsType<UnauthorizedResult>(result.Result);
        }

        [Fact]
        public void GetFromTeam_ReturnsOkResult()
        {
            // Act
            var result = _controller.GetFromTeam();

            // Assert
            var okResult = Xunit.Assert.IsType<OkObjectResult>(result.Result);
            var aspNetUsers = Xunit.Assert.IsAssignableFrom<IEnumerable<AspNetUsers>>(okResult.Value);
            Xunit.Assert.NotEmpty(aspNetUsers);
        }

        [Fact]
        public void AddToTeam_ReturnsBadRequestResult_WhenEmailIsNull()
        {
            // Act
            var result = _controller.AddToTeam(null);

            // Assert
            Xunit.Assert.IsType<BadRequestResult>(result.Result);
        }

        // Add more tests as needed for other controller actions...
    }
}
