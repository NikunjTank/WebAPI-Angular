using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using DemystifyFema.Service.Repository;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;

namespace DemystifyFema.Service.Controllers.Admin
{
    [Authorize(Roles = "Admin")]
    [RoutePrefix("admin/api")]
    public class AuthorFAQAdminController : ApiController
    {
        private IAuthorFAQ iAuthorFAQ;
        public AuthorFAQAdminController()
        {
            try
            {
                iAuthorFAQ = new AuthorFAQRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("AuthorFAQAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("authorfaqs")]
        [ResponseType(typeof(List<GetAuthorFAQResponse>))]
        public IHttpActionResult GetAuthorFAQ([FromUri]GetAuthorFAQRequest getAuthorFAQRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getAuthorFAQRequest == null)
                    getAuthorFAQRequest = new GetAuthorFAQRequest();

                if (getAuthorFAQRequest.PageSize == null)
                    getAuthorFAQRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var authorFAQ = new AuthorFAQ()
                {
                    AuthorFAQId = getAuthorFAQRequest.AuthorFAQId,
                    SearchText = getAuthorFAQRequest.SearchText,
                    IsActive = getAuthorFAQRequest.IsActive,
                    PageNumber = getAuthorFAQRequest.PageNumber,
                    PageSize = Convert.ToInt32(getAuthorFAQRequest.PageSize),
                    IsPagingRequired = (getAuthorFAQRequest.PageNumber != null) ? true : false,
                    OrderBy = getAuthorFAQRequest.OrderBy,
                    OrderByDirection = getAuthorFAQRequest.OrderByDirection
                };
                var authorFAQs = iAuthorFAQ.GetAuthorFAQ(authorFAQ);

                var authorFAQList = new List<GetAuthorFAQResponse>();
                foreach (var authorFAQDetail in authorFAQs)
                {
                    authorFAQList.Add(new GetAuthorFAQResponse()
                    {
                        AuthorFAQId = Convert.ToInt32(authorFAQDetail.AuthorFAQId),
                        TopicId = authorFAQDetail.TopicId,
                        TopicName = authorFAQDetail.TopicName,
                        IsActive = Convert.ToBoolean(authorFAQDetail.IsActive),
                        CreatedBy = authorFAQDetail.CreatedBy,
                        TotalPageCount = authorFAQDetail.TotalPageCount,
                        TotalRecord = authorFAQDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "AuthorFAQ retrieved successfully";
                responses.Response = authorFAQList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving authorfaq.";

                Utility.WriteLog("GetAuthorFAQ", getAuthorFAQRequest, "Error while retrieving authorfaq. (AuthorFAQAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("authorfaqs/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddAuthorFAQ(AddAuthorFAQRequest addAuthorFAQRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var authorFAQ = new AuthorFAQ()
                {
                    TopicId = addAuthorFAQRequest.TopicId,
                    CreatedBy = Utility.UserId
                };
                int result = iAuthorFAQ.AddAuthorFAQ(authorFAQ);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "AuthorFAQ added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "AuthorFAQ alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding authorfaq.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding authorfaq.";

                Utility.WriteLog("AddAuthorFAQ", addAuthorFAQRequest, "Error while adding authorfaq. (AuthorFAQAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("authorfaqs/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateAuthorFAQ(UpdateAuthorFAQRequest updateAuthorFAQRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var authorFAQ = new AuthorFAQ()
                {
                    AuthorFAQId = updateAuthorFAQRequest.AuthorFAQId,
                    TopicId = updateAuthorFAQRequest.TopicId,
                    ModifiedBy = Utility.UserId
                };
                int result = iAuthorFAQ.UpdateAuthorFAQ(authorFAQ);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "AuthorFAQ updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "AuthorFAQ already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "AuthorFAQ doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating authorfaq.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating admin profile.";

                Utility.WriteLog("UpdateAuthorFAQ", updateAuthorFAQRequest, "Error while updating authorfaq. (AuthorFAQAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("authorfaqs/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteAuthorFAQ(DeleteAuthorFAQRequest deleteAuthorFAQRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var authorFAQ = new AuthorFAQ()
                {
                    AuthorFAQId = deleteAuthorFAQRequest.AuthorFAQId,
                    ModifiedBy = Utility.UserId
                };

                int result = iAuthorFAQ.DeleteAuthorFAQ(authorFAQ);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "AuthorFAQ deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "AuthorFAQ doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting authorfaq.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting authorfaq.";

                Utility.WriteLog("DeleteAuthorFAQ", deleteAuthorFAQRequest, "Error while deleting authorfaq. (AuthorFAQAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
