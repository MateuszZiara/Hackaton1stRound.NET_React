using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hackaton_1st_round.Server.Controllers.AspNetUsers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Hackaton_1st_round.Server.Controllers.AspNetUsers.Tests
{
    [TestClass]
    public class AspNetUsersControllerTests
    {
        [TestMethod]
        public void GetAllTest()
        {
            // Arrange
            var controller = new AspNetUsersController();

            // Act
            var result = controller.GetAll();

            // Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult));
        }

        [TestMethod]
        public void GetByIdTest()
        {
            // Arrange
            var controller = new AspNetUsersController();
            var id = Guid.NewGuid(); // przygotowanie losowego ID

            // Act
            var result = controller.GetById(id);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult));
        }

        [TestMethod]
        public void EditTest()
        {
            // Arrange
            var controller = new AspNetUsersController();
            var id = Guid.NewGuid(); // przygotowanie losowego ID

            // Act
            var result = controller.Edit(id);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOfType(result.Result, typeof(ActionResult<Models.AspNetUsers.AspNetUsers>));
        }

        [TestMethod]
        public void CreateAddressEntityTest()
        {
            // Arrange
            var controller = new AspNetUsersController();
            var testEntity = new Models.AspNetUsers.AspNetUsers(); // przygotowanie testowej encji

            // Act
            var result = controller.CreateAddressEntity(testEntity);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOfType(result.Result, typeof(CreatedAtActionResult));
        }

        [TestMethod]
        public async Task LogoutTest()
        {
            // Arrange
            var controller = new AspNetUsersController();

            // Act
            var result = await controller.Logout();

            // Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOfType(result, typeof(OkObjectResult));
        }

        [TestMethod]
        public async Task GetUserInfoTest()
        {
            // Arrange
            var controller = new AspNetUsersController();

            // Act
            var result = await controller.GetUserInfo();

            // Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOfType(result, typeof(UnauthorizedResult));
        }

        [TestMethod]
        public void GetUserInfoAsObjectTest()
        {
            // Arrange
            var controller = new AspNetUsersController();

            // Act & Assert
            Assert.ThrowsException<Exception>(() => controller.GetUserInfoAsObject());
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
            Assert.IsInstanceOfType(result.Result, typeof(ActionResult<IEnumerable<Models.AspNetUsers.AspNetUsers>>));
        }

        [TestMethod]
        public void GetFromTeamIdTest()
        {
            // Arrange
            var controller = new AspNetUsersController();
            var id = Guid.NewGuid(); // przygotowanie losowego ID

            // Act
            var result = controller.GetFromTeamId(id);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOfType(result.Result, typeof(ActionResult<IEnumerable<Models.AspNetUsers.AspNetUsers>>));
        }

        [TestMethod]
        public void AddToTeamTest()
        {
            // Arrange
            var controller = new AspNetUsersController();
            var email = "example@example.com"; // przygotowanie testowego emaila

            // Act & Assert
            Assert.ThrowsException<Exception>(() => controller.AddToTeam(email));
        }

        [TestMethod]
        public void RegisterTest()
        {
            // Arrange
            var controller = new AspNetUsersController();
            var testEntity = new Models.AspNetUsers.AspNetUsers(); // przygotowanie testowej encji

            // Act
            var result = controller.Register(testEntity);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOfType(result.Result, typeof(CreatedAtActionResult));
        }

        [TestMethod]
        public void DeleteAddressEntityTest()
        {
            // Arrange
            var controller = new AspNetUsersController();
            var id = Guid.NewGuid(); // przygotowanie losowego ID

            // Act
            var result = controller.DeleteAddressEntity(id);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOfType(result, typeof(NoContentResult));
        }
    }
}
