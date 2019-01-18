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
    public class APDIRCircularUserController : ApiController
    {
        private IAPDIRCircular iAPDIRCircular;
        public APDIRCircularUserController()
        {
            try
            {
                iAPDIRCircular = new APDIRCircularRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("APDIRCircularUserController (User)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("apdircirculars")]
        [ResponseType(typeof(List<GetAPDIRCircularResponse>))]
        public IHttpActionResult GetAPDIRCircular([FromUri]GetAPDIRCircularRequest getAPDIRCircularRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getAPDIRCircularRequest == null)
                    getAPDIRCircularRequest = new GetAPDIRCircularRequest();

                if (getAPDIRCircularRequest.PageSize == null)
                    getAPDIRCircularRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var aPDIRCircular = new APDIRCircular()
                {
                    APDIRCircularId = getAPDIRCircularRequest.APDIRCircularId,
                    MasterDirectionId = getAPDIRCircularRequest.MasterDirectionId,
                    Year = getAPDIRCircularRequest.Year,
                    SearchText = getAPDIRCircularRequest.SearchText,
                    IsActive = getAPDIRCircularRequest.IsActive,
                    PageNumber = getAPDIRCircularRequest.PageNumber,
                    PageSize = Convert.ToInt32(getAPDIRCircularRequest.PageSize),
                    IsPagingRequired = (getAPDIRCircularRequest.PageNumber != null) ? true : false,
                    OrderBy = getAPDIRCircularRequest.OrderBy,
                    OrderByDirection = getAPDIRCircularRequest.OrderByDirection
                };
                var aPDIRCirculars = iAPDIRCircular.GetAPDIRCircular(aPDIRCircular);

                var aPDIRCircularList = new List<GetAPDIRCircularResponse>();
                foreach (var aPDIRCircularDetail in aPDIRCirculars)
                {
                    aPDIRCircularList.Add(new GetAPDIRCircularResponse()
                    {
                        APDIRCircularId = Convert.ToInt32(aPDIRCircularDetail.APDIRCircularId),
                        MasterDirectionId = aPDIRCircularDetail.MasterDirectionId,
                        MasterDirectionName = aPDIRCircularDetail.MasterDirectionName,
                        APDIRCircularNo = aPDIRCircularDetail.APDIRCircularNo,
                        APDIRCircularName = aPDIRCircularDetail.APDIRCircularName,
                        APDIRCircularDate = aPDIRCircularDetail.APDIRCircularDate,
                        APDIRCircularEffectiveDate = aPDIRCircularDetail.APDIRCircularEffectiveDate,
                        Year = aPDIRCircularDetail.Year,
                        APDIRCircularYearName = Utility.GetAPDIRCircularYear(Convert.ToInt32(aPDIRCircularDetail.Year)).First().APDIRCircularYearName,
                        APDIRCircularPDF = aPDIRCircularDetail.APDIRCircularPDF,
                        IsActive = Convert.ToBoolean(aPDIRCircularDetail.IsActive),
                        CreatedBy = aPDIRCircularDetail.CreatedBy,
                        TotalPageCount = aPDIRCircularDetail.TotalPageCount,
                        TotalRecord = aPDIRCircularDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "APDIRCircular retrieved successfully";
                responses.Response = aPDIRCircularList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving APDIRCircular.";

                Utility.WriteLog("GetAPDIRCircular", getAPDIRCircularRequest, "Error while retrieving APDIRCircular. (APDIRCircularUserController)", ex.ToString());
            }
            return Ok(responses);
        }
        
        [HttpGet]
        [Route("apdircircularyears")]
        [ResponseType(typeof(List<APDIRCircularYear>))]
        public IHttpActionResult GetAPDIRCircularYear()
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);
                
                var lstAPDIRCircularYear = Utility.GetAPDIRCircularYear(null).Where(x => x.APDIRCircularYearId >= 1996 && x.APDIRCircularYearId <= DateTime.Now.Year).OrderByDescending(x => x.APDIRCircularYearId).ToList();
                
                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "APDIRCircularYear retrieved successfully";
                responses.Response = lstAPDIRCircularYear;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving APDIRCircularYear.";

                Utility.WriteLog("GetAPDIRCircularYear", null, "Error while retrieving APDIRCircularYear. (APDIRCircularUserController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
