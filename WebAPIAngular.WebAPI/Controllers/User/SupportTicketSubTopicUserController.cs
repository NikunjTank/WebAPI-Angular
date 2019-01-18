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

namespace DemystifyFema.Service.Controllers.User
{
    [Authorize(Roles = "User")]
    [RoutePrefix("user/api")]
    public class SupportTicketSubTopicUserController : ApiController
    {
        private ISupportTicketSubTopic iSupportTicketSubTopic;
        public SupportTicketSubTopicUserController()
        {
            try
            {
                iSupportTicketSubTopic = new SupportTicketSubTopicRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("SupportTicketSubTopicUserController (User)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("supportticketsubtopics")]
        [ResponseType(typeof(List<GetSupportTicketSubTopicResponse>))]
        public IHttpActionResult GetSupportTicketSubTopic([FromUri]GetSupportTicketSubTopicRequest getSupportTicketSubTopicRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getSupportTicketSubTopicRequest == null)
                    getSupportTicketSubTopicRequest = new GetSupportTicketSubTopicRequest();

                if (getSupportTicketSubTopicRequest.PageSize == null)
                    getSupportTicketSubTopicRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var supportTicketSubTopic = new SupportTicketSubTopic()
                {
                    SupportTicketSubTopicId = getSupportTicketSubTopicRequest.SupportTicketSubTopicId,
                    FEMAModuleId = getSupportTicketSubTopicRequest.FEMAModuleId,
                    SearchText = getSupportTicketSubTopicRequest.SearchText,
                    IsActive = getSupportTicketSubTopicRequest.IsActive,
                    PageNumber = getSupportTicketSubTopicRequest.PageNumber,
                    PageSize = Convert.ToInt32(getSupportTicketSubTopicRequest.PageSize),
                    IsPagingRequired = (getSupportTicketSubTopicRequest.PageNumber != null) ? true : false,
                    OrderBy = getSupportTicketSubTopicRequest.OrderBy,
                    OrderByDirection = getSupportTicketSubTopicRequest.OrderByDirection
                };
                var supportTicketSubTopics = iSupportTicketSubTopic.GetSupportTicketSubTopic(supportTicketSubTopic);

                var supportTicketSubTopicList = new List<GetSupportTicketSubTopicResponse>();
                foreach (var supportTicketSubTopicDetail in supportTicketSubTopics)
                {
                    supportTicketSubTopicList.Add(new GetSupportTicketSubTopicResponse()
                    {
                        SupportTicketSubTopicId = supportTicketSubTopicDetail.SupportTicketSubTopicId,
                        FEMAModuleId = supportTicketSubTopicDetail.FEMAModuleId,
                        SupportTicketSubTopicName = supportTicketSubTopicDetail.SupportTicketSubTopicName,
                        IsActive = Convert.ToBoolean(supportTicketSubTopicDetail.IsActive),
                        CreatedBy = supportTicketSubTopicDetail.CreatedBy,
                        TotalPageCount = supportTicketSubTopicDetail.TotalPageCount,
                        TotalRecord = supportTicketSubTopicDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "SupportTicketSubTopic retrieved successfully";
                responses.Response = supportTicketSubTopicList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving supportticketsubtopic.";

                Utility.WriteLog("GetSupportTicketSubTopic", getSupportTicketSubTopicRequest, "Error while retrieving supportticketsubtopic. (SupportTicketSubTopicUserController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
