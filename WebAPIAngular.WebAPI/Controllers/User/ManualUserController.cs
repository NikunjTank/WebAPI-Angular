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
    public class ManualUserController : ApiController
    {
        private IManual iManual;
        public ManualUserController()
        {
            try
            {
                iManual = new ManualRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("ManualUserController (User)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("manuals")]
        [ResponseType(typeof(List<GetManualResponse>))]
        public IHttpActionResult GetManual([FromUri]GetManualRequest getManualRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getManualRequest == null)
                    getManualRequest = new GetManualRequest();

                if (getManualRequest.PageSize == null)
                    getManualRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var manual = new Manual()
                {
                    ManualId = getManualRequest.ManualId,
                    SearchText = getManualRequest.SearchText,
                    IsActive = getManualRequest.IsActive,
                    PageNumber = getManualRequest.PageNumber,
                    PageSize = Convert.ToInt32(getManualRequest.PageSize),
                    IsPagingRequired = (getManualRequest.PageNumber != null) ? true : false,
                    OrderBy = getManualRequest.OrderBy,
                    OrderByDirection = getManualRequest.OrderByDirection
                };
                var manuals = iManual.GetManual(manual);

                var manualList = new List<GetManualResponse>();
                foreach (var manualDetail in manuals)
                {
                    manualList.Add(new GetManualResponse()
                    {
                        ManualId = Convert.ToInt32(manualDetail.ManualId),
                        ManualName = manualDetail.ManualName,
                        PDF = manualDetail.PDF,
                        IsActive = Convert.ToBoolean(manualDetail.IsActive),
                        CreatedBy = manualDetail.CreatedBy,
                        TotalPageCount = manualDetail.TotalPageCount,
                        TotalRecord = manualDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "Manual retrieved successfully";
                responses.Response = manualList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving manual.";

                Utility.WriteLog("GetManual", getManualRequest, "Error while retrieving manual. (ManualUserController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
