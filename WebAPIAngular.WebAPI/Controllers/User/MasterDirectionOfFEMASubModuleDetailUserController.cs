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
    public class MasterDirectionOfFEMASubModuleDetailUserController : ApiController
    {
        private IFEMASubModuleDetail iFEMASubModuleDetail;
        private IMasterDirectionChapter iMasterDirectionChapter;
        private IMasterDirectionIndex iMasterDirectionIndex;
        private IMasterDirectionSubIndex iMasterDirectionSubIndex;
        private IMasterDirectionIndexAmendment iMasterDirectionIndexAmendment;
        private IMasterDirectionFAQ iMasterDirectionFAQ;

        public MasterDirectionOfFEMASubModuleDetailUserController()
        {
            try
            {
                iFEMASubModuleDetail = new FEMASubModuleDetailRepository();
                iMasterDirectionChapter = new MasterDirectionChapterRepository();
                iMasterDirectionIndex = new MasterDirectionIndexRepository();
                iMasterDirectionSubIndex = new MasterDirectionSubIndexRepository();
                iMasterDirectionIndexAmendment = new MasterDirectionIndexAmendmentRepository();
                iMasterDirectionFAQ = new MasterDirectionFAQRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("MasterDirectionOfFEMASubModuleDetailUserController (User)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("masterdirectionoffemasubmoduledetails")]
        [ResponseType(typeof(List<GetMasterDirectionOfFEMASubModuleDetailResponse>))]
        public IHttpActionResult GetMasterDirectionOfFEMASubModuleDetail([FromUri]GetMasterDirectionOfFEMASubModuleDetailRequest getMasterDirectionOfFEMASubModuleDetailRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getMasterDirectionOfFEMASubModuleDetailRequest == null)
                    getMasterDirectionOfFEMASubModuleDetailRequest = new GetMasterDirectionOfFEMASubModuleDetailRequest();

                if (getMasterDirectionOfFEMASubModuleDetailRequest.PageSize == null)
                    getMasterDirectionOfFEMASubModuleDetailRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var masterDirectionOfFEMASubModuleDetail = new MasterDirectionOfFEMASubModuleDetail()
                {
                    FEMASubModuleOfModuleId = getMasterDirectionOfFEMASubModuleDetailRequest.FEMASubModuleOfModuleId,
                    SearchText = getMasterDirectionOfFEMASubModuleDetailRequest.SearchText,
                    IsActive = getMasterDirectionOfFEMASubModuleDetailRequest.IsActive,
                    PageNumber = getMasterDirectionOfFEMASubModuleDetailRequest.PageNumber,
                    PageSize = Convert.ToInt32(getMasterDirectionOfFEMASubModuleDetailRequest.PageSize),
                    IsPagingRequired = (getMasterDirectionOfFEMASubModuleDetailRequest.PageNumber != null) ? true : false,
                    OrderBy = getMasterDirectionOfFEMASubModuleDetailRequest.OrderBy,
                    OrderByDirection = getMasterDirectionOfFEMASubModuleDetailRequest.OrderByDirection
                };
                var masterDirectionOfFEMASubModuleDetails = iFEMASubModuleDetail.GetMasterDirectionOfFEMASubModuleDetail(masterDirectionOfFEMASubModuleDetail);

                var masterDirectionOfFEMASubModuleDetailList = new List<GetMasterDirectionOfFEMASubModuleDetailResponse>();
                foreach (var masterDirectionOfFEMASubModuleDetailItem in masterDirectionOfFEMASubModuleDetails)
                {
                    masterDirectionOfFEMASubModuleDetailList.Add(new GetMasterDirectionOfFEMASubModuleDetailResponse()
                    {
                        MasterDirectionId = masterDirectionOfFEMASubModuleDetailItem.MasterDirectionId,
                        MasterDirectionName = masterDirectionOfFEMASubModuleDetailItem.MasterDirectionName,
                        Year = masterDirectionOfFEMASubModuleDetailItem.Year,
                        PDF = masterDirectionOfFEMASubModuleDetailItem.PDF,
                        IsActive = Convert.ToBoolean(masterDirectionOfFEMASubModuleDetailItem.IsActive),
                        CreatedBy = masterDirectionOfFEMASubModuleDetailItem.CreatedBy,
                        TotalPageCount = masterDirectionOfFEMASubModuleDetailItem.TotalPageCount,
                        TotalRecord = masterDirectionOfFEMASubModuleDetailItem.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "MasterDirectionOfFEMASubModuleDetail retrieved successfully";
                responses.Response = masterDirectionOfFEMASubModuleDetailList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving MasterDirectionOfFEMASubModuleDetail.";

                Utility.WriteLog("GetMasterDirectionOfFEMASubModuleDetail", getMasterDirectionOfFEMASubModuleDetailRequest, "Error while retrieving MasterDirectionOfFEMASubModuleDetail. (MasterDirectionOfFEMASubModuleDetailUserController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpGet]
        [Route("masterdirectionchapters")]
        [ResponseType(typeof(List<GetMasterDirectionChapterResponse>))]
        public IHttpActionResult GetMasterDirectionChapter([FromUri]GetMasterDirectionChapterRequest getMasterDirectionChapterRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getMasterDirectionChapterRequest == null)
                    getMasterDirectionChapterRequest = new GetMasterDirectionChapterRequest();

                if (getMasterDirectionChapterRequest.PageSize == null)
                    getMasterDirectionChapterRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var masterDirectionChapter = new MasterDirectionChapter()
                {
                    MasterDirectionChapterId = getMasterDirectionChapterRequest.MasterDirectionChapterId,
                    MasterDirectionId = getMasterDirectionChapterRequest.MasterDirectionId,
                    SearchText = getMasterDirectionChapterRequest.SearchText,
                    IsActive = getMasterDirectionChapterRequest.IsActive,
                    PageNumber = getMasterDirectionChapterRequest.PageNumber,
                    PageSize = Convert.ToInt32(getMasterDirectionChapterRequest.PageSize),
                    IsPagingRequired = (getMasterDirectionChapterRequest.PageNumber != null) ? true : false,
                    OrderBy = getMasterDirectionChapterRequest.OrderBy,
                    OrderByDirection = getMasterDirectionChapterRequest.OrderByDirection
                };
                var masterDirectionChapters = iMasterDirectionChapter.GetMasterDirectionChapter(masterDirectionChapter).OrderBy(x => x.SortId).ToList();

                var masterDirectionChapterList = new List<GetMasterDirectionChapterResponse>();
                foreach (var masterDirectionChapterDetail in masterDirectionChapters)
                {
                    masterDirectionChapterList.Add(new GetMasterDirectionChapterResponse()
                    {
                        MasterDirectionId = Convert.ToInt32(masterDirectionChapterDetail.MasterDirectionId),
                        MasterDirectionChapterId = Convert.ToInt32(masterDirectionChapterDetail.MasterDirectionChapterId),
                        Chapter = masterDirectionChapterDetail.Chapter,
                        SortId = masterDirectionChapterDetail.SortId,
                        IsActive = Convert.ToBoolean(masterDirectionChapterDetail.IsActive),
                        CreatedBy = masterDirectionChapterDetail.CreatedBy,
                        TotalPageCount = masterDirectionChapterDetail.TotalPageCount,
                        TotalRecord = masterDirectionChapterDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "MasterDirectionChapter retrieved successfully";
                responses.Response = masterDirectionChapterList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving MasterDirectionChapter.";

                Utility.WriteLog("GetMasterDirectionChapter", getMasterDirectionChapterRequest, "Error while retrieving MasterDirectionChapter. (MasterDirectionOfFEMASubModuleDetailUserController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpGet]
        [Route("masterdirectionindexes")]
        [ResponseType(typeof(List<GetMasterDirectionIndexResponse>))]
        public IHttpActionResult GetMasterDirectionIndex([FromUri]GetMasterDirectionIndexRequest getMasterDirectionIndexRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getMasterDirectionIndexRequest == null)
                    getMasterDirectionIndexRequest = new GetMasterDirectionIndexRequest();

                if (getMasterDirectionIndexRequest.PageSize == null)
                    getMasterDirectionIndexRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var masterDirectionIndex = new MasterDirectionIndex()
                {
                    MasterDirectionIndexId = getMasterDirectionIndexRequest.MasterDirectionIndexId,
                    MasterDirectionId = getMasterDirectionIndexRequest.MasterDirectionId,
                    MasterDirectionChapterId = getMasterDirectionIndexRequest.MasterDirectionChapterId,
                    SearchText = getMasterDirectionIndexRequest.SearchText,
                    IsActive = getMasterDirectionIndexRequest.IsActive,
                    PageNumber = getMasterDirectionIndexRequest.PageNumber,
                    PageSize = Convert.ToInt32(getMasterDirectionIndexRequest.PageSize),
                    IsPagingRequired = (getMasterDirectionIndexRequest.PageNumber != null) ? true : false,
                    OrderBy = getMasterDirectionIndexRequest.OrderBy,
                    OrderByDirection = getMasterDirectionIndexRequest.OrderByDirection
                };
                var masterDirectionIndexes = iMasterDirectionIndex.GetMasterDirectionIndex(masterDirectionIndex).OrderBy(x => x.SortId).ToList();

                var masterDirectionIndexList = new List<GetMasterDirectionIndexResponse>();
                foreach (var masterDirectionIndexDetail in masterDirectionIndexes)
                {
                    masterDirectionIndexList.Add(new GetMasterDirectionIndexResponse()
                    {
                        MasterDirectionIndexId = Convert.ToInt32(masterDirectionIndexDetail.MasterDirectionIndexId),
                        MasterDirectionChapterId = Convert.ToInt32(masterDirectionIndexDetail.MasterDirectionChapterId),
                        IndexNo = masterDirectionIndexDetail.IndexNo,
                        IndexName = masterDirectionIndexDetail.IndexName,
                        IndexContent = masterDirectionIndexDetail.IndexContent,
                        SortId = masterDirectionIndexDetail.SortId,
                        IsActive = Convert.ToBoolean(masterDirectionIndexDetail.IsActive),
                        CreatedBy = masterDirectionIndexDetail.CreatedBy,
                        TotalPageCount = masterDirectionIndexDetail.TotalPageCount,
                        TotalRecord = masterDirectionIndexDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "MasterDirectionIndex retrieved successfully";
                responses.Response = masterDirectionIndexList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving MasterDirectionIndex.";

                Utility.WriteLog("GetMasterDirectionIndex", getMasterDirectionIndexRequest, "Error while retrieving MasterDirectionIndex. (MasterDirectionOfFEMASubModuleDetailUserController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpGet]
        [Route("masterdirectionsubindexes")]
        [ResponseType(typeof(List<GetMasterDirectionSubIndexResponse>))]
        public IHttpActionResult GetMasterDirectionSubIndex([FromUri]GetMasterDirectionSubIndexRequest getMasterDirectionSubIndexRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getMasterDirectionSubIndexRequest == null)
                    getMasterDirectionSubIndexRequest = new GetMasterDirectionSubIndexRequest();

                if (getMasterDirectionSubIndexRequest.PageSize == null)
                    getMasterDirectionSubIndexRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var masterDirectionSubIndex = new MasterDirectionSubIndex()
                {
                    MasterDirectionSubIndexId = getMasterDirectionSubIndexRequest.MasterDirectionSubIndexId,
                    MasterDirectionId = getMasterDirectionSubIndexRequest.MasterDirectionId,
                    MasterDirectionIndexId = getMasterDirectionSubIndexRequest.MasterDirectionIndexId,
                    SearchText = getMasterDirectionSubIndexRequest.SearchText,
                    IsActive = getMasterDirectionSubIndexRequest.IsActive,
                    PageNumber = getMasterDirectionSubIndexRequest.PageNumber,
                    PageSize = Convert.ToInt32(getMasterDirectionSubIndexRequest.PageSize),
                    IsPagingRequired = (getMasterDirectionSubIndexRequest.PageNumber != null) ? true : false,
                    OrderBy = getMasterDirectionSubIndexRequest.OrderBy,
                    OrderByDirection = getMasterDirectionSubIndexRequest.OrderByDirection
                };
                var masterDirectionSubIndexes = iMasterDirectionSubIndex.GetMasterDirectionSubIndex(masterDirectionSubIndex).OrderBy(x => x.SortId).ToList();

                var masterDirectionSubIndexList = new List<GetMasterDirectionSubIndexResponse>();
                foreach (var masterDirectionSubIndexDetail in masterDirectionSubIndexes)
                {
                    masterDirectionSubIndexList.Add(new GetMasterDirectionSubIndexResponse()
                    {
                        MasterDirectionSubIndexId = Convert.ToInt32(masterDirectionSubIndexDetail.MasterDirectionSubIndexId),
                        MasterDirectionIndexId = Convert.ToInt32(masterDirectionSubIndexDetail.MasterDirectionIndexId),
                        SubIndexNo = masterDirectionSubIndexDetail.SubIndexNo,
                        SubIndexName = masterDirectionSubIndexDetail.SubIndexName,
                        SubIndexContent = masterDirectionSubIndexDetail.SubIndexContent,
                        SortId = masterDirectionSubIndexDetail.SortId,
                        IsActive = Convert.ToBoolean(masterDirectionSubIndexDetail.IsActive),
                        CreatedBy = masterDirectionSubIndexDetail.CreatedBy,
                        TotalPageCount = masterDirectionSubIndexDetail.TotalPageCount,
                        TotalRecord = masterDirectionSubIndexDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "MasterDirectionSubIndex retrieved successfully";
                responses.Response = masterDirectionSubIndexList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving MasterDirectionSubIndex.";

                Utility.WriteLog("GetMasterDirectionSubIndex", getMasterDirectionSubIndexRequest, "Error while retrieving MasterDirectionSubIndex. (MasterDirectionOfFEMASubModuleDetailUserController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpGet]
        [Route("masterdirectionindexamendments")]
        [ResponseType(typeof(List<GetMasterDirectionIndexAmendmentResponse>))]
        public IHttpActionResult GetMasterDirectionIndexAmendment([FromUri]GetMasterDirectionIndexAmendmentRequest getMasterDirectionIndexAmendmentRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getMasterDirectionIndexAmendmentRequest == null)
                    getMasterDirectionIndexAmendmentRequest = new GetMasterDirectionIndexAmendmentRequest();

                if (getMasterDirectionIndexAmendmentRequest.PageSize == null)
                    getMasterDirectionIndexAmendmentRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var masterDirectionIndexAmendment = new MasterDirectionIndexAmendment()
                {
                    MasterDirectionIndexAmendmentId = getMasterDirectionIndexAmendmentRequest.MasterDirectionIndexAmendmentId,
                    MasterDirectionId = getMasterDirectionIndexAmendmentRequest.MasterDirectionId,
                    SearchText = getMasterDirectionIndexAmendmentRequest.SearchText,
                    IsActive = getMasterDirectionIndexAmendmentRequest.IsActive,
                    PageNumber = getMasterDirectionIndexAmendmentRequest.PageNumber,
                    PageSize = Convert.ToInt32(getMasterDirectionIndexAmendmentRequest.PageSize),
                    IsPagingRequired = (getMasterDirectionIndexAmendmentRequest.PageNumber != null) ? true : false,
                    OrderBy = getMasterDirectionIndexAmendmentRequest.OrderBy,
                    OrderByDirection = getMasterDirectionIndexAmendmentRequest.OrderByDirection
                };
                var masterDirectionIndexAmendments = iMasterDirectionIndexAmendment.GetMasterDirectionIndexAmendment(masterDirectionIndexAmendment);

                var masterDirectionIndexAmendmentList = new List<GetMasterDirectionIndexAmendmentResponse>();
                foreach (var masterDirectionIndexAmendmentDetail in masterDirectionIndexAmendments)
                {
                    masterDirectionIndexAmendmentList.Add(new GetMasterDirectionIndexAmendmentResponse()
                    {
                        MasterDirectionIndexAmendmentId = masterDirectionIndexAmendmentDetail.MasterDirectionIndexAmendmentId,
                        MasterDirectionId = masterDirectionIndexAmendmentDetail.MasterDirectionId,
                        APDIRCircularIds = masterDirectionIndexAmendmentDetail.APDIRCircularIds,
                        APDIRCirculars = masterDirectionIndexAmendmentDetail.APDIRCirculars,
                        NotificationIds = masterDirectionIndexAmendmentDetail.NotificationIds,
                        Notifications = masterDirectionIndexAmendmentDetail.Notifications,
                        MasterDirectionChapterId = masterDirectionIndexAmendmentDetail.MasterDirectionChapterId,
                        Chapter = masterDirectionIndexAmendmentDetail.Chapter,
                        MasterDirectionIndexId = masterDirectionIndexAmendmentDetail.MasterDirectionIndexId,
                        IndexNo = masterDirectionIndexAmendmentDetail.IndexNo,
                        IndexName = masterDirectionIndexAmendmentDetail.IndexName,
                        MasterDirectionSubIndexId = masterDirectionIndexAmendmentDetail.MasterDirectionSubIndexId,
                        SubIndexNo = masterDirectionIndexAmendmentDetail.SubIndexNo,
                        SubIndexName = masterDirectionIndexAmendmentDetail.SubIndexName,
                        IndexAmendmentContent = masterDirectionIndexAmendmentDetail.IndexAmendmentContent,
                        Year = masterDirectionIndexAmendmentDetail.Year,
                        UpdatedInsertedByRBI = masterDirectionIndexAmendmentDetail.UpdatedInsertedByRBI,
                        UpdatedInsertedDateByRBI = masterDirectionIndexAmendmentDetail.UpdatedInsertedDateByRBI,
                        IsActive = Convert.ToBoolean(masterDirectionIndexAmendmentDetail.IsActive),
                        CreatedBy = masterDirectionIndexAmendmentDetail.CreatedBy,
                        TotalPageCount = masterDirectionIndexAmendmentDetail.TotalPageCount,
                        TotalRecord = masterDirectionIndexAmendmentDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "MasterDirectionIndexAmendment retrieved successfully";
                responses.Response = masterDirectionIndexAmendmentList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving MasterDirectionIndexAmendment.";

                Utility.WriteLog("GetMasterDirectionIndexAmendment", getMasterDirectionIndexAmendmentRequest, "Error while retrieving MasterDirectionIndexAmendment. (MasterDirectionOfFEMASubModuleDetailUserController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpGet]
        [Route("masterdirectionfaqs")]
        [ResponseType(typeof(List<GetMasterDirectionFAQResponse>))]
        public IHttpActionResult GetMasterDirectionFAQ([FromUri]GetMasterDirectionFAQRequest getMasterDirectionFAQRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getMasterDirectionFAQRequest == null)
                    getMasterDirectionFAQRequest = new GetMasterDirectionFAQRequest();

                if (getMasterDirectionFAQRequest.PageSize == null)
                    getMasterDirectionFAQRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var masterDirectionFAQ = new MasterDirectionFAQ()
                {
                    MasterDirectionFAQId = getMasterDirectionFAQRequest.MasterDirectionFAQId,
                    MasterDirectionId = getMasterDirectionFAQRequest.MasterDirectionId,
                    SearchText = getMasterDirectionFAQRequest.SearchText,
                    IsActive = getMasterDirectionFAQRequest.IsActive,
                    PageNumber = getMasterDirectionFAQRequest.PageNumber,
                    PageSize = Convert.ToInt32(getMasterDirectionFAQRequest.PageSize),
                    IsPagingRequired = (getMasterDirectionFAQRequest.PageNumber != null) ? true : false,
                    OrderBy = getMasterDirectionFAQRequest.OrderBy,
                    OrderByDirection = getMasterDirectionFAQRequest.OrderByDirection
                };
                var masterDirectionFAQs = iMasterDirectionFAQ.GetMasterDirectionFAQ(masterDirectionFAQ);

                var masterDirectionFAQList = new List<GetMasterDirectionFAQResponse>();
                foreach (var masterDirectionFAQDetail in masterDirectionFAQs)
                {
                    masterDirectionFAQList.Add(new GetMasterDirectionFAQResponse()
                    {
                        MasterDirectionFAQId = Convert.ToInt32(masterDirectionFAQDetail.MasterDirectionFAQId),
                        MasterDirectionId = Convert.ToInt32(masterDirectionFAQDetail.MasterDirectionId),
                        FAQId = masterDirectionFAQDetail.FAQId,
                        TopicName = masterDirectionFAQDetail.TopicName,
                        CategoryName = masterDirectionFAQDetail.CategoryName,
                        PDF = masterDirectionFAQDetail.PDF,
                        IsActive = Convert.ToBoolean(masterDirectionFAQDetail.IsActive),
                        CreatedBy = masterDirectionFAQDetail.CreatedBy,
                        TotalPageCount = masterDirectionFAQDetail.TotalPageCount,
                        TotalRecord = masterDirectionFAQDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "MasterDirectionFAQ retrieved successfully";
                responses.Response = masterDirectionFAQList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving MasterDirectionFAQ.";

                Utility.WriteLog("GetMasterDirectionFAQ", getMasterDirectionFAQRequest, "Error while retrieving MasterDirectionFAQ. (MasterDirectionOfFEMASubModuleDetailUserController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
