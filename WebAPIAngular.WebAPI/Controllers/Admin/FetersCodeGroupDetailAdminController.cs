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
    public class FetersCodeGroupDetailAdminController : ApiController
    {
        private IFetersCodeGroupDetail iFetersCodeGroupDetail;
        public FetersCodeGroupDetailAdminController()
        {
            try
            {
                iFetersCodeGroupDetail = new FetersCodeGroupDetailRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("FetersCodeGroupDetailAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("feterscodegroupdetails")]
        [ResponseType(typeof(List<GetFetersCodeGroupDetailResponse>))]
        public IHttpActionResult GetFetersCodeGroupDetail([FromUri]GetFetersCodeGroupDetailRequest getFetersCodeGroupDetailRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getFetersCodeGroupDetailRequest == null)
                    getFetersCodeGroupDetailRequest = new GetFetersCodeGroupDetailRequest();

                if (getFetersCodeGroupDetailRequest.PageSize == null)
                    getFetersCodeGroupDetailRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var fetersCodeGroupDetail = new FetersCodeGroupDetail()
                {
                    FetersCodeGroupDetailId = getFetersCodeGroupDetailRequest.FetersCodeGroupDetailId,
                    FetersCodeDetailId = getFetersCodeGroupDetailRequest.FetersCodeDetailId,
                    SearchText = getFetersCodeGroupDetailRequest.SearchText,
                    IsActive = getFetersCodeGroupDetailRequest.IsActive,
                    PageNumber = getFetersCodeGroupDetailRequest.PageNumber,
                    PageSize = Convert.ToInt32(getFetersCodeGroupDetailRequest.PageSize),
                    IsPagingRequired = (getFetersCodeGroupDetailRequest.PageNumber != null) ? true : false,
                    OrderBy = getFetersCodeGroupDetailRequest.OrderBy,
                    OrderByDirection = getFetersCodeGroupDetailRequest.OrderByDirection
                };
                var fetersCodeGroupDetails = iFetersCodeGroupDetail.GetFetersCodeGroupDetail(fetersCodeGroupDetail);

                var fetersCodeGroupDetailList = new List<GetFetersCodeGroupDetailResponse>();
                foreach (var fetersCodeGroupDetailDetail in fetersCodeGroupDetails)
                {
                    fetersCodeGroupDetailList.Add(new GetFetersCodeGroupDetailResponse()
                    {
                        FetersCodeGroupDetailId = Convert.ToInt32(fetersCodeGroupDetailDetail.FetersCodeGroupDetailId),
                        FetersCodeDetailId = fetersCodeGroupDetailDetail.FetersCodeDetailId,
                        PurposeCode = fetersCodeGroupDetailDetail.PurposeCode,
                        Description = fetersCodeGroupDetailDetail.Description,
                        IsActive = Convert.ToBoolean(fetersCodeGroupDetailDetail.IsActive),
                        CreatedBy = fetersCodeGroupDetailDetail.CreatedBy,
                        TotalPageCount = fetersCodeGroupDetailDetail.TotalPageCount,
                        TotalRecord = fetersCodeGroupDetailDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "FetersCodeGroupDetail retrieved successfully";
                responses.Response = fetersCodeGroupDetailList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving FetersCodeGroupDetail.";

                Utility.WriteLog("GetFetersCodeGroupDetail", getFetersCodeGroupDetailRequest, "Error while retrieving FetersCodeGroupDetail. (FetersCodeGroupDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("feterscodegroupdetails/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddFetersCodeGroupDetail(AddFetersCodeGroupDetailRequest addFetersCodeGroupDetailRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var fetersCodeGroupDetail = new FetersCodeGroupDetail()
                {
                    FetersCodeDetailId = addFetersCodeGroupDetailRequest.FetersCodeDetailId,
                    PurposeCode = addFetersCodeGroupDetailRequest.PurposeCode,
                    Description = addFetersCodeGroupDetailRequest.Description,
                    CreatedBy = Utility.UserId
                };
                int result = iFetersCodeGroupDetail.AddFetersCodeGroupDetail(fetersCodeGroupDetail);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "FetersCodeGroupDetail added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "FetersCodeGroupDetail alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding FetersCodeGroupDetail.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding FetersCodeGroupDetail.";

                Utility.WriteLog("AddFetersCodeGroupDetail", addFetersCodeGroupDetailRequest, "Error while adding FetersCodeGroupDetail. (FetersCodeGroupDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("feterscodegroupdetails/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateFetersCodeGroupDetail(UpdateFetersCodeGroupDetailRequest updateFetersCodeGroupDetailRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var fetersCodeGroupDetail = new FetersCodeGroupDetail()
                {
                    FetersCodeGroupDetailId = updateFetersCodeGroupDetailRequest.FetersCodeGroupDetailId,
                    FetersCodeDetailId = updateFetersCodeGroupDetailRequest.FetersCodeDetailId,
                    PurposeCode = updateFetersCodeGroupDetailRequest.PurposeCode,
                    Description = updateFetersCodeGroupDetailRequest.Description,
                    ModifiedBy = Utility.UserId
                };
                int result = iFetersCodeGroupDetail.UpdateFetersCodeGroupDetail(fetersCodeGroupDetail);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "FetersCodeGroupDetail updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FetersCodeGroupDetail already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FetersCodeGroupDetail doesn't exist.";
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
                responses.Description = "Error while updating FetersCodeGroupDetail.";

                Utility.WriteLog("UpdateFetersCodeGroupDetail", updateFetersCodeGroupDetailRequest, "Error while updating FetersCodeGroupDetail. (FetersCodeGroupDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("feterscodegroupdetails/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteFetersCodeGroupDetail(DeleteFetersCodeGroupDetailRequest deleteFetersCodeGroupDetailRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var fetersCodeGroupDetail = new FetersCodeGroupDetail()
                {
                    FetersCodeGroupDetailId = deleteFetersCodeGroupDetailRequest.FetersCodeGroupDetailId,
                    ModifiedBy = Utility.UserId
                };

                int result = iFetersCodeGroupDetail.DeleteFetersCodeGroupDetail(fetersCodeGroupDetail);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "FetersCodeGroupDetail deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FetersCodeGroupDetail doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting FetersCodeGroupDetail.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting FetersCodeGroupDetail.";

                Utility.WriteLog("DeleteFetersCodeGroupDetail", deleteFetersCodeGroupDetailRequest, "Error while deleting FetersCodeGroupDetail. (FetersCodeGroupDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
