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
    public class FIPBPressReleaseCaseUserController : ApiController
    {
        private IFIPBPressReleaseCase iFIPBPressReleaseCase;
        public FIPBPressReleaseCaseUserController()
        {
            try
            {
                iFIPBPressReleaseCase = new FIPBPressReleaseCaseRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("FIPBPressReleaseCaseUserController (User)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("fipbpressreleasecases")]
        [ResponseType(typeof(List<GetFIPBPressReleaseCaseResponse>))]
        public IHttpActionResult GetFIPBPressReleaseCase([FromUri]GetFIPBPressReleaseCaseRequest getFIPBPressReleaseCaseRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getFIPBPressReleaseCaseRequest == null)
                    getFIPBPressReleaseCaseRequest = new GetFIPBPressReleaseCaseRequest();

                if (getFIPBPressReleaseCaseRequest.PageSize == null)
                    getFIPBPressReleaseCaseRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var fIPBPressReleaseCase = new FIPBPressReleaseCase()
                {
                    FIPBPressReleaseCaseId = getFIPBPressReleaseCaseRequest.FIPBPressReleaseCaseId,
                    SearchText = getFIPBPressReleaseCaseRequest.SearchText,
                    IsActive = getFIPBPressReleaseCaseRequest.IsActive,
                    PageNumber = getFIPBPressReleaseCaseRequest.PageNumber,
                    PageSize = Convert.ToInt32(getFIPBPressReleaseCaseRequest.PageSize),
                    IsPagingRequired = (getFIPBPressReleaseCaseRequest.PageNumber != null) ? true : false,
                    OrderBy = getFIPBPressReleaseCaseRequest.OrderBy,
                    OrderByDirection = getFIPBPressReleaseCaseRequest.OrderByDirection
                };
                var fIPBPressReleaseCases = iFIPBPressReleaseCase.GetFIPBPressReleaseCase(fIPBPressReleaseCase);

                var fIPBPressReleaseCaseList = new List<GetFIPBPressReleaseCaseResponse>();
                foreach (var fIPBPressReleaseCaseDetail in fIPBPressReleaseCases)
                {
                    fIPBPressReleaseCaseList.Add(new GetFIPBPressReleaseCaseResponse()
                    {
                        FIPBPressReleaseCaseId = Convert.ToInt32(fIPBPressReleaseCaseDetail.FIPBPressReleaseCaseId),
                        MinistryName = fIPBPressReleaseCaseDetail.MinistryName,
                        MeetingNo_Detail = fIPBPressReleaseCaseDetail.MeetingNo_Detail,
                        PDF = fIPBPressReleaseCaseDetail.PDF,
                        IsActive = Convert.ToBoolean(fIPBPressReleaseCaseDetail.IsActive),
                        CreatedBy = fIPBPressReleaseCaseDetail.CreatedBy,
                        TotalPageCount = fIPBPressReleaseCaseDetail.TotalPageCount,
                        TotalRecord = fIPBPressReleaseCaseDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "FIPBPressReleaseCase retrieved successfully";
                responses.Response = fIPBPressReleaseCaseList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving fIPBPressReleaseCase.";

                Utility.WriteLog("GetFIPBPressReleaseCase", getFIPBPressReleaseCaseRequest, "Error while retrieving fIPBPressReleaseCase. (FIPBPressReleaseCaseUserController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
