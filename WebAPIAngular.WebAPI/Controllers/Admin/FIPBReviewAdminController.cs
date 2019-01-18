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
    public class FIPBReviewAdminController : ApiController
    {
        private IFIPBReview iFIPBReview;
        public FIPBReviewAdminController()
        {
            try
            {
                iFIPBReview = new FIPBReviewRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("FIPBReviewAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("fipbreviews")]
        [ResponseType(typeof(List<GetFIPBReviewResponse>))]
        public IHttpActionResult GetFIPBReview([FromUri]GetFIPBReviewRequest getFIPBReviewRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getFIPBReviewRequest == null)
                    getFIPBReviewRequest = new GetFIPBReviewRequest();

                if (getFIPBReviewRequest.PageSize == null)
                    getFIPBReviewRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var fIPBReview = new FIPBReview()
                {
                    FIPBReviewId = getFIPBReviewRequest.FIPBReviewId,
                    SearchText = getFIPBReviewRequest.SearchText,
                    IsActive = getFIPBReviewRequest.IsActive,
                    PageNumber = getFIPBReviewRequest.PageNumber,
                    PageSize = Convert.ToInt32(getFIPBReviewRequest.PageSize),
                    IsPagingRequired = (getFIPBReviewRequest.PageNumber != null) ? true : false,
                    OrderBy = getFIPBReviewRequest.OrderBy,
                    OrderByDirection = getFIPBReviewRequest.OrderByDirection
                };
                var fIPBReviews = iFIPBReview.GetFIPBReview(fIPBReview);

                var fIPBReviewList = new List<GetFIPBReviewResponse>();
                foreach (var fIPBReviewDetail in fIPBReviews)
                {
                    fIPBReviewList.Add(new GetFIPBReviewResponse()
                    {
                        FIPBReviewId = Convert.ToInt32(fIPBReviewDetail.FIPBReviewId),
                        Name = fIPBReviewDetail.Name,
                        PDF = fIPBReviewDetail.PDF,
                        IsActive = Convert.ToBoolean(fIPBReviewDetail.IsActive),
                        CreatedBy = fIPBReviewDetail.CreatedBy,
                        TotalPageCount = fIPBReviewDetail.TotalPageCount,
                        TotalRecord = fIPBReviewDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "FIPBReview retrieved successfully";
                responses.Response = fIPBReviewList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving fIPBReview.";

                Utility.WriteLog("GetFIPBReview", getFIPBReviewRequest, "Error while retrieving fIPBReview. (FIPBReviewAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        #region Upload Files
        [HttpPost]
        [Route("fipbreviews/uploadfiles")]
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
                string fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["FIPBReviewPDFPath"]), fileName);
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

                Utility.WriteLog("UploadFile", null, "Error while uploading file. (FIPBReviewAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
        #endregion

        [HttpPost]
        [Route("fipbreviews/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddFIPBReview(AddFIPBReviewRequest addFIPBReviewRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var fIPBReview = new FIPBReview()
                {
                    Name = addFIPBReviewRequest.Name,
                    PDF = addFIPBReviewRequest.PDF,
                    CreatedBy = Utility.UserId
                };
                int result = iFIPBReview.AddFIPBReview(fIPBReview);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "FIPBReview added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "FIPBReview alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding fIPBReview.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding fIPBReview.";

                Utility.WriteLog("AddFIPBReview", addFIPBReviewRequest, "Error while adding fIPBReview. (FIPBReviewAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("fipbreviews/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateFIPBReview(UpdateFIPBReviewRequest updateFIPBReviewRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var fIPBReview = new FIPBReview()
                {
                    FIPBReviewId = updateFIPBReviewRequest.FIPBReviewId,
                    Name = updateFIPBReviewRequest.Name,
                    PDF = updateFIPBReviewRequest.PDF,
                    ModifiedBy = Utility.UserId
                };
                int result = iFIPBReview.UpdateFIPBReview(fIPBReview);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "FIPBReview updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FIPBReview already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FIPBReview doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating fIPBReview.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating admin profile.";

                Utility.WriteLog("UpdateFIPBReview", updateFIPBReviewRequest, "Error while updating fIPBReview. (FIPBReviewAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("fipbreviews/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteFIPBReview(DeleteFIPBReviewRequest deleteFIPBReviewRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var fIPBReview = new FIPBReview()
                {
                    FIPBReviewId = deleteFIPBReviewRequest.FIPBReviewId,
                    ModifiedBy = Utility.UserId
                };

                int result = iFIPBReview.DeleteFIPBReview(fIPBReview);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "FIPBReview deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FIPBReview doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting fIPBReview.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting fIPBReview.";

                Utility.WriteLog("DeleteFIPBReview", deleteFIPBReviewRequest, "Error while deleting fIPBReview. (FIPBReviewAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
