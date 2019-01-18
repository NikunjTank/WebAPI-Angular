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

namespace DemystifyFema.Service.Controllers.Admin
{
    [Authorize(Roles = "Admin")]
    [RoutePrefix("admin/api")]
    public class RBICompoundingOrderAdminController : ApiController
    {
        private IRBICompoundingOrder iRBICompoundingOrder;
        public RBICompoundingOrderAdminController()
        {
            try
            {
                iRBICompoundingOrder = new RBICompoundingOrderRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("RBICompoundingOrderAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
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

                Utility.WriteLog("GetRBICompoundingOrder", getRBICompoundingOrderRequest, "Error while retrieving rbicompoundingorder. (RBICompoundingOrderAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        #region Upload Files
        [HttpPost]
        [Route("rbicompoundingorders/uploadfiles")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UploadFiles()
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var httpRequest = HttpContext.Current.Request;
                if (httpRequest.Files.Count <= 0)
                    return BadRequest(Utility.FILE_NOT_AVAILABLE);

                string fileName = string.Empty;

                var file = httpRequest.Files[0];
                fileName = DateTime.Now.ToString("ddMMyyyyhhmmssfff") + "_" + file.FileName;
                string fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["RBICompoundingOrderPDFPath"]), fileName);
                file.SaveAs(fileSavePath);

                if (!string.IsNullOrEmpty(fileName))
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "File uploaded successfully.";
                    responses.Response = fileName;
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while uploading file.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while uploading file.";

                Utility.WriteLog("UploadFile", null, "Error while uploading file. (RBICompoundingOrderAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
        #endregion

        [HttpPost]
        [Route("rbicompoundingorders/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddRBICompoundingOrder(AddRBICompoundingOrderRequest addRBICompoundingOrderRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var rBICompoundingOrder = new RBICompoundingOrder()
                {
                    ApplicantName = addRBICompoundingOrderRequest.ApplicantName,
                    OrderGist = addRBICompoundingOrderRequest.OrderGist,
                    Topic = addRBICompoundingOrderRequest.Topic,
                    FEMRegulationRuleNo = addRBICompoundingOrderRequest.FEMRegulationRuleNo,
                    OrderDate = addRBICompoundingOrderRequest.OrderDate,
                    PenaltyAmount = addRBICompoundingOrderRequest.PenaltyAmount,
                    Regional_CentralOfficeOfRBI = addRBICompoundingOrderRequest.Regional_CentralOfficeOfRBI,
                    PDF = addRBICompoundingOrderRequest.PDF,
                    CreatedBy = Utility.UserId
                };
                int result = iRBICompoundingOrder.AddRBICompoundingOrder(rBICompoundingOrder);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "RBICompoundingOrder added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "RBICompoundingOrder alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding rbicompoundingorder.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding rbicompoundingorder.";

                Utility.WriteLog("AddRBICompoundingOrder", addRBICompoundingOrderRequest, "Error while adding rbicompoundingorder. (RBICompoundingOrderAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("rbicompoundingorders/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateRBICompoundingOrder(UpdateRBICompoundingOrderRequest updateRBICompoundingOrderRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var rBICompoundingOrder = new RBICompoundingOrder()
                {
                    RBICompoundingOrderId = updateRBICompoundingOrderRequest.RBICompoundingOrderId,
                    ApplicantName = updateRBICompoundingOrderRequest.ApplicantName,
                    OrderGist = updateRBICompoundingOrderRequest.OrderGist,
                    Topic = updateRBICompoundingOrderRequest.Topic,
                    FEMRegulationRuleNo = updateRBICompoundingOrderRequest.FEMRegulationRuleNo,
                    OrderDate = updateRBICompoundingOrderRequest.OrderDate,
                    PenaltyAmount = updateRBICompoundingOrderRequest.PenaltyAmount,
                    Regional_CentralOfficeOfRBI = updateRBICompoundingOrderRequest.Regional_CentralOfficeOfRBI,
                    PDF = updateRBICompoundingOrderRequest.PDF,
                    ModifiedBy = Utility.UserId
                };
                int result = iRBICompoundingOrder.UpdateRBICompoundingOrder(rBICompoundingOrder);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "RBICompoundingOrder updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "RBICompoundingOrder already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "RBICompoundingOrder doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating rbicompoundingorder.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating admin profile.";

                Utility.WriteLog("UpdateRBICompoundingOrder", updateRBICompoundingOrderRequest, "Error while updating rbicompoundingorder. (RBICompoundingOrderAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("rbicompoundingorders/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteRBICompoundingOrder(DeleteRBICompoundingOrderRequest deleteRBICompoundingOrderRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var rBICompoundingOrder = new RBICompoundingOrder()
                {
                    RBICompoundingOrderId = deleteRBICompoundingOrderRequest.RBICompoundingOrderId,
                    ModifiedBy = Utility.UserId
                };

                int result = iRBICompoundingOrder.DeleteRBICompoundingOrder(rBICompoundingOrder);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "RBICompoundingOrder deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "RBICompoundingOrder doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting rbicompoundingorder.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting rbicompoundingorder.";

                Utility.WriteLog("DeleteRBICompoundingOrder", deleteRBICompoundingOrderRequest, "Error while deleting rbicompoundingorder. (RBICompoundingOrderAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
