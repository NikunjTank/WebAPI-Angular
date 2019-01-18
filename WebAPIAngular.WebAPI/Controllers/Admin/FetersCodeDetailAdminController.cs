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

namespace DemystifyFema.Service.Controllers.Admin
{
    [Authorize(Roles = "Admin")]
    [RoutePrefix("admin/api")]
    public class FetersCodeDetailAdminController : ApiController
    {
        private IFetersCodeDetail iFetersCodeDetail;
        public FetersCodeDetailAdminController()
        {
            try
            {
                iFetersCodeDetail = new FetersCodeDetailRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("FetersCodeDetailAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("feterscodedetails")]
        [ResponseType(typeof(List<GetFetersCodeDetailResponse>))]
        public IHttpActionResult GetFetersCodeDetail([FromUri]GetFetersCodeDetailRequest getFetersCodeDetailRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getFetersCodeDetailRequest == null)
                    getFetersCodeDetailRequest = new GetFetersCodeDetailRequest();

                if (getFetersCodeDetailRequest.PageSize == null)
                    getFetersCodeDetailRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var fetersCodeDetail = new FetersCodeDetail()
                {
                    FetersCodeDetailId = getFetersCodeDetailRequest.FetersCodeDetailId,
                    FetersCodeId = getFetersCodeDetailRequest.FetersCodeId,
                    SearchText = getFetersCodeDetailRequest.SearchText,
                    IsActive = getFetersCodeDetailRequest.IsActive,
                    PageNumber = getFetersCodeDetailRequest.PageNumber,
                    PageSize = Convert.ToInt32(getFetersCodeDetailRequest.PageSize),
                    IsPagingRequired = (getFetersCodeDetailRequest.PageNumber != null) ? true : false,
                    OrderBy = getFetersCodeDetailRequest.OrderBy,
                    OrderByDirection = getFetersCodeDetailRequest.OrderByDirection
                };
                var fetersCodeDetails = iFetersCodeDetail.GetFetersCodeDetail(fetersCodeDetail);

                var fetersCodeDetailList = new List<GetFetersCodeDetailResponse>();
                foreach (var fetersCodeDetailDetail in fetersCodeDetails)
                {
                    fetersCodeDetailList.Add(new GetFetersCodeDetailResponse()
                    {
                        FetersCodeDetailId = Convert.ToInt32(fetersCodeDetailDetail.FetersCodeDetailId),
                        FetersCodeId = Convert.ToInt32(fetersCodeDetailDetail.FetersCodeId),
                        GroupNo = fetersCodeDetailDetail.GroupNo,
                        PurposeGroupName = fetersCodeDetailDetail.PurposeGroupName,
                        SerialNo = fetersCodeDetailDetail.SerialNo,
                        LRSItem = fetersCodeDetailDetail.LRSItem,
                        LRSFetersCode = fetersCodeDetailDetail.LRSFetersCode,
                        IsActive = Convert.ToBoolean(fetersCodeDetailDetail.IsActive),
                        CreatedBy = fetersCodeDetailDetail.CreatedBy,
                        TotalPageCount = fetersCodeDetailDetail.TotalPageCount,
                        TotalRecord = fetersCodeDetailDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "FetersCodeDetail retrieved successfully";
                responses.Response = fetersCodeDetailList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving FetersCodeDetail.";

                Utility.WriteLog("GetFetersCodeDetail", getFetersCodeDetailRequest, "Error while retrieving FetersCodeDetail. (FetersCodeDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("feterscodedetails/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddFetersCodeDetail(AddFetersCodeDetailRequest addFetersCodeDetailRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var fetersCodeDetail = new FetersCodeDetail()
                {
                    FetersCodeId = addFetersCodeDetailRequest.FetersCodeId,
                    GroupNo = addFetersCodeDetailRequest.GroupNo,
                    PurposeGroupName = addFetersCodeDetailRequest.PurposeGroupName,
                    LRSItem = addFetersCodeDetailRequest.LRSItem,
                    LRSFetersCode = addFetersCodeDetailRequest.LRSFetersCode,
                    CreatedBy = Utility.UserId
                };
                int result = iFetersCodeDetail.AddFetersCodeDetail(fetersCodeDetail);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "FetersCodeDetail added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "FetersCodeDetail alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding FetersCodeDetail.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding FetersCodeDetail.";

                Utility.WriteLog("AddFetersCodeDetail", addFetersCodeDetailRequest, "Error while adding FetersCodeDetail. (FetersCodeDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("feterscodedetails/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateFetersCodeDetail(UpdateFetersCodeDetailRequest updateFetersCodeDetailRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var fetersCodeDetail = new FetersCodeDetail()
                {
                    FetersCodeDetailId = updateFetersCodeDetailRequest.FetersCodeDetailId,
                    FetersCodeId = updateFetersCodeDetailRequest.FetersCodeId,
                    GroupNo = updateFetersCodeDetailRequest.GroupNo,
                    PurposeGroupName = updateFetersCodeDetailRequest.PurposeGroupName,
                    LRSItem = updateFetersCodeDetailRequest.LRSItem,
                    LRSFetersCode = updateFetersCodeDetailRequest.LRSFetersCode,
                    ModifiedBy = Utility.UserId
                };
                int result = iFetersCodeDetail.UpdateFetersCodeDetail(fetersCodeDetail);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "FetersCodeDetail updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FetersCodeDetail already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FetersCodeDetail doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating all definition.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating FetersCodeDetail.";

                Utility.WriteLog("UpdateFetersCodeDetail", updateFetersCodeDetailRequest, "Error while updating FetersCodeDetail. (FetersCodeDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("feterscodedetails/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteFetersCodeDetail(DeleteFetersCodeDetailRequest deleteFetersCodeDetailRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var fetersCodeDetail = new FetersCodeDetail()
                {
                    FetersCodeDetailId = deleteFetersCodeDetailRequest.FetersCodeDetailId,
                    ModifiedBy = Utility.UserId
                };

                int result = iFetersCodeDetail.DeleteFetersCodeDetail(fetersCodeDetail);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "FetersCodeDetail deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FetersCodeDetail doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting FetersCodeDetail.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting FetersCodeDetail.";

                Utility.WriteLog("DeleteFetersCodeDetail", deleteFetersCodeDetailRequest, "Error while deleting FetersCodeDetail. (FetersCodeDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
