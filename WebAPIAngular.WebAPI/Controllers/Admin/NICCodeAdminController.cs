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
    public class NICCodeAdminController : ApiController
    {
        private INICCode iNICCode;
        public NICCodeAdminController()
        {
            try
            {
                iNICCode = new NICCodeRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("NICCodeAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("niccodes")]
        [ResponseType(typeof(List<GetNICCodeResponse>))]
        public IHttpActionResult GetNICCode([FromUri]GetNICCodeRequest getNICCodeRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getNICCodeRequest == null)
                    getNICCodeRequest = new GetNICCodeRequest();

                if (getNICCodeRequest.PageSize == null)
                    getNICCodeRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var nICCode = new NICCode()
                {
                    NICCodeId = getNICCodeRequest.NICCodeId,
                    SearchText = getNICCodeRequest.SearchText,
                    IsActive = getNICCodeRequest.IsActive,
                    PageNumber = getNICCodeRequest.PageNumber,
                    PageSize = Convert.ToInt32(getNICCodeRequest.PageSize),
                    IsPagingRequired = (getNICCodeRequest.PageNumber != null) ? true : false,
                    OrderBy = getNICCodeRequest.OrderBy,
                    OrderByDirection = getNICCodeRequest.OrderByDirection
                };
                var nICCodes = iNICCode.GetNICCode(nICCode);

                var nICCodeList = new List<GetNICCodeResponse>();
                foreach (var nICCodeDetail in nICCodes)
                {
                    nICCodeList.Add(new GetNICCodeResponse()
                    {
                        NICCodeId = Convert.ToInt32(nICCodeDetail.NICCodeId),
                        NICCodeName = nICCodeDetail.NICCodeName,
                        PDF = nICCodeDetail.PDF,
                        IsActive = Convert.ToBoolean(nICCodeDetail.IsActive),
                        CreatedBy = nICCodeDetail.CreatedBy,
                        TotalPageCount = nICCodeDetail.TotalPageCount,
                        TotalRecord = nICCodeDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "NICCode retrieved successfully";
                responses.Response = nICCodeList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving niccode.";

                Utility.WriteLog("GetNICCode", getNICCodeRequest, "Error while retrieving niccode. (NICCodeAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        #region Upload Files
        [HttpPost]
        [Route("niccodes/uploadfiles")]
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
                string fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["NICCodePDFPath"]), fileName);
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

                Utility.WriteLog("UploadFile", null, "Error while uploading file. (NICCodeAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
        #endregion

        [HttpPost]
        [Route("niccodes/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddNICCode(AddNICCodeRequest addNICCodeRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var nICCode = new NICCode()
                {
                    NICCodeName = addNICCodeRequest.NICCodeName,
                    PDF = addNICCodeRequest.PDF,
                    CreatedBy = Utility.UserId
                };
                int result = iNICCode.AddNICCode(nICCode);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "NICCode added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "NICCode alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding niccode.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding niccode.";

                Utility.WriteLog("AddNICCode", addNICCodeRequest, "Error while adding niccode. (NICCodeAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("niccodes/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateNICCode(UpdateNICCodeRequest updateNICCodeRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var nICCode = new NICCode()
                {
                    NICCodeId = updateNICCodeRequest.NICCodeId,
                    NICCodeName = updateNICCodeRequest.NICCodeName,
                    PDF = updateNICCodeRequest.PDF,
                    ModifiedBy = Utility.UserId
                };
                int result = iNICCode.UpdateNICCode(nICCode);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "NICCode updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "NICCode already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "NICCode doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating niccode.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating admin profile.";

                Utility.WriteLog("UpdateNICCode", updateNICCodeRequest, "Error while updating niccode. (NICCodeAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("niccodes/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteNICCode(DeleteNICCodeRequest deleteNICCodeRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var nICCode = new NICCode()
                {
                    NICCodeId = deleteNICCodeRequest.NICCodeId,
                    ModifiedBy = Utility.UserId
                };

                int result = iNICCode.DeleteNICCode(nICCode);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "NICCode deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "NICCode doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting niccode.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting niccode.";

                Utility.WriteLog("DeleteNICCode", deleteNICCodeRequest, "Error while deleting niccode. (NICCodeAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
