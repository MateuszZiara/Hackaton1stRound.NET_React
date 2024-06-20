using System.Collections.Immutable;
using Azure;
using Hackaton_1st_round.Server.Models.AspNetUsers;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Hackaton_1st_round.Server.Controllers.AspNetUsers;

public class AspNetUsersControllerXUnitTest
{
    private readonly AspNetUsersController _controller = new AspNetUsersController();

    Models.AspNetUsers.AspNetUsers create()
    {
        Models.AspNetUsers.AspNetUsers aspNetUsers = new Models.AspNetUsers.AspNetUsers();
        aspNetUsers.Provider = "test";
        aspNetUsers.FirstName = "test";
        aspNetUsers.LastName = "test";
        aspNetUsers.Email = "test@test.pl";
        using (var session = NHibernateHelper.OpenSession())
        {
            using (var transaction = session.BeginTransaction())
            {
                session.Save(aspNetUsers);
                transaction.Commit();
            }
        }

        return aspNetUsers;
    }
    void delete(Models.AspNetUsers.AspNetUsers aspNetUser)
    {
        using (var session = NHibernateHelper.OpenSession())
        {
            using (var transaction = session.BeginTransaction())
            {
                session.Delete(aspNetUser);
                transaction.Commit();
               
            }
        }
    }
    void deleteById(string id)
    {
        using (var session = NHibernateHelper.OpenSession())
        {
            using (var transaction = session.BeginTransaction())
            {
                var query = session.Query<Models.AspNetUsers.AspNetUsers>().FirstOrDefault(x => x.Id == id);
                session.Delete(query);
                transaction.Commit();
            }
        }
    }
    [Fact]
    public void GetAll_ReturnsOkResult()
    {
        // Act
        var result = _controller.GetAll();

        // Assert
        var okResult = Xunit.Assert.IsType<OkObjectResult>(result.Result);
        var aspNetUsers = Xunit.Assert.IsAssignableFrom<IEnumerable<Models.AspNetUsers.AspNetUsersDTO>>(okResult.Value);
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
    public void GetById_ReturnsNotFoundResult_WhenIdExist()
    {

        Models.AspNetUsers.AspNetUsers aspNetUser = create();
        var result = _controller.GetById(aspNetUser.Id);
        delete(aspNetUser);
        Xunit.Assert.IsType<OkObjectResult>(result.Result);
    }

    [Fact]
    public void Edit()
    {
        Models.AspNetUsers.AspNetUsers aspNetUser = create();
        var expectedResult = "test"; 
    
        // Act
        var result = _controller.Edit(aspNetUser.Id, null, null, expectedResult);
    
        // Assert
        delete(aspNetUser);
        Assert.NotNull(result.Value); 
        Assert.Equal(expectedResult, result.Value.FirstName); 
    }

    [Fact]
    public void createTest()
    {
        Models.AspNetUsers.AspNetUsers user = new Models.AspNetUsers.AspNetUsers();
        user.Provider = "test";
        user.FirstName = "test";
        user.LastName = "test";
        var aspNetUser = _controller.CreateAddressEntity(user);
        delete(user);
        Xunit.Assert.IsType<ActionResult<AspNetUsersDTO>>(aspNetUser);
    }
    [Fact]
    public void register()
    {
        Models.AspNetUsers.AspNetUsers user = new Models.AspNetUsers.AspNetUsers();
        user.Provider = "test";
        user.FirstName = "test";
        user.LastName = "test";
        var aspNetUser = _controller.Register(user);
        delete(user);
        Xunit.Assert.IsType<ActionResult<AspNetUsersDTO>>(aspNetUser);
    }
    [Fact]
    public void google()
    {
        Models.AspNetUsers.AspNetUsers user = new Models.AspNetUsers.AspNetUsers();
        user.Provider = "test";
        user.FirstName = "test";
        user.LastName = "test";
        var aspNetUser = _controller.Google(user);
        delete(user);
        Xunit.Assert.IsType<Task<ActionResult<AspNetUsersDTO>>>(aspNetUser);
    }
    [Fact]
    public void facebook()
    {
        Models.AspNetUsers.AspNetUsers user = new Models.AspNetUsers.AspNetUsers();
        user.Provider = "test";
        user.FirstName = "test";
        user.LastName = "test";
        var aspNetUser = _controller.Facebook(user);
        delete(user);
        Xunit.Assert.IsType<Microsoft.AspNetCore.Mvc.ActionResult<AspNetUsersDTO>>(aspNetUser);
    }

    [Fact]
    public void email_exist()
    {
        Models.AspNetUsers.AspNetUsers user = create();

       var result = _controller.CheckEmailExists("test@test.pl");
        delete(user);
        Assert.Equal(true, result); 

    }
    [Fact]
    public void email_Noexist()
    {
        var result = _controller.CheckEmailExists("dawdwwa");
        Assert.Equal(false, result); 
    }

    [Fact]
    public void deleteUser()
    {
        Models.AspNetUsers.AspNetUsers user = create();
        var result = _controller.DeleteAddressEntity(user.Id);
        delete(user);
        Xunit.Assert.IsType<NoContentResult>(result);
    }
    [Fact]
    public void deleteUserNoExist()
    {
        var result = _controller.DeleteAddressEntity("null");
        Xunit.Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public void adminUpgrade()
    {
        Models.AspNetUsers.AspNetUsers user = create();
        var result = _controller.UpdateToAdmin(user.Id);
        delete(user);
        Assert.Equal(UserRank.Admin, result.Value.UserRank); 
    }
    [Fact]
    public void adminUpgradeNoExist()
    {
   
        // Act
        var result = _controller.UpdateToAdmin("dwadawd");

        // Assert
        Assert.IsType<NotFoundObjectResult>(result.Result); // Checking the type of the ActionResult returned

        var notFoundResult = result.Result as NotFoundObjectResult;
        Assert.Equal("No user with this id", notFoundResult?.Value); 
    }
    [Fact]
    public void userUpgrade()
    {
        Models.AspNetUsers.AspNetUsers user = create();
        var result = _controller.updateToUser(user.Id);
        delete(user);
        if (result.Value != null) Assert.Equal(UserRank.User, result.Value.UserRank);
    }

    [Fact]
    public void userUpgradeNoExist()
    {
        // Act
        var result = _controller.updateToUser("dwadawd");

        // Assert
        Assert.IsType<NotFoundObjectResult>(result.Result); // Checking the type of the ActionResult returned

        var notFoundResult = result.Result as NotFoundObjectResult;
        Assert.Equal("No user with this id", notFoundResult?.Value);
    }

    [Fact]
    public void changePasswordGood()
    {
        Models.AspNetUsers.AspNetUsers user = new Models.AspNetUsers.AspNetUsers();
        user.Provider = "test";
        user.FirstName = "test";
        user.LastName = "test";
        user.PasswordHash = "test12345";
        _controller.Register(user);
        
        ChangePasswordDTO chng = new ChangePasswordDTO();
        chng.OldPassword = "test12345";
        chng.NewPassword = "test123456";
        chng.Id = user.Id;
        var result = _controller.ChangePassword(chng);
        delete(user);
        Assert.IsType<ActionResult<Models.AspNetUsers.AspNetUsersDTO>>(result);
       
        
    }
    [Fact]
    public void changePasswordWrongPassword()
    {
        Models.AspNetUsers.AspNetUsers user = new Models.AspNetUsers.AspNetUsers();
        user.Provider = "test";
        user.FirstName = "test";
        user.LastName = "test";
        user.PasswordHash = "test12345";
        user.Email = "testowyemail";
        _controller.Register(user);
        Models.AspNetUsers.AspNetUsers finded = new Models.AspNetUsers.AspNetUsers();
        using (var session = NHibernateHelper.OpenSession())
        {
            finded = session.Query<Models.AspNetUsers.AspNetUsers>()
                .FirstOrDefault(x => x.Email == user.Email);
        }

        if (finded == null)
        {
            return; 
        }
        ChangePasswordDTO chng = new ChangePasswordDTO();
        chng.OldPassword = "test1234";
        chng.NewPassword = "test123456";
        chng.Id = finded.Id;
        var result = _controller.ChangePassword(chng);
        var notFoundResult = result.Result as UnauthorizedObjectResult;
        delete(user);
        Assert.Equal("Wrong password. Try again", notFoundResult?.Value);
        
    }
    [Fact]
    public void changePasswordTooShort()
    {
        Models.AspNetUsers.AspNetUsers user = new Models.AspNetUsers.AspNetUsers();
        user.Provider = "test";
        user.FirstName = "test";
        user.LastName = "test";
        user.PasswordHash = "test12345";
        user.Email = "testowyemail";
        _controller.Register(user);
        Models.AspNetUsers.AspNetUsers finded = new Models.AspNetUsers.AspNetUsers();
        using (var session = NHibernateHelper.OpenSession())
        {
            finded = session.Query<Models.AspNetUsers.AspNetUsers>()
                .FirstOrDefault(x => x.Email == user.Email);
        }

        if (finded == null)
        {
            return; 
        }
        ChangePasswordDTO chng = new ChangePasswordDTO();
        chng.OldPassword = "test12345";
        chng.NewPassword = "td";
        chng.Id = finded.Id;
        var result = _controller.ChangePassword(chng);
        var notFoundResult = result.Result as UnauthorizedObjectResult;
        delete(user);
        Assert.Equal("New password doesn't meet criteria. Password must be at least 8 characters long.", notFoundResult?.Value);
        
    }
    [Fact]
    public void changePasswordBadID()
    {
        Models.AspNetUsers.AspNetUsers user = new Models.AspNetUsers.AspNetUsers();
        user.Provider = "test";
        user.FirstName = "test";
        user.LastName = "test";
        user.PasswordHash = "test12345";
        user.Email = "testowyemail";
        _controller.Register(user);
        Models.AspNetUsers.AspNetUsers finded = new Models.AspNetUsers.AspNetUsers();
        using (var session = NHibernateHelper.OpenSession())
        {
            finded = session.Query<Models.AspNetUsers.AspNetUsers>()
                .FirstOrDefault(x => x.Email == user.Email);
        }

        if (finded == null)
        {
            return; 
        }
        ChangePasswordDTO chng = new ChangePasswordDTO();
        chng.OldPassword = "test12345";
        chng.NewPassword = "td";
        chng.Id = finded.Id + 'd';
        var result = _controller.ChangePassword(chng);
        var notFoundResult = result.Result as NotFoundObjectResult;
        delete(user);
        Assert.Equal("No user with this id", notFoundResult?.Value);
        
    }
}