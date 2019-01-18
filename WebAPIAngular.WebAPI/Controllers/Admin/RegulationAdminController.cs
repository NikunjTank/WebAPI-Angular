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
    public class RegulationAdminController : ApiController
    {
        private IRegulation iRegulation;
        public RegulationAdminController()
        {
            try
            {
                iRegulation = new RegulationRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("RegulationAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("regulations")]
        [ResponseType(typeof(List<GetRegulationResponse>))]
        public IHttpActionResult GetRegulation([FromUri]GetRegulationRequest getRegulationRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getRegulationRequest == null)
                    getRegulationRequest = new GetRegulationRequest();

                if (getRegulationRequest.PageSize == null)
                    getRegulationRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var regulation = new Regulation()
                {
                    RegulationId = getRegulationRequest.RegulationId,
                    SearchText = getRegulationRequest.SearchText,
                    IsActive = getRegulationRequest.IsActive,
                    PageNumber = getRegulationRequest.PageNumber,
                    PageSize = Convert.ToInt32(getRegulationRequest.PageSize),
                    IsPagingRequired = (getRegulationRequest.PageNumber != null) ? true : false,
                    OrderBy = getRegulationRequest.OrderBy,
                    OrderByDirection = getRegulationRequest.OrderByDirection
                };
                var regulations = iRegulation.GetRegulation(regulation);

                var regulationList = new List<GetRegulationResponse>();
                foreach (var regulationDetail in regulations)
                {
                    regulationList.Add(new GetRegulationResponse()
                    {
                        RegulationId = regulationDetail.RegulationId,
                        RegulationName = regulationDetail.RegulationName,
                        RegulationNumber = regulationDetail.RegulationNumber,
                        Year = regulationDetail.Year,
                        PublicationDate = regulationDetail.PublicationDate,
                        IsActive = Convert.ToBoolean(regulationDetail.IsActive),
                        CreatedBy = regulationDetail.CreatedBy,
                        TotalPageCount = regulationDetail.TotalPageCount,
                        TotalRecord = regulationDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "Regulation retrieved successfully";
                responses.Response = regulationList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving regulation.";

                Utility.WriteLog("GetRegulation", getRegulationRequest, "Error while retrieving regulation. (RegulationAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
        
        [HttpPost]
        [Route("regulations/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddRegulation(AddRegulationRequest addRegulationRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var regulation = new Regulation()
                {
                    RegulationName = addRegulationRequest.RegulationName,
                    RegulationNumber = addRegulationRequest.RegulationNumber,
                    Year = addRegulationRequest.Year,
                    PublicationDate = addRegulationRequest.PublicationDate
                };
                int result = iRegulation.AddRegulation(regulation);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "Regulation added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Regulation alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding regulation.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding regulation.";

                Utility.WriteLog("AddRegulation", addRegulationRequest, "Error while adding regulation. (RegulationAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("regulations/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateRegulation(UpdateRegulationRequest updateRegulationRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var regulation = new Regulation()
                {
                    RegulationId = updateRegulationRequest.RegulationId,
                    RegulationName = updateRegulationRequest.RegulationName,
                    RegulationNumber = updateRegulationRequest.RegulationNumber,
                    Year = updateRegulationRequest.Year,
                    PublicationDate = updateRegulationRequest.PublicationDate,
                    ModifiedBy = Utility.UserId
                };
                int result = iRegulation.UpdateRegulation(regulation);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "Regulation updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Regulation already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Regulation doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating regulation.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating regulation.";

                Utility.WriteLog("UpdateRegulation", updateRegulationRequest, "Error while updating regulation. (RegulationAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("regulations/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteRegulation(DeleteRegulationRequest deleteRegulationRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var regulation = new Regulation()
                {
                    RegulationId = deleteRegulationRequest.RegulationId,
                    ModifiedBy = Utility.UserId
                };

                int result = iRegulation.DeleteRegulation(regulation);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "Regulation deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Regulation doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting regulation.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting regulation.";

                Utility.WriteLog("DeleteRegulation", deleteRegulationRequest, "Error while deleting regulation. (RegulationAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
