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
    public class DIPPClarificationUserController : ApiController
    {
        private IDIPPClarification iDIPPClarification;
        public DIPPClarificationUserController()
        {
            try
            {
                iDIPPClarification = new DIPPClarificationRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("DIPPClarificationUserController (User)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("dippclarifications")]
        [ResponseType(typeof(List<GetDIPPClarificationResponse>))]
        public IHttpActionResult GetDIPPClarification([FromUri]GetDIPPClarificationRequest getDIPPClarificationRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getDIPPClarificationRequest == null)
                    getDIPPClarificationRequest = new GetDIPPClarificationRequest();

                if (getDIPPClarificationRequest.PageSize == null)
                    getDIPPClarificationRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var dIPPClarification = new DIPPClarification()
                {
                    DIPPClarificationId = getDIPPClarificationRequest.DIPPClarificationId,
                    SearchText = getDIPPClarificationRequest.SearchText,
                    IsActive = getDIPPClarificationRequest.IsActive,
                    PageNumber = getDIPPClarificationRequest.PageNumber,
                    PageSize = Convert.ToInt32(getDIPPClarificationRequest.PageSize),
                    IsPagingRequired = (getDIPPClarificationRequest.PageNumber != null) ? true : false,
                    OrderBy = getDIPPClarificationRequest.OrderBy,
                    OrderByDirection = getDIPPClarificationRequest.OrderByDirection
                };
                var dIPPClarifications = iDIPPClarification.GetDIPPClarification(dIPPClarification);

                var dIPPClarificationList = new List<GetDIPPClarificationResponse>();
                foreach (var dIPPClarificationDetail in dIPPClarifications)
                {
                    dIPPClarificationList.Add(new GetDIPPClarificationResponse()
                    {
                        DIPPClarificationId = Convert.ToInt32(dIPPClarificationDetail.DIPPClarificationId),
                        ClarificationTopic = dIPPClarificationDetail.ClarificationTopic,
                        PDF = dIPPClarificationDetail.PDF,
                        IsActive = Convert.ToBoolean(dIPPClarificationDetail.IsActive),
                        CreatedBy = dIPPClarificationDetail.CreatedBy,
                        TotalPageCount = dIPPClarificationDetail.TotalPageCount,
                        TotalRecord = dIPPClarificationDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "DIPPClarification retrieved successfully";
                responses.Response = dIPPClarificationList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving dIPPClarification.";

                Utility.WriteLog("GetDIPPClarification", getDIPPClarificationRequest, "Error while retrieving dIPPClarification. (DIPPClarificationUserController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
