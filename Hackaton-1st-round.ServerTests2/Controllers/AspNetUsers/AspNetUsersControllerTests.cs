using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Hackaton_1st_round.Server.Controllers.AspNetUsers;
using Hackaton_1st_round.Server.Models.AspNetUsers;

namespace YourNamespace.Tests
{
    [TestClass]
    public class AspNetUsersControllerTests
    {
        [TestMethod]
        public void GetByIdTest()
        {
            // Arrange
            var controller = new AspNetUsersController();
            var id = Guid.NewGuid(); // przykładowe ID

            // Act
            var result = controller.GetById(id);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOfType(result.Result, typeof(ActionResult<Hackaton_1st_round.Server.Controllers.AspNetUsers.AspNetUsersController>));
        }

        [TestMethod]
        public void EditTest()
        {
            // Arrange
            var controller = new AspNetUsersController();
            var id = Guid.NewGuid(); // przykładowe ID
            string email = "test@example.com"; // przykładowe dane

            // Act
            var result = controller.Edit(id, email);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOfType(result, typeof(ActionResult<Hackaton_1st_round.Server.Controllers.AspNetUsers.AspNetUsersController>));
        }

        [TestMethod]
        public void LogoutTest()
        {
            // Arrange
            var controller = new AspNetUsersController();

            // Act
            var result = controller.Logout();

            // Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult));
        }

        [TestMethod]
        public void GetUserInfoTest()
        {
            // Arrange
            var controller = new AspNetUsersController();

            // Act
            var result = controller.GetUserInfo();

            // Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOfType(result.Result, typeof(IActionResult));
        }

        [TestMethod]
        public void GetUserInfoAsObjectTest()
        {
            // Arrange
            var controller = new AspNetUsersController();

            // Act
            var result = controller.GetUserInfoAsObject();

            // Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOfType(result, typeof(Hackaton_1st_round.Server.Controllers.AspNetUsers.AspNetUsersController));
        }

        [TestMethod]
        public void GetFromTeamTest()
        {
            // Arrange
            var controller = new AspNetUsersController();

            // Act
            var result = controller.GetFromTeam();

            // Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOfType(result.Result, typeof(ActionResult<IEnumerable<Hackaton_1st_round.Server.Controllers.AspNetUsers.AspNetUsersController>>));
        }

        [TestMethod]
        public void GetFromTeamIdTest()
        {
            // Arrange
            var controller = new AspNetUsersController();
            var id = Guid.NewGuid(); // przykładowe ID

            // Act
            var result = controller.GetFromTeamId(id);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOfType(result.Result, typeof(ActionResult<IEnumerable<Hackaton_1st_round.Server.Controllers.AspNetUsers.AspNetUsersController>>));
        }

        [TestMethod]
        public void AddToTeamTest()
        {
            // Arrange
            var controller = new AspNetUsersController();
            var email = "test@example.com"; // przykładowy email

            // Act
            var result = controller.AddToTeam(email);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOfType(result.Result, typeof(ActionResult<Hackaton_1st_round.Server.Controllers.AspNetUsers.AspNetUsersController>));
        }

        [TestMethod]
        public void RegisterTest()
        {
            // Arrange
            var controller = new AspNetUsersController();
            var testEntity = new Hackaton_1st_round.Server.Controllers.AspNetUsers.AspNetUsersController(); // przykładowa encja

            // Act
            var result = controller.Register(testEntity);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOfType(result.Result, typeof(ActionResult<Hackaton_1st_round.Server.Controllers.AspNetUsers.AspNetUsersController>));
        }

        [TestMethod]
        public void DeleteAddressEntityTest()
        {
            // Arrange
            var controller = new AspNetUsersController();
            var id = Guid.NewGuid(); // przykładowe ID

            // Act
            var result = controller.DeleteAddressEntity(id);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOfType(result, typeof(ActionResult));
        }
    }
}
