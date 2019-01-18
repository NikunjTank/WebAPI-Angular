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
    public class RulesIndexAmendmentAdminController : ApiController
    {
        private IRulesIndexAmendment iRulesIndexAmendment;
        public RulesIndexAmendmentAdminController()
        {
            try
            {
                iRulesIndexAmendment = new RulesIndexAmendmentRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("RulesIndexAmendmentAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("rulesindexamendments")]
        [ResponseType(typeof(List<GetRulesIndexAmendmentResponse>))]
        public IHttpActionResult GetRulesIndexAmendment([FromUri]GetRulesIndexAmendmentRequest getRulesIndexAmendmentRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getRulesIndexAmendmentRequest == null)
                    getRulesIndexAmendmentRequest = new GetRulesIndexAmendmentRequest();

                if (getRulesIndexAmendmentRequest.PageSize == null)
                    getRulesIndexAmendmentRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var rulesIndexAmendment = new RulesIndexAmendment()
                {
                    RulesIndexAmendmentId = getRulesIndexAmendmentRequest.RulesIndexAmendmentId,
                    RulesId = getRulesIndexAmendmentRequest.RulesId,
                    SearchText = getRulesIndexAmendmentRequest.SearchText,
                    IsActive = getRulesIndexAmendmentRequest.IsActive,
                    PageNumber = getRulesIndexAmendmentRequest.PageNumber,
                    PageSize = Convert.ToInt32(getRulesIndexAmendmentRequest.PageSize),
                    IsPagingRequired = (getRulesIndexAmendmentRequest.PageNumber != null) ? true : false,
                    OrderBy = getRulesIndexAmendmentRequest.OrderBy,
                    OrderByDirection = getRulesIndexAmendmentRequest.OrderByDirection
                };
                var rulesIndexAmendments = iRulesIndexAmendment.GetRulesIndexAmendment(rulesIndexAmendment);

                var rulesIndexAmendmentList = new List<GetRulesIndexAmendmentResponse>();
                foreach (var rulesIndexAmendmentDetail in rulesIndexAmendments)
                {
                    rulesIndexAmendmentList.Add(new GetRulesIndexAmendmentResponse()
                    {
                        RulesIndexAmendmentId = rulesIndexAmendmentDetail.RulesIndexAmendmentId,
                        RulesId = rulesIndexAmendmentDetail.RulesId,
                        GSRNotificationIds = rulesIndexAmendmentDetail.GSRNotificationIds,
                        GSRNotifications = rulesIndexAmendmentDetail.GSRNotifications,
                        IndexId = rulesIndexAmendmentDetail.IndexId,
                        IndexNo = rulesIndexAmendmentDetail.IndexNo,
                        IndexName = rulesIndexAmendmentDetail.IndexName,
                        SubIndexId = rulesIndexAmendmentDetail.SubIndexId,
                        SubIndexNo = rulesIndexAmendmentDetail.SubIndexNo,
                        SubIndexName = rulesIndexAmendmentDetail.SubIndexName,
                        IndexAmendmentContent = rulesIndexAmendmentDetail.IndexAmendmentContent,
                        IsActive = Convert.ToBoolean(rulesIndexAmendmentDetail.IsActive),
                        CreatedBy = rulesIndexAmendmentDetail.CreatedBy,
                        TotalPageCount = rulesIndexAmendmentDetail.TotalPageCount,
                        TotalRecord = rulesIndexAmendmentDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "RulesIndexAmendment retrieved successfully";
                responses.Response = rulesIndexAmendmentList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving index amendment.";

                Utility.WriteLog("GetRulesIndexAmendment", getRulesIndexAmendmentRequest, "Error while retrieving index amendment. (RulesIndexAmendmentAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("rulesindexamendments/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddRulesIndexAmendment(AddRulesIndexAmendmentRequest addRulesIndexAmendmentRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var rulesIndexAmendment = new RulesIndexAmendment()
                {
                    RulesId = addRulesIndexAmendmentRequest.RulesId,
                    GSRNotificationIds = addRulesIndexAmendmentRequest.GSRNotificationIds,
                    IndexId = addRulesIndexAmendmentRequest.IndexId,
                    SubIndexId = addRulesIndexAmendmentRequest.SubIndexId,
                    IndexAmendmentContent = addRulesIndexAmendmentRequest.IndexAmendmentContent
                };
                int result = iRulesIndexAmendment.AddRulesIndexAmendment(rulesIndexAmendment);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "RulesIndexAmendment added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "RulesIndexAmendment alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding index amendment.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding index amendment.";

                Utility.WriteLog("AddRulesIndexAmendment", addRulesIndexAmendmentRequest, "Error while adding index amendment. (RulesIndexAmendmentAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("rulesindexamendments/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateRulesIndexAmendment(UpdateRulesIndexAmendmentRequest updateRulesIndexAmendmentRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var rulesIndexAmendment = new RulesIndexAmendment()
                {
                    RulesIndexAmendmentId = updateRulesIndexAmendmentRequest.RulesIndexAmendmentId,
                    RulesId = updateRulesIndexAmendmentRequest.RulesId,
                    GSRNotificationIds = updateRulesIndexAmendmentRequest.GSRNotificationIds,
                    IndexId = updateRulesIndexAmendmentRequest.IndexId,
                    SubIndexId = updateRulesIndexAmendmentRequest.SubIndexId,
                    IndexAmendmentContent = updateRulesIndexAmendmentRequest.IndexAmendmentContent,
                    ModifiedBy = Utility.UserId
                };
                int result = iRulesIndexAmendment.UpdateRulesIndexAmendment(rulesIndexAmendment);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "RulesIndexAmendment updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "RulesIndexAmendment already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "RulesIndexAmendment doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating index amendment.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating index amendment.";

                Utility.WriteLog("UpdateRulesIndexAmendment", updateRulesIndexAmendmentRequest, "Error while updating index amendment. (RulesIndexAmendmentAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("rulesindexamendments/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteRulesIndexAmendment(DeleteRulesIndexAmendmentRequest deleteRulesIndexAmendmentRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var rulesIndexAmendment = new RulesIndexAmendment()
                {
                    RulesIndexAmendmentId = deleteRulesIndexAmendmentRequest.RulesIndexAmendmentId,
                    ModifiedBy = Utility.UserId
                };

                int result = iRulesIndexAmendment.DeleteRulesIndexAmendment(rulesIndexAmendment);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "RulesIndexAmendment deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "RulesIndexAmendment doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting index amendment.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting index amendment.";

                Utility.WriteLog("DeleteRulesIndexAmendment", deleteRulesIndexAmendmentRequest, "Error while deleting index amendment. (RulesIndexAmendmentAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
