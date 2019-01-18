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
    public class FIPBReviewUserController : ApiController
    {
        private IFIPBReview iFIPBReview;
        public FIPBReviewUserController()
        {
            try
            {
                iFIPBReview = new FIPBReviewRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("FIPBReviewUserController (User)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("fipbreviews")]
        [ResponseType(typeof(List<GetFIPBReviewResponse>))]
        public IHttpActionResult GetFIPBReview([FromUri]GetFIPBReviewRequest getFIPBReviewRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getFIPBReviewRequest == null)
                    getFIPBReviewRequest = new GetFIPBReviewRequest();

                if (getFIPBReviewRequest.PageSize == null)
                    getFIPBReviewRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var fIPBReview = new FIPBReview()
                {
                    FIPBReviewId = getFIPBReviewRequest.FIPBReviewId,
                    SearchText = getFIPBReviewRequest.SearchText,
                    IsActive = getFIPBReviewRequest.IsActive,
                    PageNumber = getFIPBReviewRequest.PageNumber,
                    PageSize = Convert.ToInt32(getFIPBReviewRequest.PageSize),
                    IsPagingRequired = (getFIPBReviewRequest.PageNumber != null) ? true : false,
                    OrderBy = getFIPBReviewRequest.OrderBy,
                    OrderByDirection = getFIPBReviewRequest.OrderByDirection
                };
                var fIPBReviews = iFIPBReview.GetFIPBReview(fIPBReview);

                var fIPBReviewList = new List<GetFIPBReviewResponse>();
                foreach (var fIPBReviewDetail in fIPBReviews)
                {
                    fIPBReviewList.Add(new GetFIPBReviewResponse()
                    {
                        FIPBReviewId = Convert.ToInt32(fIPBReviewDetail.FIPBReviewId),
                        Name = fIPBReviewDetail.Name,
                        PDF = fIPBReviewDetail.PDF,
                        IsActive = Convert.ToBoolean(fIPBReviewDetail.IsActive),
                        CreatedBy = fIPBReviewDetail.CreatedBy,
                        TotalPageCount = fIPBReviewDetail.TotalPageCount,
                        TotalRecord = fIPBReviewDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "FIPBReview retrieved successfully";
                responses.Response = fIPBReviewList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving fIPBReview.";

                Utility.WriteLog("GetFIPBReview", getFIPBReviewRequest, "Error while retrieving fIPBReview. (FIPBReviewUserController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
