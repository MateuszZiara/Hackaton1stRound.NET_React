using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace Hackaton_1st_round.Server.Controllers.AspNetUsers
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
            var aspNetUsers = Xunit.Assert.IsAssignableFrom<IEnumerable<Models.AspNetUsers.AspNetUsers>>(okResult.Value);
            Xunit.Assert.NotEmpty(aspNetUsers);
        }

        [Fact]
        public void GetById_ReturnsNotFoundResult_WhenIdDoesNotExist()
        {
            // Arrange
            Guid id = Guid.NewGuid();
            String id_parse = id.ToString();

            // Act
            var result = _controller.GetById(id_parse);

            // Assert
            Xunit.Assert.IsType<NotFoundResult>(result.Result);
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
