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

namespace DemystifyFema.Service.Controllers.User
{
    [Authorize(Roles = "User")]
    [RoutePrefix("user/api")]
    public class FEMASubModuleOfModuleUserController : ApiController
    {
        private IFEMASubModuleOfModule iFEMASubModuleOfModule;
        public FEMASubModuleOfModuleUserController()
        {
            try
            {
                iFEMASubModuleOfModule = new FEMASubModuleOfModuleRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("FEMASubModuleOfModuleUserController (User)", null, "Error while initialize repository.", ex.ToString());
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

                Utility.WriteLog("GetFEMASubModuleOfModule", getFEMASubModuleOfModuleRequest, "Error while retrieving FEMASubModuleOfModule. (FEMASubModuleOfModuleUserController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
