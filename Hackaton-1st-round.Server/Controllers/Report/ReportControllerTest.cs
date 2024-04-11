using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace Hackaton_1st_round.Server.Controllers.Report;

public class ReportControllerTest
{
    private readonly ReportController _controller;

    public ReportControllerTest()
    {
        _controller = new ReportController();
    }
    
    [Fact]
    public void GetAll_ReturnsOkResult()
    {
   
        var result = _controller.GetAll();

        Assert.IsType<OkObjectResult>(result.Result);
    }
    
    //[Fact]
    
    /*public void GetIdOk()
    {
        
        Models.TeamEntity.TeamEntity teamEntity = new Models.TeamEntity.TeamEntity();
        teamEntity.TeamName = "gb123";
        teamEntity.TeamDesc = "tu123";
        using (var session = NHibernateHelper.OpenSession())
        {
            using (var transaction = session.BeginTransaction())
            {
                session.Save(teamEntity);
                transaction.Commit();
            }
        }
        
        
        Models.Report.Report user = new Models.Report.Report();
        user.Url = "gb123";
        user.TeamEntity_FK2 = teamEntity.id;
        
        using (var session = NHibernateHelper.OpenSession())
        {
            using (var transaction = session.BeginTransaction())
            {
                session.Save(user);
                transaction.Commit();
            }
        }
        
        
        var result = _controller.GetById(user.id);
            
       Assert.IsType<OkObjectResult>(result.Result);
            
        using (var session = NHibernateHelper.OpenSession())
        {
            using (var transaction = session.BeginTransaction())
            {
                session.Delete(user);
                session.Delete(teamEntity);
                transaction.Commit();
            }
            
        }
        
        
        
    }*/
    
    [Fact]
    public void GetIdNotOk()
    {
        var result = _controller.GetById(Guid.Parse("CF175B95-0E47-43CA-9DE3-40B2389893D1"));
        
        Xunit.Assert.IsType<NotFoundResult>(result.Result);
    }
    
    [Fact]
        public async Task Upload_ReturnsBadRequest_WhenFileIsNull()
        {
            // Arrange
            var controller = new ReportController();
            var name = "testName";
            var FK = Guid.NewGuid();
            IFormFile file = null;

            // Act
            var result = await controller.Upload(name, FK, file);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Nieprawidłowy plik", badRequestResult.Value);
        }
    [Fact]
    public async Task Upload_ReturnsInternalServerError_WhenExceptionOccurs()
    {
        // Arrange
        var controller = new ReportController();
        var name = "testName";
        var FK = Guid.NewGuid();
        var content = "Test file content";
        var fileName = "test.pdf";
        var fileBytes = System.Text.Encoding.UTF8.GetBytes(content);
        var ms = new MemoryStream(fileBytes);
        var formFile = new FormFile(ms, 0, ms.Length, "file", fileName);

        // Act
        var result = await controller.Upload(name, FK, formFile);

        // Assert
        var objectResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(StatusCodes.Status500InternalServerError, objectResult.StatusCode);
        Assert.Equal("Wystąpił błąd podczas zapisywania pliku: could not execute batch command.[SQL: SQL not available]", objectResult.Value);
    }
    [Fact]
    public void DeleteAddressEntity_ReturnsNotFound_WhenAddressNotFound()
    {
 
        Guid nonExistentId = Guid.NewGuid(); 

        var result = _controller.DeleteAddressEntity(nonExistentId);
        
        Assert.IsType<NotFoundResult>(result); 
    }
    
    [Fact]
    public void DeleteAddressEntity_DeletesAddress_WhenAddressExists()
    {
        Models.Report.Report user = new Models.Report.Report();
        var result = _controller.DeleteAddressEntity(user.id);
        Assert.IsType<NotFoundResult>(result); 
    }

    
}