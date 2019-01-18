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
    public class RulesOfFEMASubModuleDetailUserController : ApiController
    {
        private IFEMASubModuleDetail iFEMASubModuleDetail;
        private IRulesIndex iRulesIndex;
        private IRulesSubIndex iRulesSubIndex;
        private IRulesIndexAmendment iRulesIndexAmendment;
        public RulesOfFEMASubModuleDetailUserController()
        {
            try
            {
                iFEMASubModuleDetail = new FEMASubModuleDetailRepository();
                iRulesIndex = new RulesIndexRepository();
                iRulesSubIndex = new RulesSubIndexRepository();
                iRulesIndexAmendment = new RulesIndexAmendmentRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("RulesOfFEMASubModuleDetailUserController (User)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("rulesoffemasubmoduledetails")]
        [ResponseType(typeof(List<GetRulesOfFEMASubModuleDetailResponse>))]
        public IHttpActionResult GetRulesOfFEMASubModuleDetail([FromUri]GetRulesOfFEMASubModuleDetailRequest getRulesOfFEMASubModuleDetailRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getRulesOfFEMASubModuleDetailRequest == null)
                    getRulesOfFEMASubModuleDetailRequest = new GetRulesOfFEMASubModuleDetailRequest();

                if (getRulesOfFEMASubModuleDetailRequest.PageSize == null)
                    getRulesOfFEMASubModuleDetailRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var rulesOfFEMASubModuleDetail = new RulesOfFEMASubModuleDetail()
                {
                    FEMASubModuleOfModuleId = getRulesOfFEMASubModuleDetailRequest.FEMASubModuleOfModuleId,
                    SearchText = getRulesOfFEMASubModuleDetailRequest.SearchText,
                    IsActive = getRulesOfFEMASubModuleDetailRequest.IsActive,
                    PageNumber = getRulesOfFEMASubModuleDetailRequest.PageNumber,
                    PageSize = Convert.ToInt32(getRulesOfFEMASubModuleDetailRequest.PageSize),
                    IsPagingRequired = (getRulesOfFEMASubModuleDetailRequest.PageNumber != null) ? true : false,
                    OrderBy = getRulesOfFEMASubModuleDetailRequest.OrderBy,
                    OrderByDirection = getRulesOfFEMASubModuleDetailRequest.OrderByDirection
                };
                var rulesOfFEMASubModuleDetails = iFEMASubModuleDetail.GetRulesOfFEMASubModuleDetail(rulesOfFEMASubModuleDetail);

                var rulesOfFEMASubModuleDetailList = new List<GetRulesOfFEMASubModuleDetailResponse>();
                foreach (var rulesOfFEMASubModuleDetailItem in rulesOfFEMASubModuleDetails)
                {
                    rulesOfFEMASubModuleDetailList.Add(new GetRulesOfFEMASubModuleDetailResponse()
                    {
                        RulesId = rulesOfFEMASubModuleDetailItem.RulesId,
                        RulesNumber = rulesOfFEMASubModuleDetailItem.RulesNumber,
                        RulesName = rulesOfFEMASubModuleDetailItem.RulesName,
                        Year = rulesOfFEMASubModuleDetailItem.Year,
                        PublicationDate = rulesOfFEMASubModuleDetailItem.PublicationDate,
                        IsActive = Convert.ToBoolean(rulesOfFEMASubModuleDetailItem.IsActive),
                        CreatedBy = rulesOfFEMASubModuleDetailItem.CreatedBy,
                        TotalPageCount = rulesOfFEMASubModuleDetailItem.TotalPageCount,
                        TotalRecord = rulesOfFEMASubModuleDetailItem.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "RulesOfFEMASubModuleDetail retrieved successfully";
                responses.Response = rulesOfFEMASubModuleDetailList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving RulesOfFEMASubModuleDetail.";

                Utility.WriteLog("GetRulesOfFEMASubModuleDetail", getRulesOfFEMASubModuleDetailRequest, "Error while retrieving RulesOfFEMASubModuleDetail. (RulesOfFEMASubModuleDetailUserController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpGet]
        [Route("rulesindexes")]
        [ResponseType(typeof(List<GetRulesIndexResponse>))]
        public IHttpActionResult GetRulesIndex([FromUri]GetRulesIndexRequest getRulesIndexRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getRulesIndexRequest == null)
                    getRulesIndexRequest = new GetRulesIndexRequest();

                if (getRulesIndexRequest.PageSize == null)
                    getRulesIndexRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var rulesIndex = new RulesIndex()
                {
                    IndexId = getRulesIndexRequest.IndexId,
                    RulesId = getRulesIndexRequest.RulesId,
                    SearchText = getRulesIndexRequest.SearchText,
                    IsActive = getRulesIndexRequest.IsActive,
                    PageNumber = getRulesIndexRequest.PageNumber,
                    PageSize = Convert.ToInt32(getRulesIndexRequest.PageSize),
                    IsPagingRequired = (getRulesIndexRequest.PageNumber != null) ? true : false,
                    OrderBy = getRulesIndexRequest.OrderBy,
                    OrderByDirection = getRulesIndexRequest.OrderByDirection
                };
                var rulesIndexes = iRulesIndex.GetRulesIndex(rulesIndex).OrderBy(x => x.SortId).ToList();

                var rulesIndexList = new List<GetRulesIndexResponse>();
                foreach (var rulesIndexDetail in rulesIndexes)
                {
                    rulesIndexList.Add(new GetRulesIndexResponse()
                    {
                        IndexId = Convert.ToInt32(rulesIndexDetail.IndexId),
                        RulesId = Convert.ToInt32(rulesIndexDetail.RulesId),
                        IndexNo = rulesIndexDetail.IndexNo,
                        IndexName = rulesIndexDetail.IndexName,
                        IndexContent = rulesIndexDetail.IndexContent,
                        SortId = rulesIndexDetail.SortId,
                        IsActive = Convert.ToBoolean(rulesIndexDetail.IsActive),
                        CreatedBy = rulesIndexDetail.CreatedBy,
                        TotalPageCount = rulesIndexDetail.TotalPageCount,
                        TotalRecord = rulesIndexDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "RulesIndex retrieved successfully";
                responses.Response = rulesIndexList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving RulesIndex.";

                Utility.WriteLog("GetRulesIndex", getRulesIndexRequest, "Error while retrieving RulesIndex. (RulesOfFEMASubModuleDetailUserController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpGet]
        [Route("rulessubindexes")]
        [ResponseType(typeof(List<GetRulesSubIndexResponse>))]
        public IHttpActionResult GetRulesSubIndex([FromUri]GetRulesSubIndexRequest getRulesSubIndexRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getRulesSubIndexRequest == null)
                    getRulesSubIndexRequest = new GetRulesSubIndexRequest();

                if (getRulesSubIndexRequest.PageSize == null)
                    getRulesSubIndexRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var rulesSubIndex = new RulesSubIndex()
                {
                    SubIndexId = getRulesSubIndexRequest.SubIndexId,
                    IndexId = getRulesSubIndexRequest.IndexId,
                    RulesId = getRulesSubIndexRequest.RulesId,
                    SearchText = getRulesSubIndexRequest.SearchText,
                    IsActive = getRulesSubIndexRequest.IsActive,
                    PageNumber = getRulesSubIndexRequest.PageNumber,
                    PageSize = Convert.ToInt32(getRulesSubIndexRequest.PageSize),
                    IsPagingRequired = (getRulesSubIndexRequest.PageNumber != null) ? true : false,
                    OrderBy = getRulesSubIndexRequest.OrderBy,
                    OrderByDirection = getRulesSubIndexRequest.OrderByDirection
                };
                var rulesSubIndexes = iRulesSubIndex.GetRulesSubIndex(rulesSubIndex).OrderBy(x => x.SortId).ToList();

                var rulesSubIndexList = new List<GetRulesSubIndexResponse>();
                foreach (var rulesSubIndexDetail in rulesSubIndexes)
                {
                    rulesSubIndexList.Add(new GetRulesSubIndexResponse()
                    {
                        SubIndexId = Convert.ToInt32(rulesSubIndexDetail.SubIndexId),
                        IndexId = Convert.ToInt32(rulesSubIndexDetail.IndexId),
                        SubIndexNo = rulesSubIndexDetail.SubIndexNo,
                        SubIndexName = rulesSubIndexDetail.SubIndexName,
                        SubIndexContent = rulesSubIndexDetail.SubIndexContent,
                        SortId = rulesSubIndexDetail.SortId,
                        IsActive = Convert.ToBoolean(rulesSubIndexDetail.IsActive),
                        CreatedBy = rulesSubIndexDetail.CreatedBy,
                        TotalPageCount = rulesSubIndexDetail.TotalPageCount,
                        TotalRecord = rulesSubIndexDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "RulesSubIndex retrieved successfully";
                responses.Response = rulesSubIndexList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving fema subindex.";

                Utility.WriteLog("GetRulesSubIndex", getRulesSubIndexRequest, "Error while retrieving fema subindex. (RulesOfFEMASubModuleDetailUserController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpGet]
        [Route("rulesindexamendments")]
        [ResponseType(typeof(List<GetRulesIndexAmendmentResponse>))]
        public IHttpActionResult GetRulesIndexAmendment([FromUri]GetRulesIndexAmendmentRequest getRulesIndexAmendmentRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getRulesIndexAmendmentRequest == null)
                    getRulesIndexAmendmentRequest = new GetRulesIndexAmendmentRequest();

                if (getRulesIndexAmendmentRequest.PageSize == null)
                    getRulesIndexAmendmentRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var rulesIndexAmendment = new RulesIndexAmendment()
                {
                    RulesIndexAmendmentId = getRulesIndexAmendmentRequest.RulesIndexAmendmentId,
                    RulesId = getRulesIndexAmendmentRequest.RulesId,
                    SearchText = getRulesIndexAmendmentRequest.SearchText,
                    IsActive = getRulesIndexAmendmentRequest.IsActive,
                    PageNumber = getRulesIndexAmendmentRequest.PageNumber,
                    PageSize = Convert.ToInt32(getRulesIndexAmendmentRequest.PageSize),
                    IsPagingRequired = (getRulesIndexAmendmentRequest.PageNumber != null) ? true : false,
                    OrderBy = getRulesIndexAmendmentRequest.OrderBy,
                    OrderByDirection = getRulesIndexAmendmentRequest.OrderByDirection
                };
                var rulesIndexAmendments = iRulesIndexAmendment.GetRulesIndexAmendment(rulesIndexAmendment);

                var rulesIndexAmendmentList = new List<GetRulesIndexAmendmentResponse>();
                foreach (var rulesIndexAmendmentDetail in rulesIndexAmendments)
                {
                    rulesIndexAmendmentList.Add(new GetRulesIndexAmendmentResponse()
                    {
                        RulesIndexAmendmentId = rulesIndexAmendmentDetail.RulesIndexAmendmentId,
                        RulesId = rulesIndexAmendmentDetail.RulesId,
                        GSRNotifications = rulesIndexAmendmentDetail.GSRNotifications,
                        IndexId = rulesIndexAmendmentDetail.IndexId,
                        IndexNo = rulesIndexAmendmentDetail.IndexNo,
                        IndexName = rulesIndexAmendmentDetail.IndexName,
                        SubIndexId = rulesIndexAmendmentDetail.SubIndexId,
                        SubIndexNo = rulesIndexAmendmentDetail.SubIndexNo,
                        SubIndexName = rulesIndexAmendmentDetail.SubIndexName,
                        IndexAmendmentContent = rulesIndexAmendmentDetail.IndexAmendmentContent,
                        IsActive = Convert.ToBoolean(rulesIndexAmendmentDetail.IsActive),
                        CreatedBy = rulesIndexAmendmentDetail.CreatedBy,
                        TotalPageCount = rulesIndexAmendmentDetail.TotalPageCount,
                        TotalRecord = rulesIndexAmendmentDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "RulesIndexAmendment retrieved successfully";
                responses.Response = rulesIndexAmendmentList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving index amendment.";

                Utility.WriteLog("GetRulesIndexAmendment", getRulesIndexAmendmentRequest, "Error while retrieving index amendment. (RulesOfFEMASubModuleDetailUserController)", ex.ToString());
            }
            return Ok(responses);
        }
    }


}
