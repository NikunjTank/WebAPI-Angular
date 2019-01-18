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
    public class IndexAmendmentAdminController : ApiController
    {
        private IIndexAmendment iIndexAmendment;
        public IndexAmendmentAdminController()
        {
            try
            {
                iIndexAmendment = new IndexAmendmentRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("IndexAmendmentAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("indexamendments")]
        [ResponseType(typeof(List<GetIndexAmendmentResponse>))]
        public IHttpActionResult GetIndexAmendment([FromUri]GetIndexAmendmentRequest getIndexAmendmentRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getIndexAmendmentRequest == null)
                    getIndexAmendmentRequest = new GetIndexAmendmentRequest();

                if (getIndexAmendmentRequest.PageSize == null)
                    getIndexAmendmentRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var indexAmendment = new IndexAmendment()
                {
                    IndexAmendmentId = getIndexAmendmentRequest.IndexAmendmentId,
                    RegulationId = getIndexAmendmentRequest.RegulationId,
                    SearchText = getIndexAmendmentRequest.SearchText,
                    IsActive = getIndexAmendmentRequest.IsActive,
                    PageNumber = getIndexAmendmentRequest.PageNumber,
                    PageSize = Convert.ToInt32(getIndexAmendmentRequest.PageSize),
                    IsPagingRequired = (getIndexAmendmentRequest.PageNumber != null) ? true : false,
                    OrderBy = getIndexAmendmentRequest.OrderBy,
                    OrderByDirection = getIndexAmendmentRequest.OrderByDirection
                };
                var indexAmendments = iIndexAmendment.GetIndexAmendment(indexAmendment);

                var indexAmendmentList = new List<GetIndexAmendmentResponse>();
                foreach (var indexAmendmentDetail in indexAmendments)
                {
                    indexAmendmentList.Add(new GetIndexAmendmentResponse()
                    {
                        IndexAmendmentId = indexAmendmentDetail.IndexAmendmentId,
                        RegulationId = indexAmendmentDetail.RegulationId,
                        NotificationIds = indexAmendmentDetail.NotificationIds,
                        Notifications = indexAmendmentDetail.Notifications,
                        RegulationName = indexAmendmentDetail.RegulationName,
                        RegulationNumber = indexAmendmentDetail.RegulationNumber,
                        IndexId = indexAmendmentDetail.IndexId,
                        IndexNo = indexAmendmentDetail.IndexNo,
                        IndexName = indexAmendmentDetail.IndexName,
                        SubIndexId = indexAmendmentDetail.SubIndexId,
                        SubIndexNumber = indexAmendmentDetail.SubIndexNumber,
                        SubIndexName = indexAmendmentDetail.SubIndexName,
                        IndexAmendmentContent = indexAmendmentDetail.IndexAmendmentContent,
                        IsActive = Convert.ToBoolean(indexAmendmentDetail.IsActive),
                        CreatedBy = indexAmendmentDetail.CreatedBy,
                        TotalPageCount = indexAmendmentDetail.TotalPageCount,
                        TotalRecord = indexAmendmentDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "IndexAmendment retrieved successfully";
                responses.Response = indexAmendmentList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving index amendment.";

                Utility.WriteLog("GetIndexAmendment", getIndexAmendmentRequest, "Error while retrieving index amendment. (IndexAmendmentAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("indexamendments/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddIndexAmendment(AddIndexAmendmentRequest addIndexAmendmentRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var indexAmendment = new IndexAmendment()
                {
                    RegulationId = addIndexAmendmentRequest.RegulationId,
                    NotificationIds = addIndexAmendmentRequest.NotificationIds,
                    IndexId = addIndexAmendmentRequest.IndexId,
                    SubIndexId = addIndexAmendmentRequest.SubIndexId,
                    IndexAmendmentContent = addIndexAmendmentRequest.IndexAmendmentContent
                };
                int result = iIndexAmendment.AddIndexAmendment(indexAmendment);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "IndexAmendment added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "IndexAmendment alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding index amendment.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding index amendment.";

                Utility.WriteLog("AddIndexAmendment", addIndexAmendmentRequest, "Error while adding index amendment. (IndexAmendmentAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("indexamendments/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateIndexAmendment(UpdateIndexAmendmentRequest updateIndexAmendmentRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var indexAmendment = new IndexAmendment()
                {
                    IndexAmendmentId = updateIndexAmendmentRequest.IndexAmendmentId,
                    RegulationId = updateIndexAmendmentRequest.RegulationId,
                    NotificationIds = updateIndexAmendmentRequest.NotificationIds,
                    IndexId = updateIndexAmendmentRequest.IndexId,
                    SubIndexId = updateIndexAmendmentRequest.SubIndexId,
                    IndexAmendmentContent = updateIndexAmendmentRequest.IndexAmendmentContent,
                    ModifiedBy = Utility.UserId
                };
                int result = iIndexAmendment.UpdateIndexAmendment(indexAmendment);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "IndexAmendment updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "IndexAmendment already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "IndexAmendment doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating index amendment.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating index amendment.";

                Utility.WriteLog("UpdateIndexAmendment", updateIndexAmendmentRequest, "Error while updating index amendment. (IndexAmendmentAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("indexamendments/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteIndexAmendment(DeleteIndexAmendmentRequest deleteIndexAmendmentRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var indexAmendment = new IndexAmendment()
                {
                    IndexAmendmentId = deleteIndexAmendmentRequest.IndexAmendmentId,
                    ModifiedBy = Utility.UserId
                };

                int result = iIndexAmendment.DeleteIndexAmendment(indexAmendment);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "IndexAmendment deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "IndexAmendment doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting index amendment.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting index amendment.";

                Utility.WriteLog("DeleteIndexAmendment", deleteIndexAmendmentRequest, "Error while deleting index amendment. (IndexAmendmentAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
