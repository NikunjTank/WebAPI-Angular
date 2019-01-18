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
    public class FetersCodeUserController : ApiController
    {
        private IFetersCode iFetersCode;
        private IFetersCodeDetail iFetersCodeDetail;
        private IFetersCodeGroupDetail iFetersCodeGroupDetail;
        public FetersCodeUserController()
        {
            try
            {
                iFetersCode = new FetersCodeRepository();
                iFetersCodeDetail = new FetersCodeDetailRepository();
                iFetersCodeGroupDetail = new FetersCodeGroupDetailRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("FetersCodeUserController (User)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("feterscodes")]
        [ResponseType(typeof(List<GetFetersCodeResponse>))]
        public IHttpActionResult GetFetersCode([FromUri]GetFetersCodeRequest getFetersCodeRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getFetersCodeRequest == null)
                    getFetersCodeRequest = new GetFetersCodeRequest();

                if (getFetersCodeRequest.PageSize == null)
                    getFetersCodeRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var fetersCode = new FetersCode()
                {
                    FetersCodeId = getFetersCodeRequest.FetersCodeId,
                    SearchText = getFetersCodeRequest.SearchText,
                    IsActive = getFetersCodeRequest.IsActive,
                    PageNumber = getFetersCodeRequest.PageNumber,
                    PageSize = Convert.ToInt32(getFetersCodeRequest.PageSize),
                    IsPagingRequired = (getFetersCodeRequest.PageNumber != null) ? true : false,
                    OrderBy = getFetersCodeRequest.OrderBy,
                    OrderByDirection = getFetersCodeRequest.OrderByDirection
                };
                var fetersCodes = iFetersCode.GetFetersCode(fetersCode);

                var fetersCodeList = new List<GetFetersCodeResponse>();
                foreach (var fetersCodeDetail in fetersCodes)
                {
                    fetersCodeList.Add(new GetFetersCodeResponse()
                    {
                        FetersCodeId = Convert.ToInt32(fetersCodeDetail.FetersCodeId),
                        FetersCodeName = fetersCodeDetail.FetersCodeName,
                        PDF = fetersCodeDetail.PDF,
                        IsActive = Convert.ToBoolean(fetersCodeDetail.IsActive),
                        CreatedBy = fetersCodeDetail.CreatedBy,
                        TotalPageCount = fetersCodeDetail.TotalPageCount,
                        TotalRecord = fetersCodeDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "FetersCode retrieved successfully";
                responses.Response = fetersCodeList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving fetersCode.";

                Utility.WriteLog("GetFetersCode", getFetersCodeRequest, "Error while retrieving fetersCode. (FetersCodeUserController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpGet]
        [Route("feterscodedetails")]
        [ResponseType(typeof(List<GetFetersCodeDetailResponse>))]
        public IHttpActionResult GetFetersCodeDetail([FromUri]GetFetersCodeDetailRequest getFetersCodeDetailRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getFetersCodeDetailRequest == null)
                    getFetersCodeDetailRequest = new GetFetersCodeDetailRequest();

                if (getFetersCodeDetailRequest.PageSize == null)
                    getFetersCodeDetailRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var fetersCodeDetail = new FetersCodeDetail()
                {
                    FetersCodeDetailId = getFetersCodeDetailRequest.FetersCodeDetailId,
                    FetersCodeId = getFetersCodeDetailRequest.FetersCodeId,
                    SearchText = getFetersCodeDetailRequest.SearchText,
                    IsActive = getFetersCodeDetailRequest.IsActive,
                    PageNumber = getFetersCodeDetailRequest.PageNumber,
                    PageSize = Convert.ToInt32(getFetersCodeDetailRequest.PageSize),
                    IsPagingRequired = (getFetersCodeDetailRequest.PageNumber != null) ? true : false,
                    OrderBy = getFetersCodeDetailRequest.OrderBy,
                    OrderByDirection = getFetersCodeDetailRequest.OrderByDirection
                };
                var fetersCodeDetails = iFetersCodeDetail.GetFetersCodeDetail(fetersCodeDetail);

                var fetersCodeDetailList = new List<GetFetersCodeDetailResponse>();
                foreach (var fetersCodeDetailDetail in fetersCodeDetails)
                {
                    fetersCodeDetailList.Add(new GetFetersCodeDetailResponse()
                    {
                        FetersCodeDetailId = Convert.ToInt32(fetersCodeDetailDetail.FetersCodeDetailId),
                        FetersCodeId = Convert.ToInt32(fetersCodeDetailDetail.FetersCodeId),
                        GroupNo = fetersCodeDetailDetail.GroupNo,
                        PurposeGroupName = fetersCodeDetailDetail.PurposeGroupName,
                        SerialNo = fetersCodeDetailDetail.SerialNo,
                        LRSItem = fetersCodeDetailDetail.LRSItem,
                        LRSFetersCode = fetersCodeDetailDetail.LRSFetersCode,
                        IsActive = Convert.ToBoolean(fetersCodeDetailDetail.IsActive),
                        CreatedBy = fetersCodeDetailDetail.CreatedBy,
                        TotalPageCount = fetersCodeDetailDetail.TotalPageCount,
                        TotalRecord = fetersCodeDetailDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "FetersCodeDetail retrieved successfully";
                responses.Response = fetersCodeDetailList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving FetersCodeDetail.";

                Utility.WriteLog("GetFetersCodeDetail", getFetersCodeDetailRequest, "Error while retrieving FetersCodeDetail. (FetersCodeUserController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpGet]
        [Route("feterscodegroupdetails")]
        [ResponseType(typeof(List<GetFetersCodeGroupDetailResponse>))]
        public IHttpActionResult GetFetersCodeGroupDetail([FromUri]GetFetersCodeGroupDetailRequest getFetersCodeGroupDetailRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getFetersCodeGroupDetailRequest == null)
                    getFetersCodeGroupDetailRequest = new GetFetersCodeGroupDetailRequest();

                if (getFetersCodeGroupDetailRequest.PageSize == null)
                    getFetersCodeGroupDetailRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var fetersCodeGroupDetail = new FetersCodeGroupDetail()
                {
                    FetersCodeGroupDetailId = getFetersCodeGroupDetailRequest.FetersCodeGroupDetailId,
                    FetersCodeDetailId = getFetersCodeGroupDetailRequest.FetersCodeDetailId,
                    SearchText = getFetersCodeGroupDetailRequest.SearchText,
                    IsActive = getFetersCodeGroupDetailRequest.IsActive,
                    PageNumber = getFetersCodeGroupDetailRequest.PageNumber,
                    PageSize = Convert.ToInt32(getFetersCodeGroupDetailRequest.PageSize),
                    IsPagingRequired = (getFetersCodeGroupDetailRequest.PageNumber != null) ? true : false,
                    OrderBy = getFetersCodeGroupDetailRequest.OrderBy,
                    OrderByDirection = getFetersCodeGroupDetailRequest.OrderByDirection
                };
                var fetersCodeGroupDetails = iFetersCodeGroupDetail.GetFetersCodeGroupDetail(fetersCodeGroupDetail);

                var fetersCodeGroupDetailList = new List<GetFetersCodeGroupDetailResponse>();
                foreach (var fetersCodeGroupDetailDetail in fetersCodeGroupDetails)
                {
                    fetersCodeGroupDetailList.Add(new GetFetersCodeGroupDetailResponse()
                    {
                        FetersCodeGroupDetailId = Convert.ToInt32(fetersCodeGroupDetailDetail.FetersCodeGroupDetailId),
                        FetersCodeDetailId = fetersCodeGroupDetailDetail.FetersCodeDetailId,
                        PurposeCode = fetersCodeGroupDetailDetail.PurposeCode,
                        Description = fetersCodeGroupDetailDetail.Description,
                        IsActive = Convert.ToBoolean(fetersCodeGroupDetailDetail.IsActive),
                        CreatedBy = fetersCodeGroupDetailDetail.CreatedBy,
                        TotalPageCount = fetersCodeGroupDetailDetail.TotalPageCount,
                        TotalRecord = fetersCodeGroupDetailDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "FetersCodeGroupDetail retrieved successfully";
                responses.Response = fetersCodeGroupDetailList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving FetersCodeGroupDetail.";

                Utility.WriteLog("GetFetersCodeGroupDetail", getFetersCodeGroupDetailRequest, "Error while retrieving FetersCodeGroupDetail. (FetersCodeGroupDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
