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
    public class FIPBPressReleaseCaseAdminController : ApiController
    {
        private IFIPBPressReleaseCase iFIPBPressReleaseCase;
        public FIPBPressReleaseCaseAdminController()
        {
            try
            {
                iFIPBPressReleaseCase = new FIPBPressReleaseCaseRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("FIPBPressReleaseCaseAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("fipbpressreleasecases")]
        [ResponseType(typeof(List<GetFIPBPressReleaseCaseResponse>))]
        public IHttpActionResult GetFIPBPressReleaseCase([FromUri]GetFIPBPressReleaseCaseRequest getFIPBPressReleaseCaseRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getFIPBPressReleaseCaseRequest == null)
                    getFIPBPressReleaseCaseRequest = new GetFIPBPressReleaseCaseRequest();

                if (getFIPBPressReleaseCaseRequest.PageSize == null)
                    getFIPBPressReleaseCaseRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var fIPBPressReleaseCase = new FIPBPressReleaseCase()
                {
                    FIPBPressReleaseCaseId = getFIPBPressReleaseCaseRequest.FIPBPressReleaseCaseId,
                    SearchText = getFIPBPressReleaseCaseRequest.SearchText,
                    IsActive = getFIPBPressReleaseCaseRequest.IsActive,
                    PageNumber = getFIPBPressReleaseCaseRequest.PageNumber,
                    PageSize = Convert.ToInt32(getFIPBPressReleaseCaseRequest.PageSize),
                    IsPagingRequired = (getFIPBPressReleaseCaseRequest.PageNumber != null) ? true : false,
                    OrderBy = getFIPBPressReleaseCaseRequest.OrderBy,
                    OrderByDirection = getFIPBPressReleaseCaseRequest.OrderByDirection
                };
                var fIPBPressReleaseCases = iFIPBPressReleaseCase.GetFIPBPressReleaseCase(fIPBPressReleaseCase);

                var fIPBPressReleaseCaseList = new List<GetFIPBPressReleaseCaseResponse>();
                foreach (var fIPBPressReleaseCaseDetail in fIPBPressReleaseCases)
                {
                    fIPBPressReleaseCaseList.Add(new GetFIPBPressReleaseCaseResponse()
                    {
                        FIPBPressReleaseCaseId = Convert.ToInt32(fIPBPressReleaseCaseDetail.FIPBPressReleaseCaseId),
                        MinistryName = fIPBPressReleaseCaseDetail.MinistryName,
                        MeetingNo_Detail = fIPBPressReleaseCaseDetail.MeetingNo_Detail,
                        PDF = fIPBPressReleaseCaseDetail.PDF,
                        IsActive = Convert.ToBoolean(fIPBPressReleaseCaseDetail.IsActive),
                        CreatedBy = fIPBPressReleaseCaseDetail.CreatedBy,
                        TotalPageCount = fIPBPressReleaseCaseDetail.TotalPageCount,
                        TotalRecord = fIPBPressReleaseCaseDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "FIPBPressReleaseCase retrieved successfully";
                responses.Response = fIPBPressReleaseCaseList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving fIPBPressReleaseCase.";

                Utility.WriteLog("GetFIPBPressReleaseCase", getFIPBPressReleaseCaseRequest, "Error while retrieving fIPBPressReleaseCase. (FIPBPressReleaseCaseAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        #region Upload Files
        [HttpPost]
        [Route("fipbpressreleasecases/uploadfiles")]
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
                string fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["FIPBPressReleaseCasePDFPath"]), fileName);
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

                Utility.WriteLog("UploadFile", null, "Error while uploading file. (FIPBPressReleaseCaseAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
        #endregion

        [HttpPost]
        [Route("fipbpressreleasecases/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddFIPBPressReleaseCase(AddFIPBPressReleaseCaseRequest addFIPBPressReleaseCaseRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var fIPBPressReleaseCase = new FIPBPressReleaseCase()
                {
                    MinistryName = addFIPBPressReleaseCaseRequest.MinistryName,
                    MeetingNo_Detail = addFIPBPressReleaseCaseRequest.MeetingNo_Detail,
                    PDF = addFIPBPressReleaseCaseRequest.PDF,
                    CreatedBy = Utility.UserId
                };
                int result = iFIPBPressReleaseCase.AddFIPBPressReleaseCase(fIPBPressReleaseCase);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "FIPBPressReleaseCase added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "FIPBPressReleaseCase alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding fIPBPressReleaseCase.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding fIPBPressReleaseCase.";

                Utility.WriteLog("AddFIPBPressReleaseCase", addFIPBPressReleaseCaseRequest, "Error while adding fIPBPressReleaseCase. (FIPBPressReleaseCaseAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("fipbpressreleasecases/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateFIPBPressReleaseCase(UpdateFIPBPressReleaseCaseRequest updateFIPBPressReleaseCaseRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var fIPBPressReleaseCase = new FIPBPressReleaseCase()
                {
                    FIPBPressReleaseCaseId = updateFIPBPressReleaseCaseRequest.FIPBPressReleaseCaseId,
                    MinistryName = updateFIPBPressReleaseCaseRequest.MinistryName,
                    MeetingNo_Detail = updateFIPBPressReleaseCaseRequest.MeetingNo_Detail,
                    PDF = updateFIPBPressReleaseCaseRequest.PDF,
                    ModifiedBy = Utility.UserId
                };
                int result = iFIPBPressReleaseCase.UpdateFIPBPressReleaseCase(fIPBPressReleaseCase);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "FIPBPressReleaseCase updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FIPBPressReleaseCase already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FIPBPressReleaseCase doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating fIPBPressReleaseCase.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating admin profile.";

                Utility.WriteLog("UpdateFIPBPressReleaseCase", updateFIPBPressReleaseCaseRequest, "Error while updating fIPBPressReleaseCase. (FIPBPressReleaseCaseAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("fipbpressreleasecases/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteFIPBPressReleaseCase(DeleteFIPBPressReleaseCaseRequest deleteFIPBPressReleaseCaseRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var fIPBPressReleaseCase = new FIPBPressReleaseCase()
                {
                    FIPBPressReleaseCaseId = deleteFIPBPressReleaseCaseRequest.FIPBPressReleaseCaseId,
                    ModifiedBy = Utility.UserId
                };

                int result = iFIPBPressReleaseCase.DeleteFIPBPressReleaseCase(fIPBPressReleaseCase);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "FIPBPressReleaseCase deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FIPBPressReleaseCase doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting fIPBPressReleaseCase.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting fIPBPressReleaseCase.";

                Utility.WriteLog("DeleteFIPBPressReleaseCase", deleteFIPBPressReleaseCaseRequest, "Error while deleting fIPBPressReleaseCase. (FIPBPressReleaseCaseAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
