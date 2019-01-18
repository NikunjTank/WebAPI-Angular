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
    public class RulesIndexAdminController : ApiController
    {
        private IRulesIndex iRulesIndex;
        public RulesIndexAdminController()
        {
            try
            {
                iRulesIndex = new RulesIndexRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("RulesIndexAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("rulesindexes")]
        [ResponseType(typeof(List<GetRulesIndexResponse>))]
        public IHttpActionResult GetRulesIndex([FromUri]GetRulesIndexRequest getRulesIndexRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getRulesIndexRequest == null)
                    getRulesIndexRequest = new GetRulesIndexRequest();

                if (getRulesIndexRequest.PageSize == null)
                    getRulesIndexRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var rulesIndex = new RulesIndex()
                {
                    IndexId = getRulesIndexRequest.IndexId,
                    RulesId = getRulesIndexRequest.RulesId,
                    SearchText = getRulesIndexRequest.SearchText,
                    IsActive = getRulesIndexRequest.IsActive,
                    PageNumber = getRulesIndexRequest.PageNumber,
                    PageSize = Convert.ToInt32(getRulesIndexRequest.PageSize),
                    IsPagingRequired = (getRulesIndexRequest.PageNumber != null) ? true : false,
                    OrderBy = getRulesIndexRequest.OrderBy,
                    OrderByDirection = getRulesIndexRequest.OrderByDirection
                };
                var rulesIndexes = iRulesIndex.GetRulesIndex(rulesIndex);

                var rulesIndexList = new List<GetRulesIndexResponse>();
                foreach (var rulesIndexDetail in rulesIndexes)
                {
                    rulesIndexList.Add(new GetRulesIndexResponse()
                    {
                        IndexId = Convert.ToInt32(rulesIndexDetail.IndexId),
                        RulesId = Convert.ToInt32(rulesIndexDetail.RulesId),
                        IndexNo = rulesIndexDetail.IndexNo,
                        IndexName = rulesIndexDetail.IndexName,
                        IndexContent = rulesIndexDetail.IndexContent,
                        SortId = rulesIndexDetail.SortId,
                        IsActive = Convert.ToBoolean(rulesIndexDetail.IsActive),
                        CreatedBy = rulesIndexDetail.CreatedBy,
                        TotalPageCount = rulesIndexDetail.TotalPageCount,
                        TotalRecord = rulesIndexDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "RulesIndex retrieved successfully";
                responses.Response = rulesIndexList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving RulesIndex.";

                Utility.WriteLog("GetRulesIndex", getRulesIndexRequest, "Error while retrieving RulesIndex. (RulesIndexAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("rulesindexes/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddRulesIndex(AddRulesIndexRequest addRulesIndexRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var rulesIndex = new RulesIndex()
                {
                    RulesId = addRulesIndexRequest.RulesId,
                    IndexNo = addRulesIndexRequest.IndexNo,
                    IndexName = addRulesIndexRequest.IndexName,
                    IndexContent = addRulesIndexRequest.IndexContent,
                    SaveAfterIndexId = addRulesIndexRequest.SaveAfterIndexId,
                    CreatedBy = Utility.UserId
                };
                int result = iRulesIndex.AddRulesIndex(rulesIndex);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "RulesIndex added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "RulesIndex alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding RulesIndex.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding RulesIndex.";

                Utility.WriteLog("AddRulesIndex", addRulesIndexRequest, "Error while adding RulesIndex. (RulesIndexAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("rulesindexes/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateRulesIndex(UpdateRulesIndexRequest updateRulesIndexRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var rulesIndex = new RulesIndex()
                {
                    IndexId = updateRulesIndexRequest.IndexId,
                    RulesId = updateRulesIndexRequest.RulesId,
                    IndexNo = updateRulesIndexRequest.IndexNo,
                    IndexName = updateRulesIndexRequest.IndexName,
                    IndexContent = updateRulesIndexRequest.IndexContent,
                    SaveAfterIndexId = updateRulesIndexRequest.SaveAfterIndexId,
                    ModifiedBy = Utility.UserId
                };
                int result = iRulesIndex.UpdateRulesIndex(rulesIndex);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "RulesIndex updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "RulesIndex already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "RulesIndex doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating RulesIndex.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating RulesIndex.";

                Utility.WriteLog("UpdateRulesIndex", updateRulesIndexRequest, "Error while updating RulesIndex. (RulesIndexAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("rulesindexes/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteRulesIndex(DeleteRulesIndexRequest deleteRulesIndexRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var rulesIndex = new RulesIndex()
                {
                    IndexId = deleteRulesIndexRequest.IndexId,
                    RulesId = deleteRulesIndexRequest.RulesId,
                    ModifiedBy = Utility.UserId
                };

                int result = iRulesIndex.DeleteRulesIndex(rulesIndex);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "RulesIndex deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "RulesIndex doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting RulesIndex.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting RulesIndex.";

                Utility.WriteLog("DeleteRulesIndex", deleteRulesIndexRequest, "Error while deleting RulesIndex. (RulesIndexAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
