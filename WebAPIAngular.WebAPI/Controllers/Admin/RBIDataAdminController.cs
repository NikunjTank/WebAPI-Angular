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
    public class RBIDataAdminController : ApiController
    {
        private IRBIData iRBIData;
        public RBIDataAdminController()
        {
            try
            {
                iRBIData = new RBIDataRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("RBIDataAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("rbidatas")]
        [ResponseType(typeof(List<GetRBIDataResponse>))]
        public IHttpActionResult GetRBIData([FromUri]GetRBIDataRequest getRBIDataRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getRBIDataRequest == null)
                    getRBIDataRequest = new GetRBIDataRequest();

                if (getRBIDataRequest.PageSize == null)
                    getRBIDataRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var rBIData = new RBIData()
                {
                    RBIDataId = getRBIDataRequest.RBIDataId,
                    SearchText = getRBIDataRequest.SearchText,
                    IsActive = getRBIDataRequest.IsActive,
                    PageNumber = getRBIDataRequest.PageNumber,
                    PageSize = Convert.ToInt32(getRBIDataRequest.PageSize),
                    IsPagingRequired = (getRBIDataRequest.PageNumber != null) ? true : false,
                    OrderBy = getRBIDataRequest.OrderBy,
                    OrderByDirection = getRBIDataRequest.OrderByDirection
                };
                var rBIDatas = iRBIData.GetRBIData(rBIData);

                var rBIDataList = new List<GetRBIDataResponse>();
                foreach (var rBIDataDetail in rBIDatas)
                {
                    rBIDataList.Add(new GetRBIDataResponse()
                    {
                        RBIDataId = Convert.ToInt32(rBIDataDetail.RBIDataId),
                        RBIDataName = rBIDataDetail.RBIDataName,
                        Excel = rBIDataDetail.Excel,
                        IsActive = Convert.ToBoolean(rBIDataDetail.IsActive),
                        CreatedBy = rBIDataDetail.CreatedBy,
                        TotalPageCount = rBIDataDetail.TotalPageCount,
                        TotalRecord = rBIDataDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "RBIData retrieved successfully";
                responses.Response = rBIDataList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving rbidata.";

                Utility.WriteLog("GetRBIData", getRBIDataRequest, "Error while retrieving rbidata. (RBIDataAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        #region Upload Files
        [HttpPost]
        [Route("rbidatas/uploadfiles")]
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
                string fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["RBIDataExcelPath"]), fileName);
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

                Utility.WriteLog("UploadFile", null, "Error while uploading file. (RBIDataAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
        #endregion

        [HttpPost]
        [Route("rbidatas/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddRBIData(AddRBIDataRequest addRBIDataRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var rBIData = new RBIData()
                {
                    RBIDataName = addRBIDataRequest.RBIDataName,
                    Excel = addRBIDataRequest.Excel,
                    CreatedBy = Utility.UserId
                };
                int result = iRBIData.AddRBIData(rBIData);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "RBIData added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "RBIData alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding rbidata.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding rbidata.";

                Utility.WriteLog("AddRBIData", addRBIDataRequest, "Error while adding rbidata. (RBIDataAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("rbidatas/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateRBIData(UpdateRBIDataRequest updateRBIDataRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var rBIData = new RBIData()
                {
                    RBIDataId = updateRBIDataRequest.RBIDataId,
                    RBIDataName = updateRBIDataRequest.RBIDataName,
                    Excel = updateRBIDataRequest.Excel,
                    ModifiedBy = Utility.UserId
                };
                int result = iRBIData.UpdateRBIData(rBIData);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "RBIData updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "RBIData already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "RBIData doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating rbidata.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating admin profile.";

                Utility.WriteLog("UpdateRBIData", updateRBIDataRequest, "Error while updating rbidata. (RBIDataAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("rbidatas/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteRBIData(DeleteRBIDataRequest deleteRBIDataRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var rBIData = new RBIData()
                {
                    RBIDataId = deleteRBIDataRequest.RBIDataId,
                    ModifiedBy = Utility.UserId
                };

                int result = iRBIData.DeleteRBIData(rBIData);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "RBIData deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "RBIData doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting rbidata.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting rbidata.";

                Utility.WriteLog("DeleteRBIData", deleteRBIDataRequest, "Error while deleting rbidata. (RBIDataAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
