using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using DemystifyFema.Service.Repository;
using System.Web.Http.Description;
using System.Configuration;

namespace DemystifyFema.Service.Controllers.User
{
    [Authorize(Roles = "User")]
    [RoutePrefix("user/api")]
    public class MasterCircularOfFEMASubModuleDetailUserController : ApiController
    {
        private IFEMASubModuleDetail iFEMASubModuleDetail;
        private IMasterCircularDetail iMasterCircularDetail;

        public MasterCircularOfFEMASubModuleDetailUserController()
        {
            try
            {
                iFEMASubModuleDetail = new FEMASubModuleDetailRepository();
                iMasterCircularDetail = new MasterCircularDetailRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("MasterCircularOfFEMASubModuleDetailUserController (User)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("mastercircularoffemasubmoduledetails")]
        [ResponseType(typeof(List<GetMasterCircularOfFEMASubModuleDetailResponse>))]
        public IHttpActionResult GetMasterCircularOfFEMASubModuleDetail([FromUri]GetMasterCircularOfFEMASubModuleDetailRequest getMasterCircularOfFEMASubModuleDetailRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getMasterCircularOfFEMASubModuleDetailRequest == null)
                    getMasterCircularOfFEMASubModuleDetailRequest = new GetMasterCircularOfFEMASubModuleDetailRequest();

                if (getMasterCircularOfFEMASubModuleDetailRequest.PageSize == null)
                    getMasterCircularOfFEMASubModuleDetailRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var masterCircularOfFEMASubModuleDetail = new MasterCircularOfFEMASubModuleDetail()
                {
                    FEMASubModuleOfModuleId = getMasterCircularOfFEMASubModuleDetailRequest.FEMASubModuleOfModuleId,
                    SearchText = getMasterCircularOfFEMASubModuleDetailRequest.SearchText,
                    IsActive = getMasterCircularOfFEMASubModuleDetailRequest.IsActive,
                    PageNumber = getMasterCircularOfFEMASubModuleDetailRequest.PageNumber,
                    PageSize = Convert.ToInt32(getMasterCircularOfFEMASubModuleDetailRequest.PageSize),
                    IsPagingRequired = (getMasterCircularOfFEMASubModuleDetailRequest.PageNumber != null) ? true : false,
                    OrderBy = getMasterCircularOfFEMASubModuleDetailRequest.OrderBy,
                    OrderByDirection = getMasterCircularOfFEMASubModuleDetailRequest.OrderByDirection
                };
                var masterCircularOfFEMASubModuleDetails = iFEMASubModuleDetail.GetMasterCircularOfFEMASubModuleDetail(masterCircularOfFEMASubModuleDetail);

                var masterCircularOfFEMASubModuleDetailList = new List<GetMasterCircularOfFEMASubModuleDetailResponse>();
                foreach (var masterCircularOfFEMASubModuleDetailItem in masterCircularOfFEMASubModuleDetails)
                {
                    masterCircularOfFEMASubModuleDetailList.Add(new GetMasterCircularOfFEMASubModuleDetailResponse()
                    {
                        MasterCircularId = masterCircularOfFEMASubModuleDetailItem.MasterCircularId,
                        MasterCircularName = masterCircularOfFEMASubModuleDetailItem.MasterCircularName,
                        IsActive = Convert.ToBoolean(masterCircularOfFEMASubModuleDetailItem.IsActive),
                        CreatedBy = masterCircularOfFEMASubModuleDetailItem.CreatedBy,
                        TotalPageCount = masterCircularOfFEMASubModuleDetailItem.TotalPageCount,
                        TotalRecord = masterCircularOfFEMASubModuleDetailItem.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "MasterCircularOfFEMASubModuleDetail retrieved successfully";
                responses.Response = masterCircularOfFEMASubModuleDetailList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving MasterCircularOfFEMASubModuleDetail.";

                Utility.WriteLog("GetMasterCircularOfFEMASubModuleDetail", getMasterCircularOfFEMASubModuleDetailRequest, "Error while retrieving MasterCircularOfFEMASubModuleDetail. (MasterCircularOfFEMASubModuleDetailUserController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpGet]
        [Route("mastercirculardetails")]
        [ResponseType(typeof(List<GetMasterCircularDetailResponse>))]
        public IHttpActionResult GetMasterCircularDetail([FromUri]GetMasterCircularDetailRequest getMasterCircularDetailRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getMasterCircularDetailRequest == null)
                    getMasterCircularDetailRequest = new GetMasterCircularDetailRequest();

                if (getMasterCircularDetailRequest.PageSize == null)
                    getMasterCircularDetailRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var masterCircularDetail = new MasterCircularDetail()
                {
                    MasterCircularDetailId = getMasterCircularDetailRequest.MasterCircularDetailId,
                    MasterCircularId = getMasterCircularDetailRequest.MasterCircularId,
                    Year = getMasterCircularDetailRequest.Year,
                    SearchText = getMasterCircularDetailRequest.SearchText,
                    IsActive = getMasterCircularDetailRequest.IsActive,
                    PageNumber = getMasterCircularDetailRequest.PageNumber,
                    PageSize = Convert.ToInt32(getMasterCircularDetailRequest.PageSize),
                    IsPagingRequired = (getMasterCircularDetailRequest.PageNumber != null) ? true : false,
                    OrderBy = getMasterCircularDetailRequest.OrderBy,
                    OrderByDirection = getMasterCircularDetailRequest.OrderByDirection
                };
                var masterCircularDetails = iMasterCircularDetail.GetMasterCircularDetail(masterCircularDetail);

                var masterCircularDetailList = new List<GetMasterCircularDetailResponse>();
                foreach (var masterCircularDetailItem in masterCircularDetails)
                {
                    masterCircularDetailList.Add(new GetMasterCircularDetailResponse()
                    {
                        MasterCircularDetailId = masterCircularDetailItem.MasterCircularDetailId,
                        MasterCircularId = masterCircularDetailItem.MasterCircularId,
                        Year = masterCircularDetailItem.Year,
                        PDF = masterCircularDetailItem.PDF,
                        IsActive = Convert.ToBoolean(masterCircularDetailItem.IsActive),
                        CreatedBy = masterCircularDetailItem.CreatedBy,
                        TotalPageCount = masterCircularDetailItem.TotalPageCount,
                        TotalRecord = masterCircularDetailItem.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "MasterCircularDetail retrieved successfully";
                responses.Response = masterCircularDetailList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving masterCircularDetail.";

                Utility.WriteLog("GetMasterCircularDetail", getMasterCircularDetailRequest, "Error while retrieving masterCircularDetail. (MasterCircularOfFEMASubModuleDetailUserController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpGet]
        [Route("mastercirculardetailyears")]
        [ResponseType(typeof(List<int>))]
        public IHttpActionResult GetMasterCircularDetailYear()
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var lstMasterCircularDetailYear = Utility.GetYear().Where(x => x >= 1995 && x <= 2015).OrderByDescending(x => x).ToList();

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "MasterCircularDetailYear retrieved successfully";
                responses.Response = lstMasterCircularDetailYear;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving MasterCircularDetailYear.";

                Utility.WriteLog("GetMasterCircularDetailYear", null, "Error while retrieving MasterCircularDetailYear. (MasterCircularOfFEMASubModuleDetailUserController)", ex.ToString());
            }
            return Ok(responses);
        }

    }
}
