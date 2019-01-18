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
    public class FemaSubIndexAdminController : ApiController
    {
        private IFemaSubIndex iFemaSubIndex;
        public FemaSubIndexAdminController()
        {
            try
            {
                iFemaSubIndex = new FemaSubIndexRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("FemaSubIndexAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("femasubindexes")]
        [ResponseType(typeof(List<GetFemaSubIndexResponse>))]
        public IHttpActionResult GetFemaSubIndex([FromUri]GetFemaSubIndexRequest getFemaSubIndexRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getFemaSubIndexRequest == null)
                    getFemaSubIndexRequest = new GetFemaSubIndexRequest();

                if (getFemaSubIndexRequest.PageSize == null)
                    getFemaSubIndexRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var femaSubIndex = new FemaSubIndex()
                {
                    SubIndexId = getFemaSubIndexRequest.SubIndexId,
                    IndexId = getFemaSubIndexRequest.IndexId,
                    RegulationId = getFemaSubIndexRequest.RegulationId,
                    SearchText = getFemaSubIndexRequest.SearchText,
                    IsActive = getFemaSubIndexRequest.IsActive,
                    PageNumber = getFemaSubIndexRequest.PageNumber,
                    PageSize = Convert.ToInt32(getFemaSubIndexRequest.PageSize),
                    IsPagingRequired = (getFemaSubIndexRequest.PageNumber != null) ? true : false,
                    OrderBy = getFemaSubIndexRequest.OrderBy,
                    OrderByDirection = getFemaSubIndexRequest.OrderByDirection
                };
                var femaSubIndexes = iFemaSubIndex.GetFemaSubIndex(femaSubIndex);

                var femaSubIndexList = new List<GetFemaSubIndexResponse>();
                foreach (var femaSubIndexDetail in femaSubIndexes)
                {
                    femaSubIndexList.Add(new GetFemaSubIndexResponse()
                    {
                        SubIndexId = Convert.ToInt32(femaSubIndexDetail.SubIndexId),
                        IndexId = Convert.ToInt32(femaSubIndexDetail.IndexId),
                        SubIndexNo = femaSubIndexDetail.SubIndexNo,
                        SubIndexName = femaSubIndexDetail.SubIndexName,
                        SubIndexContent = femaSubIndexDetail.SubIndexContent,
                        SortId = femaSubIndexDetail.SortId,
                        IsActive = Convert.ToBoolean(femaSubIndexDetail.IsActive),
                        CreatedBy = femaSubIndexDetail.CreatedBy,
                        TotalPageCount = femaSubIndexDetail.TotalPageCount,
                        TotalRecord = femaSubIndexDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "FemaSubIndex retrieved successfully";
                responses.Response = femaSubIndexList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving fema subindex.";

                Utility.WriteLog("GetFemaSubIndex", getFemaSubIndexRequest, "Error while retrieving fema subindex. (FemaSubIndexAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("femasubindexes/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddFemaSubIndex(AddFemaSubIndexRequest addFemaSubIndexRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var femaSubIndex = new FemaSubIndex()
                {
                    IndexId = addFemaSubIndexRequest.IndexId,
                    SubIndexNo = addFemaSubIndexRequest.SubIndexNo,
                    SubIndexName = addFemaSubIndexRequest.SubIndexName,
                    SubIndexContent = addFemaSubIndexRequest.SubIndexContent,
                    SaveAfterSubIndexId = addFemaSubIndexRequest.SaveAfterSubIndexId
                };
                int result = iFemaSubIndex.AddFemaSubIndex(femaSubIndex);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "FemaSubIndex added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "FemaSubIndex alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding fema subindex.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding fema subindex.";

                Utility.WriteLog("AddFemaSubIndex", addFemaSubIndexRequest, "Error while adding fema subindex. (FemaSubIndexAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("femasubindexes/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateFemaSubIndex(UpdateFemaSubIndexRequest updateFemaSubIndexRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var femaSubIndex = new FemaSubIndex()
                {
                    SubIndexId = updateFemaSubIndexRequest.SubIndexId,
                    IndexId = updateFemaSubIndexRequest.IndexId,
                    SubIndexNo = updateFemaSubIndexRequest.SubIndexNo,
                    SubIndexName = updateFemaSubIndexRequest.SubIndexName,
                    SubIndexContent = updateFemaSubIndexRequest.SubIndexContent,
                    SaveAfterSubIndexId = updateFemaSubIndexRequest.SaveAfterSubIndexId,
                    ModifiedBy = Utility.UserId
                };
                int result = iFemaSubIndex.UpdateFemaSubIndex(femaSubIndex);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "FemaSubIndex updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FemaSubIndex already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FemaSubIndex doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating fema subindex.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating fema subindex.";

                Utility.WriteLog("UpdateFemaSubIndex", updateFemaSubIndexRequest, "Error while updating fema subindex. (FemaSubIndexAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("femasubindexes/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteFemaSubIndex(DeleteFemaSubIndexRequest deleteFemaSubIndexRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var femaSubIndex = new FemaSubIndex()
                {
                    SubIndexId = deleteFemaSubIndexRequest.SubIndexId,
                    IndexId = deleteFemaSubIndexRequest.IndexId,
                    ModifiedBy = Utility.UserId
                };

                int result = iFemaSubIndex.DeleteFemaSubIndex(femaSubIndex);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "FemaSubIndex deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FemaSubIndex doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting fema subindex.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting fema subindex.";

                Utility.WriteLog("DeleteFemaSubIndex", deleteFemaSubIndexRequest, "Error while deleting fema subindex. (FemaSubIndexAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}