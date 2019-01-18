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
    public class FDICircularIndexAdminController : ApiController
    {
        private IFDICircularIndex iFDICircularIndex;
        public FDICircularIndexAdminController()
        {
            try
            {
                iFDICircularIndex = new FDICircularIndexRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("FDICircularIndexAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("fdicircularindexes")]
        [ResponseType(typeof(List<GetFDICircularIndexResponse>))]
        public IHttpActionResult GetFDICircularIndex([FromUri]GetFDICircularIndexRequest getFDICircularIndexRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getFDICircularIndexRequest == null)
                    getFDICircularIndexRequest = new GetFDICircularIndexRequest();

                if (getFDICircularIndexRequest.PageSize == null)
                    getFDICircularIndexRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var fDICircularIndex = new FDICircularIndex()
                {
                    FDICircularIndexId = getFDICircularIndexRequest.FDICircularIndexId,
                    FDIChapterId = getFDICircularIndexRequest.FDIChapterId,
                    SearchText = getFDICircularIndexRequest.SearchText,
                    IsActive = getFDICircularIndexRequest.IsActive,
                    PageNumber = getFDICircularIndexRequest.PageNumber,
                    PageSize = Convert.ToInt32(getFDICircularIndexRequest.PageSize),
                    IsPagingRequired = (getFDICircularIndexRequest.PageNumber != null) ? true : false,
                    OrderBy = getFDICircularIndexRequest.OrderBy,
                    OrderByDirection = getFDICircularIndexRequest.OrderByDirection
                };
                var fDICircularIndexes = iFDICircularIndex.GetFDICircularIndex(fDICircularIndex);

                var fDICircularIndexList = new List<GetFDICircularIndexResponse>();
                foreach (var fDICircularIndexDetail in fDICircularIndexes)
                {
                    fDICircularIndexList.Add(new GetFDICircularIndexResponse()
                    {
                        FDICircularIndexId = Convert.ToInt32(fDICircularIndexDetail.FDICircularIndexId),
                        FDIChapterId = Convert.ToInt32(fDICircularIndexDetail.FDIChapterId),
                        IndexNo = fDICircularIndexDetail.IndexNo,
                        IndexName = fDICircularIndexDetail.IndexName,
                        IndexContent = fDICircularIndexDetail.IndexContent,
                        SortId = fDICircularIndexDetail.SortId,
                        IsActive = Convert.ToBoolean(fDICircularIndexDetail.IsActive),
                        CreatedBy = fDICircularIndexDetail.CreatedBy,
                        TotalPageCount = fDICircularIndexDetail.TotalPageCount,
                        TotalRecord = fDICircularIndexDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "FDICircularIndex retrieved successfully";
                responses.Response = fDICircularIndexList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving FDICircularIndex.";

                Utility.WriteLog("GetFDICircularIndex", getFDICircularIndexRequest, "Error while retrieving FDICircularIndex. (FDICircularIndexAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("fdicircularindexes/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddFDICircularIndex(AddFDICircularIndexRequest addFDICircularIndexRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var fDICircularIndex = new FDICircularIndex()
                {
                    FDIChapterId = addFDICircularIndexRequest.FDIChapterId,
                    IndexNo = addFDICircularIndexRequest.IndexNo,
                    IndexName = addFDICircularIndexRequest.IndexName,
                    IndexContent = addFDICircularIndexRequest.IndexContent,
                    SaveAfterIndexId = addFDICircularIndexRequest.SaveAfterIndexId
                };
                int result = iFDICircularIndex.AddFDICircularIndex(fDICircularIndex);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "FDICircularIndex added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "FDICircularIndex alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding FDICircularIndex.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding FDICircularIndex.";

                Utility.WriteLog("AddFDICircularIndex", addFDICircularIndexRequest, "Error while adding FDICircularIndex. (FDICircularIndexAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("fdicircularindexes/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateFDICircularIndex(UpdateFDICircularIndexRequest updateFDICircularIndexRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var fDICircularIndex = new FDICircularIndex()
                {
                    FDICircularIndexId = updateFDICircularIndexRequest.FDICircularIndexId,
                    FDIChapterId = updateFDICircularIndexRequest.FDIChapterId,
                    IndexNo = updateFDICircularIndexRequest.IndexNo,
                    IndexName = updateFDICircularIndexRequest.IndexName,
                    IndexContent = updateFDICircularIndexRequest.IndexContent,
                    SaveAfterIndexId = updateFDICircularIndexRequest.SaveAfterIndexId,
                    ModifiedBy = Utility.UserId
                };
                int result = iFDICircularIndex.UpdateFDICircularIndex(fDICircularIndex);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "FDICircularIndex updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FDICircularIndex already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FDICircularIndex doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating FDICircularIndex.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating FDICircularIndex.";

                Utility.WriteLog("UpdateFDICircularIndex", updateFDICircularIndexRequest, "Error while updating FDICircularIndex. (FDICircularIndexAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("fdicircularindexes/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteFDICircularIndex(DeleteFDICircularIndexRequest deleteFDICircularIndexRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var fDICircularIndex = new FDICircularIndex()
                {
                    FDICircularIndexId = deleteFDICircularIndexRequest.FDICircularIndexId,
                    FDIChapterId = deleteFDICircularIndexRequest.FDIChapterId,
                    ModifiedBy = Utility.UserId
                };

                int result = iFDICircularIndex.DeleteFDICircularIndex(fDICircularIndex);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "FDICircularIndex deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FDICircularIndex doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting FDICircularIndex.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting FDICircularIndex.";

                Utility.WriteLog("DeleteFDICircularIndex", deleteFDICircularIndexRequest, "Error while deleting FDICircularIndex. (FDICircularIndexAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
