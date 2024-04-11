using System;
using System.Collections.Generic;
using Hackaton_1st_round.Server.Controllers.TeamEntity;
using Hackaton_1st_round.Server.Models.TeamEntity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace Hackaton_1st_round.Server.Test.Controllers.TeamEntity
{
    public class TeamEntityControllerTest
    {
        private readonly TeamEntityController _controller;

        public TeamEntityControllerTest()
        {
            _controller = new TeamEntityController();
        }

        [Fact]
        public void GetAll_ReturnsOkResult()
        {
            // Act
            var result = _controller.GetAll();

            // Assert
            Assert.IsType<OkObjectResult>(result.Result);
        }

        [Fact]
        public void GetById_ReturnsNotFound_WhenIdNotFound()
        {
            // Arrange
            var nonExistentId = Guid.NewGuid();

            // Act
            var result = _controller.GetById(nonExistentId);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        




        [Fact]
        public void GetAmmountOfMembers_ReturnsCorrectAmmount()
        {

            var teamEntity = new Models.TeamEntity.TeamEntity();
            
            var result = _controller.GetAmmountOfMembers(teamEntity.id);


            Assert.Equal(0, result);
        }



        [Fact]
        public void DeleteAddressEntity_ReturnsNotFound_WhenIdNotFound()
        {

            var nonExistentId = Guid.NewGuid();

   
            var result = _controller.DeleteAddressEntity(nonExistentId);


            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public void DeleteAddressEntity_ReturnsNoContent_WhenIdFound()
        {
            // Arrange
            var teamEntity = new Models.TeamEntity.TeamEntity();

            // Act
            var result = _controller.DeleteAddressEntity(teamEntity.id);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

    }
}
