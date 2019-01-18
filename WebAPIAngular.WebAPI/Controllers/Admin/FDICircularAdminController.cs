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
    public class FDICircularAdminController : ApiController
    {
        private IFDICircular iFDICircular;
        public FDICircularAdminController()
        {
            try
            {
                iFDICircular = new FDICircularRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("FDICircularAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("fdicirculars")]
        [ResponseType(typeof(List<GetFDICircularResponse>))]
        public IHttpActionResult GetFDICircular([FromUri]GetFDICircularRequest getFDICircularRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getFDICircularRequest == null)
                    getFDICircularRequest = new GetFDICircularRequest();

                if (getFDICircularRequest.PageSize == null)
                    getFDICircularRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var fDICircular = new FDICircular()
                {
                    FDICircularId = getFDICircularRequest.FDICircularId,
                    SearchText = getFDICircularRequest.SearchText,
                    IsActive = getFDICircularRequest.IsActive,
                    PageNumber = getFDICircularRequest.PageNumber,
                    PageSize = Convert.ToInt32(getFDICircularRequest.PageSize),
                    IsPagingRequired = (getFDICircularRequest.PageNumber != null) ? true : false,
                    OrderBy = getFDICircularRequest.OrderBy,
                    OrderByDirection = getFDICircularRequest.OrderByDirection
                };
                var fDICirculars = iFDICircular.GetFDICircular(fDICircular);

                var fDICircularList = new List<GetFDICircularResponse>();
                foreach (var fDICircularDetail in fDICirculars)
                {
                    fDICircularList.Add(new GetFDICircularResponse()
                    {
                        FDICircularId = Convert.ToInt32(fDICircularDetail.FDICircularId),
                        FDICircularName = fDICircularDetail.FDICircularName,
                        Year = fDICircularDetail.Year,
                        PDF = fDICircularDetail.PDF,
                        IsActive = Convert.ToBoolean(fDICircularDetail.IsActive),
                        CreatedBy = fDICircularDetail.CreatedBy,
                        TotalPageCount = fDICircularDetail.TotalPageCount,
                        TotalRecord = fDICircularDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "FDICircular retrieved successfully";
                responses.Response = fDICircularList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving FDICircular.";

                Utility.WriteLog("GetFDICircular", getFDICircularRequest, "Error while retrieving FDICircular. (FDICircularAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        #region Upload Files
        [HttpPost]
        [Route("fdicirculars/uploadfiles")]
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
                string fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["FDICircularPDFPath"]), fileName);
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

                Utility.WriteLog("UploadFile", null, "Error while uploading file. (FDICircularAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
        #endregion

        [HttpPost]
        [Route("fdicirculars/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddFDICircular(AddFDICircularRequest addFDICircularRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var fDICircular = new FDICircular()
                {
                    FDICircularName = addFDICircularRequest.FDICircularName,
                    Year = addFDICircularRequest.Year,
                    PDF = addFDICircularRequest.PDF,
                    CreatedBy = Utility.UserId
                };
                int result = iFDICircular.AddFDICircular(fDICircular);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "FDICircular added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "FDICircular alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding FDICircular.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding FDICircular.";

                Utility.WriteLog("AddFDICircular", addFDICircularRequest, "Error while adding FDICircular. (FDICircularAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("fdicirculars/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateFDICircular(UpdateFDICircularRequest updateFDICircularRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var fDICircular = new FDICircular()
                {
                    FDICircularId = updateFDICircularRequest.FDICircularId,
                    FDICircularName = updateFDICircularRequest.FDICircularName,
                    Year = updateFDICircularRequest.Year,
                    PDF = updateFDICircularRequest.PDF,
                    ModifiedBy = Utility.UserId
                };
                int result = iFDICircular.UpdateFDICircular(fDICircular);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "FDICircular updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FDICircular already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FDICircular doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating FDICircular.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating FDICircular.";

                Utility.WriteLog("UpdateFDICircular", updateFDICircularRequest, "Error while updating FDICircular. (FDICircularAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("fdicirculars/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteFDICircular(DeleteFDICircularRequest deleteFDICircularRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var fDICircular = new FDICircular()
                {
                    FDICircularId = deleteFDICircularRequest.FDICircularId,
                    ModifiedBy = Utility.UserId
                };

                int result = iFDICircular.DeleteFDICircular(fDICircular);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "FDICircular deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FDICircular doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting FDICircular.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting FDICircular.";

                Utility.WriteLog("DeleteFDICircular", deleteFDICircularRequest, "Error while deleting FDICircular. (FDICircularAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
