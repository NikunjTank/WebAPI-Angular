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
    public class GSRNotificationAdminController : ApiController
    {
        private IGSRNotification iGSRNotification;
        public GSRNotificationAdminController()
        {
            try
            {
                iGSRNotification = new GSRNotificationRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("GSRNotificationAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
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

                Utility.WriteLog("GetGSRNotification", getGSRNotificationRequest, "Error while retrieving GSRNotification. (GSRNotificationAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        #region Upload Files
        [HttpPost]
        [Route("gsrnotifications/uploadfiles")]
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
                string fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["GSRNotificationPDFPath"]), fileName);
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

                Utility.WriteLog("UploadFile", null, "Error while uploading file. (GSRNotificationAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
        #endregion

        [HttpPost]
        [Route("gsrnotifications/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddGSRNotification(AddGSRNotificationRequest addGSRNotificationRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var gSRNotification = new GSRNotification()
                {
                    RulesId = addGSRNotificationRequest.RulesId,
                    GSRNotificationNo = addGSRNotificationRequest.GSRNotificationNo,
                    GSRNotificationName = addGSRNotificationRequest.GSRNotificationName,
                    GSRNotificationDate = addGSRNotificationRequest.GSRNotificationDate,
                    GSRNotificationEffectiveDate = addGSRNotificationRequest.GSRNotificationEffectiveDate,
                    GSRNotificationTypeId = addGSRNotificationRequest.GSRNotificationTypeId,
                    PDF = addGSRNotificationRequest.PDF,
                    CreatedBy = Utility.UserId
                };
                int result = iGSRNotification.AddGSRNotification(gSRNotification);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "GSRNotification added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "GSRNotification alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding GSRNotification.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding GSRNotification.";

                Utility.WriteLog("AddGSRNotification", addGSRNotificationRequest, "Error while adding GSRNotification. (GSRNotificationAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("gsrnotifications/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateGSRNotification(UpdateGSRNotificationRequest updateGSRNotificationRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var gSRNotification = new GSRNotification()
                {
                    GSRNotificationId = updateGSRNotificationRequest.GSRNotificationId,
                    RulesId = updateGSRNotificationRequest.RulesId,
                    GSRNotificationNo = updateGSRNotificationRequest.GSRNotificationNo,
                    GSRNotificationName = updateGSRNotificationRequest.GSRNotificationName,
                    GSRNotificationDate = updateGSRNotificationRequest.GSRNotificationDate,
                    GSRNotificationEffectiveDate = updateGSRNotificationRequest.GSRNotificationEffectiveDate,
                    GSRNotificationTypeId = updateGSRNotificationRequest.GSRNotificationTypeId,
                    PDF = updateGSRNotificationRequest.PDF,
                    ModifiedBy = Utility.UserId
                };
                int result = iGSRNotification.UpdateGSRNotification(gSRNotification);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "GSRNotification updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "GSRNotification already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "GSRNotification doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating GSRNotification.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating GSRNotification.";

                Utility.WriteLog("UpdateGSRNotification", updateGSRNotificationRequest, "Error while updating GSRNotification. (GSRNotificationAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("gsrnotifications/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteGSRNotification(DeleteGSRNotificationRequest deleteGSRNotificationRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var gSRNotification = new GSRNotification()
                {
                    GSRNotificationId = deleteGSRNotificationRequest.GSRNotificationId,
                    ModifiedBy = Utility.UserId
                };

                int result = iGSRNotification.DeleteGSRNotification(gSRNotification);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "GSRNotification deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "GSRNotification doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting GSRNotification.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting GSRNotification.";

                Utility.WriteLog("DeleteGSRNotification", deleteGSRNotificationRequest, "Error while deleting GSRNotification. (GSRNotificationAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpGet]
        [Route("gsrnotificationtypes")]
        [ResponseType(typeof(List<GetGSRNotificationTypeResponse>))]
        public IHttpActionResult GetGSRNotificationType([FromUri]GetGSRNotificationTypeRequest getGSRNotificationTypeRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getGSRNotificationTypeRequest == null)
                    getGSRNotificationTypeRequest = new GetGSRNotificationTypeRequest();
                
                var gSRNotificationType = new GSRNotificationType()
                {
                    GSRNotificationTypeId = getGSRNotificationTypeRequest.GSRNotificationTypeId
                };
                var gSRNotificationTypes = iGSRNotification.GetGSRNotificationType(gSRNotificationType);

                var gSRNotificationTypeList = new List<GetGSRNotificationTypeResponse>();
                foreach (var gSRNotificationTypeDetail in gSRNotificationTypes)
                {
                    gSRNotificationTypeList.Add(new GetGSRNotificationTypeResponse()
                    {
                        GSRNotificationTypeId = gSRNotificationTypeDetail.GSRNotificationTypeId,
                        GSRNotificationTypeName = gSRNotificationTypeDetail.GSRNotificationTypeName
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "GSRNotificationType retrieved successfully";
                responses.Response = gSRNotificationTypeList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving GSRNotification type.";

                Utility.WriteLog("GetGSRNotificationType", getGSRNotificationTypeRequest, "Error while retrieving GSRNotification type. (GSRNotificationAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
