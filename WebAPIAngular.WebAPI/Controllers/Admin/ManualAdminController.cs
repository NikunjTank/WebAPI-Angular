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
    public class ManualAdminController : ApiController
    {
        private IManual iManual;
        public ManualAdminController()
        {
            try
            {
                iManual = new ManualRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("ManualAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("manuals")]
        [ResponseType(typeof(List<GetManualResponse>))]
        public IHttpActionResult GetManual([FromUri]GetManualRequest getManualRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getManualRequest == null)
                    getManualRequest = new GetManualRequest();

                if (getManualRequest.PageSize == null)
                    getManualRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var manual = new Manual()
                {
                    ManualId = getManualRequest.ManualId,
                    SearchText = getManualRequest.SearchText,
                    IsActive = getManualRequest.IsActive,
                    PageNumber = getManualRequest.PageNumber,
                    PageSize = Convert.ToInt32(getManualRequest.PageSize),
                    IsPagingRequired = (getManualRequest.PageNumber != null) ? true : false,
                    OrderBy = getManualRequest.OrderBy,
                    OrderByDirection = getManualRequest.OrderByDirection
                };
                var manuals = iManual.GetManual(manual);

                var manualList = new List<GetManualResponse>();
                foreach (var manualDetail in manuals)
                {
                    manualList.Add(new GetManualResponse()
                    {
                        ManualId = Convert.ToInt32(manualDetail.ManualId),
                        ManualName = manualDetail.ManualName,
                        PDF = manualDetail.PDF,
                        IsActive = Convert.ToBoolean(manualDetail.IsActive),
                        CreatedBy = manualDetail.CreatedBy,
                        TotalPageCount = manualDetail.TotalPageCount,
                        TotalRecord = manualDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "Manual retrieved successfully";
                responses.Response = manualList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving manual.";

                Utility.WriteLog("GetManual", getManualRequest, "Error while retrieving manual. (ManualAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        #region Upload Files
        [HttpPost]
        [Route("manuals/uploadfiles")]
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
                string fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["ManualPDFPath"]), fileName);
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

                Utility.WriteLog("UploadFile", null, "Error while uploading file. (ManualAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
        #endregion

        [HttpPost]
        [Route("manuals/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddManual(AddManualRequest addManualRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var manual = new Manual()
                {
                    ManualName = addManualRequest.ManualName,
                    PDF = addManualRequest.PDF,
                    CreatedBy = Utility.UserId
                };
                int result = iManual.AddManual(manual);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "Manual added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Manual alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding manual.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding manual.";

                Utility.WriteLog("AddManual", addManualRequest, "Error while adding manual. (ManualAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("manuals/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateManual(UpdateManualRequest updateManualRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var manual = new Manual()
                {
                    ManualId = updateManualRequest.ManualId,
                    ManualName = updateManualRequest.ManualName,
                    PDF = updateManualRequest.PDF,
                    ModifiedBy = Utility.UserId
                };
                int result = iManual.UpdateManual(manual);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "Manual updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Manual already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Manual doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating manual.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating admin profile.";

                Utility.WriteLog("UpdateManual", updateManualRequest, "Error while updating manual. (ManualAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("manuals/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteManual(DeleteManualRequest deleteManualRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var manual = new Manual()
                {
                    ManualId = deleteManualRequest.ManualId,
                    ModifiedBy = Utility.UserId
                };

                int result = iManual.DeleteManual(manual);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "Manual deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Manual doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting manual.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting manual.";

                Utility.WriteLog("DeleteManual", deleteManualRequest, "Error while deleting manual. (ManualAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
