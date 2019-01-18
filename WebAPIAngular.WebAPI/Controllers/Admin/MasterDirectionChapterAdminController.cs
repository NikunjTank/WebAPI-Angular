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
    public class MasterDirectionChapterAdminController : ApiController
    {
        private IMasterDirectionChapter iMasterDirectionChapter;
        public MasterDirectionChapterAdminController()
        {
            try
            {
                iMasterDirectionChapter = new MasterDirectionChapterRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("MasterDirectionChapterAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("masterdirectionchapters")]
        [ResponseType(typeof(List<GetMasterDirectionChapterResponse>))]
        public IHttpActionResult GetMasterDirectionChapter([FromUri]GetMasterDirectionChapterRequest getMasterDirectionChapterRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getMasterDirectionChapterRequest == null)
                    getMasterDirectionChapterRequest = new GetMasterDirectionChapterRequest();

                if (getMasterDirectionChapterRequest.PageSize == null)
                    getMasterDirectionChapterRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var masterDirectionChapter = new MasterDirectionChapter()
                {
                    MasterDirectionChapterId = getMasterDirectionChapterRequest.MasterDirectionChapterId,
                    MasterDirectionId = getMasterDirectionChapterRequest.MasterDirectionId,
                    SearchText = getMasterDirectionChapterRequest.SearchText,
                    IsActive = getMasterDirectionChapterRequest.IsActive,
                    PageNumber = getMasterDirectionChapterRequest.PageNumber,
                    PageSize = Convert.ToInt32(getMasterDirectionChapterRequest.PageSize),
                    IsPagingRequired = (getMasterDirectionChapterRequest.PageNumber != null) ? true : false,
                    OrderBy = getMasterDirectionChapterRequest.OrderBy,
                    OrderByDirection = getMasterDirectionChapterRequest.OrderByDirection
                };
                var masterDirectionChapters = iMasterDirectionChapter.GetMasterDirectionChapter(masterDirectionChapter);

                var masterDirectionChapterList = new List<GetMasterDirectionChapterResponse>();
                foreach (var masterDirectionChapterDetail in masterDirectionChapters)
                {
                    masterDirectionChapterList.Add(new GetMasterDirectionChapterResponse()
                    {
                        MasterDirectionId = Convert.ToInt32(masterDirectionChapterDetail.MasterDirectionId),
                        MasterDirectionChapterId = Convert.ToInt32(masterDirectionChapterDetail.MasterDirectionChapterId),
                        Chapter = masterDirectionChapterDetail.Chapter,
                        SortId = masterDirectionChapterDetail.SortId,
                        IsActive = Convert.ToBoolean(masterDirectionChapterDetail.IsActive),
                        CreatedBy = masterDirectionChapterDetail.CreatedBy,
                        TotalPageCount = masterDirectionChapterDetail.TotalPageCount,
                        TotalRecord = masterDirectionChapterDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "MasterDirectionChapter retrieved successfully";
                responses.Response = masterDirectionChapterList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving MasterDirectionChapter.";

                Utility.WriteLog("GetMasterDirectionChapter", getMasterDirectionChapterRequest, "Error while retrieving MasterDirectionChapter. (MasterDirectionChapterAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("masterdirectionchapters/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddMasterDirectionChapter(AddMasterDirectionChapterRequest addMasterDirectionChapterRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var masterDirectionChapter = new MasterDirectionChapter()
                {
                    MasterDirectionId = addMasterDirectionChapterRequest.MasterDirectionId,
                    Chapter = addMasterDirectionChapterRequest.Chapter,
                    SaveAfterChapterId = addMasterDirectionChapterRequest.SaveAfterChapterId,
                    CreatedBy = Utility.UserId
                };
                int result = iMasterDirectionChapter.AddMasterDirectionChapter(masterDirectionChapter);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "MasterDirectionChapter added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "MasterDirectionChapter alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding MasterDirectionChapter.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding MasterDirectionChapter.";

                Utility.WriteLog("AddMasterDirectionChapter", addMasterDirectionChapterRequest, "Error while adding MasterDirectionChapter. (MasterDirectionChapterAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("masterdirectionchapters/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateMasterDirectionChapter(UpdateMasterDirectionChapterRequest updateMasterDirectionChapterRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var masterDirectionChapter = new MasterDirectionChapter()
                {
                    MasterDirectionChapterId = updateMasterDirectionChapterRequest.MasterDirectionChapterId,
                    MasterDirectionId = updateMasterDirectionChapterRequest.MasterDirectionId,
                    Chapter = updateMasterDirectionChapterRequest.Chapter,
                    SaveAfterChapterId = updateMasterDirectionChapterRequest.SaveAfterChapterId,
                    ModifiedBy = Utility.UserId
                };
                int result = iMasterDirectionChapter.UpdateMasterDirectionChapter(masterDirectionChapter);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "MasterDirectionChapter updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "MasterDirectionChapter already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "MasterDirectionChapter doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating MasterDirectionChapter.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating MasterDirectionChapter.";

                Utility.WriteLog("UpdateMasterDirectionChapter", updateMasterDirectionChapterRequest, "Error while updating MasterDirectionChapter. (MasterDirectionChapterAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("masterdirectionchapters/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteMasterDirectionChapter(DeleteMasterDirectionChapterRequest deleteMasterDirectionChapterRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var masterDirectionChapter = new MasterDirectionChapter()
                {
                    MasterDirectionChapterId = deleteMasterDirectionChapterRequest.MasterDirectionChapterId,
                    ModifiedBy = Utility.UserId
                };

                int result = iMasterDirectionChapter.DeleteMasterDirectionChapter(masterDirectionChapter);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "MasterDirectionChapter deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "MasterDirectionChapter doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting MasterDirectionChapter.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting MasterDirectionChapter.";

                Utility.WriteLog("DeleteMasterDirectionChapter", deleteMasterDirectionChapterRequest, "Error while deleting MasterDirectionChapter. (MasterDirectionChapterAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
