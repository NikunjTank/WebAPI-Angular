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
    public class AuthorWriteUpDetailAdminController : ApiController
    {
        private IAuthorWriteUpDetail iAuthorWriteUpDetail;
        public AuthorWriteUpDetailAdminController()
        {
            try
            {
                iAuthorWriteUpDetail = new AuthorWriteUpDetailRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("AuthorWriteUpDetailAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("authorwriteupdetails")]
        [ResponseType(typeof(List<GetAuthorWriteUpDetailResponse>))]
        public IHttpActionResult GetAuthorWriteUpDetail([FromUri]GetAuthorWriteUpDetailRequest getAuthorWriteUpDetailRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getAuthorWriteUpDetailRequest == null)
                    getAuthorWriteUpDetailRequest = new GetAuthorWriteUpDetailRequest();

                if (getAuthorWriteUpDetailRequest.PageSize == null)
                    getAuthorWriteUpDetailRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var authorWriteUpDetail = new AuthorWriteUpDetail()
                {
                    AuthorWriteUpDetailId = getAuthorWriteUpDetailRequest.AuthorWriteUpDetailId,
                    AuthorWriteUpId = getAuthorWriteUpDetailRequest.AuthorWriteUpId,
                    SearchText = getAuthorWriteUpDetailRequest.SearchText,
                    IsActive = getAuthorWriteUpDetailRequest.IsActive,
                    PageNumber = getAuthorWriteUpDetailRequest.PageNumber,
                    PageSize = Convert.ToInt32(getAuthorWriteUpDetailRequest.PageSize),
                    IsPagingRequired = (getAuthorWriteUpDetailRequest.PageNumber != null) ? true : false,
                    OrderBy = getAuthorWriteUpDetailRequest.OrderBy,
                    OrderByDirection = getAuthorWriteUpDetailRequest.OrderByDirection
                };
                var authorWriteUpDetails = iAuthorWriteUpDetail.GetAuthorWriteUpDetail(authorWriteUpDetail);

                var authorWriteUpDetailList = new List<GetAuthorWriteUpDetailResponse>();
                foreach (var authorWriteUpDetailDetail in authorWriteUpDetails)
                {
                    authorWriteUpDetailList.Add(new GetAuthorWriteUpDetailResponse()
                    {
                        AuthorWriteUpDetailId = Convert.ToInt32(authorWriteUpDetailDetail.AuthorWriteUpDetailId),
                        SubTopicId = authorWriteUpDetailDetail.SubTopicId,
                        SubTopicName = authorWriteUpDetailDetail.SubTopicName,
                        PDF = authorWriteUpDetailDetail.PDF,
                        IsActive = Convert.ToBoolean(authorWriteUpDetailDetail.IsActive),
                        CreatedBy = authorWriteUpDetailDetail.CreatedBy,
                        TotalPageCount = authorWriteUpDetailDetail.TotalPageCount,
                        TotalRecord = authorWriteUpDetailDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "AuthorWriteUpDetail retrieved successfully";
                responses.Response = authorWriteUpDetailList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving authorwriteupdetail.";

                Utility.WriteLog("GetAuthorWriteUpDetail", getAuthorWriteUpDetailRequest, "Error while retrieving authorwriteupdetail. (AuthorWriteUpDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        #region Upload Files
        [HttpPost]
        [Route("authorwriteupdetails/uploadfiles")]
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
                string fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["AuthorWriteUpDetailPDFPath"]), fileName);
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

                Utility.WriteLog("UploadFile", null, "Error while uploading file. (AuthorWriteUpDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
        #endregion

        [HttpPost]
        [Route("authorwriteupdetails/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddAuthorWriteUpDetail(AddAuthorWriteUpDetailRequest addAuthorWriteUpDetailRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var authorWriteUpDetail = new AuthorWriteUpDetail()
                {
                    AuthorWriteUpId = addAuthorWriteUpDetailRequest.AuthorWriteUpId,
                    SubTopicId = addAuthorWriteUpDetailRequest.SubTopicId,
                    PDF = addAuthorWriteUpDetailRequest.PDF,
                    CreatedBy = Utility.UserId
                };
                int result = iAuthorWriteUpDetail.AddAuthorWriteUpDetail(authorWriteUpDetail);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "AuthorWriteUpDetail added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "AuthorWriteUpDetail alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding authorwriteupdetail.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding authorwriteupdetail.";

                Utility.WriteLog("AddAuthorWriteUpDetail", addAuthorWriteUpDetailRequest, "Error while adding authorwriteupdetail. (AuthorWriteUpDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("authorwriteupdetails/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateAuthorWriteUpDetail(UpdateAuthorWriteUpDetailRequest updateAuthorWriteUpDetailRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var authorWriteUpDetail = new AuthorWriteUpDetail()
                {
                    AuthorWriteUpDetailId = updateAuthorWriteUpDetailRequest.AuthorWriteUpDetailId,
                    AuthorWriteUpId = updateAuthorWriteUpDetailRequest.AuthorWriteUpId,
                    SubTopicId = updateAuthorWriteUpDetailRequest.SubTopicId,
                    PDF = updateAuthorWriteUpDetailRequest.PDF,
                    ModifiedBy = Utility.UserId
                };
                int result = iAuthorWriteUpDetail.UpdateAuthorWriteUpDetail(authorWriteUpDetail);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "AuthorWriteUpDetail updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "AuthorWriteUpDetail already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "AuthorWriteUpDetail doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating authorwriteupdetail.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating admin profile.";

                Utility.WriteLog("UpdateAuthorWriteUpDetail", updateAuthorWriteUpDetailRequest, "Error while updating authorwriteupdetail. (AuthorWriteUpDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("authorwriteupdetails/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteAuthorWriteUpDetail(DeleteAuthorWriteUpDetailRequest deleteAuthorWriteUpDetailRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var authorWriteUpDetail = new AuthorWriteUpDetail()
                {
                    AuthorWriteUpDetailId = deleteAuthorWriteUpDetailRequest.AuthorWriteUpDetailId,
                    ModifiedBy = Utility.UserId
                };

                int result = iAuthorWriteUpDetail.DeleteAuthorWriteUpDetail(authorWriteUpDetail);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "AuthorWriteUpDetail deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "AuthorWriteUpDetail doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting authorwriteupdetail.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting authorwriteupdetail.";

                Utility.WriteLog("DeleteAuthorWriteUpDetail", deleteAuthorWriteUpDetailRequest, "Error while deleting authorwriteupdetail. (AuthorWriteUpDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpGet]
        [Route("subtopics")]
        [ResponseType(typeof(List<GetSubTopicResponse>))]
        public IHttpActionResult GetSubTopic([FromUri]GetSubTopicRequest getSubTopicRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getSubTopicRequest == null)
                    getSubTopicRequest = new GetSubTopicRequest();

                var subTopic = new SubTopic()
                {
                    SubTopicId = getSubTopicRequest.SubTopicId
                };
                var subTopics = iAuthorWriteUpDetail.GetSubTopic(subTopic);

                var subTopicList = new List<GetSubTopicResponse>();
                foreach (var subTopicDetail in subTopics)
                {
                    subTopicList.Add(new GetSubTopicResponse()
                    {
                        SubTopicId = subTopicDetail.SubTopicId,
                        SubTopicName = subTopicDetail.SubTopicName
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "SubTopic retrieved successfully";
                responses.Response = subTopicList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving subTopic.";

                Utility.WriteLog("GetSubTopic", getSubTopicRequest, "Error while retrieving subTopic. (AuthorWriteUpDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
