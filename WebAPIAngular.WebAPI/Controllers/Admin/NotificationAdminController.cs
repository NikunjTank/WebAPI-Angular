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
    public class NotificationAdminController : ApiController
    {
        private INotification iNotification;
        public NotificationAdminController()
        {
            try
            {
                iNotification = new NotificationRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("NotificationAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
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
                        RegulationName = notificationDetail.RegulationName,
                        NotificationNumber = notificationDetail.NotificationNumber,
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

        #region Upload NotificationPDF
        [HttpPost]
        [Route("notifications/uploadnotificationpdf")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UploadNotificationPDF()
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
                string fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["NotificationPDFPath"]), fileName);
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

                Utility.WriteLog("UploadNotificationPDF", null, "Error while uploading file. (NotificationAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
        #endregion

        #region Upload Files
        [HttpPost]
        [Route("notifications/uploadgsrpdf")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UploadGSRPDF()
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
                string fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["GSRPDFPath"]), fileName);
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

                Utility.WriteLog("UploadGSRPDF", null, "Error while uploading file. (NotificationAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
        #endregion

        [HttpPost]
        [Route("notifications/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddNotification(AddNotificationRequest addNotificationRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var notification = new Notification()
                {
                    RegulationId = addNotificationRequest.RegulationId,
                    MasterDirectionId = addNotificationRequest.MasterDirectionId,
                    NotificationNumber = addNotificationRequest.NotificationNumber,
                    NotificationName = addNotificationRequest.NotificationName,
                    NotificationDate = addNotificationRequest.NotificationDate,
                    NotificationEffectiveDate = addNotificationRequest.NotificationEffectiveDate,
                    NotificationTypeId = addNotificationRequest.NotificationTypeId,
                    GSRNo = addNotificationRequest.GSRNo,
                    GSRDate = addNotificationRequest.GSRDate,
                    NotificationPDF = addNotificationRequest.NotificationPDF,
                    GSRPDF = addNotificationRequest.GSRPDF,
                    CreatedBy = Utility.UserId
                };
                int result = iNotification.AddNotification(notification);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "Notification added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Notification alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding notification.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding notification.";

                Utility.WriteLog("AddNotification", addNotificationRequest, "Error while adding notification. (NotificationAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("notifications/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateNotification(UpdateNotificationRequest updateNotificationRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var notification = new Notification()
                {
                    NotificationId = updateNotificationRequest.NotificationId,
                    RegulationId = updateNotificationRequest.RegulationId,
                    MasterDirectionId = updateNotificationRequest.MasterDirectionId,
                    NotificationNumber = updateNotificationRequest.NotificationNumber,
                    NotificationName = updateNotificationRequest.NotificationName,
                    NotificationDate = updateNotificationRequest.NotificationDate,
                    NotificationEffectiveDate = updateNotificationRequest.NotificationEffectiveDate,
                    NotificationTypeId = updateNotificationRequest.NotificationTypeId,
                    GSRNo = updateNotificationRequest.GSRNo,
                    GSRDate = updateNotificationRequest.GSRDate,
                    NotificationPDF = updateNotificationRequest.NotificationPDF,
                    GSRPDF = updateNotificationRequest.GSRPDF,
                    ModifiedBy = Utility.UserId
                };
                int result = iNotification.UpdateNotification(notification);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "Notification updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Notification already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Notification doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating notification.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating notification.";

                Utility.WriteLog("UpdateNotification", updateNotificationRequest, "Error while updating notification. (NotificationAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("notifications/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteNotification(DeleteNotificationRequest deleteNotificationRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var notification = new Notification()
                {
                    NotificationId = deleteNotificationRequest.NotificationId,
                    ModifiedBy = Utility.UserId
                };

                int result = iNotification.DeleteNotification(notification);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "Notification deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Notification doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting notification.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting notification.";

                Utility.WriteLog("DeleteNotification", deleteNotificationRequest, "Error while deleting notification. (NotificationAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpGet]
        [Route("notificationtypes")]
        [ResponseType(typeof(List<GetNotificationTypeResponse>))]
        public IHttpActionResult GetNotificationType([FromUri]GetNotificationTypeRequest getNotificationTypeRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getNotificationTypeRequest == null)
                    getNotificationTypeRequest = new GetNotificationTypeRequest();
                
                var notificationType = new NotificationType()
                {
                    NotificationTypeId = getNotificationTypeRequest.NotificationTypeId
                };
                var notificationTypes = iNotification.GetNotificationType(notificationType);

                var notificationTypeList = new List<GetNotificationTypeResponse>();
                foreach (var notificationTypeDetail in notificationTypes)
                {
                    notificationTypeList.Add(new GetNotificationTypeResponse()
                    {
                        NotificationTypeId = notificationTypeDetail.NotificationTypeId,
                        NotificationTypeName = notificationTypeDetail.NotificationTypeName
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "NotificationType retrieved successfully";
                responses.Response = notificationTypeList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving notification type.";

                Utility.WriteLog("GetNotificationType", getNotificationTypeRequest, "Error while retrieving notification type. (NotificationAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
