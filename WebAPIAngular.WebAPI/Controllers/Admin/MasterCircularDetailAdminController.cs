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
    public class MasterCircularDetailAdminController : ApiController
    {
        private IMasterCircularDetail iMasterCircularDetail;
        public MasterCircularDetailAdminController()
        {
            try
            {
                iMasterCircularDetail = new MasterCircularDetailRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("MasterCircularDetailAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("mastercirculardetails")]
        [ResponseType(typeof(List<GetMasterCircularDetailResponse>))]
        public IHttpActionResult GetMasterCircularDetail([FromUri]GetMasterCircularDetailRequest getMasterCircularDetailRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getMasterCircularDetailRequest == null)
                    getMasterCircularDetailRequest = new GetMasterCircularDetailRequest();

                if (getMasterCircularDetailRequest.PageSize == null)
                    getMasterCircularDetailRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var masterCircularDetail = new MasterCircularDetail()
                {
                    MasterCircularDetailId = getMasterCircularDetailRequest.MasterCircularDetailId,
                    MasterCircularId = getMasterCircularDetailRequest.MasterCircularId,
                    SearchText = getMasterCircularDetailRequest.SearchText,
                    IsActive = getMasterCircularDetailRequest.IsActive,
                    PageNumber = getMasterCircularDetailRequest.PageNumber,
                    PageSize = Convert.ToInt32(getMasterCircularDetailRequest.PageSize),
                    IsPagingRequired = (getMasterCircularDetailRequest.PageNumber != null) ? true : false,
                    OrderBy = getMasterCircularDetailRequest.OrderBy,
                    OrderByDirection = getMasterCircularDetailRequest.OrderByDirection
                };
                var masterCircularDetails = iMasterCircularDetail.GetMasterCircularDetail(masterCircularDetail);

                var sectorList = new List<GetMasterCircularDetailResponse>();
                foreach (var sector in masterCircularDetails)
                {
                    sectorList.Add(new GetMasterCircularDetailResponse()
                    {
                        MasterCircularDetailId = sector.MasterCircularDetailId,
                        MasterCircularId = sector.MasterCircularId,
                        Year = sector.Year,
                        PDF = sector.PDF,
                        IsActive = Convert.ToBoolean(sector.IsActive),
                        CreatedBy = sector.CreatedBy,
                        TotalPageCount = sector.TotalPageCount,
                        TotalRecord = sector.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "MasterCircularDetail retrieved successfully";
                responses.Response = sectorList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving masterCircularDetail.";

                Utility.WriteLog("GetMasterCircularDetail", getMasterCircularDetailRequest, "Error while retrieving masterCircularDetail. (MasterCircularDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        #region Upload Files
        [HttpPost]
        [Route("mastercirculardetails/uploadfiles")]
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
                string fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["MasterCircularPDFPath"]), fileName);
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

                Utility.WriteLog("UploadFile", null, "Error while uploading file. (MasterCircularDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
        #endregion

        [HttpPost]
        [Route("mastercirculardetails/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddMasterCircularDetail(AddMasterCircularDetailRequest addMasterCircularDetailRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var masterCircularDetail = new MasterCircularDetail()
                {
                    MasterCircularId = addMasterCircularDetailRequest.MasterCircularId,
                    Year = addMasterCircularDetailRequest.Year,
                    PDF = addMasterCircularDetailRequest.PDF,
                    CreatedBy = Utility.UserId
                };
                int result = iMasterCircularDetail.AddMasterCircularDetail(masterCircularDetail);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "MasterCircularDetail added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "MasterCircularDetail alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding masterCircularDetail.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding masterCircularDetail.";

                Utility.WriteLog("AddMasterCircularDetail", addMasterCircularDetailRequest, "Error while adding masterCircularDetail. (MasterCircularDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("mastercirculardetails/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateMasterCircularDetail(UpdateMasterCircularDetailRequest updateMasterCircularDetailRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var masterCircularDetail = new MasterCircularDetail()
                {
                    MasterCircularDetailId = updateMasterCircularDetailRequest.MasterCircularDetailId,
                    MasterCircularId = updateMasterCircularDetailRequest.MasterCircularId,
                    Year = updateMasterCircularDetailRequest.Year,
                    PDF = updateMasterCircularDetailRequest.PDF,
                    ModifiedBy = Utility.UserId
                };
                int result = iMasterCircularDetail.UpdateMasterCircularDetail(masterCircularDetail);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "MasterCircularDetail updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "MasterCircularDetail already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "MasterCircularDetail doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating masterCircularDetail.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating admin profile.";

                Utility.WriteLog("UpdateMasterCircularDetail", updateMasterCircularDetailRequest, "Error while updating masterCircularDetail. (MasterCircularDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("mastercirculardetails/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteMasterCircularDetail(DeleteMasterCircularDetailRequest deleteMasterCircularDetailRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var masterCircularDetail = new MasterCircularDetail()
                {
                    MasterCircularDetailId = deleteMasterCircularDetailRequest.MasterCircularDetailId,
                    ModifiedBy = Utility.UserId
                };

                int result = iMasterCircularDetail.DeleteMasterCircularDetail(masterCircularDetail);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "MasterCircularDetail deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "MasterCircularDetail doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting masterCircularDetail.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting masterCircularDetail.";

                Utility.WriteLog("DeleteMasterCircularDetail", deleteMasterCircularDetailRequest, "Error while deleting masterCircularDetail. (MasterCircularDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpGet]
        [Route("mastercirculardetailyears")]
        [ResponseType(typeof(List<int>))]
        public IHttpActionResult GetMasterCircularDetailYear()
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var lstMasterCircularDetailYear = Utility.GetYear().Where(x => x >= 1995 && x <= 2015).OrderByDescending(x => x).ToList();

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "MasterCircularDetailYear retrieved successfully";
                responses.Response = lstMasterCircularDetailYear;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving MasterCircularDetailYear.";

                Utility.WriteLog("GetMasterCircularDetailYear", null, "Error while retrieving MasterCircularDetailYear. (MasterCircularDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
