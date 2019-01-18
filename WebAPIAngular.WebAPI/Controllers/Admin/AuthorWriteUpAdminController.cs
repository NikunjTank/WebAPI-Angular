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

namespace DemystifyFema.Service.Controllers.Admin
{
    [Authorize(Roles = "Admin")]
    [RoutePrefix("admin/api")]
    public class AuthorWriteUpAdminController : ApiController
    {
        private IAuthorWriteUp iAuthorWriteUp;
        public AuthorWriteUpAdminController()
        {
            try
            {
                iAuthorWriteUp = new AuthorWriteUpRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("AuthorWriteUpAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
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

                Utility.WriteLog("GetAuthorWriteUp", getAuthorWriteUpRequest, "Error while retrieving authorwriteup. (AuthorWriteUpAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        #region Upload Files
        [HttpPost]
        [Route("authorwriteups/uploadfiles")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UploadFiles()
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var httpRequest = HttpContext.Current.Request;
                if (httpRequest.Files.Count <= 0)
                    return BadRequest(Utility.FILE_NOT_AVAILABLE);

                string fileName = string.Empty;

                var file = httpRequest.Files[0];
                fileName = DateTime.Now.ToString("ddMMyyyyhhmmssfff") + "_" + file.FileName;
                string fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["AuthorWriteUpPDFPath"]), fileName);
                file.SaveAs(fileSavePath);

                if (!string.IsNullOrEmpty(fileName))
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "File uploaded successfully.";
                    responses.Response = fileName;
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while uploading file.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while uploading file.";

                Utility.WriteLog("UploadFile", null, "Error while uploading file. (AuthorWriteUpAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
        #endregion

        [HttpPost]
        [Route("authorwriteups/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddAuthorWriteUp(AddAuthorWriteUpRequest addAuthorWriteUpRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var authorWriteUp = new AuthorWriteUp()
                {
                    TopicId = addAuthorWriteUpRequest.TopicId,
                    PDF = addAuthorWriteUpRequest.PDF,
                    CreatedBy = Utility.UserId
                };
                int result = iAuthorWriteUp.AddAuthorWriteUp(authorWriteUp);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "AuthorWriteUp added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "AuthorWriteUp alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding authorwriteup.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding authorwriteup.";

                Utility.WriteLog("AddAuthorWriteUp", addAuthorWriteUpRequest, "Error while adding authorwriteup. (AuthorWriteUpAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("authorwriteups/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateAuthorWriteUp(UpdateAuthorWriteUpRequest updateAuthorWriteUpRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var authorWriteUp = new AuthorWriteUp()
                {
                    AuthorWriteUpId = updateAuthorWriteUpRequest.AuthorWriteUpId,
                    TopicId = updateAuthorWriteUpRequest.TopicId,
                    PDF = updateAuthorWriteUpRequest.PDF,
                    ModifiedBy = Utility.UserId
                };
                int result = iAuthorWriteUp.UpdateAuthorWriteUp(authorWriteUp);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "AuthorWriteUp updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "AuthorWriteUp already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "AuthorWriteUp doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating authorwriteup.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating admin profile.";

                Utility.WriteLog("UpdateAuthorWriteUp", updateAuthorWriteUpRequest, "Error while updating authorwriteup. (AuthorWriteUpAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("authorwriteups/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteAuthorWriteUp(DeleteAuthorWriteUpRequest deleteAuthorWriteUpRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var authorWriteUp = new AuthorWriteUp()
                {
                    AuthorWriteUpId = deleteAuthorWriteUpRequest.AuthorWriteUpId,
                    ModifiedBy = Utility.UserId
                };

                int result = iAuthorWriteUp.DeleteAuthorWriteUp(authorWriteUp);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "AuthorWriteUp deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "AuthorWriteUp doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting authorwriteup.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting authorwriteup.";

                Utility.WriteLog("DeleteAuthorWriteUp", deleteAuthorWriteUpRequest, "Error while deleting authorwriteup. (AuthorWriteUpAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        //[HttpGet]
        //[Route("topics")]
        //[ResponseType(typeof(List<GetTopicResponse>))]
        //public IHttpActionResult GetTopic([FromUri]GetTopicRequest getTopicRequest)
        //{
        //    var responses = new Responses();
        //    try
        //    {
        //        if (Utility.UserId < 0)
        //            return BadRequest(Utility.INVALID_USER);

        //        if (getTopicRequest == null)
        //            getTopicRequest = new GetTopicRequest();

        //        var topic = new Topic()
        //        {
        //            TopicId = getTopicRequest.TopicId
        //        };
        //        var topics = iAuthorWriteUp.GetTopic(topic);

        //        var topicList = new List<GetTopicResponse>();
        //        foreach (var topicDetail in topics)
        //        {
        //            topicList.Add(new GetTopicResponse()
        //            {
        //                TopicId = topicDetail.TopicId,
        //                TopicName = topicDetail.TopicName
        //            });
        //        }

        //        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
        //        responses.Description = "Topic retrieved successfully";
        //        responses.Response = topicList;
        //    }
        //    catch (Exception ex)
        //    {
        //        responses.Status = Utility.ERROR_STATUS_RESPONSE;
        //        responses.Description = "Error while retrieving topic.";

        //        Utility.WriteLog("GetTopic", getTopicRequest, "Error while retrieving topic. (AuthorWriteUpAdminController)", ex.ToString());
        //    }
        //    return Ok(responses);
        //}
    }
}
