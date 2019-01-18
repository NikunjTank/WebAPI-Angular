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
    public class FemaIndexAdminController : ApiController
    {
        private IFemaIndex iFemaIndex;
        public FemaIndexAdminController()
        {
            try
            {
                iFemaIndex = new FemaIndexRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("FemaIndexAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("femaindexes")]
        [ResponseType(typeof(List<GetFemaIndexResponse>))]
        public IHttpActionResult GetFemaIndex([FromUri]GetFemaIndexRequest getFemaIndexRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getFemaIndexRequest == null)
                    getFemaIndexRequest = new GetFemaIndexRequest();

                if (getFemaIndexRequest.PageSize == null)
                    getFemaIndexRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var femaIndex = new FemaIndex()
                {
                    IndexId = getFemaIndexRequest.IndexId,
                    RegulationId = getFemaIndexRequest.RegulationId,
                    SearchText = getFemaIndexRequest.SearchText,
                    IsActive = getFemaIndexRequest.IsActive,
                    PageNumber = getFemaIndexRequest.PageNumber,
                    PageSize = Convert.ToInt32(getFemaIndexRequest.PageSize),
                    IsPagingRequired = (getFemaIndexRequest.PageNumber != null) ? true : false,
                    OrderBy = getFemaIndexRequest.OrderBy,
                    OrderByDirection = getFemaIndexRequest.OrderByDirection
                };
                var femaIndexes = iFemaIndex.GetFemaIndex(femaIndex);

                var femaIndexList = new List<GetFemaIndexResponse>();
                foreach (var femaIndexDetail in femaIndexes)
                {
                    femaIndexList.Add(new GetFemaIndexResponse()
                    {
                        IndexId = Convert.ToInt32(femaIndexDetail.IndexId),
                        RegulationId = Convert.ToInt32(femaIndexDetail.RegulationId),
                        IndexNo = femaIndexDetail.IndexNo,
                        IndexName = femaIndexDetail.IndexName,
                        IndexContent = femaIndexDetail.IndexContent,
                        SortId = femaIndexDetail.SortId,
                        IsActive = Convert.ToBoolean(femaIndexDetail.IsActive),
                        CreatedBy = femaIndexDetail.CreatedBy,
                        TotalPageCount = femaIndexDetail.TotalPageCount,
                        TotalRecord = femaIndexDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "FemaIndex retrieved successfully";
                responses.Response = femaIndexList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving fema index.";

                Utility.WriteLog("GetFemaIndex", getFemaIndexRequest, "Error while retrieving fema index. (FemaIndexAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("femaindexes/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddFemaIndex(AddFemaIndexRequest addFemaIndexRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var femaIndex = new FemaIndex()
                {
                    RegulationId = addFemaIndexRequest.RegulationId,
                    IndexNo = addFemaIndexRequest.IndexNo,
                    IndexName = addFemaIndexRequest.IndexName,
                    IndexContent = addFemaIndexRequest.IndexContent,
                    SaveAfterIndexId = addFemaIndexRequest.SaveAfterIndexId
                };
                int result = iFemaIndex.AddFemaIndex(femaIndex);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "FemaIndex added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "FemaIndex alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding fema index.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding fema index.";

                Utility.WriteLog("AddFemaIndex", addFemaIndexRequest, "Error while adding fema index. (FemaIndexAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("femaindexes/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateFemaIndex(UpdateFemaIndexRequest updateFemaIndexRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);
                
                var femaIndex = new FemaIndex()
                {
                    IndexId = updateFemaIndexRequest.IndexId,
                    RegulationId = updateFemaIndexRequest.RegulationId,
                    IndexNo = updateFemaIndexRequest.IndexNo,
                    IndexName = updateFemaIndexRequest.IndexName,
                    IndexContent = updateFemaIndexRequest.IndexContent,
                    SaveAfterIndexId = updateFemaIndexRequest.SaveAfterIndexId,
                    ModifiedBy = Utility.UserId
                };
                int result = iFemaIndex.UpdateFemaIndex(femaIndex);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "FemaIndex updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FemaIndex already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FemaIndex doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating fema index.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating fema index.";

                Utility.WriteLog("UpdateFemaIndex", updateFemaIndexRequest, "Error while updating fema index. (FemaIndexAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("femaindexes/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteFemaIndex(DeleteFemaIndexRequest deleteFemaIndexRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var femaIndex = new FemaIndex()
                {
                    IndexId = deleteFemaIndexRequest.IndexId,
                    RegulationId = deleteFemaIndexRequest.RegulationId,
                    ModifiedBy = Utility.UserId
                };

                int result = iFemaIndex.DeleteFemaIndex(femaIndex);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "FemaIndex deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FemaIndex doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting fema index.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting fema index.";

                Utility.WriteLog("DeleteFemaIndex", deleteFemaIndexRequest, "Error while deleting fema index. (FemaIndexAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
