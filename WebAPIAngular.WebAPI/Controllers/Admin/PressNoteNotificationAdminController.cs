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
    public class PressNoteNotificationAdminController : ApiController
    {
        private IPressNoteNotification iPressNoteNotification;
        public PressNoteNotificationAdminController()
        {
            try
            {
                iPressNoteNotification = new PressNoteNotificationRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("PressNoteNotificationAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("pressnotenotifications")]
        [ResponseType(typeof(List<GetPressNoteNotificationResponse>))]
        public IHttpActionResult GetPressNoteNotification([FromUri]GetPressNoteNotificationRequest getPressNoteNotificationRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getPressNoteNotificationRequest == null)
                    getPressNoteNotificationRequest = new GetPressNoteNotificationRequest();

                if (getPressNoteNotificationRequest.PageSize == null)
                    getPressNoteNotificationRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var pressNoteNotification = new PressNoteNotification()
                {
                    PressNoteNotificationId = getPressNoteNotificationRequest.PressNoteNotificationId,
                    PressNoteId = getPressNoteNotificationRequest.PressNoteId,
                    SearchText = getPressNoteNotificationRequest.SearchText,
                    IsActive = getPressNoteNotificationRequest.IsActive,
                    PageNumber = getPressNoteNotificationRequest.PageNumber,
                    PageSize = Convert.ToInt32(getPressNoteNotificationRequest.PageSize),
                    IsPagingRequired = (getPressNoteNotificationRequest.PageNumber != null) ? true : false,
                    OrderBy = getPressNoteNotificationRequest.OrderBy,
                    OrderByDirection = getPressNoteNotificationRequest.OrderByDirection
                };
                var pressNoteNotifications = iPressNoteNotification.GetPressNoteNotification(pressNoteNotification);

                var pressNoteNotificationList = new List<GetPressNoteNotificationResponse>();
                foreach (var pressNoteNotificationDetail in pressNoteNotifications)
                {
                    pressNoteNotificationList.Add(new GetPressNoteNotificationResponse()
                    {
                        PressNoteNotificationId = Convert.ToInt32(pressNoteNotificationDetail.PressNoteNotificationId),
                        PressNoteId = pressNoteNotificationDetail.PressNoteId,
                        NotificationId = pressNoteNotificationDetail.NotificationId,
                        RegulationId = pressNoteNotificationDetail.RegulationId,
                        NotificationNumber = pressNoteNotificationDetail.NotificationNumber,
                        RegulationNumber = pressNoteNotificationDetail.RegulationNumber,
                        NotificationName = pressNoteNotificationDetail.NotificationName,
                        NotificationTypeName = pressNoteNotificationDetail.NotificationTypeName,
                        NotificationDate = pressNoteNotificationDetail.NotificationDate,
                        NotificationEffectiveDate = pressNoteNotificationDetail.NotificationEffectiveDate,
                        NotificationTypeId = pressNoteNotificationDetail.NotificationTypeId,
                        GSRNo = pressNoteNotificationDetail.GSRNo,
                        GSRDate = pressNoteNotificationDetail.GSRDate,
                        NotificationPDF = pressNoteNotificationDetail.NotificationPDF,
                        GSRPDF = pressNoteNotificationDetail.GSRPDF,
                        IsActive = Convert.ToBoolean(pressNoteNotificationDetail.IsActive),
                        CreatedBy = pressNoteNotificationDetail.CreatedBy,
                        TotalPageCount = pressNoteNotificationDetail.TotalPageCount,
                        TotalRecord = pressNoteNotificationDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "Press Note Notification retrieved successfully";
                responses.Response = pressNoteNotificationList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving Press Note Notification.";

                Utility.WriteLog("GetPressNoteNotification", getPressNoteNotificationRequest, "Error while retrieving Press Note Notification. (PressNoteNotificationAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("pressnotenotifications/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddPressNoteNotification(AddPressNoteNotificationRequest addPressNoteNotificationRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var pressNoteNotification = new PressNoteNotification()
                {
                    PressNoteId = addPressNoteNotificationRequest.PressNoteId,
                    NotificationId = addPressNoteNotificationRequest.NotificationId,
                    CreatedBy = Utility.UserId
                };
                int result = iPressNoteNotification.AddPressNoteNotification(pressNoteNotification);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "Press Note Notification added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Press Note Notification alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding Press Note Notification.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding Press Note Notification.";

                Utility.WriteLog("AddPressNoteNotification", addPressNoteNotificationRequest, "Error while adding Press Note Notification. (PressNoteNotificationAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("pressnotenotifications/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdatePressNoteNotification(UpdatePressNoteNotificationRequest updatePressNoteNotificationRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var pressNoteNotification = new PressNoteNotification()
                {
                    PressNoteNotificationId = updatePressNoteNotificationRequest.PressNoteNotificationId,
                    PressNoteId = updatePressNoteNotificationRequest.PressNoteId,
                    NotificationId = updatePressNoteNotificationRequest.NotificationId,
                    ModifiedBy = Utility.UserId
                };
                int result = iPressNoteNotification.UpdatePressNoteNotification(pressNoteNotification);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "Press Note Notification updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Press Note Notification already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Press Note Notification doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating Press Note Notification.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating Press Note Notification.";

                Utility.WriteLog("UpdatePressNoteNotification", updatePressNoteNotificationRequest, "Error while updating Press Note Notification. (PressNoteNotificationAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("pressnotenotifications/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeletePressNoteNotification(DeletePressNoteNotificationRequest deletePressNoteNotificationRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var pressNoteNotification = new PressNoteNotification()
                {
                    PressNoteNotificationId = deletePressNoteNotificationRequest.PressNoteNotificationId,
                    ModifiedBy = Utility.UserId
                };

                int result = iPressNoteNotification.DeletePressNoteNotification(pressNoteNotification);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "Press Note Notification deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Press Note Notification doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting Press Note Notification.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting Press Note Notification.";

                Utility.WriteLog("DeletePressNoteNotification", deletePressNoteNotificationRequest, "Error while deleting Press Note Notification. (PressNoteNotificationAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
