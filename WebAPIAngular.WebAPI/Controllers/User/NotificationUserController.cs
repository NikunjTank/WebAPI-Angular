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
    public class NotificationUserController : ApiController
    {
        private INotification iNotification;
        public NotificationUserController()
        {
            try
            {
                iNotification = new NotificationRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("NotificationUserController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("notifications")]
        [ResponseType(typeof(List<GetNotificationResponse>))]
        public IHttpActionResult GetNotification([FromUri]GetNotificationRequest getNotificationRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getNotificationRequest == null)
                    getNotificationRequest = new GetNotificationRequest();

                if (getNotificationRequest.PageSize == null)
                    getNotificationRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var notification = new Notification()
                {
                    NotificationId = getNotificationRequest.NotificationId,
                    RegulationId = getNotificationRequest.RegulationId,
                    SearchText = getNotificationRequest.SearchText,
                    IsActive = getNotificationRequest.IsActive,
                    PageNumber = getNotificationRequest.PageNumber,
                    PageSize = Convert.ToInt32(getNotificationRequest.PageSize),
                    IsPagingRequired = (getNotificationRequest.PageNumber != null) ? true : false,
                    OrderBy = getNotificationRequest.OrderBy,
                    OrderByDirection = getNotificationRequest.OrderByDirection
                };
                var notifications = iNotification.GetNotification(notification);

                var notificationList = new List<GetNotificationResponse>();
                foreach (var notificationDetail in notifications)
                {
                    notificationList.Add(new GetNotificationResponse()
                    {
                        NotificationId = notificationDetail.NotificationId,
                        RegulationId = notificationDetail.RegulationId,
                        NotificationNumber = notificationDetail.NotificationNumber,
                        RegulationName = notificationDetail.RegulationName,
                        RegulationNumber = notificationDetail.RegulationNumber,
                        MasterDirectionId = notificationDetail.MasterDirectionId,
                        MasterDirectionName = notificationDetail.MasterDirectionName,
                        NotificationName = notificationDetail.NotificationName,
                        NotificationTypeName = notificationDetail.NotificationTypeName,
                        NotificationDate = notificationDetail.NotificationDate,
                        NotificationEffectiveDate = notificationDetail.NotificationEffectiveDate,
                        NotificationTypeId = notificationDetail.NotificationTypeId,
                        GSRNo = notificationDetail.GSRNo,
                        GSRDate = notificationDetail.GSRDate,
                        NotificationPDF = notificationDetail.NotificationPDF,
                        GSRPDF = notificationDetail.GSRPDF,
                        IsActive = Convert.ToBoolean(notificationDetail.IsActive),
                        CreatedBy = notificationDetail.CreatedBy,
                        TotalPageCount = notificationDetail.TotalPageCount,
                        TotalRecord = notificationDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "Notification retrieved successfully";
                responses.Response = notificationList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving notification.";

                Utility.WriteLog("GetNotification", getNotificationRequest, "Error while retrieving notification. (NotificationAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
