using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using DemystifyFema.Service.Repository;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;

namespace DemystifyFema.Service.Controllers.Admin
{
    [Authorize(Roles = "Admin")]
    [RoutePrefix("admin/api")]
    public class FDIChapterAdminController : ApiController
    {
        private IFDIChapter iFDIChapter;
        public FDIChapterAdminController()
        {
            try
            {
                iFDIChapter = new FDIChapterRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("FDIChapterAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("fdichapters")]
        [ResponseType(typeof(List<GetFDIChapterResponse>))]
        public IHttpActionResult GetFDIChapter([FromUri]GetFDIChapterRequest getFDIChapterRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getFDIChapterRequest == null)
                    getFDIChapterRequest = new GetFDIChapterRequest();

                if (getFDIChapterRequest.PageSize == null)
                    getFDIChapterRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var fDIChapter = new FDIChapter()
                {
                    FDIChapterId = getFDIChapterRequest.FDIChapterId,
                    FDICircularId = getFDIChapterRequest.FDICircularId,
                    SearchText = getFDIChapterRequest.SearchText,
                    IsActive = getFDIChapterRequest.IsActive,
                    PageNumber = getFDIChapterRequest.PageNumber,
                    PageSize = Convert.ToInt32(getFDIChapterRequest.PageSize),
                    IsPagingRequired = (getFDIChapterRequest.PageNumber != null) ? true : false,
                    OrderBy = getFDIChapterRequest.OrderBy,
                    OrderByDirection = getFDIChapterRequest.OrderByDirection
                };
                var fDIChapters = iFDIChapter.GetFDIChapter(fDIChapter);

                var fDIChapterList = new List<GetFDIChapterResponse>();
                foreach (var fDIChapterDetail in fDIChapters)
                {
                    fDIChapterList.Add(new GetFDIChapterResponse()
                    {
                        FDICircularId = Convert.ToInt32(fDIChapterDetail.FDICircularId),
                        FDIChapterId = Convert.ToInt32(fDIChapterDetail.FDIChapterId),
                        Chapter = fDIChapterDetail.Chapter,
                        SortId = fDIChapterDetail.SortId,
                        IsActive = Convert.ToBoolean(fDIChapterDetail.IsActive),
                        CreatedBy = fDIChapterDetail.CreatedBy,
                        TotalPageCount = fDIChapterDetail.TotalPageCount,
                        TotalRecord = fDIChapterDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "FDIChapter retrieved successfully";
                responses.Response = fDIChapterList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving FDIChapter.";

                Utility.WriteLog("GetFDIChapter", getFDIChapterRequest, "Error while retrieving FDIChapter. (FDIChapterAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("fdichapters/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddFDIChapter(AddFDIChapterRequest addFDIChapterRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var fDIChapter = new FDIChapter()
                {
                    FDICircularId = addFDIChapterRequest.FDICircularId,
                    Chapter = addFDIChapterRequest.Chapter,
                    SaveAfterChapterId = addFDIChapterRequest.SaveAfterChapterId,
                    CreatedBy = Utility.UserId
                };
                int result = iFDIChapter.AddFDIChapter(fDIChapter);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "FDIChapter added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "FDIChapter alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding FDIChapter.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding FDIChapter.";

                Utility.WriteLog("AddFDIChapter", addFDIChapterRequest, "Error while adding FDIChapter. (FDIChapterAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("fdichapters/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateFDIChapter(UpdateFDIChapterRequest updateFDIChapterRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var fDIChapter = new FDIChapter()
                {
                    FDIChapterId = updateFDIChapterRequest.FDIChapterId,
                    FDICircularId = updateFDIChapterRequest.FDICircularId,
                    Chapter = updateFDIChapterRequest.Chapter,
                    SaveAfterChapterId = updateFDIChapterRequest.SaveAfterChapterId,
                    ModifiedBy = Utility.UserId
                };
                int result = iFDIChapter.UpdateFDIChapter(fDIChapter);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "FDIChapter updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FDIChapter already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FDIChapter doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating FDIChapter.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating FDIChapter.";

                Utility.WriteLog("UpdateFDIChapter", updateFDIChapterRequest, "Error while updating FDIChapter. (FDIChapterAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("fdichapters/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteFDIChapter(DeleteFDIChapterRequest deleteFDIChapterRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var fDIChapter = new FDIChapter()
                {
                    FDIChapterId = deleteFDIChapterRequest.FDIChapterId,
                    ModifiedBy = Utility.UserId
                };

                int result = iFDIChapter.DeleteFDIChapter(fDIChapter);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "FDIChapter deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FDIChapter doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting FDIChapter.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting FDIChapter.";

                Utility.WriteLog("DeleteFDIChapter", deleteFDIChapterRequest, "Error while deleting FDIChapter. (FDIChapterAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
