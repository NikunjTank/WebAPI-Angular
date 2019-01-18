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
    public class RBICompoundingOrderUserController : ApiController
    {
        private IRBICompoundingOrder iRBICompoundingOrder;
        public RBICompoundingOrderUserController()
        {
            try
            {
                iRBICompoundingOrder = new RBICompoundingOrderRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("RBICompoundingOrderUserController (User)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("rbicompoundingorders")]
        [ResponseType(typeof(List<GetRBICompoundingOrderResponse>))]
        public IHttpActionResult GetRBICompoundingOrder([FromUri]GetRBICompoundingOrderRequest getRBICompoundingOrderRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getRBICompoundingOrderRequest == null)
                    getRBICompoundingOrderRequest = new GetRBICompoundingOrderRequest();

                if (getRBICompoundingOrderRequest.PageSize == null)
                    getRBICompoundingOrderRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var rBICompoundingOrder = new RBICompoundingOrder()
                {
                    RBICompoundingOrderId = getRBICompoundingOrderRequest.RBICompoundingOrderId,
                    SearchText = getRBICompoundingOrderRequest.SearchText,
                    IsActive = getRBICompoundingOrderRequest.IsActive,
                    PageNumber = getRBICompoundingOrderRequest.PageNumber,
                    PageSize = Convert.ToInt32(getRBICompoundingOrderRequest.PageSize),
                    IsPagingRequired = (getRBICompoundingOrderRequest.PageNumber != null) ? true : false,
                    OrderBy = getRBICompoundingOrderRequest.OrderBy,
                    OrderByDirection = getRBICompoundingOrderRequest.OrderByDirection
                };
                var rBICompoundingOrders = iRBICompoundingOrder.GetRBICompoundingOrder(rBICompoundingOrder);

                var rBICompoundingOrderList = new List<GetRBICompoundingOrderResponse>();
                foreach (var rBICompoundingOrderDetail in rBICompoundingOrders)
                {
                    rBICompoundingOrderList.Add(new GetRBICompoundingOrderResponse()
                    {
                        RBICompoundingOrderId = Convert.ToInt32(rBICompoundingOrderDetail.RBICompoundingOrderId),
                        ApplicantName = rBICompoundingOrderDetail.ApplicantName,
                        OrderGist = rBICompoundingOrderDetail.OrderGist,
                        Topic = rBICompoundingOrderDetail.Topic,
                        FEMRegulationRuleNo = rBICompoundingOrderDetail.FEMRegulationRuleNo,
                        OrderDate = rBICompoundingOrderDetail.OrderDate,
                        PenaltyAmount = rBICompoundingOrderDetail.PenaltyAmount,
                        Regional_CentralOfficeOfRBI = rBICompoundingOrderDetail.Regional_CentralOfficeOfRBI,
                        PDF = rBICompoundingOrderDetail.PDF,
                        IsActive = Convert.ToBoolean(rBICompoundingOrderDetail.IsActive),
                        CreatedBy = rBICompoundingOrderDetail.CreatedBy,
                        TotalPageCount = rBICompoundingOrderDetail.TotalPageCount,
                        TotalRecord = rBICompoundingOrderDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "RBICompoundingOrder retrieved successfully";
                responses.Response = rBICompoundingOrderList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving rbicompoundingorder.";

                Utility.WriteLog("GetRBICompoundingOrder", getRBICompoundingOrderRequest, "Error while retrieving rbicompoundingorder. (RBICompoundingOrderUserController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
