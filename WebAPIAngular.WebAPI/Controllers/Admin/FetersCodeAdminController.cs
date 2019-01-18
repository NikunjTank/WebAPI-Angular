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
    public class FetersCodeAdminController : ApiController
    {
        private IFetersCode iFetersCode;
        public FetersCodeAdminController()
        {
            try
            {
                iFetersCode = new FetersCodeRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("FetersCodeAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("feterscodes")]
        [ResponseType(typeof(List<GetFetersCodeResponse>))]
        public IHttpActionResult GetFetersCode([FromUri]GetFetersCodeRequest getFetersCodeRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getFetersCodeRequest == null)
                    getFetersCodeRequest = new GetFetersCodeRequest();

                if (getFetersCodeRequest.PageSize == null)
                    getFetersCodeRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var fetersCode = new FetersCode()
                {
                    FetersCodeId = getFetersCodeRequest.FetersCodeId,
                    SearchText = getFetersCodeRequest.SearchText,
                    IsActive = getFetersCodeRequest.IsActive,
                    PageNumber = getFetersCodeRequest.PageNumber,
                    PageSize = Convert.ToInt32(getFetersCodeRequest.PageSize),
                    IsPagingRequired = (getFetersCodeRequest.PageNumber != null) ? true : false,
                    OrderBy = getFetersCodeRequest.OrderBy,
                    OrderByDirection = getFetersCodeRequest.OrderByDirection
                };
                var fetersCodes = iFetersCode.GetFetersCode(fetersCode);

                var fetersCodeList = new List<GetFetersCodeResponse>();
                foreach (var fetersCodeDetail in fetersCodes)
                {
                    fetersCodeList.Add(new GetFetersCodeResponse()
                    {
                        FetersCodeId = Convert.ToInt32(fetersCodeDetail.FetersCodeId),
                        FetersCodeName = fetersCodeDetail.FetersCodeName,
                        PDF = fetersCodeDetail.PDF,
                        IsActive = Convert.ToBoolean(fetersCodeDetail.IsActive),
                        CreatedBy = fetersCodeDetail.CreatedBy,
                        TotalPageCount = fetersCodeDetail.TotalPageCount,
                        TotalRecord = fetersCodeDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "FetersCode retrieved successfully";
                responses.Response = fetersCodeList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving fetersCode.";

                Utility.WriteLog("GetFetersCode", getFetersCodeRequest, "Error while retrieving fetersCode. (FetersCodeAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        #region Upload Files
        [HttpPost]
        [Route("feterscodes/uploadfiles")]
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
                string fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["FetersCodePDFPath"]), fileName);
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

                Utility.WriteLog("UploadFile", null, "Error while uploading file. (FetersCodeAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
        #endregion

        [HttpPost]
        [Route("feterscodes/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddFetersCode(AddFetersCodeRequest addFetersCodeRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var fetersCode = new FetersCode()
                {
                    FetersCodeName = addFetersCodeRequest.FetersCodeName,
                    PDF = addFetersCodeRequest.PDF,
                    CreatedBy = Utility.UserId
                };
                int result = iFetersCode.AddFetersCode(fetersCode);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "FetersCode added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "FetersCode alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding fetersCode.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding fetersCode.";

                Utility.WriteLog("AddFetersCode", addFetersCodeRequest, "Error while adding fetersCode. (FetersCodeAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("feterscodes/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateFetersCode(UpdateFetersCodeRequest updateFetersCodeRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var fetersCode = new FetersCode()
                {
                    FetersCodeId = updateFetersCodeRequest.FetersCodeId,
                    FetersCodeName = updateFetersCodeRequest.FetersCodeName,
                    PDF = updateFetersCodeRequest.PDF,
                    ModifiedBy = Utility.UserId
                };
                int result = iFetersCode.UpdateFetersCode(fetersCode);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "FetersCode updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FetersCode already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FetersCode doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating fetersCode.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating admin profile.";

                Utility.WriteLog("UpdateFetersCode", updateFetersCodeRequest, "Error while updating fetersCode. (FetersCodeAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("feterscodes/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteFetersCode(DeleteFetersCodeRequest deleteFetersCodeRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var fetersCode = new FetersCode()
                {
                    FetersCodeId = deleteFetersCodeRequest.FetersCodeId,
                    ModifiedBy = Utility.UserId
                };

                int result = iFetersCode.DeleteFetersCode(fetersCode);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "FetersCode deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FetersCode doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting fetersCode.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting fetersCode.";

                Utility.WriteLog("DeleteFetersCode", deleteFetersCodeRequest, "Error while deleting fetersCode. (FetersCodeAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
