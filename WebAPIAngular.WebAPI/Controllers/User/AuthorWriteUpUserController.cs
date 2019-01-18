using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using DemystifyFema.Service.Repository;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;

namespace DemystifyFema.Service.Controllers.User
{
    [Authorize(Roles = "User")]
    [RoutePrefix("user/api")]
    public class AuthorWriteUpUserController : ApiController
    {
        private IAuthorWriteUp iAuthorWriteUp;
        public AuthorWriteUpUserController()
        {
            try
            {
                iAuthorWriteUp = new AuthorWriteUpRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("AuthorWriteUpUserController (User)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("authorwriteups")]
        [ResponseType(typeof(List<GetAuthorWriteUpResponse>))]
        public IHttpActionResult GetAuthorWriteUp([FromUri]GetAuthorWriteUpRequest getAuthorWriteUpRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getAuthorWriteUpRequest == null)
                    getAuthorWriteUpRequest = new GetAuthorWriteUpRequest();

                if (getAuthorWriteUpRequest.PageSize == null)
                    getAuthorWriteUpRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var authorWriteUp = new AuthorWriteUp()
                {
                    AuthorWriteUpId = getAuthorWriteUpRequest.AuthorWriteUpId,
                    TopicId = getAuthorWriteUpRequest.TopicId,
                    SearchText = getAuthorWriteUpRequest.SearchText,
                    IsActive = getAuthorWriteUpRequest.IsActive,
                    PageNumber = getAuthorWriteUpRequest.PageNumber,
                    PageSize = Convert.ToInt32(getAuthorWriteUpRequest.PageSize),
                    IsPagingRequired = (getAuthorWriteUpRequest.PageNumber != null) ? true : false,
                    OrderBy = getAuthorWriteUpRequest.OrderBy,
                    OrderByDirection = getAuthorWriteUpRequest.OrderByDirection
                };
                var authorWriteUps = iAuthorWriteUp.GetAuthorWriteUp(authorWriteUp);

                var authorWriteUpList = new List<GetAuthorWriteUpResponse>();
                foreach (var authorWriteUpDetail in authorWriteUps)
                {
                    authorWriteUpList.Add(new GetAuthorWriteUpResponse()
                    {
                        AuthorWriteUpId = Convert.ToInt32(authorWriteUpDetail.AuthorWriteUpId),
                        TopicId = Convert.ToInt32(authorWriteUpDetail.TopicId),
                        TopicName = authorWriteUpDetail.TopicName,
                        PDF = authorWriteUpDetail.PDF,
                        IsActive = Convert.ToBoolean(authorWriteUpDetail.IsActive),
                        CreatedBy = authorWriteUpDetail.CreatedBy,
                        TotalPageCount = authorWriteUpDetail.TotalPageCount,
                        TotalRecord = authorWriteUpDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "AuthorWriteUp retrieved successfully";
                responses.Response = authorWriteUpList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving authorwriteup.";

                Utility.WriteLog("GetAuthorWriteUp", getAuthorWriteUpRequest, "Error while retrieving authorwriteup. (AuthorWriteUpUserController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
