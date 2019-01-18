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
    public class RegulationOfFEMASubModuleDetailUserController : ApiController
    {
        private IFEMASubModuleDetail iFEMASubModuleDetail;
        private IFemaIndex iFemaIndex;
        private IFemaSubIndex iFemaSubIndex;
        private IIndexAmendment iIndexAmendment;
        public RegulationOfFEMASubModuleDetailUserController()
        {
            try
            {
                iFEMASubModuleDetail = new FEMASubModuleDetailRepository();
                iFemaIndex = new FemaIndexRepository();
                iFemaSubIndex = new FemaSubIndexRepository();
                iIndexAmendment = new IndexAmendmentRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("FEMASubModuleDetailUserController (User)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("regulationoffemasubmoduledetails")]
        [ResponseType(typeof(List<GetRegulationOfFEMASubModuleDetailResponse>))]
        public IHttpActionResult GetRegulationOfFEMASubModuleDetail([FromUri]GetRegulationOfFEMASubModuleDetailRequest getRegulationOfFEMASubModuleDetailRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getRegulationOfFEMASubModuleDetailRequest == null)
                    getRegulationOfFEMASubModuleDetailRequest = new GetRegulationOfFEMASubModuleDetailRequest();

                if (getRegulationOfFEMASubModuleDetailRequest.PageSize == null)
                    getRegulationOfFEMASubModuleDetailRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var regulationOfFEMASubModuleDetail = new RegulationOfFEMASubModuleDetail()
                {
                    FEMASubModuleOfModuleId = getRegulationOfFEMASubModuleDetailRequest.FEMASubModuleOfModuleId,
                    SearchText = getRegulationOfFEMASubModuleDetailRequest.SearchText,
                    IsActive = getRegulationOfFEMASubModuleDetailRequest.IsActive,
                    PageNumber = getRegulationOfFEMASubModuleDetailRequest.PageNumber,
                    PageSize = Convert.ToInt32(getRegulationOfFEMASubModuleDetailRequest.PageSize),
                    IsPagingRequired = (getRegulationOfFEMASubModuleDetailRequest.PageNumber != null) ? true : false,
                    OrderBy = getRegulationOfFEMASubModuleDetailRequest.OrderBy,
                    OrderByDirection = getRegulationOfFEMASubModuleDetailRequest.OrderByDirection
                };
                var regulationOfFEMASubModuleDetails = iFEMASubModuleDetail.GetRegulationOfFEMASubModuleDetail(regulationOfFEMASubModuleDetail);

                var regulationOfFEMASubModuleDetailList = new List<GetRegulationOfFEMASubModuleDetailResponse>();
                foreach (var regulationOfFEMASubModuleDetailDetail in regulationOfFEMASubModuleDetails)
                {
                    regulationOfFEMASubModuleDetailList.Add(new GetRegulationOfFEMASubModuleDetailResponse()
                    {
                        RegulationId = regulationOfFEMASubModuleDetailDetail.RegulationId,
                        RegulationNumber = regulationOfFEMASubModuleDetailDetail.RegulationNumber,
                        RegulationName = regulationOfFEMASubModuleDetailDetail.RegulationName,
                        Year = regulationOfFEMASubModuleDetailDetail.Year,
                        PublicationDate = regulationOfFEMASubModuleDetailDetail.PublicationDate,
                        IsActive = Convert.ToBoolean(regulationOfFEMASubModuleDetailDetail.IsActive),
                        CreatedBy = regulationOfFEMASubModuleDetailDetail.CreatedBy,
                        TotalPageCount = regulationOfFEMASubModuleDetailDetail.TotalPageCount,
                        TotalRecord = regulationOfFEMASubModuleDetailDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "RegulationOfFEMASubModuleDetail retrieved successfully";
                responses.Response = regulationOfFEMASubModuleDetailList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving RegulationOfFEMASubModuleDetail.";

                Utility.WriteLog("GetRegulationOfFEMASubModuleDetail", getRegulationOfFEMASubModuleDetailRequest, "Error while retrieving RegulationOfFEMASubModuleDetail. (FEMASubModuleDetailUserController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpGet]
        [Route("femaindexes")]
        [ResponseType(typeof(List<GetFemaIndexResponse>))]
        public IHttpActionResult GetFemaIndex([FromUri]GetFemaIndexRequest getFemaIndexRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getFemaIndexRequest == null)
                    getFemaIndexRequest = new GetFemaIndexRequest();

                if (getFemaIndexRequest.PageSize == null)
                    getFemaIndexRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var femaIndex = new FemaIndex()
                {
                    IndexId = getFemaIndexRequest.IndexId,
                    RegulationId = getFemaIndexRequest.RegulationId,
                    SearchText = getFemaIndexRequest.SearchText,
                    IsActive = getFemaIndexRequest.IsActive,
                    PageNumber = getFemaIndexRequest.PageNumber,
                    PageSize = Convert.ToInt32(getFemaIndexRequest.PageSize),
                    IsPagingRequired = (getFemaIndexRequest.PageNumber != null) ? true : false,
                    OrderBy = getFemaIndexRequest.OrderBy,
                    OrderByDirection = getFemaIndexRequest.OrderByDirection
                };
                var femaIndexes = iFemaIndex.GetFemaIndex(femaIndex).OrderBy(x => x.SortId).ToList();

                var femaIndexList = new List<GetFemaIndexResponse>();
                foreach (var femaIndexDetail in femaIndexes)
                {
                    femaIndexList.Add(new GetFemaIndexResponse()
                    {
                        IndexId = Convert.ToInt32(femaIndexDetail.IndexId),
                        RegulationId = Convert.ToInt32(femaIndexDetail.RegulationId),
                        IndexNo = femaIndexDetail.IndexNo,
                        IndexName = femaIndexDetail.IndexName,
                        IndexContent = femaIndexDetail.IndexContent,
                        SortId = femaIndexDetail.SortId,
                        IsActive = Convert.ToBoolean(femaIndexDetail.IsActive),
                        CreatedBy = femaIndexDetail.CreatedBy,
                        TotalPageCount = femaIndexDetail.TotalPageCount,
                        TotalRecord = femaIndexDetail.TotalRecord
                    });
                }
                
                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "FemaIndex retrieved successfully";
                responses.Response = femaIndexList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving fema index.";

                Utility.WriteLog("GetFemaIndex", getFemaIndexRequest, "Error while retrieving fema index. (FEMASubModuleDetailUserController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpGet]
        [Route("femasubindexes")]
        [ResponseType(typeof(List<GetFemaSubIndexResponse>))]
        public IHttpActionResult GetFemaSubIndex([FromUri]GetFemaSubIndexRequest getFemaSubIndexRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getFemaSubIndexRequest == null)
                    getFemaSubIndexRequest = new GetFemaSubIndexRequest();

                if (getFemaSubIndexRequest.PageSize == null)
                    getFemaSubIndexRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var femaSubIndex = new FemaSubIndex()
                {
                    SubIndexId = getFemaSubIndexRequest.SubIndexId,
                    IndexId = getFemaSubIndexRequest.IndexId,
                    RegulationId = getFemaSubIndexRequest.RegulationId,
                    SearchText = getFemaSubIndexRequest.SearchText,
                    IsActive = getFemaSubIndexRequest.IsActive,
                    PageNumber = getFemaSubIndexRequest.PageNumber,
                    PageSize = Convert.ToInt32(getFemaSubIndexRequest.PageSize),
                    IsPagingRequired = (getFemaSubIndexRequest.PageNumber != null) ? true : false,
                    OrderBy = getFemaSubIndexRequest.OrderBy,
                    OrderByDirection = getFemaSubIndexRequest.OrderByDirection
                };
                var femaSubIndexes = iFemaSubIndex.GetFemaSubIndex(femaSubIndex).OrderBy(x => x.SortId).ToList();

                var femaSubIndexList = new List<GetFemaSubIndexResponse>();
                foreach (var femaSubIndexDetail in femaSubIndexes)
                {
                    femaSubIndexList.Add(new GetFemaSubIndexResponse()
                    {
                        SubIndexId = Convert.ToInt32(femaSubIndexDetail.SubIndexId),
                        IndexId = Convert.ToInt32(femaSubIndexDetail.IndexId),
                        SubIndexNo = femaSubIndexDetail.SubIndexNo,
                        SubIndexName = femaSubIndexDetail.SubIndexName,
                        SubIndexContent = femaSubIndexDetail.SubIndexContent,
                        SortId = femaSubIndexDetail.SortId,
                        IsActive = Convert.ToBoolean(femaSubIndexDetail.IsActive),
                        CreatedBy = femaSubIndexDetail.CreatedBy,
                        TotalPageCount = femaSubIndexDetail.TotalPageCount,
                        TotalRecord = femaSubIndexDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "FemaSubIndex retrieved successfully";
                responses.Response = femaSubIndexList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving fema subindex.";

                Utility.WriteLog("GetFemaSubIndex", getFemaSubIndexRequest, "Error while retrieving fema subindex. (FEMASubModuleDetailUserController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpGet]
        [Route("indexamendments")]
        [ResponseType(typeof(List<GetIndexAmendmentResponse>))]
        public IHttpActionResult GetIndexAmendment([FromUri]GetIndexAmendmentRequest getIndexAmendmentRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getIndexAmendmentRequest == null)
                    getIndexAmendmentRequest = new GetIndexAmendmentRequest();

                if (getIndexAmendmentRequest.PageSize == null)
                    getIndexAmendmentRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var indexAmendment = new IndexAmendment()
                {
                    IndexAmendmentId = getIndexAmendmentRequest.IndexAmendmentId,
                    RegulationId = getIndexAmendmentRequest.RegulationId,
                    SearchText = getIndexAmendmentRequest.SearchText,
                    IsActive = getIndexAmendmentRequest.IsActive,
                    PageNumber = getIndexAmendmentRequest.PageNumber,
                    PageSize = Convert.ToInt32(getIndexAmendmentRequest.PageSize),
                    IsPagingRequired = (getIndexAmendmentRequest.PageNumber != null) ? true : false,
                    OrderBy = getIndexAmendmentRequest.OrderBy,
                    OrderByDirection = getIndexAmendmentRequest.OrderByDirection
                };
                var indexAmendments = iIndexAmendment.GetIndexAmendment(indexAmendment);

                var indexAmendmentList = new List<GetIndexAmendmentResponse>();
                foreach (var indexAmendmentDetail in indexAmendments)
                {
                    indexAmendmentList.Add(new GetIndexAmendmentResponse()
                    {
                        IndexAmendmentId = indexAmendmentDetail.IndexAmendmentId,
                        RegulationId = indexAmendmentDetail.RegulationId,
                        NotificationIds = indexAmendmentDetail.NotificationIds,
                        Notifications = indexAmendmentDetail.Notifications,
                        RegulationName = indexAmendmentDetail.RegulationName,
                        RegulationNumber = indexAmendmentDetail.RegulationNumber,
                        IndexId = indexAmendmentDetail.IndexId,
                        IndexNo = indexAmendmentDetail.IndexNo,
                        IndexName = indexAmendmentDetail.IndexName,
                        SubIndexId = indexAmendmentDetail.SubIndexId,
                        SubIndexNumber = indexAmendmentDetail.SubIndexNumber,
                        SubIndexName = indexAmendmentDetail.SubIndexName,
                        IndexAmendmentContent = indexAmendmentDetail.IndexAmendmentContent,
                        IsActive = Convert.ToBoolean(indexAmendmentDetail.IsActive),
                        CreatedBy = indexAmendmentDetail.CreatedBy,
                        TotalPageCount = indexAmendmentDetail.TotalPageCount,
                        TotalRecord = indexAmendmentDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "IndexAmendment retrieved successfully";
                responses.Response = indexAmendmentList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving index amendment.";

                Utility.WriteLog("GetIndexAmendment", getIndexAmendmentRequest, "Error while retrieving index amendment. (FEMASubModuleDetailUserController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
