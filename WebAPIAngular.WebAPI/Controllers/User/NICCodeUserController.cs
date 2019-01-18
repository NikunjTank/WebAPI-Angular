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
    public class NICCodeUserController : ApiController
    {
        private INICCode iNICCode;
        public NICCodeUserController()
        {
            try
            {
                iNICCode = new NICCodeRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("NICCodeUserController (User)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("niccodes")]
        [ResponseType(typeof(List<GetNICCodeResponse>))]
        public IHttpActionResult GetNICCode([FromUri]GetNICCodeRequest getNICCodeRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getNICCodeRequest == null)
                    getNICCodeRequest = new GetNICCodeRequest();

                if (getNICCodeRequest.PageSize == null)
                    getNICCodeRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var nICCode = new NICCode()
                {
                    NICCodeId = getNICCodeRequest.NICCodeId,
                    SearchText = getNICCodeRequest.SearchText,
                    IsActive = getNICCodeRequest.IsActive,
                    PageNumber = getNICCodeRequest.PageNumber,
                    PageSize = Convert.ToInt32(getNICCodeRequest.PageSize),
                    IsPagingRequired = (getNICCodeRequest.PageNumber != null) ? true : false,
                    OrderBy = getNICCodeRequest.OrderBy,
                    OrderByDirection = getNICCodeRequest.OrderByDirection
                };
                var nICCodes = iNICCode.GetNICCode(nICCode);

                var nICCodeList = new List<GetNICCodeResponse>();
                foreach (var nICCodeDetail in nICCodes)
                {
                    nICCodeList.Add(new GetNICCodeResponse()
                    {
                        NICCodeId = Convert.ToInt32(nICCodeDetail.NICCodeId),
                        NICCodeName = nICCodeDetail.NICCodeName,
                        PDF = nICCodeDetail.PDF,
                        IsActive = Convert.ToBoolean(nICCodeDetail.IsActive),
                        CreatedBy = nICCodeDetail.CreatedBy,
                        TotalPageCount = nICCodeDetail.TotalPageCount,
                        TotalRecord = nICCodeDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "NICCode retrieved successfully";
                responses.Response = nICCodeList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving niccode.";

                Utility.WriteLog("GetNICCode", getNICCodeRequest, "Error while retrieving niccode. (NICCodeUserController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
