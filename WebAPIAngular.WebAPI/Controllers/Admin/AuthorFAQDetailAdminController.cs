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
    public class AuthorFAQDetailAdminController : ApiController
    {
        private IAuthorFAQDetail iAuthorFAQDetail;
        public AuthorFAQDetailAdminController()
        {
            try
            {
                iAuthorFAQDetail = new AuthorFAQDetailRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("AuthorFAQDetailAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("authorfaqdetails")]
        [ResponseType(typeof(List<GetAuthorFAQDetailResponse>))]
        public IHttpActionResult GetAuthorFAQDetail([FromUri]GetAuthorFAQDetailRequest getAuthorFAQDetailRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getAuthorFAQDetailRequest == null)
                    getAuthorFAQDetailRequest = new GetAuthorFAQDetailRequest();

                if (getAuthorFAQDetailRequest.PageSize == null)
                    getAuthorFAQDetailRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var authorFAQDetail = new AuthorFAQDetail()
                {
                    AuthorFAQDetailId = getAuthorFAQDetailRequest.AuthorFAQDetailId,
                    AuthorFAQId = getAuthorFAQDetailRequest.AuthorFAQId,
                    SearchText = getAuthorFAQDetailRequest.SearchText,
                    IsActive = getAuthorFAQDetailRequest.IsActive,
                    PageNumber = getAuthorFAQDetailRequest.PageNumber,
                    PageSize = Convert.ToInt32(getAuthorFAQDetailRequest.PageSize),
                    IsPagingRequired = (getAuthorFAQDetailRequest.PageNumber != null) ? true : false,
                    OrderBy = getAuthorFAQDetailRequest.OrderBy,
                    OrderByDirection = getAuthorFAQDetailRequest.OrderByDirection
                };
                var authorFAQDetails = iAuthorFAQDetail.GetAuthorFAQDetail(authorFAQDetail);

                var authorFAQDetailList = new List<GetAuthorFAQDetailResponse>();
                foreach (var authorFAQDetailDetail in authorFAQDetails)
                {
                    authorFAQDetailList.Add(new GetAuthorFAQDetailResponse()
                    {
                        AuthorFAQDetailId = Convert.ToInt32(authorFAQDetailDetail.AuthorFAQDetailId),
                        SubTopicId = authorFAQDetailDetail.SubTopicId,
                        SubTopicName = authorFAQDetailDetail.SubTopicName,
                        IsActive = Convert.ToBoolean(authorFAQDetailDetail.IsActive),
                        CreatedBy = authorFAQDetailDetail.CreatedBy,
                        TotalPageCount = authorFAQDetailDetail.TotalPageCount,
                        TotalRecord = authorFAQDetailDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "AuthorFAQDetail retrieved successfully";
                responses.Response = authorFAQDetailList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving authorfaqdetail.";

                Utility.WriteLog("GetAuthorFAQDetail", getAuthorFAQDetailRequest, "Error while retrieving authorfaqdetail. (AuthorFAQDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
        
        [HttpPost]
        [Route("authorfaqdetails/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddAuthorFAQDetail(AddAuthorFAQDetailRequest addAuthorFAQDetailRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var authorFAQDetail = new AuthorFAQDetail()
                {
                    AuthorFAQId = addAuthorFAQDetailRequest.AuthorFAQId,
                    SubTopicId = addAuthorFAQDetailRequest.SubTopicId,
                    CreatedBy = Utility.UserId
                };
                int result = iAuthorFAQDetail.AddAuthorFAQDetail(authorFAQDetail);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "AuthorFAQDetail added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "AuthorFAQDetail alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding authorfaqdetail.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding authorfaqdetail.";

                Utility.WriteLog("AddAuthorFAQDetail", addAuthorFAQDetailRequest, "Error while adding authorfaqdetail. (AuthorFAQDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("authorfaqdetails/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateAuthorFAQDetail(UpdateAuthorFAQDetailRequest updateAuthorFAQDetailRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var authorFAQDetail = new AuthorFAQDetail()
                {
                    AuthorFAQDetailId = updateAuthorFAQDetailRequest.AuthorFAQDetailId,
                    AuthorFAQId = updateAuthorFAQDetailRequest.AuthorFAQId,
                    SubTopicId = updateAuthorFAQDetailRequest.SubTopicId,
                    ModifiedBy = Utility.UserId
                };
                int result = iAuthorFAQDetail.UpdateAuthorFAQDetail(authorFAQDetail);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "AuthorFAQDetail updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "AuthorFAQDetail already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "AuthorFAQDetail doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating authorfaqdetail.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating admin profile.";

                Utility.WriteLog("UpdateAuthorFAQDetail", updateAuthorFAQDetailRequest, "Error while updating authorfaqdetail. (AuthorFAQDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("authorfaqdetails/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteAuthorFAQDetail(DeleteAuthorFAQDetailRequest deleteAuthorFAQDetailRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var authorFAQDetail = new AuthorFAQDetail()
                {
                    AuthorFAQDetailId = deleteAuthorFAQDetailRequest.AuthorFAQDetailId,
                    ModifiedBy = Utility.UserId
                };

                int result = iAuthorFAQDetail.DeleteAuthorFAQDetail(authorFAQDetail);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "AuthorFAQDetail deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "AuthorFAQDetail doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting authorfaqdetail.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting authorfaqdetail.";

                Utility.WriteLog("DeleteAuthorFAQDetail", deleteAuthorFAQDetailRequest, "Error while deleting authorfaqdetail. (AuthorFAQDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
