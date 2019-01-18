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
    public class RBIFAQOfFEMASubModuleDetailUserController : ApiController
    {
        private IFEMASubModuleDetail iFEMASubModuleDetail;

        public RBIFAQOfFEMASubModuleDetailUserController()
        {
            try
            {
                iFEMASubModuleDetail = new FEMASubModuleDetailRepository();
                
            }
            catch (Exception ex)
            {
                Utility.WriteLog("RBIFAQOfFEMASubModuleDetailUserController (User)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("rbifaqoffemasubmoduledetails")]
        [ResponseType(typeof(List<GetRBIFAQOfFEMASubModuleDetailResponse>))]
        public IHttpActionResult GetRBIFAQOfFEMASubModuleDetail([FromUri]GetRBIFAQOfFEMASubModuleDetailRequest getRBIFAQOfFEMASubModuleDetailRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getRBIFAQOfFEMASubModuleDetailRequest == null)
                    getRBIFAQOfFEMASubModuleDetailRequest = new GetRBIFAQOfFEMASubModuleDetailRequest();

                if (getRBIFAQOfFEMASubModuleDetailRequest.PageSize == null)
                    getRBIFAQOfFEMASubModuleDetailRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var rBIFAQOfFEMASubModuleDetail = new RBIFAQOfFEMASubModuleDetail()
                {
                    FEMASubModuleOfModuleId = getRBIFAQOfFEMASubModuleDetailRequest.FEMASubModuleOfModuleId,
                    SearchText = getRBIFAQOfFEMASubModuleDetailRequest.SearchText,
                    IsActive = getRBIFAQOfFEMASubModuleDetailRequest.IsActive,
                    PageNumber = getRBIFAQOfFEMASubModuleDetailRequest.PageNumber,
                    PageSize = Convert.ToInt32(getRBIFAQOfFEMASubModuleDetailRequest.PageSize),
                    IsPagingRequired = (getRBIFAQOfFEMASubModuleDetailRequest.PageNumber != null) ? true : false,
                    OrderBy = getRBIFAQOfFEMASubModuleDetailRequest.OrderBy,
                    OrderByDirection = getRBIFAQOfFEMASubModuleDetailRequest.OrderByDirection
                };
                var rBIFAQOfFEMASubModuleDetails = iFEMASubModuleDetail.GetRBIFAQOfFEMASubModuleDetail(rBIFAQOfFEMASubModuleDetail);

                var rBIFAQOfFEMASubModuleDetailList = new List<GetRBIFAQOfFEMASubModuleDetailResponse>();
                foreach (var rBIFAQOfFEMASubModuleDetailItem in rBIFAQOfFEMASubModuleDetails)
                {
                    rBIFAQOfFEMASubModuleDetailList.Add(new GetRBIFAQOfFEMASubModuleDetailResponse()
                    {
                        FAQId = rBIFAQOfFEMASubModuleDetailItem.FAQId,
                        CategoryId = Convert.ToInt32(rBIFAQOfFEMASubModuleDetailItem.CategoryId),
                        CategoryName = rBIFAQOfFEMASubModuleDetailItem.CategoryName,
                        TopicName = rBIFAQOfFEMASubModuleDetailItem.TopicName,
                        PDF = rBIFAQOfFEMASubModuleDetailItem.PDF,
                        IsActive = Convert.ToBoolean(rBIFAQOfFEMASubModuleDetailItem.IsActive),
                        CreatedBy = rBIFAQOfFEMASubModuleDetailItem.CreatedBy,
                        TotalPageCount = rBIFAQOfFEMASubModuleDetailItem.TotalPageCount,
                        TotalRecord = rBIFAQOfFEMASubModuleDetailItem.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "RBIFAQOfFEMASubModuleDetail retrieved successfully";
                responses.Response = rBIFAQOfFEMASubModuleDetailList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving RBIFAQOfFEMASubModuleDetail.";

                Utility.WriteLog("GetRBIFAQOfFEMASubModuleDetail", getRBIFAQOfFEMASubModuleDetailRequest, "Error while retrieving RBIFAQOfFEMASubModuleDetail. (RBIFAQOfFEMASubModuleDetailUserController)", ex.ToString());
            }
            return Ok(responses);
        }
        
    }
}
