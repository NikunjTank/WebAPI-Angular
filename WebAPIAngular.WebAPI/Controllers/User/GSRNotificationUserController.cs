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
    public class GSRNotificationUserController : ApiController
    {
        private IGSRNotification iGSRNotification;
        public GSRNotificationUserController()
        {
            try
            {
                iGSRNotification = new GSRNotificationRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("GSRNotificationUserController (User)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("gsrnotifications")]
        [ResponseType(typeof(List<GetGSRNotificationResponse>))]
        public IHttpActionResult GetGSRNotification([FromUri]GetGSRNotificationRequest getGSRNotificationRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getGSRNotificationRequest == null)
                    getGSRNotificationRequest = new GetGSRNotificationRequest();

                if (getGSRNotificationRequest.PageSize == null)
                    getGSRNotificationRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var gSRNotification = new GSRNotification()
                {
                    GSRNotificationId = getGSRNotificationRequest.GSRNotificationId,
                    RulesId = getGSRNotificationRequest.RulesId,
                    SearchText = getGSRNotificationRequest.SearchText,
                    IsActive = getGSRNotificationRequest.IsActive,
                    PageNumber = getGSRNotificationRequest.PageNumber,
                    PageSize = Convert.ToInt32(getGSRNotificationRequest.PageSize),
                    IsPagingRequired = (getGSRNotificationRequest.PageNumber != null) ? true : false,
                    OrderBy = getGSRNotificationRequest.OrderBy,
                    OrderByDirection = getGSRNotificationRequest.OrderByDirection
                };
                var gSRNotifications = iGSRNotification.GetGSRNotification(gSRNotification);

                var gSRNotificationList = new List<GetGSRNotificationResponse>();
                foreach (var gSRNotificationDetail in gSRNotifications)
                {
                    gSRNotificationList.Add(new GetGSRNotificationResponse()
                    {
                        GSRNotificationId = gSRNotificationDetail.GSRNotificationId,
                        RulesId = gSRNotificationDetail.RulesId,
                        GSRNotificationNo = gSRNotificationDetail.GSRNotificationNo,
                        RulesName = gSRNotificationDetail.RulesName,
                        GSRNotificationName = gSRNotificationDetail.GSRNotificationName,
                        GSRNotificationTypeName = gSRNotificationDetail.GSRNotificationTypeName,
                        GSRNotificationDate = gSRNotificationDetail.GSRNotificationDate,
                        GSRNotificationEffectiveDate = gSRNotificationDetail.GSRNotificationEffectiveDate,
                        GSRNotificationTypeId = gSRNotificationDetail.GSRNotificationTypeId,
                        PDF = gSRNotificationDetail.PDF,
                        IsActive = Convert.ToBoolean(gSRNotificationDetail.IsActive),
                        CreatedBy = gSRNotificationDetail.CreatedBy,
                        TotalPageCount = gSRNotificationDetail.TotalPageCount,
                        TotalRecord = gSRNotificationDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "GSRNotification retrieved successfully";
                responses.Response = gSRNotificationList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving GSRNotification.";

                Utility.WriteLog("GetGSRNotification", getGSRNotificationRequest, "Error while retrieving GSRNotification. (GSRNotificationUserController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
