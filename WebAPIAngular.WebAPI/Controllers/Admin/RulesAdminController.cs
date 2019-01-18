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
    public class RulesAdminController : ApiController
    {
        private IRules iRules;
        public RulesAdminController()
        {
            try
            {
                iRules = new RulesRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("RulesAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("rules")]
        [ResponseType(typeof(List<GetRulesResponse>))]
        public IHttpActionResult GetRules([FromUri]GetRulesRequest getRulesRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getRulesRequest == null)
                    getRulesRequest = new GetRulesRequest();

                if (getRulesRequest.PageSize == null)
                    getRulesRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var rules = new Rules()
                {
                    RulesId = getRulesRequest.RulesId,
                    SearchText = getRulesRequest.SearchText,
                    IsActive = getRulesRequest.IsActive,
                    PageNumber = getRulesRequest.PageNumber,
                    PageSize = Convert.ToInt32(getRulesRequest.PageSize),
                    IsPagingRequired = (getRulesRequest.PageNumber != null) ? true : false,
                    OrderBy = getRulesRequest.OrderBy,
                    OrderByDirection = getRulesRequest.OrderByDirection
                };
                var ruless = iRules.GetRules(rules);

                var rulesList = new List<GetRulesResponse>();
                foreach (var rulesDetail in ruless)
                {
                    rulesList.Add(new GetRulesResponse()
                    {
                        RulesId = rulesDetail.RulesId,
                        RulesName = rulesDetail.RulesName,
                        RulesNo = rulesDetail.RulesNo,
                        Year = rulesDetail.Year,
                        PublicationDate = rulesDetail.PublicationDate,
                        IsActive = Convert.ToBoolean(rulesDetail.IsActive),
                        CreatedBy = rulesDetail.CreatedBy,
                        TotalPageCount = rulesDetail.TotalPageCount,
                        TotalRecord = rulesDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "Rules retrieved successfully";
                responses.Response = rulesList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving rules.";

                Utility.WriteLog("GetRules", getRulesRequest, "Error while retrieving rules. (RulesAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("rules/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddRules(AddRulesRequest addRulesRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var rules = new Rules()
                {
                    RulesName = addRulesRequest.RulesName,
                    RulesNo = addRulesRequest.RulesNo,
                    Year = addRulesRequest.Year,
                    PublicationDate = addRulesRequest.PublicationDate,
                    CreatedBy = Utility.UserId
                };
                int result = iRules.AddRules(rules);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "Rules added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Rules alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding rules.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding rules.";

                Utility.WriteLog("AddRules", addRulesRequest, "Error while adding rules. (RulesAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("rules/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateRules(UpdateRulesRequest updateRulesRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var rules = new Rules()
                {
                    RulesId = updateRulesRequest.RulesId,
                    RulesName = updateRulesRequest.RulesName,
                    RulesNo = updateRulesRequest.RulesNo,
                    Year = updateRulesRequest.Year,
                    PublicationDate = updateRulesRequest.PublicationDate,
                    ModifiedBy = Utility.UserId
                };
                int result = iRules.UpdateRules(rules);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "Rules updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Rules already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Rules doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating rules.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating rules.";

                Utility.WriteLog("UpdateRules", updateRulesRequest, "Error while updating rules. (RulesAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("rules/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteRules(DeleteRulesRequest deleteRulesRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var rules = new Rules()
                {
                    RulesId = deleteRulesRequest.RulesId,
                    ModifiedBy = Utility.UserId
                };

                int result = iRules.DeleteRules(rules);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "Rules deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Rules doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting rules.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting rules.";

                Utility.WriteLog("DeleteRules", deleteRulesRequest, "Error while deleting rules. (RulesAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpGet]
        [Route("rulesyears")]
        [ResponseType(typeof(List<int>))]
        public IHttpActionResult GetRulesDetailYear()
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var lstRulesDetailYear = Utility.GetYear();

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "RulesDetailYear retrieved successfully";
                responses.Response = lstRulesDetailYear;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving RulesDetailYear.";

                Utility.WriteLog("GetRulesDetailYear", null, "Error while retrieving RulesDetailYear. (RulesDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
