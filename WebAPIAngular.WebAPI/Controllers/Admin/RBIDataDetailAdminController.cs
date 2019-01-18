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
    public class RBIDataDetailAdminController : ApiController
    {
        private IRBIDataDetail iRBIDataDetail;
        public RBIDataDetailAdminController()
        {
            try
            {
                iRBIDataDetail = new RBIDataDetailRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("RBIDataDetailAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("rbidatadetails")]
        [ResponseType(typeof(List<GetRBIDataDetailResponse>))]
        public IHttpActionResult GetRBIDataDetail([FromUri]GetRBIDataDetailRequest getRBIDataDetailRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getRBIDataDetailRequest == null)
                    getRBIDataDetailRequest = new GetRBIDataDetailRequest();

                if (getRBIDataDetailRequest.PageSize == null)
                    getRBIDataDetailRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var rBIDataDetail = new RBIDataDetail()
                {
                    RBIDataDetailId = getRBIDataDetailRequest.RBIDataDetailId,
                    RBIDataId = getRBIDataDetailRequest.RBIDataId,
                    Year = getRBIDataDetailRequest.Year,
                    Month = getRBIDataDetailRequest.Month,
                    SearchText = getRBIDataDetailRequest.SearchText,
                    IsActive = getRBIDataDetailRequest.IsActive,
                    PageNumber = getRBIDataDetailRequest.PageNumber,
                    PageSize = Convert.ToInt32(getRBIDataDetailRequest.PageSize),
                    IsPagingRequired = (getRBIDataDetailRequest.PageNumber != null) ? true : false,
                    OrderBy = getRBIDataDetailRequest.OrderBy,
                    OrderByDirection = getRBIDataDetailRequest.OrderByDirection
                };
                var rBIDataDetails = iRBIDataDetail.GetRBIDataDetail(rBIDataDetail);

                var rBIDataDetailList = new List<GetRBIDataDetailResponse>();
                foreach (var rBIDataDetailDetail in rBIDataDetails)
                {
                    rBIDataDetailList.Add(new GetRBIDataDetailResponse()
                    {
                        RBIDataDetailId = Convert.ToInt32(rBIDataDetailDetail.RBIDataDetailId),
                        RBIDataId = Convert.ToInt32(rBIDataDetailDetail.RBIDataId),
                        Month = rBIDataDetailDetail.Month,
                        Year = rBIDataDetailDetail.Year,
                        Excel = rBIDataDetailDetail.Excel,
                        PDF = rBIDataDetailDetail.PDF,
                        IsActive = Convert.ToBoolean(rBIDataDetailDetail.IsActive),
                        CreatedBy = rBIDataDetailDetail.CreatedBy,
                        TotalPageCount = rBIDataDetailDetail.TotalPageCount,
                        TotalRecord = rBIDataDetailDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "RBIDataDetail retrieved successfully";
                responses.Response = rBIDataDetailList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving rbidatadetail.";

                Utility.WriteLog("GetRBIDataDetail", getRBIDataDetailRequest, "Error while retrieving rbidatadetail. (RBIDataDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        #region Upload Excel Files
        [HttpPost]
        [Route("rbidatadetails/uploadexcelfiles")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UploadExcelFiles()
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
                string fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["RBIDatadetailExcelPath"]), fileName);
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

                Utility.WriteLog("UploadExcelFile", null, "Error while uploading file. (RBIDataDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
        #endregion

        #region Upload PDF Files
        [HttpPost]
        [Route("rbidatadetails/uploadpdffiles")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UploadPDFFiles()
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
                string fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["RBIDatadetailPDFPath"]), fileName);
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

                Utility.WriteLog("UploadPDFFile", null, "Error while uploading file. (RBIDataDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
        #endregion

        [HttpPost]
        [Route("rbidatadetails/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddRBIDataDetail(AddRBIDataDetailRequest addRBIDataDetailRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var rBIDataDetail = new RBIDataDetail()
                {
                    RBIDataId = addRBIDataDetailRequest.RBIDataId,
                    Month = addRBIDataDetailRequest.Month,
                    Year = addRBIDataDetailRequest.Year,
                    Excel = addRBIDataDetailRequest.Excel,
                    PDF = addRBIDataDetailRequest.PDF,
                    CreatedBy = Utility.UserId
                };
                int result = iRBIDataDetail.AddRBIDataDetail(rBIDataDetail);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "RBIDataDetail added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "RBIDataDetail alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding rbidatadetail.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding rbidatadetail.";

                Utility.WriteLog("AddRBIDataDetail", addRBIDataDetailRequest, "Error while adding rbidatadetail. (RBIDataDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("rbidatadetails/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateRBIDataDetail(UpdateRBIDataDetailRequest updateRBIDataDetailRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var rBIDataDetail = new RBIDataDetail()
                {
                    RBIDataDetailId = updateRBIDataDetailRequest.RBIDataDetailId,
                    RBIDataId = updateRBIDataDetailRequest.RBIDataId,
                    Month = updateRBIDataDetailRequest.Month,
                    Year = updateRBIDataDetailRequest.Year,
                    Excel = updateRBIDataDetailRequest.Excel,
                    PDF = updateRBIDataDetailRequest.PDF,
                    ModifiedBy = Utility.UserId
                };
                int result = iRBIDataDetail.UpdateRBIDataDetail(rBIDataDetail);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "RBIDataDetail updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "RBIDataDetail already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "RBIDataDetail doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating rbidatadetail.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating admin profile.";

                Utility.WriteLog("UpdateRBIDataDetail", updateRBIDataDetailRequest, "Error while updating rbidatadetail. (RBIDataDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("rbidatadetails/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteRBIDataDetail(DeleteRBIDataDetailRequest deleteRBIDataDetailRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var rBIDataDetail = new RBIDataDetail()
                {
                    RBIDataDetailId = deleteRBIDataDetailRequest.RBIDataDetailId,
                    ModifiedBy = Utility.UserId
                };

                int result = iRBIDataDetail.DeleteRBIDataDetail(rBIDataDetail);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "RBIDataDetail deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "RBIDataDetail doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting rbidatadetail.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting rbidatadetail.";

                Utility.WriteLog("DeleteRBIDataDetail", deleteRBIDataDetailRequest, "Error while deleting rbidatadetail. (RBIDataDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpGet]
        [Route("rbidatadetailyears")]
        [ResponseType(typeof(List<int>))]
        public IHttpActionResult GetRBIDataDetailYear()
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var lstYear = Utility.GetYear().Where(x => x >= 2000 && x <= DateTime.Now.Year).OrderByDescending(x => x).ToList();

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "RBIDataDetailYear retrieved successfully";
                responses.Response = lstYear;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving RBIDataDetailYear.";

                Utility.WriteLog("GetRBIDataDetailYear", null, "Error while retrieving RBIDataDetailYear. (RBIDataDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpGet]
        [Route("rbidatadetailmonths")]
        [ResponseType(typeof(List<int>))]
        public IHttpActionResult GetRBIDataDetailMonth()
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var lstMonth = Utility.GetMonth();

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "RBIDataDetailMonth retrieved successfully";
                responses.Response = lstMonth;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving RBIDataDetailMonth.";

                Utility.WriteLog("GetRBIDataDetailMonth", null, "Error while retrieving RBIDataDetailMonth. (RBIDataDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
