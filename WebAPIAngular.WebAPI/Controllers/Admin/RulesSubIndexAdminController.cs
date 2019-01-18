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
    public class RulesSubIndexAdminController : ApiController
    {
        private IRulesSubIndex iRulesSubIndex;
        public RulesSubIndexAdminController()
        {
            try
            {
                iRulesSubIndex = new RulesSubIndexRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("RulesSubIndexAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("rulessubindexes")]
        [ResponseType(typeof(List<GetRulesSubIndexResponse>))]
        public IHttpActionResult GetRulesSubIndex([FromUri]GetRulesSubIndexRequest getRulesSubIndexRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getRulesSubIndexRequest == null)
                    getRulesSubIndexRequest = new GetRulesSubIndexRequest();

                if (getRulesSubIndexRequest.PageSize == null)
                    getRulesSubIndexRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var rulesSubIndex = new RulesSubIndex()
                {
                    SubIndexId = getRulesSubIndexRequest.SubIndexId,
                    IndexId = getRulesSubIndexRequest.IndexId,
                    SearchText = getRulesSubIndexRequest.SearchText,
                    IsActive = getRulesSubIndexRequest.IsActive,
                    PageNumber = getRulesSubIndexRequest.PageNumber,
                    PageSize = Convert.ToInt32(getRulesSubIndexRequest.PageSize),
                    IsPagingRequired = (getRulesSubIndexRequest.PageNumber != null) ? true : false,
                    OrderBy = getRulesSubIndexRequest.OrderBy,
                    OrderByDirection = getRulesSubIndexRequest.OrderByDirection
                };
                var rulesSubIndexes = iRulesSubIndex.GetRulesSubIndex(rulesSubIndex);

                var rulesSubIndexList = new List<GetRulesSubIndexResponse>();
                foreach (var rulesSubIndexDetail in rulesSubIndexes)
                {
                    rulesSubIndexList.Add(new GetRulesSubIndexResponse()
                    {
                        SubIndexId = Convert.ToInt32(rulesSubIndexDetail.SubIndexId),
                        IndexId = Convert.ToInt32(rulesSubIndexDetail.IndexId),
                        SubIndexNo = rulesSubIndexDetail.SubIndexNo,
                        SubIndexName = rulesSubIndexDetail.SubIndexName,
                        SubIndexContent = rulesSubIndexDetail.SubIndexContent,
                        SortId = rulesSubIndexDetail.SortId,
                        IsActive = Convert.ToBoolean(rulesSubIndexDetail.IsActive),
                        CreatedBy = rulesSubIndexDetail.CreatedBy,
                        TotalPageCount = rulesSubIndexDetail.TotalPageCount,
                        TotalRecord = rulesSubIndexDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "RulesSubIndex retrieved successfully";
                responses.Response = rulesSubIndexList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving fema subindex.";

                Utility.WriteLog("GetRulesSubIndex", getRulesSubIndexRequest, "Error while retrieving fema subindex. (RulesSubIndexAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("rulessubindexes/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddRulesSubIndex(AddRulesSubIndexRequest addRulesSubIndexRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var rulesSubIndex = new RulesSubIndex()
                {
                    IndexId = addRulesSubIndexRequest.IndexId,
                    SubIndexNo = addRulesSubIndexRequest.SubIndexNo,
                    SubIndexName = addRulesSubIndexRequest.SubIndexName,
                    SubIndexContent = addRulesSubIndexRequest.SubIndexContent,
                    SaveAfterSubIndexId = addRulesSubIndexRequest.SaveAfterSubIndexId
                };
                int result = iRulesSubIndex.AddRulesSubIndex(rulesSubIndex);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "RulesSubIndex added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "RulesSubIndex alread exists.";
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

                Utility.WriteLog("AddRulesSubIndex", addRulesSubIndexRequest, "Error while adding fema subindex. (RulesSubIndexAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("rulessubindexes/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateRulesSubIndex(UpdateRulesSubIndexRequest updateRulesSubIndexRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var rulesSubIndex = new RulesSubIndex()
                {
                    SubIndexId = updateRulesSubIndexRequest.SubIndexId,
                    IndexId = updateRulesSubIndexRequest.IndexId,
                    SubIndexNo = updateRulesSubIndexRequest.SubIndexNo,
                    SubIndexName = updateRulesSubIndexRequest.SubIndexName,
                    SubIndexContent = updateRulesSubIndexRequest.SubIndexContent,
                    SaveAfterSubIndexId = updateRulesSubIndexRequest.SaveAfterSubIndexId,
                    ModifiedBy = Utility.UserId
                };
                int result = iRulesSubIndex.UpdateRulesSubIndex(rulesSubIndex);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "RulesSubIndex updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "RulesSubIndex already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "RulesSubIndex doesn't exist.";
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

                Utility.WriteLog("UpdateRulesSubIndex", updateRulesSubIndexRequest, "Error while updating fema subindex. (RulesSubIndexAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("rulessubindexes/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteRulesSubIndex(DeleteRulesSubIndexRequest deleteRulesSubIndexRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var rulesSubIndex = new RulesSubIndex()
                {
                    SubIndexId = deleteRulesSubIndexRequest.SubIndexId,
                    IndexId = deleteRulesSubIndexRequest.IndexId,
                    ModifiedBy = Utility.UserId
                };

                int result = iRulesSubIndex.DeleteRulesSubIndex(rulesSubIndex);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "RulesSubIndex deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "RulesSubIndex doesn't exist.";
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

                Utility.WriteLog("DeleteRulesSubIndex", deleteRulesSubIndexRequest, "Error while deleting fema subindex. (RulesSubIndexAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}