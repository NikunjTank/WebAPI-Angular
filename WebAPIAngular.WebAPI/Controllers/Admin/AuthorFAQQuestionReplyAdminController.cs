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
    public class AuthorFAQQuestionReplyAdminController : ApiController
    {
        private IAuthorFAQQuestionReply iAuthorFAQQuestionReply;
        public AuthorFAQQuestionReplyAdminController()
        {
            try
            {
                iAuthorFAQQuestionReply = new AuthorFAQQuestionReplyRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("AuthorFAQQuestionReplyAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("authorfaqquestionreplies")]
        [ResponseType(typeof(List<GetAuthorFAQQuestionReplyResponse>))]
        public IHttpActionResult GetAuthorFAQQuestionReply([FromUri]GetAuthorFAQQuestionReplyRequest getAuthorFAQQuestionReplyRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getAuthorFAQQuestionReplyRequest == null)
                    getAuthorFAQQuestionReplyRequest = new GetAuthorFAQQuestionReplyRequest();

                if (getAuthorFAQQuestionReplyRequest.PageSize == null)
                    getAuthorFAQQuestionReplyRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var authorFAQQuestionReply = new AuthorFAQQuestionReply()
                {
                    AuthorFAQQuestionReplyId = getAuthorFAQQuestionReplyRequest.AuthorFAQQuestionReplyId,
                    AuthorFAQDetailId = getAuthorFAQQuestionReplyRequest.AuthorFAQDetailId,
                    SearchText = getAuthorFAQQuestionReplyRequest.SearchText,
                    IsActive = getAuthorFAQQuestionReplyRequest.IsActive,
                    PageNumber = getAuthorFAQQuestionReplyRequest.PageNumber,
                    PageSize = Convert.ToInt32(getAuthorFAQQuestionReplyRequest.PageSize),
                    IsPagingRequired = (getAuthorFAQQuestionReplyRequest.PageNumber != null) ? true : false,
                    OrderBy = getAuthorFAQQuestionReplyRequest.OrderBy,
                    OrderByDirection = getAuthorFAQQuestionReplyRequest.OrderByDirection
                };
                var authorFAQQuestionReplys = iAuthorFAQQuestionReply.GetAuthorFAQQuestionReply(authorFAQQuestionReply);

                var authorFAQQuestionReplyList = new List<GetAuthorFAQQuestionReplyResponse>();
                foreach (var authorFAQQuestionReplyDetail in authorFAQQuestionReplys)
                {
                    authorFAQQuestionReplyList.Add(new GetAuthorFAQQuestionReplyResponse()
                    {
                        AuthorFAQQuestionReplyId = Convert.ToInt32(authorFAQQuestionReplyDetail.AuthorFAQQuestionReplyId),
                        AuthorFAQDetailId = Convert.ToInt32(authorFAQQuestionReplyDetail.AuthorFAQDetailId),
                        Question = authorFAQQuestionReplyDetail.Question,
                        Reply = authorFAQQuestionReplyDetail.Reply,
                        IsActive = Convert.ToBoolean(authorFAQQuestionReplyDetail.IsActive),
                        CreatedBy = authorFAQQuestionReplyDetail.CreatedBy,
                        TotalPageCount = authorFAQQuestionReplyDetail.TotalPageCount,
                        TotalRecord = authorFAQQuestionReplyDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "AuthorFAQQuestionReply retrieved successfully";
                responses.Response = authorFAQQuestionReplyList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving authorfaqquestionreply.";

                Utility.WriteLog("GetAuthorFAQQuestionReply", getAuthorFAQQuestionReplyRequest, "Error while retrieving authorfaqquestionreply. (AuthorFAQQuestionReplyAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("authorfaqquestionreplies/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddAuthorFAQQuestionReply(AddAuthorFAQQuestionReplyRequest addAuthorFAQQuestionReplyRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var authorFAQQuestionReply = new AuthorFAQQuestionReply()
                {
                    AuthorFAQDetailId = addAuthorFAQQuestionReplyRequest.AuthorFAQDetailId,
                    Question = addAuthorFAQQuestionReplyRequest.Question,
                    Reply = addAuthorFAQQuestionReplyRequest.Reply,
                    CreatedBy = Utility.UserId
                };
                int result = iAuthorFAQQuestionReply.AddAuthorFAQQuestionReply(authorFAQQuestionReply);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "AuthorFAQQuestionReply added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "AuthorFAQQuestionReply alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding authorfaqquestionreply.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding authorfaqquestionreply.";

                Utility.WriteLog("AddAuthorFAQQuestionReply", addAuthorFAQQuestionReplyRequest, "Error while adding authorfaqquestionreply. (AuthorFAQQuestionReplyAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("authorfaqquestionreplies/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateAuthorFAQQuestionReply(UpdateAuthorFAQQuestionReplyRequest updateAuthorFAQQuestionReplyRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var authorFAQQuestionReply = new AuthorFAQQuestionReply()
                {
                    AuthorFAQQuestionReplyId = updateAuthorFAQQuestionReplyRequest.AuthorFAQQuestionReplyId,
                    AuthorFAQDetailId = updateAuthorFAQQuestionReplyRequest.AuthorFAQDetailId,
                    Question = updateAuthorFAQQuestionReplyRequest.Question,
                    Reply = updateAuthorFAQQuestionReplyRequest.Reply,
                    ModifiedBy = Utility.UserId
                };
                int result = iAuthorFAQQuestionReply.UpdateAuthorFAQQuestionReply(authorFAQQuestionReply);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "AuthorFAQQuestionReply updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "AuthorFAQQuestionReply already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "AuthorFAQQuestionReply doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating authorfaqquestionreply.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating admin profile.";

                Utility.WriteLog("UpdateAuthorFAQQuestionReply", updateAuthorFAQQuestionReplyRequest, "Error while updating authorfaqquestionreply. (AuthorFAQQuestionReplyAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("authorfaqquestionreplies/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteAuthorFAQQuestionReply(DeleteAuthorFAQQuestionReplyRequest deleteAuthorFAQQuestionReplyRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var authorFAQQuestionReply = new AuthorFAQQuestionReply()
                {
                    AuthorFAQQuestionReplyId = deleteAuthorFAQQuestionReplyRequest.AuthorFAQQuestionReplyId,
                    ModifiedBy = Utility.UserId
                };

                int result = iAuthorFAQQuestionReply.DeleteAuthorFAQQuestionReply(authorFAQQuestionReply);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "AuthorFAQQuestionReply deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "AuthorFAQQuestionReply doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting authorfaqquestionreply.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting authorfaqquestionreply.";

                Utility.WriteLog("DeleteAuthorFAQQuestionReply", deleteAuthorFAQQuestionReplyRequest, "Error while deleting authorfaqquestionreply. (AuthorFAQQuestionReplyAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
