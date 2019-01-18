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
    public class APDIRCircularAdminController : ApiController
    {
        private IAPDIRCircular iAPDIRCircular;
        public APDIRCircularAdminController()
        {
            try
            {
                iAPDIRCircular = new APDIRCircularRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("APDIRCircularAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("apdircirculars")]
        [ResponseType(typeof(List<GetAPDIRCircularResponse>))]
        public IHttpActionResult GetAPDIRCircular([FromUri]GetAPDIRCircularRequest getAPDIRCircularRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getAPDIRCircularRequest == null)
                    getAPDIRCircularRequest = new GetAPDIRCircularRequest();

                if (getAPDIRCircularRequest.PageSize == null)
                    getAPDIRCircularRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var aPDIRCircular = new APDIRCircular()
                {
                    APDIRCircularId = getAPDIRCircularRequest.APDIRCircularId,
                    MasterDirectionId = getAPDIRCircularRequest.MasterDirectionId,
                    SearchText = getAPDIRCircularRequest.SearchText,
                    IsActive = getAPDIRCircularRequest.IsActive,
                    PageNumber = getAPDIRCircularRequest.PageNumber,
                    PageSize = Convert.ToInt32(getAPDIRCircularRequest.PageSize),
                    IsPagingRequired = (getAPDIRCircularRequest.PageNumber != null) ? true : false,
                    OrderBy = getAPDIRCircularRequest.OrderBy,
                    OrderByDirection = getAPDIRCircularRequest.OrderByDirection
                };
                var aPDIRCirculars = iAPDIRCircular.GetAPDIRCircular(aPDIRCircular);

                var aPDIRCircularList = new List<GetAPDIRCircularResponse>();
                foreach (var aPDIRCircularDetail in aPDIRCirculars)
                {
                    aPDIRCircularList.Add(new GetAPDIRCircularResponse()
                    {
                        APDIRCircularId = Convert.ToInt32(aPDIRCircularDetail.APDIRCircularId),
                        MasterDirectionId = aPDIRCircularDetail.MasterDirectionId,
                        MasterDirectionName = aPDIRCircularDetail.MasterDirectionName,
                        APDIRCircularNo = aPDIRCircularDetail.APDIRCircularNo,
                        APDIRCircularName = aPDIRCircularDetail.APDIRCircularName,
                        APDIRCircularDate = aPDIRCircularDetail.APDIRCircularDate,
                        APDIRCircularEffectiveDate = aPDIRCircularDetail.APDIRCircularEffectiveDate,
                        Year = aPDIRCircularDetail.Year,
                        APDIRCircularYearName = Utility.GetAPDIRCircularYear(Convert.ToInt32(aPDIRCircularDetail.Year)).First().APDIRCircularYearName,
                        APDIRCircularPDF = aPDIRCircularDetail.APDIRCircularPDF,
                        IsActive = Convert.ToBoolean(aPDIRCircularDetail.IsActive),
                        CreatedBy = aPDIRCircularDetail.CreatedBy,
                        TotalPageCount = aPDIRCircularDetail.TotalPageCount,
                        TotalRecord = aPDIRCircularDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "APDIRCircular retrieved successfully";
                responses.Response = aPDIRCircularList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving APDIRCircular.";

                Utility.WriteLog("GetAPDIRCircular", getAPDIRCircularRequest, "Error while retrieving APDIRCircular. (APDIRCircularAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        #region Upload Files
        [HttpPost]
        [Route("apdircirculars/uploadfiles")]
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
                string fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["APDIRCircularPDFPath"]), fileName);
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

                Utility.WriteLog("UploadFile", null, "Error while uploading file. (APDIRCircularAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
        #endregion

        [HttpPost]
        [Route("apdircirculars/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddAPDIRCircular(AddAPDIRCircularRequest addAPDIRCircularRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var aPDIRCircular = new APDIRCircular()
                {
                    MasterDirectionId = addAPDIRCircularRequest.MasterDirectionId,
                    APDIRCircularNo = addAPDIRCircularRequest.APDIRCircularNo,
                    APDIRCircularName = addAPDIRCircularRequest.APDIRCircularName,
                    APDIRCircularDate = addAPDIRCircularRequest.APDIRCircularDate,
                    APDIRCircularEffectiveDate = addAPDIRCircularRequest.APDIRCircularEffectiveDate,
                    Year = addAPDIRCircularRequest.Year,
                    APDIRCircularPDF = addAPDIRCircularRequest.APDIRCircularPDF,
                    CreatedBy = Utility.UserId
                };
                int result = iAPDIRCircular.AddAPDIRCircular(aPDIRCircular);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "APDIRCircular added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "APDIRCircular alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding APDIRCircular.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding APDIRCircular.";

                Utility.WriteLog("AddAPDIRCircular", addAPDIRCircularRequest, "Error while adding APDIRCircular. (APDIRCircularAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("apdircirculars/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateAPDIRCircular(UpdateAPDIRCircularRequest updateAPDIRCircularRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var aPDIRCircular = new APDIRCircular()
                {
                    APDIRCircularId = updateAPDIRCircularRequest.APDIRCircularId,
                    MasterDirectionId = updateAPDIRCircularRequest.MasterDirectionId,
                    APDIRCircularNo = updateAPDIRCircularRequest.APDIRCircularNo,
                    APDIRCircularName = updateAPDIRCircularRequest.APDIRCircularName,
                    APDIRCircularDate = updateAPDIRCircularRequest.APDIRCircularDate,
                    APDIRCircularEffectiveDate = updateAPDIRCircularRequest.APDIRCircularEffectiveDate,
                    Year = updateAPDIRCircularRequest.Year,
                    APDIRCircularPDF = updateAPDIRCircularRequest.APDIRCircularPDF,
                    ModifiedBy = Utility.UserId
                };
                int result = iAPDIRCircular.UpdateAPDIRCircular(aPDIRCircular);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "APDIRCircular updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "APDIRCircular already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "APDIRCircular doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating APDIRCircular.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating APDIRCircular.";

                Utility.WriteLog("UpdateAPDIRCircular", updateAPDIRCircularRequest, "Error while updating APDIRCircular. (APDIRCircularAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("apdircirculars/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteAPDIRCircular(DeleteAPDIRCircularRequest deleteAPDIRCircularRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var aPDIRCircular = new APDIRCircular()
                {
                    APDIRCircularId = deleteAPDIRCircularRequest.APDIRCircularId,
                    ModifiedBy = Utility.UserId
                };

                int result = iAPDIRCircular.DeleteAPDIRCircular(aPDIRCircular);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "APDIRCircular deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "APDIRCircular doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting APDIRCircular.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting APDIRCircular.";

                Utility.WriteLog("DeleteAPDIRCircular", deleteAPDIRCircularRequest, "Error while deleting APDIRCircular. (APDIRCircularAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
        
        [HttpGet]
        [Route("apdircircularyears")]
        [ResponseType(typeof(List<APDIRCircularYear>))]
        public IHttpActionResult GetAPDIRCircularYear()
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var lstAPDIRCircularYear = Utility.GetAPDIRCircularYear(null).Where(x => x.APDIRCircularYearId >= 1996 && x.APDIRCircularYearId <= DateTime.Now.Year).OrderByDescending(x => x.APDIRCircularYearId).ToList();

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "APDIRCircularYear retrieved successfully";
                responses.Response = lstAPDIRCircularYear;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving APDIRCircularYear.";

                Utility.WriteLog("GetAPDIRCircularYear", null, "Error while retrieving APDIRCircularYear. (APDIRCircularAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
