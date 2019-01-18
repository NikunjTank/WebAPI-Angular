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
    public class FDICircularUserController : ApiController
    {
        private IFDICircular iFDICircular;
        private IFDIChapter iFDIChapter;
        private IFDICircularIndex iFDICircularIndex;
        private IFDICircularSubIndex iFDICircularSubIndex;
        private IFDICircularIndexAmendment iFDICircularIndexAmendment;
        public FDICircularUserController()
        {
            try
            {
                iFDICircular = new FDICircularRepository();
                iFDIChapter = new FDIChapterRepository();
                iFDICircularIndex = new FDICircularIndexRepository();
                iFDICircularSubIndex = new FDICircularSubIndexRepository();
                iFDICircularIndexAmendment = new FDICircularIndexAmendmentRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("FDICircularUserController (User)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("fdicirculars")]
        [ResponseType(typeof(List<GetFDICircularResponse>))]
        public IHttpActionResult GetFDICircular([FromUri]GetFDICircularRequest getFDICircularRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getFDICircularRequest == null)
                    getFDICircularRequest = new GetFDICircularRequest();

                if (getFDICircularRequest.PageSize == null)
                    getFDICircularRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var fDICircular = new FDICircular()
                {
                    FDICircularId = getFDICircularRequest.FDICircularId,
                    SearchText = getFDICircularRequest.SearchText,
                    IsActive = getFDICircularRequest.IsActive,
                    PageNumber = getFDICircularRequest.PageNumber,
                    PageSize = Convert.ToInt32(getFDICircularRequest.PageSize),
                    IsPagingRequired = (getFDICircularRequest.PageNumber != null) ? true : false,
                    OrderBy = getFDICircularRequest.OrderBy,
                    OrderByDirection = getFDICircularRequest.OrderByDirection
                };
                var fDICirculars = iFDICircular.GetFDICircular(fDICircular);

                var fDICircularList = new List<GetFDICircularResponse>();
                foreach (var fDICircularDetail in fDICirculars)
                {
                    fDICircularList.Add(new GetFDICircularResponse()
                    {
                        FDICircularId = Convert.ToInt32(fDICircularDetail.FDICircularId),
                        FDICircularName = fDICircularDetail.FDICircularName,
                        Year = fDICircularDetail.Year,
                        PDF = fDICircularDetail.PDF,
                        IsActive = Convert.ToBoolean(fDICircularDetail.IsActive),
                        CreatedBy = fDICircularDetail.CreatedBy,
                        TotalPageCount = fDICircularDetail.TotalPageCount,
                        TotalRecord = fDICircularDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "FDICircular retrieved successfully";
                responses.Response = fDICircularList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving FDICircular.";

                Utility.WriteLog("GetFDICircular", getFDICircularRequest, "Error while retrieving FDICircular. (FDICircularUserController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpGet]
        [Route("fdichapters")]
        [ResponseType(typeof(List<GetFDIChapterResponse>))]
        public IHttpActionResult GetFDIChapter([FromUri]GetFDIChapterRequest getFDIChapterRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getFDIChapterRequest == null)
                    getFDIChapterRequest = new GetFDIChapterRequest();

                if (getFDIChapterRequest.PageSize == null)
                    getFDIChapterRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var fDIChapter = new FDIChapter()
                {
                    FDIChapterId = getFDIChapterRequest.FDIChapterId,
                    FDICircularId = getFDIChapterRequest.FDICircularId,
                    SearchText = getFDIChapterRequest.SearchText,
                    IsActive = getFDIChapterRequest.IsActive,
                    PageNumber = getFDIChapterRequest.PageNumber,
                    PageSize = Convert.ToInt32(getFDIChapterRequest.PageSize),
                    IsPagingRequired = (getFDIChapterRequest.PageNumber != null) ? true : false,
                    OrderBy = getFDIChapterRequest.OrderBy,
                    OrderByDirection = getFDIChapterRequest.OrderByDirection
                };
                var fDIChapters = iFDIChapter.GetFDIChapter(fDIChapter).OrderBy(x => x.SortId).ToList();

                var fDIChapterList = new List<GetFDIChapterResponse>();
                foreach (var fDIChapterDetail in fDIChapters)
                {
                    fDIChapterList.Add(new GetFDIChapterResponse()
                    {
                        FDICircularId = Convert.ToInt32(fDIChapterDetail.FDICircularId),
                        FDIChapterId = Convert.ToInt32(fDIChapterDetail.FDIChapterId),
                        Chapter = fDIChapterDetail.Chapter,
                        SortId = fDIChapterDetail.SortId,
                        IsActive = Convert.ToBoolean(fDIChapterDetail.IsActive),
                        CreatedBy = fDIChapterDetail.CreatedBy,
                        TotalPageCount = fDIChapterDetail.TotalPageCount,
                        TotalRecord = fDIChapterDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "FDIChapter retrieved successfully";
                responses.Response = fDIChapterList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving FDIChapter.";

                Utility.WriteLog("GetFDIChapter", getFDIChapterRequest, "Error while retrieving FDIChapter. (FDICircularUserController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpGet]
        [Route("fdicircularindexes")]
        [ResponseType(typeof(List<GetFDICircularIndexResponse>))]
        public IHttpActionResult GetFDICircularIndex([FromUri]GetFDICircularIndexRequest getFDICircularIndexRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getFDICircularIndexRequest == null)
                    getFDICircularIndexRequest = new GetFDICircularIndexRequest();

                if (getFDICircularIndexRequest.PageSize == null)
                    getFDICircularIndexRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var fDICircularIndex = new FDICircularIndex()
                {
                    FDICircularIndexId = getFDICircularIndexRequest.FDICircularIndexId,
                    FDICircularId = getFDICircularIndexRequest.FDICircularId,
                    FDIChapterId = getFDICircularIndexRequest.FDIChapterId,
                    SearchText = getFDICircularIndexRequest.SearchText,
                    IsActive = getFDICircularIndexRequest.IsActive,
                    PageNumber = getFDICircularIndexRequest.PageNumber,
                    PageSize = Convert.ToInt32(getFDICircularIndexRequest.PageSize),
                    IsPagingRequired = (getFDICircularIndexRequest.PageNumber != null) ? true : false,
                    OrderBy = getFDICircularIndexRequest.OrderBy,
                    OrderByDirection = getFDICircularIndexRequest.OrderByDirection
                };
                var fDICircularIndexes = iFDICircularIndex.GetFDICircularIndex(fDICircularIndex).OrderBy(x => x.SortId).ToList();

                var fDICircularIndexList = new List<GetFDICircularIndexResponse>();
                foreach (var fDICircularIndexDetail in fDICircularIndexes)
                {
                    fDICircularIndexList.Add(new GetFDICircularIndexResponse()
                    {
                        FDICircularIndexId = Convert.ToInt32(fDICircularIndexDetail.FDICircularIndexId),
                        FDIChapterId = Convert.ToInt32(fDICircularIndexDetail.FDIChapterId),
                        IndexNo = fDICircularIndexDetail.IndexNo,
                        IndexName = fDICircularIndexDetail.IndexName,
                        IndexContent = fDICircularIndexDetail.IndexContent,
                        SortId = fDICircularIndexDetail.SortId,
                        IsActive = Convert.ToBoolean(fDICircularIndexDetail.IsActive),
                        CreatedBy = fDICircularIndexDetail.CreatedBy,
                        TotalPageCount = fDICircularIndexDetail.TotalPageCount,
                        TotalRecord = fDICircularIndexDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "FDICircularIndex retrieved successfully";
                responses.Response = fDICircularIndexList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving FDICircularIndex.";

                Utility.WriteLog("GetFDICircularIndex", getFDICircularIndexRequest, "Error while retrieving FDICircularIndex. (FDICircularUserController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpGet]
        [Route("fdicircularsubindexes")]
        [ResponseType(typeof(List<GetFDICircularSubIndexResponse>))]
        public IHttpActionResult GetFDICircularSubIndex([FromUri]GetFDICircularSubIndexRequest getFDICircularSubIndexRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getFDICircularSubIndexRequest == null)
                    getFDICircularSubIndexRequest = new GetFDICircularSubIndexRequest();

                if (getFDICircularSubIndexRequest.PageSize == null)
                    getFDICircularSubIndexRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var fDICircularSubIndex = new FDICircularSubIndex()
                {
                    FDICircularSubIndexId = getFDICircularSubIndexRequest.FDICircularSubIndexId,
                    FDICircularId = getFDICircularSubIndexRequest.FDICircularId,
                    FDICircularIndexId = getFDICircularSubIndexRequest.FDICircularIndexId,
                    SearchText = getFDICircularSubIndexRequest.SearchText,
                    IsActive = getFDICircularSubIndexRequest.IsActive,
                    PageNumber = getFDICircularSubIndexRequest.PageNumber,
                    PageSize = Convert.ToInt32(getFDICircularSubIndexRequest.PageSize),
                    IsPagingRequired = (getFDICircularSubIndexRequest.PageNumber != null) ? true : false,
                    OrderBy = getFDICircularSubIndexRequest.OrderBy,
                    OrderByDirection = getFDICircularSubIndexRequest.OrderByDirection
                };
                var fDICircularSubIndexes = iFDICircularSubIndex.GetFDICircularSubIndex(fDICircularSubIndex).OrderBy(x => x.SortId).ToList();

                var fDICircularSubIndexList = new List<GetFDICircularSubIndexResponse>();
                foreach (var fDICircularSubIndexDetail in fDICircularSubIndexes)
                {
                    fDICircularSubIndexList.Add(new GetFDICircularSubIndexResponse()
                    {
                        FDICircularSubIndexId = Convert.ToInt32(fDICircularSubIndexDetail.FDICircularSubIndexId),
                        FDICircularIndexId = Convert.ToInt32(fDICircularSubIndexDetail.FDICircularIndexId),
                        SubIndexNo = fDICircularSubIndexDetail.SubIndexNo,
                        SubIndexName = fDICircularSubIndexDetail.SubIndexName,
                        SubIndexContent = fDICircularSubIndexDetail.SubIndexContent,
                        SortId = fDICircularSubIndexDetail.SortId,
                        IsActive = Convert.ToBoolean(fDICircularSubIndexDetail.IsActive),
                        CreatedBy = fDICircularSubIndexDetail.CreatedBy,
                        TotalPageCount = fDICircularSubIndexDetail.TotalPageCount,
                        TotalRecord = fDICircularSubIndexDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "FDICircularSubIndex retrieved successfully";
                responses.Response = fDICircularSubIndexList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving FDICircularSubIndex.";

                Utility.WriteLog("GetFDICircularSubIndex", getFDICircularSubIndexRequest, "Error while retrieving FDICircularSubIndex. (FDICircularUserController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpGet]
        [Route("fdicircularindexamendments")]
        [ResponseType(typeof(List<GetFDICircularIndexAmendmentResponse>))]
        public IHttpActionResult GetFDICircularIndexAmendment([FromUri]GetFDICircularIndexAmendmentRequest getFDICircularIndexAmendmentRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getFDICircularIndexAmendmentRequest == null)
                    getFDICircularIndexAmendmentRequest = new GetFDICircularIndexAmendmentRequest();

                if (getFDICircularIndexAmendmentRequest.PageSize == null)
                    getFDICircularIndexAmendmentRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var fDICircularIndexAmendment = new FDICircularIndexAmendment()
                {
                    FDICircularIndexAmendmentId = getFDICircularIndexAmendmentRequest.FDICircularIndexAmendmentId,
                    FDICircularId = getFDICircularIndexAmendmentRequest.FDICircularId,
                    SearchText = getFDICircularIndexAmendmentRequest.SearchText,
                    IsActive = getFDICircularIndexAmendmentRequest.IsActive,
                    PageNumber = getFDICircularIndexAmendmentRequest.PageNumber,
                    PageSize = Convert.ToInt32(getFDICircularIndexAmendmentRequest.PageSize),
                    IsPagingRequired = (getFDICircularIndexAmendmentRequest.PageNumber != null) ? true : false,
                    OrderBy = getFDICircularIndexAmendmentRequest.OrderBy,
                    OrderByDirection = getFDICircularIndexAmendmentRequest.OrderByDirection
                };
                var fDICircularIndexAmendments = iFDICircularIndexAmendment.GetFDICircularIndexAmendment(fDICircularIndexAmendment);

                var fDICircularIndexAmendmentList = new List<GetFDICircularIndexAmendmentResponse>();
                foreach (var fDICircularIndexAmendmentDetail in fDICircularIndexAmendments)
                {
                    fDICircularIndexAmendmentList.Add(new GetFDICircularIndexAmendmentResponse()
                    {
                        FDICircularIndexAmendmentId = fDICircularIndexAmendmentDetail.FDICircularIndexAmendmentId,
                        FDICircularId = fDICircularIndexAmendmentDetail.FDICircularId,
                        PressNoteIds = fDICircularIndexAmendmentDetail.PressNoteIds,
                        PressNotes = fDICircularIndexAmendmentDetail.PressNotes,
                        FDIChapterId = fDICircularIndexAmendmentDetail.FDIChapterId,
                        Chapter = fDICircularIndexAmendmentDetail.Chapter,
                        FDICircularIndexId = fDICircularIndexAmendmentDetail.FDICircularIndexId,
                        IndexNo = fDICircularIndexAmendmentDetail.IndexNo,
                        FDICircularSubIndexId = fDICircularIndexAmendmentDetail.FDICircularSubIndexId,
                        SubIndexNo = fDICircularIndexAmendmentDetail.SubIndexNo,
                        IndexAmendmentContent = fDICircularIndexAmendmentDetail.IndexAmendmentContent,
                        Year = fDICircularIndexAmendmentDetail.Year,
                        IsActive = Convert.ToBoolean(fDICircularIndexAmendmentDetail.IsActive),
                        CreatedBy = fDICircularIndexAmendmentDetail.CreatedBy,
                        TotalPageCount = fDICircularIndexAmendmentDetail.TotalPageCount,
                        TotalRecord = fDICircularIndexAmendmentDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "FDICircularIndexAmendment retrieved successfully";
                responses.Response = fDICircularIndexAmendmentList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving FDICircularIndexAmendment.";

                Utility.WriteLog("GetFDICircularIndexAmendment", getFDICircularIndexAmendmentRequest, "Error while retrieving FDICircularIndexAmendment. (FDICircularUserController)", ex.ToString());
            }
            return Ok(responses);
        }

    }
}
