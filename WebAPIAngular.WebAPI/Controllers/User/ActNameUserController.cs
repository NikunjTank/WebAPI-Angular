using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using DemystifyFema.Service.Repository;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;

namespace DemystifyFema.Service.Controllers.User
{
    [Authorize(Roles = "User")]
    [RoutePrefix("user/api")]
    public class ActNameUserController : ApiController
    {
        private IActName iActName;
        public ActNameUserController()
        {
            try
            {
                iActName = new ActNameRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("ActNameUserController (User)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("actnames")]
        [ResponseType(typeof(List<GetActNameResponse>))]
        public IHttpActionResult GetActName([FromUri]GetActNameRequest getActNameRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getActNameRequest == null)
                    getActNameRequest = new GetActNameRequest();

                if (getActNameRequest.PageSize == null)
                    getActNameRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var actName = new ActName()
                {
                    ActId = getActNameRequest.ActId,
                    SearchText = getActNameRequest.SearchText,
                    IsActive = getActNameRequest.IsActive,
                    PageNumber = getActNameRequest.PageNumber,
                    PageSize = Convert.ToInt32(getActNameRequest.PageSize),
                    IsPagingRequired = (getActNameRequest.PageNumber != null) ? true : false,
                    OrderBy = getActNameRequest.OrderBy,
                    OrderByDirection = getActNameRequest.OrderByDirection
                };
                var actNames = iActName.GetActName(actName);

                var actNameList = new List<GetActNameResponse>();
                foreach (var actNameDetail in actNames)
                {
                    actNameList.Add(new GetActNameResponse()
                    {
                        ActId = Convert.ToInt32(actNameDetail.ActId),
                        LongTitle = actNameDetail.LongTitle,
                        ActPDF = actNameDetail.ActPDF,
                        IsActive = Convert.ToBoolean(actNameDetail.IsActive),
                        CreatedBy = actNameDetail.CreatedBy,
                        TotalPageCount = actNameDetail.TotalPageCount,
                        TotalRecord = actNameDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "ActName retrieved successfully";
                responses.Response = actNameList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving actname.";

                Utility.WriteLog("GetActName", getActNameRequest, "Error while retrieving actname. (ActNameUserController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
