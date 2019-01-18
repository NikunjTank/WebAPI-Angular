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
    public class MasterDirectionAdminController : ApiController
    {
        private IMasterDirection iMasterDirection;
        public MasterDirectionAdminController()
        {
            try
            {
                iMasterDirection = new MasterDirectionRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("MasterDirectionAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("masterdirections")]
        [ResponseType(typeof(List<GetMasterDirectionResponse>))]
        public IHttpActionResult GetMasterDirection([FromUri]GetMasterDirectionRequest getMasterDirectionRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getMasterDirectionRequest == null)
                    getMasterDirectionRequest = new GetMasterDirectionRequest();

                if (getMasterDirectionRequest.PageSize == null)
                    getMasterDirectionRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var masterDirection = new MasterDirection()
                {
                    MasterDirectionId = getMasterDirectionRequest.MasterDirectionId,
                    SearchText = getMasterDirectionRequest.SearchText,
                    IsActive = getMasterDirectionRequest.IsActive,
                    PageNumber = getMasterDirectionRequest.PageNumber,
                    PageSize = Convert.ToInt32(getMasterDirectionRequest.PageSize),
                    IsPagingRequired = (getMasterDirectionRequest.PageNumber != null) ? true : false,
                    OrderBy = getMasterDirectionRequest.OrderBy,
                    OrderByDirection = getMasterDirectionRequest.OrderByDirection
                };
                var masterDirections = iMasterDirection.GetMasterDirection(masterDirection);

                var masterDirectionList = new List<GetMasterDirectionResponse>();
                foreach (var masterDirectionDetail in masterDirections)
                {
                    masterDirectionList.Add(new GetMasterDirectionResponse()
                    {
                        MasterDirectionId = Convert.ToInt32(masterDirectionDetail.MasterDirectionId),
                        MasterDirectionName = masterDirectionDetail.MasterDirectionName,
                        Year = masterDirectionDetail.Year,
                        PDF = masterDirectionDetail.PDF,
                        IsActive = Convert.ToBoolean(masterDirectionDetail.IsActive),
                        CreatedBy = masterDirectionDetail.CreatedBy,
                        TotalPageCount = masterDirectionDetail.TotalPageCount,
                        TotalRecord = masterDirectionDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "MasterDirection retrieved successfully";
                responses.Response = masterDirectionList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving MasterDirection.";

                Utility.WriteLog("GetMasterDirection", getMasterDirectionRequest, "Error while retrieving MasterDirection. (MasterDirectionAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        #region Upload Files
        [HttpPost]
        [Route("masterdirections/uploadfiles")]
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
                string fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["MasterDirectionPDFPath"]), fileName);
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

                Utility.WriteLog("UploadFile", null, "Error while uploading file. (MasterDirectionAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
        #endregion

        [HttpPost]
        [Route("masterdirections/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddMasterDirection(AddMasterDirectionRequest addMasterDirectionRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var masterDirection = new MasterDirection()
                {
                    MasterDirectionName = addMasterDirectionRequest.MasterDirectionName,
                    Year = addMasterDirectionRequest.Year,
                    PDF = addMasterDirectionRequest.PDF,
                    CreatedBy = Utility.UserId
                };
                int result = iMasterDirection.AddMasterDirection(masterDirection);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "MasterDirection added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "MasterDirection alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding MasterDirection.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding MasterDirection.";

                Utility.WriteLog("AddMasterDirection", addMasterDirectionRequest, "Error while adding MasterDirection. (MasterDirectionAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("masterdirections/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateMasterDirection(UpdateMasterDirectionRequest updateMasterDirectionRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var masterDirection = new MasterDirection()
                {
                    MasterDirectionId = updateMasterDirectionRequest.MasterDirectionId,
                    MasterDirectionName = updateMasterDirectionRequest.MasterDirectionName,
                    Year = updateMasterDirectionRequest.Year,
                    PDF = updateMasterDirectionRequest.PDF,
                    ModifiedBy = Utility.UserId
                };
                int result = iMasterDirection.UpdateMasterDirection(masterDirection);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "MasterDirection updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "MasterDirection already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "MasterDirection doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating MasterDirection.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating MasterDirection.";

                Utility.WriteLog("UpdateMasterDirection", updateMasterDirectionRequest, "Error while updating MasterDirection. (MasterDirectionAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("masterdirections/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteMasterDirection(DeleteMasterDirectionRequest deleteMasterDirectionRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var masterDirection = new MasterDirection()
                {
                    MasterDirectionId = deleteMasterDirectionRequest.MasterDirectionId,
                    ModifiedBy = Utility.UserId
                };

                int result = iMasterDirection.DeleteMasterDirection(masterDirection);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "MasterDirection deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "MasterDirection doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting MasterDirection.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting MasterDirection.";

                Utility.WriteLog("DeleteMasterDirection", deleteMasterDirectionRequest, "Error while deleting MasterDirection. (MasterDirectionAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpGet]
        [Route("masterdirectionyears")]
        [ResponseType(typeof(List<int>))]
        public IHttpActionResult GetMasterDirectionYear()
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var lstMasterDirectionYear = Utility.GetYear();

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "MasterDirectionYear retrieved successfully";
                responses.Response = lstMasterDirectionYear;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving MasterDirectionYear.";

                Utility.WriteLog("GetMasterDirectionYear", null, "Error while retrieving MasterDirectionYear. (MasterDirectionAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
