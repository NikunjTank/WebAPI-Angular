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
    public class DIPPClarificationAdminController : ApiController
    {
        private IDIPPClarification iDIPPClarification;
        public DIPPClarificationAdminController()
        {
            try
            {
                iDIPPClarification = new DIPPClarificationRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("DIPPClarificationAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
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

                Utility.WriteLog("GetDIPPClarification", getDIPPClarificationRequest, "Error while retrieving dIPPClarification. (DIPPClarificationAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        #region Upload Files
        [HttpPost]
        [Route("dippclarifications/uploadfiles")]
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
                string fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["DIPPClarificationPDFPath"]), fileName);
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

                Utility.WriteLog("UploadFile", null, "Error while uploading file. (DIPPClarificationAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
        #endregion

        [HttpPost]
        [Route("dippclarifications/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddDIPPClarification(AddDIPPClarificationRequest addDIPPClarificationRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var dIPPClarification = new DIPPClarification()
                {
                    ClarificationTopic = addDIPPClarificationRequest.ClarificationTopic,
                    PDF = addDIPPClarificationRequest.PDF,
                    CreatedBy = Utility.UserId
                };
                int result = iDIPPClarification.AddDIPPClarification(dIPPClarification);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "DIPPClarification added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "DIPPClarification alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding dIPPClarification.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding dIPPClarification.";

                Utility.WriteLog("AddDIPPClarification", addDIPPClarificationRequest, "Error while adding dIPPClarification. (DIPPClarificationAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("dippclarifications/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateDIPPClarification(UpdateDIPPClarificationRequest updateDIPPClarificationRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var dIPPClarification = new DIPPClarification()
                {
                    DIPPClarificationId = updateDIPPClarificationRequest.DIPPClarificationId,
                    ClarificationTopic = updateDIPPClarificationRequest.ClarificationTopic,
                    PDF = updateDIPPClarificationRequest.PDF,
                    ModifiedBy = Utility.UserId
                };
                int result = iDIPPClarification.UpdateDIPPClarification(dIPPClarification);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "DIPPClarification updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "DIPPClarification already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "DIPPClarification doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating dIPPClarification.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating admin profile.";

                Utility.WriteLog("UpdateDIPPClarification", updateDIPPClarificationRequest, "Error while updating dIPPClarification. (DIPPClarificationAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("dippclarifications/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteDIPPClarification(DeleteDIPPClarificationRequest deleteDIPPClarificationRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var dIPPClarification = new DIPPClarification()
                {
                    DIPPClarificationId = deleteDIPPClarificationRequest.DIPPClarificationId,
                    ModifiedBy = Utility.UserId
                };

                int result = iDIPPClarification.DeleteDIPPClarification(dIPPClarification);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "DIPPClarification deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "DIPPClarification doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting dIPPClarification.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting dIPPClarification.";

                Utility.WriteLog("DeleteDIPPClarification", deleteDIPPClarificationRequest, "Error while deleting dIPPClarification. (DIPPClarificationAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
