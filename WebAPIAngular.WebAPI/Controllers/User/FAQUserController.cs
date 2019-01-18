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
    public class FAQUserController : ApiController
    {
        private IFAQ iFAQ;
        public FAQUserController()
        {
            try
            {
                iFAQ = new FAQRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("FAQUserController (User)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("faqs")]
        [ResponseType(typeof(List<GetFAQResponse>))]
        public IHttpActionResult GetFAQ([FromUri]GetFAQRequest getFAQRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getFAQRequest == null)
                    getFAQRequest = new GetFAQRequest();

                if (getFAQRequest.PageSize == null)
                    getFAQRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var fAQ = new FAQ()
                {
                    FAQId = getFAQRequest.FAQId,
                    SearchText = getFAQRequest.SearchText,
                    IsActive = getFAQRequest.IsActive,
                    PageNumber = getFAQRequest.PageNumber,
                    PageSize = Convert.ToInt32(getFAQRequest.PageSize),
                    IsPagingRequired = (getFAQRequest.PageNumber != null) ? true : false,
                    OrderBy = getFAQRequest.OrderBy,
                    OrderByDirection = getFAQRequest.OrderByDirection
                };
                var fAQs = iFAQ.GetFAQ(fAQ);

                var fAQList = new List<GetFAQResponse>();
                foreach (var fAQDetail in fAQs)
                {
                    fAQList.Add(new GetFAQResponse()
                    {
                        FAQId = Convert.ToInt32(fAQDetail.FAQId),
                        CategoryId = Convert.ToInt32(fAQDetail.CategoryId),
                        CategoryName = fAQDetail.CategoryName,
                        TopicName = fAQDetail.TopicName,
                        PDF = fAQDetail.PDF,
                        IsActive = Convert.ToBoolean(fAQDetail.IsActive),
                        CreatedBy = fAQDetail.CreatedBy,
                        TotalPageCount = fAQDetail.TotalPageCount,
                        TotalRecord = fAQDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "FAQ retrieved successfully";
                responses.Response = fAQList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving FAQ.";

                Utility.WriteLog("GetFAQ", getFAQRequest, "Error while retrieving FAQ. (FAQUserController)", ex.ToString());
            }
            return Ok(responses);
        }

    }
}
