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
    public class AuthorWriteUpDetailUserController : ApiController
    {
        private IAuthorWriteUpDetail iAuthorWriteUpDetail;
        public AuthorWriteUpDetailUserController()
        {
            try
            {
                iAuthorWriteUpDetail = new AuthorWriteUpDetailRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("AuthorWriteUpDetailUserController (User)", null, "Error while initialize repository.", ex.ToString());
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
