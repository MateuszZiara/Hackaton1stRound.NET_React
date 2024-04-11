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
        public void ReturnGetALl()
        {
            // Act
            var result = _controller.GetAll();

            // Assert
            Xunit.Assert.IsType<OkObjectResult>(result.Result);
        }
        
        
        [Fact]
        public void GetIdOk()
        {
            Models.AspNetUsers.AspNetUsers aspNetUsers = new Models.AspNetUsers.AspNetUsers();
            using (var session = NHibernateHelper.OpenSession())
            {
                using (var transaction = session.BeginTransaction())
                {
                    session.Save(aspNetUsers);
                    transaction.Commit();
                }
            }

            // Act
            var result = _controller.GetById(aspNetUsers.Id);
            
            // Assert
            Xunit.Assert.IsType<OkObjectResult>(result.Result);
            
            using (var session = NHibernateHelper.OpenSession())
            {
                using (var transaction = session.BeginTransaction())
                {
                    session.Delete(aspNetUsers);
                    transaction.Commit();
                }
            }
        }
        [Fact]
        public void GetIdNotOk()
        {
            Models.AspNetUsers.AspNetUsers aspNetUsers = new Models.AspNetUsers.AspNetUsers();
            using (var session = NHibernateHelper.OpenSession())
            {
                using (var transaction = session.BeginTransaction())
                {
                    session.Save(aspNetUsers);
                    transaction.Commit();
                }
            }

            // Act
            var result = _controller.GetById("ED46F6F9-7B87-4549-816A-0E0788D1B506");
            
            // Assert
            Xunit.Assert.IsType<NotFoundResult>(result.Result);
            
            using (var session = NHibernateHelper.OpenSession())
            {
                using (var transaction = session.BeginTransaction())
                {
                    session.Delete(aspNetUsers);
                    transaction.Commit();
                }
            }
        }
        
        [Fact]
        public void ReturnRegister()
        {
            Models.AspNetUsers.AspNetUsers testEntity = new Models.AspNetUsers.AspNetUsers();
            testEntity.Email = "lolkolo@gb.pl";
            testEntity.PasswordHash = "kolobolo123@";
            var result = _controller.Register(testEntity);
        
            
            Xunit.Assert.IsType<CreatedAtActionResult>(result.Result);
            
            using (var session = NHibernateHelper.OpenSession())
            {
                using (var transaction = session.BeginTransaction())
                {
                    session.Delete(testEntity);
                    transaction.Commit();
                }
            }
            
        }
        [Fact]
        public void ShortPasswordWithRegister()
        {
            Models.AspNetUsers.AspNetUsers testEntity = new Models.AspNetUsers.AspNetUsers();
            testEntity.Email = "lolkolo@gb.pl";
            testEntity.PasswordHash = "gb";
            var result = _controller.Register(testEntity);
        
            
            Xunit.Assert.IsType<ConflictObjectResult>(result.Result);
            
            using (var session = NHibernateHelper.OpenSession())
            {
                using (var transaction = session.BeginTransaction())
                {
                    session.Delete(testEntity);
                    transaction.Commit();
                }
            }
            
        }
        
        [Fact]
        public void DeleteOk()
        {
            Models.AspNetUsers.AspNetUsers aspNetUsers = new Models.AspNetUsers.AspNetUsers();
            using (var session = NHibernateHelper.OpenSession())
            {
                using (var transaction = session.BeginTransaction())
                {
                    session.Save(aspNetUsers);
                    transaction.Commit();
                }
            }

            // Act
            var result = _controller.DeleteAddressEntity(aspNetUsers.Id);
            
            // Assert
            Xunit.Assert.IsType<NoContentResult>(result);
            
            using (var session = NHibernateHelper.OpenSession())
            {
                using (var transaction = session.BeginTransaction())
                {
                    session.Delete(aspNetUsers);
                    transaction.Commit();
                }
            }
        }
        
        [Fact]
        public void DeleteNotOk()
        {
            Models.AspNetUsers.AspNetUsers aspNetUsers = new Models.AspNetUsers.AspNetUsers();
            using (var session = NHibernateHelper.OpenSession())
            {
                using (var transaction = session.BeginTransaction())
                {
                    session.Save(aspNetUsers);
                    transaction.Commit();
                }
            }

            // Act
            var result = _controller.DeleteAddressEntity("ED46F6F9-7B87-4549-816A-0E0788D1B506");
            
            // Assert
            Xunit.Assert.IsType<NotFoundResult>(result);
            
            using (var session = NHibernateHelper.OpenSession())
            {
                using (var transaction = session.BeginTransaction())
                {
                    session.Delete(aspNetUsers);
                    transaction.Commit();
                }
            }
            
        }
        
    }
}
