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
    public class FEMASubModuleOfModuleAdminController : ApiController
    {
        private IFEMASubModuleOfModule iFEMASubModuleOfModule;
        public FEMASubModuleOfModuleAdminController()
        {
            try
            {
                iFEMASubModuleOfModule = new FEMASubModuleOfModuleRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("FEMASubModuleOfModuleAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("femasubmoduleofmodules")]
        [ResponseType(typeof(List<GetFEMASubModuleOfModuleResponse>))]
        public IHttpActionResult GetFEMASubModuleOfModule([FromUri]GetFEMASubModuleOfModuleRequest getFEMASubModuleOfModuleRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getFEMASubModuleOfModuleRequest == null)
                    getFEMASubModuleOfModuleRequest = new GetFEMASubModuleOfModuleRequest();

                if (getFEMASubModuleOfModuleRequest.PageSize == null)
                    getFEMASubModuleOfModuleRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var fEMASubModuleOfModule = new FEMASubModuleOfModule()
                {
                    FEMAModuleId = getFEMASubModuleOfModuleRequest.FEMAModuleId,
                    FEMASubModuleOfModuleId = getFEMASubModuleOfModuleRequest.FEMASubModuleOfModuleId,
                    PageNumber = getFEMASubModuleOfModuleRequest.PageNumber,
                    PageSize = Convert.ToInt32(getFEMASubModuleOfModuleRequest.PageSize),
                    IsPagingRequired = (getFEMASubModuleOfModuleRequest.PageNumber != null) ? true : false
                };
                var fEMASubModuleOfModules = iFEMASubModuleOfModule.GetFEMASubModuleOfModule(fEMASubModuleOfModule);

                var fEMASubModuleOfModuleList = new List<GetFEMASubModuleOfModuleResponse>();
                foreach (var fEMASubModuleOfModuleDetail in fEMASubModuleOfModules)
                {
                    fEMASubModuleOfModuleList.Add(new GetFEMASubModuleOfModuleResponse()
                    {
                        FEMASubModuleOfModuleId = fEMASubModuleOfModuleDetail.FEMASubModuleOfModuleId,
                        FEMAModuleId = fEMASubModuleOfModuleDetail.FEMAModuleId,
                        FEMASubModuleId = fEMASubModuleOfModuleDetail.FEMASubModuleId,
                        FEMASubModuleName = fEMASubModuleOfModuleDetail.FEMASubModuleName,
                        FEMAKeyModuleId = fEMASubModuleOfModuleDetail.FEMAKeyModuleId,
                        FEMAKeyModuleName = fEMASubModuleOfModuleDetail.FEMAKeyModuleName,
                        FEMAKeyModuleDetail = fEMASubModuleOfModuleDetail.FEMAKeyModuleDetail,
                        FEMAKeyModuleDetailNames = fEMASubModuleOfModuleDetail.FEMAKeyModuleDetailNames,
                        IsActive = Convert.ToBoolean(fEMASubModuleOfModuleDetail.IsActive),
                        CreatedBy = fEMASubModuleOfModuleDetail.CreatedBy,
                        TotalPageCount = fEMASubModuleOfModuleDetail.TotalPageCount,
                        TotalRecord = fEMASubModuleOfModuleDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "FEMASubModuleOfModule retrieved successfully";
                responses.Response = fEMASubModuleOfModuleList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving FEMASubModuleOfModule.";

                Utility.WriteLog("GetFEMASubModuleOfModule", getFEMASubModuleOfModuleRequest, "Error while retrieving FEMASubModuleOfModule. (FEMASubModuleOfModuleAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("femasubmoduleofmodules/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddFEMASubModuleOfModule(AddFEMASubModuleOfModuleRequest addFEMASubModuleOfModuleRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var fEMASubModuleOfModule = new FEMASubModuleOfModule()
                {
                    FEMAModuleId = addFEMASubModuleOfModuleRequest.FEMAModuleId,
                    FEMASubModuleId = addFEMASubModuleOfModuleRequest.FEMASubModuleId,
                    RegulationKeyModuleDetail = addFEMASubModuleOfModuleRequest.RegulationKeyModuleDetail,
                    RulesKeyModuleDetail = addFEMASubModuleOfModuleRequest.RulesKeyModuleDetail,
                    MasterDirectionKeyModuleDetail = addFEMASubModuleOfModuleRequest.MasterDirectionKeyModuleDetail,
                    MasterCircularKeyModuleDetail = addFEMASubModuleOfModuleRequest.MasterCircularKeyModuleDetail,
                    RBIFAQKeyModuleDetail = addFEMASubModuleOfModuleRequest.RBIFAQKeyModuleDetail,
                    CreatedBy = Utility.UserId
                };
                int result = iFEMASubModuleOfModule.AddFEMASubModuleOfModule(fEMASubModuleOfModule);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "FEMASubModuleOfModule added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "FEMASubModuleOfModule alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding FEMASubModuleOfModule.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding FEMASubModuleOfModule.";

                Utility.WriteLog("AddFEMASubModuleOfModule", addFEMASubModuleOfModuleRequest, "Error while adding FEMASubModuleOfModule. (FEMASubModuleOfModuleAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("femasubmoduleofmodules/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateFEMASubModuleOfModule(UpdateFEMASubModuleOfModuleRequest updateFEMASubModuleOfModuleRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var fEMASubModuleOfModule = new FEMASubModuleOfModule()
                {
                    FEMASubModuleOfModuleId = updateFEMASubModuleOfModuleRequest.FEMASubModuleOfModuleId,
                    FEMAModuleId = updateFEMASubModuleOfModuleRequest.FEMAModuleId,
                    FEMASubModuleId = updateFEMASubModuleOfModuleRequest.FEMASubModuleId,
                    RegulationKeyModuleDetail = updateFEMASubModuleOfModuleRequest.RegulationKeyModuleDetail,
                    RulesKeyModuleDetail = updateFEMASubModuleOfModuleRequest.RulesKeyModuleDetail,
                    MasterDirectionKeyModuleDetail = updateFEMASubModuleOfModuleRequest.MasterDirectionKeyModuleDetail,
                    MasterCircularKeyModuleDetail = updateFEMASubModuleOfModuleRequest.MasterCircularKeyModuleDetail,
                    RBIFAQKeyModuleDetail = updateFEMASubModuleOfModuleRequest.RBIFAQKeyModuleDetail,
                    ModifiedBy = Utility.UserId
                };
                int result = iFEMASubModuleOfModule.UpdateFEMASubModuleOfModule(fEMASubModuleOfModule);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "FEMASubModuleOfModule updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FEMASubModuleOfModule already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FEMASubModuleOfModule doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating FEMASubModuleOfModule.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating admin profile.";

                Utility.WriteLog("UpdateFEMASubModuleOfModule", updateFEMASubModuleOfModuleRequest, "Error while updating FEMASubModuleOfModule. (FEMASubModuleOfModuleAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("femasubmoduleofmodules/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteFEMASubModuleOfModule(DeleteFEMASubModuleOfModuleRequest deleteFEMASubModuleOfModuleRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var fEMASubModuleOfModule = new FEMASubModuleOfModule()
                {
                    FEMASubModuleOfModuleId = deleteFEMASubModuleOfModuleRequest.FEMASubModuleOfModuleId,
                    ModifiedBy = Utility.UserId
                };

                int result = iFEMASubModuleOfModule.DeleteFEMASubModuleOfModule(fEMASubModuleOfModule);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "FEMASubModuleOfModule deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FEMASubModuleOfModule doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting FEMASubModuleOfModule.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting FEMASubModuleOfModule.";

                Utility.WriteLog("DeleteFEMASubModuleOfModule", deleteFEMASubModuleOfModuleRequest, "Error while deleting FEMASubModuleOfModule. (FEMASubModuleOfModuleAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
