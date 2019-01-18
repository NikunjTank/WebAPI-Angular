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
    public class RBIDataUserController : ApiController
    {
        private IRBIData iRBIData;
        private IRBIDataDetail iRBIDataDetail;
        public RBIDataUserController()
        {
            try
            {
                iRBIData = new RBIDataRepository();
                iRBIDataDetail = new RBIDataDetailRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("RBIDataUserController (User)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("rbidatas")]
        [ResponseType(typeof(List<GetRBIDataResponse>))]
        public IHttpActionResult GetRBIData([FromUri]GetRBIDataRequest getRBIDataRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getRBIDataRequest == null)
                    getRBIDataRequest = new GetRBIDataRequest();

                if (getRBIDataRequest.PageSize == null)
                    getRBIDataRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var rBIData = new RBIData()
                {
                    RBIDataId = getRBIDataRequest.RBIDataId,
                    SearchText = getRBIDataRequest.SearchText,
                    IsActive = getRBIDataRequest.IsActive,
                    PageNumber = getRBIDataRequest.PageNumber,
                    PageSize = Convert.ToInt32(getRBIDataRequest.PageSize),
                    IsPagingRequired = (getRBIDataRequest.PageNumber != null) ? true : false,
                    OrderBy = getRBIDataRequest.OrderBy,
                    OrderByDirection = getRBIDataRequest.OrderByDirection
                };
                var rBIDatas = iRBIData.GetRBIData(rBIData);

                var rBIDataList = new List<GetRBIDataResponse>();
                foreach (var rBIDataDetail in rBIDatas)
                {
                    rBIDataList.Add(new GetRBIDataResponse()
                    {
                        RBIDataId = Convert.ToInt32(rBIDataDetail.RBIDataId),
                        RBIDataName = rBIDataDetail.RBIDataName,
                        Excel = rBIDataDetail.Excel,
                        IsActive = Convert.ToBoolean(rBIDataDetail.IsActive),
                        CreatedBy = rBIDataDetail.CreatedBy,
                        TotalPageCount = rBIDataDetail.TotalPageCount,
                        TotalRecord = rBIDataDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "RBIData retrieved successfully";
                responses.Response = rBIDataList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving rbidata.";

                Utility.WriteLog("GetRBIData", getRBIDataRequest, "Error while retrieving rbidata. (RBIDataUserController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpGet]
        [Route("rbidatadetails")]
        [ResponseType(typeof(List<GetRBIDataDetailResponse>))]
        public IHttpActionResult GetRBIDataDetail([FromUri]GetRBIDataDetailRequest getRBIDataDetailRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getRBIDataDetailRequest == null)
                    getRBIDataDetailRequest = new GetRBIDataDetailRequest();

                if (getRBIDataDetailRequest.PageSize == null)
                    getRBIDataDetailRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var rBIDataDetail = new RBIDataDetail()
                {
                    RBIDataDetailId = getRBIDataDetailRequest.RBIDataDetailId,
                    RBIDataId = getRBIDataDetailRequest.RBIDataId,
                    Year = getRBIDataDetailRequest.Year,
                    Month = getRBIDataDetailRequest.Month,
                    SearchText = getRBIDataDetailRequest.SearchText,
                    IsActive = getRBIDataDetailRequest.IsActive,
                    PageNumber = getRBIDataDetailRequest.PageNumber,
                    PageSize = Convert.ToInt32(getRBIDataDetailRequest.PageSize),
                    IsPagingRequired = (getRBIDataDetailRequest.PageNumber != null) ? true : false,
                    OrderBy = getRBIDataDetailRequest.OrderBy,
                    OrderByDirection = getRBIDataDetailRequest.OrderByDirection
                };
                var rBIDataDetails = iRBIDataDetail.GetRBIDataDetail(rBIDataDetail);

                var rBIDataDetailList = new List<GetRBIDataDetailResponse>();
                foreach (var rBIDataDetailDetail in rBIDataDetails)
                {
                    rBIDataDetailList.Add(new GetRBIDataDetailResponse()
                    {
                        RBIDataDetailId = Convert.ToInt32(rBIDataDetailDetail.RBIDataDetailId),
                        RBIDataId = Convert.ToInt32(rBIDataDetailDetail.RBIDataId),
                        Month = rBIDataDetailDetail.Month,
                        Year = rBIDataDetailDetail.Year,
                        Excel = rBIDataDetailDetail.Excel,
                        PDF = rBIDataDetailDetail.PDF,
                        IsActive = Convert.ToBoolean(rBIDataDetailDetail.IsActive),
                        CreatedBy = rBIDataDetailDetail.CreatedBy,
                        TotalPageCount = rBIDataDetailDetail.TotalPageCount,
                        TotalRecord = rBIDataDetailDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "RBIDataDetail retrieved successfully";
                responses.Response = rBIDataDetailList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving rbidatadetail.";

                Utility.WriteLog("GetRBIDataDetail", getRBIDataDetailRequest, "Error while retrieving rbidatadetail. (RBIDataDetailUserController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpGet]
        [Route("rbidatadetailyears")]
        [ResponseType(typeof(List<int>))]
        public IHttpActionResult GetRBIDataDetailYear()
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var lstRBIDataDetailYearYear = Utility.GetYear().Where(x => x >= 2000 && x <= DateTime.Now.Year).OrderByDescending(x => x).ToList();

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "RBIDataDetailYear retrieved successfully";
                responses.Response = lstRBIDataDetailYearYear;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving RBIDataDetailYear.";

                Utility.WriteLog("GetRBIDataDetailYear", null, "Error while retrieving RBIDataDetailYear. (RBIDataDetailUserController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
