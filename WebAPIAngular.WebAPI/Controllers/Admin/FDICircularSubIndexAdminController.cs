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
    public class FDICircularSubIndexAdminController : ApiController
    {
        private IFDICircularSubIndex iFDICircularSubIndex;
        public FDICircularSubIndexAdminController()
        {
            try
            {
                iFDICircularSubIndex = new FDICircularSubIndexRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("FDICircularSubIndexAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("fdicircularsubindexes")]
        [ResponseType(typeof(List<GetFDICircularSubIndexResponse>))]
        public IHttpActionResult GetFDICircularSubIndex([FromUri]GetFDICircularSubIndexRequest getFDICircularSubIndexRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getFDICircularSubIndexRequest == null)
                    getFDICircularSubIndexRequest = new GetFDICircularSubIndexRequest();

                if (getFDICircularSubIndexRequest.PageSize == null)
                    getFDICircularSubIndexRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var fDICircularSubIndex = new FDICircularSubIndex()
                {
                    FDICircularSubIndexId = getFDICircularSubIndexRequest.FDICircularSubIndexId,
                    FDICircularIndexId = getFDICircularSubIndexRequest.FDICircularIndexId,
                    SearchText = getFDICircularSubIndexRequest.SearchText,
                    IsActive = getFDICircularSubIndexRequest.IsActive,
                    PageNumber = getFDICircularSubIndexRequest.PageNumber,
                    PageSize = Convert.ToInt32(getFDICircularSubIndexRequest.PageSize),
                    IsPagingRequired = (getFDICircularSubIndexRequest.PageNumber != null) ? true : false,
                    OrderBy = getFDICircularSubIndexRequest.OrderBy,
                    OrderByDirection = getFDICircularSubIndexRequest.OrderByDirection
                };
                var fDICircularSubIndexes = iFDICircularSubIndex.GetFDICircularSubIndex(fDICircularSubIndex);

                var fDICircularSubIndexList = new List<GetFDICircularSubIndexResponse>();
                foreach (var fDICircularSubIndexDetail in fDICircularSubIndexes)
                {
                    fDICircularSubIndexList.Add(new GetFDICircularSubIndexResponse()
                    {
                        FDICircularSubIndexId = Convert.ToInt32(fDICircularSubIndexDetail.FDICircularSubIndexId),
                        FDICircularIndexId = Convert.ToInt32(fDICircularSubIndexDetail.FDICircularIndexId),
                        SubIndexNo = fDICircularSubIndexDetail.SubIndexNo,
                        SubIndexName = fDICircularSubIndexDetail.SubIndexName,
                        SubIndexContent = fDICircularSubIndexDetail.SubIndexContent,
                        SortId = fDICircularSubIndexDetail.SortId,
                        IsActive = Convert.ToBoolean(fDICircularSubIndexDetail.IsActive),
                        CreatedBy = fDICircularSubIndexDetail.CreatedBy,
                        TotalPageCount = fDICircularSubIndexDetail.TotalPageCount,
                        TotalRecord = fDICircularSubIndexDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "FDICircularSubIndex retrieved successfully";
                responses.Response = fDICircularSubIndexList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving FDICircularSubIndex.";

                Utility.WriteLog("GetFDICircularSubIndex", getFDICircularSubIndexRequest, "Error while retrieving FDICircularSubIndex. (FDICircularSubIndexAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("fdicircularsubindexes/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddFDICircularSubIndex(AddFDICircularSubIndexRequest addFDICircularSubIndexRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var fDICircularSubIndex = new FDICircularSubIndex()
                {
                    FDICircularIndexId = addFDICircularSubIndexRequest.FDICircularIndexId,
                    SubIndexNo = addFDICircularSubIndexRequest.SubIndexNo,
                    SubIndexName = addFDICircularSubIndexRequest.SubIndexName,
                    SubIndexContent = addFDICircularSubIndexRequest.SubIndexContent,
                    SaveAfterSubIndexId = addFDICircularSubIndexRequest.SaveAfterSubIndexId
                };
                int result = iFDICircularSubIndex.AddFDICircularSubIndex(fDICircularSubIndex);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "FDICircularSubIndex added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "FDICircularSubIndex alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding FDICircularSubIndex.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding FDICircularSubIndex.";

                Utility.WriteLog("AddFDICircularSubIndex", addFDICircularSubIndexRequest, "Error while adding FDICircularSubIndex. (FDICircularSubIndexAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("fdicircularsubindexes/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateFDICircularSubIndex(UpdateFDICircularSubIndexRequest updateFDICircularSubIndexRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var fDICircularSubIndex = new FDICircularSubIndex()
                {
                    FDICircularSubIndexId = updateFDICircularSubIndexRequest.FDICircularSubIndexId,
                    FDICircularIndexId = updateFDICircularSubIndexRequest.FDICircularIndexId,
                    SubIndexNo = updateFDICircularSubIndexRequest.SubIndexNo,
                    SubIndexName = updateFDICircularSubIndexRequest.SubIndexName,
                    SubIndexContent = updateFDICircularSubIndexRequest.SubIndexContent,
                    SaveAfterSubIndexId = updateFDICircularSubIndexRequest.SaveAfterSubIndexId,
                    ModifiedBy = Utility.UserId
                };
                int result = iFDICircularSubIndex.UpdateFDICircularSubIndex(fDICircularSubIndex);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "FDICircularSubIndex updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FDICircularSubIndex already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FDICircularSubIndex doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating FDICircularSubIndex.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating FDICircularSubIndex.";

                Utility.WriteLog("UpdateFDICircularSubIndex", updateFDICircularSubIndexRequest, "Error while updating FDICircularSubIndex. (FDICircularSubIndexAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("fdicircularsubindexes/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteFDICircularSubIndex(DeleteFDICircularSubIndexRequest deleteFDICircularSubIndexRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var fDICircularSubIndex = new FDICircularSubIndex()
                {
                    FDICircularSubIndexId = deleteFDICircularSubIndexRequest.FDICircularSubIndexId,
                    FDICircularIndexId = deleteFDICircularSubIndexRequest.FDICircularIndexId,
                    ModifiedBy = Utility.UserId
                };

                int result = iFDICircularSubIndex.DeleteFDICircularSubIndex(fDICircularSubIndex);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "FDICircularSubIndex deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FDICircularSubIndex doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting FDICircularSubIndex.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting FDICircularSubIndex.";

                Utility.WriteLog("DeleteFDICircularSubIndex", deleteFDICircularSubIndexRequest, "Error while deleting FDICircularSubIndex. (FDICircularSubIndexAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
