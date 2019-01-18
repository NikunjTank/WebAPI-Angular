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
    public class ActNameAdminController : ApiController
    {
        private IActName iActName;
        public ActNameAdminController()
        {
            try
            {
                iActName = new ActNameRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("ActNameAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("actnames")]
        [ResponseType(typeof(List<GetActNameResponse>))]
        public IHttpActionResult GetActName([FromUri]GetActNameRequest getActNameRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getActNameRequest == null)
                    getActNameRequest = new GetActNameRequest();

                if (getActNameRequest.PageSize == null)
                    getActNameRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var actName = new ActName()
                {
                    ActId = getActNameRequest.ActId,
                    SearchText = getActNameRequest.SearchText,
                    IsActive = getActNameRequest.IsActive,
                    PageNumber = getActNameRequest.PageNumber,
                    PageSize = Convert.ToInt32(getActNameRequest.PageSize),
                    IsPagingRequired = (getActNameRequest.PageNumber != null) ? true : false,
                    OrderBy = getActNameRequest.OrderBy,
                    OrderByDirection = getActNameRequest.OrderByDirection
                };
                var actNames = iActName.GetActName(actName);

                var actNameList = new List<GetActNameResponse>();
                foreach (var actNameDetail in actNames)
                {
                    actNameList.Add(new GetActNameResponse()
                    {
                        ActId = Convert.ToInt32(actNameDetail.ActId),
                        LongTitle = actNameDetail.LongTitle,
                        ActPDF = actNameDetail.ActPDF,
                        IsActive = Convert.ToBoolean(actNameDetail.IsActive),
                        CreatedBy = actNameDetail.CreatedBy,
                        TotalPageCount = actNameDetail.TotalPageCount,
                        TotalRecord = actNameDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "ActName retrieved successfully";
                responses.Response = actNameList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving actname.";

                Utility.WriteLog("GetActName", getActNameRequest, "Error while retrieving actname. (ActNameAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        #region Upload Files
        [HttpPost]
        [Route("actnames/uploadfiles")]
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
                string fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["ActPDFPath"]), fileName);
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

                Utility.WriteLog("UploadFile", null, "Error while uploading file. (ActNameAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
        #endregion

        [HttpPost]
        [Route("actnames/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddActName(AddActNameRequest addActNameRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var actName = new ActName()
                {
                    LongTitle = addActNameRequest.LongTitle,
                    ActPDF = addActNameRequest.ActPDF
                };
                int result = iActName.AddActName(actName);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "ActName added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "ActName alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding actname.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding actname.";

                Utility.WriteLog("AddActName", addActNameRequest, "Error while adding actname. (ActNameAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("actnames/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateActName(UpdateActNameRequest updateActNameRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var actName = new ActName()
                {
                    ActId = updateActNameRequest.ActId,
                    LongTitle = updateActNameRequest.LongTitle,
                    ActPDF = updateActNameRequest.ActPDF,
                    ModifiedBy = Utility.UserId
                };
                int result = iActName.UpdateActName(actName);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "ActName updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "ActName already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "ActName doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating actname.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating admin profile.";

                Utility.WriteLog("UpdateActName", updateActNameRequest, "Error while updating actname. (ActNameAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("actnames/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteActName(DeleteActNameRequest deleteActNameRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var actName = new ActName()
                {
                    ActId = deleteActNameRequest.ActId,
                    ModifiedBy = Utility.UserId
                };

                int result = iActName.DeleteActName(actName);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "ActName deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "ActName doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting actname.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting actname.";

                Utility.WriteLog("DeleteActName", deleteActNameRequest, "Error while deleting actname. (ActNameAdminController)", ex.ToString());
            }
            return Ok(responses);
        }        
    }
}
