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
    public class PenaltyDetailUserController : ApiController
    {
        private IPenaltyDetail iPenaltyDetail;
        public PenaltyDetailUserController()
        {
            try
            {
                iPenaltyDetail = new PenaltyDetailRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("PenaltyDetailUserController (User)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("penaltydetails")]
        [ResponseType(typeof(List<GetPenaltyDetailResponse>))]
        public IHttpActionResult GetPenaltyDetail([FromUri]GetPenaltyDetailRequest getPenaltyDetailRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getPenaltyDetailRequest == null)
                    getPenaltyDetailRequest = new GetPenaltyDetailRequest();

                if (getPenaltyDetailRequest.PageSize == null)
                    getPenaltyDetailRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var penaltyDetail = new PenaltyDetail()
                {
                    PenaltyDetailId = getPenaltyDetailRequest.PenaltyDetailId,
                    CalculatorID = getPenaltyDetailRequest.CalculatorID,
                    CalculatorSubTopicID = getPenaltyDetailRequest.CalculatorSubTopicID,
                    SearchText = getPenaltyDetailRequest.SearchText,
                    IsActive = getPenaltyDetailRequest.IsActive,
                    PageNumber = getPenaltyDetailRequest.PageNumber,
                    PageSize = Convert.ToInt32(getPenaltyDetailRequest.PageSize),
                    IsPagingRequired = (getPenaltyDetailRequest.PageNumber != null) ? true : false,
                    OrderBy = getPenaltyDetailRequest.OrderBy,
                    OrderByDirection = getPenaltyDetailRequest.OrderByDirection
                };
                var penaltyDetails = iPenaltyDetail.GetPenaltyDetail(penaltyDetail);

                var penaltyDetailList = new List<GetPenaltyDetailResponse>();
                foreach (var penaltyDetailItem in penaltyDetails)
                {
                    penaltyDetailList.Add(new GetPenaltyDetailResponse()
                    {
                        PenaltyDetailId = penaltyDetailItem.PenaltyDetailId,
                        FEMAModuleId = penaltyDetailItem.FEMAModuleId,
                        CalculatorID = penaltyDetailItem.CalculatorID,
                        CalculatorName = penaltyDetailItem.CalculatorName,
                        CalculatorSubTopicID = penaltyDetailItem.CalculatorSubTopicID,
                        CalculatorSubTopicName = penaltyDetailItem.CalculatorSubTopicName,
                        IsFixedPenalty = (penaltyDetailItem.IsFixedPenalty),
                        Range = penaltyDetailItem.Range,
                        Amount = penaltyDetailItem.Amount,
                        RangeAfter07November2017 = penaltyDetailItem.RangeAfter07November2017,
                        AmountAfter07November2017 = penaltyDetailItem.AmountAfter07November2017,
                        ExtraPenaltyRange = penaltyDetailItem.ExtraPenaltyRange,
                        IsActive = Convert.ToBoolean(penaltyDetailItem.IsActive),
                        CreatedBy = penaltyDetailItem.CreatedBy,
                        TotalPageCount = penaltyDetailItem.TotalPageCount,
                        TotalRecord = penaltyDetailItem.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "PenaltyDetail retrieved successfully";
                responses.Response = penaltyDetailList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving PenaltyDetail.";

                Utility.WriteLog("GetPenaltyDetail", getPenaltyDetailRequest, "Error while retrieving PenaltyDetail. (PenaltyDetailUserController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
