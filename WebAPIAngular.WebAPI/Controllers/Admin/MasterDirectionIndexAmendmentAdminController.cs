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
    public class MasterDirectionIndexAmendmentAdminController : ApiController
    {
        private IMasterDirectionIndexAmendment iMasterDirectionIndexAmendment;
        public MasterDirectionIndexAmendmentAdminController()
        {
            try
            {
                iMasterDirectionIndexAmendment = new MasterDirectionIndexAmendmentRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("MasterDirectionIndexAmendmentAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("masterdirectionindexamendments")]
        [ResponseType(typeof(List<GetMasterDirectionIndexAmendmentResponse>))]
        public IHttpActionResult GetMasterDirectionIndexAmendment([FromUri]GetMasterDirectionIndexAmendmentRequest getMasterDirectionIndexAmendmentRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getMasterDirectionIndexAmendmentRequest == null)
                    getMasterDirectionIndexAmendmentRequest = new GetMasterDirectionIndexAmendmentRequest();

                if (getMasterDirectionIndexAmendmentRequest.PageSize == null)
                    getMasterDirectionIndexAmendmentRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var masterDirectionIndexAmendment = new MasterDirectionIndexAmendment()
                {
                    MasterDirectionIndexAmendmentId = getMasterDirectionIndexAmendmentRequest.MasterDirectionIndexAmendmentId,
                    MasterDirectionId = getMasterDirectionIndexAmendmentRequest.MasterDirectionId,
                    SearchText = getMasterDirectionIndexAmendmentRequest.SearchText,
                    IsActive = getMasterDirectionIndexAmendmentRequest.IsActive,
                    PageNumber = getMasterDirectionIndexAmendmentRequest.PageNumber,
                    PageSize = Convert.ToInt32(getMasterDirectionIndexAmendmentRequest.PageSize),
                    IsPagingRequired = (getMasterDirectionIndexAmendmentRequest.PageNumber != null) ? true : false,
                    OrderBy = getMasterDirectionIndexAmendmentRequest.OrderBy,
                    OrderByDirection = getMasterDirectionIndexAmendmentRequest.OrderByDirection
                };
                var masterDirectionIndexAmendments = iMasterDirectionIndexAmendment.GetMasterDirectionIndexAmendment(masterDirectionIndexAmendment);

                var masterDirectionIndexAmendmentList = new List<GetMasterDirectionIndexAmendmentResponse>();
                foreach (var masterDirectionIndexAmendmentDetail in masterDirectionIndexAmendments)
                {
                    masterDirectionIndexAmendmentList.Add(new GetMasterDirectionIndexAmendmentResponse()
                    {
                        MasterDirectionIndexAmendmentId = masterDirectionIndexAmendmentDetail.MasterDirectionIndexAmendmentId,
                        MasterDirectionId = masterDirectionIndexAmendmentDetail.MasterDirectionId,
                        APDIRCircularIds = masterDirectionIndexAmendmentDetail.APDIRCircularIds,
                        APDIRCirculars = masterDirectionIndexAmendmentDetail.APDIRCirculars,
                        NotificationIds = masterDirectionIndexAmendmentDetail.NotificationIds,
                        Notifications = masterDirectionIndexAmendmentDetail.Notifications,
                        MasterDirectionChapterId = masterDirectionIndexAmendmentDetail.MasterDirectionChapterId,
                        Chapter = masterDirectionIndexAmendmentDetail.Chapter,
                        MasterDirectionIndexId = masterDirectionIndexAmendmentDetail.MasterDirectionIndexId,
                        IndexNo = masterDirectionIndexAmendmentDetail.IndexNo,
                        IndexName = masterDirectionIndexAmendmentDetail.IndexName,
                        MasterDirectionSubIndexId = masterDirectionIndexAmendmentDetail.MasterDirectionSubIndexId,
                        SubIndexNo = masterDirectionIndexAmendmentDetail.SubIndexNo,
                        SubIndexName = masterDirectionIndexAmendmentDetail.SubIndexName,
                        IndexAmendmentContent = masterDirectionIndexAmendmentDetail.IndexAmendmentContent,
                        Year = masterDirectionIndexAmendmentDetail.Year,
                        UpdatedInsertedByRBI = masterDirectionIndexAmendmentDetail.UpdatedInsertedByRBI,
                        UpdatedInsertedDateByRBI = masterDirectionIndexAmendmentDetail.UpdatedInsertedDateByRBI,
                        IsActive = Convert.ToBoolean(masterDirectionIndexAmendmentDetail.IsActive),
                        CreatedBy = masterDirectionIndexAmendmentDetail.CreatedBy,
                        TotalPageCount = masterDirectionIndexAmendmentDetail.TotalPageCount,
                        TotalRecord = masterDirectionIndexAmendmentDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "MasterDirectionIndexAmendment retrieved successfully";
                responses.Response = masterDirectionIndexAmendmentList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving MasterDirectionIndexAmendment.";

                Utility.WriteLog("GetMasterDirectionIndexAmendment", getMasterDirectionIndexAmendmentRequest, "Error while retrieving MasterDirectionIndexAmendment. (MasterDirectionIndexAmendmentAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("masterdirectionindexamendments/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddMasterDirectionIndexAmendment(AddMasterDirectionIndexAmendmentRequest addMasterDirectionIndexAmendmentRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var masterDirectionIndexAmendment = new MasterDirectionIndexAmendment()
                {
                    MasterDirectionId = addMasterDirectionIndexAmendmentRequest.MasterDirectionId,
                    APDIRCircularIds = addMasterDirectionIndexAmendmentRequest.APDIRCircularIds,
                    NotificationIds = addMasterDirectionIndexAmendmentRequest.NotificationIds,
                    MasterDirectionChapterId = addMasterDirectionIndexAmendmentRequest.MasterDirectionChapterId,
                    MasterDirectionIndexId = addMasterDirectionIndexAmendmentRequest.MasterDirectionIndexId,
                    MasterDirectionSubIndexId = addMasterDirectionIndexAmendmentRequest.MasterDirectionSubIndexId,
                    IndexAmendmentContent = addMasterDirectionIndexAmendmentRequest.IndexAmendmentContent,
                    Year = addMasterDirectionIndexAmendmentRequest.Year,
                    UpdatedInsertedByRBI = addMasterDirectionIndexAmendmentRequest.UpdatedInsertedByRBI,
                    UpdatedInsertedDateByRBI = addMasterDirectionIndexAmendmentRequest.UpdatedInsertedDateByRBI,
                    CreatedBy = Utility.UserId
                };
                int result = iMasterDirectionIndexAmendment.AddMasterDirectionIndexAmendment(masterDirectionIndexAmendment);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "MasterDirectionIndexAmendment added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "MasterDirectionIndexAmendment alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding MasterDirectionIndexAmendment.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding MasterDirectionIndexAmendment.";

                Utility.WriteLog("AddMasterDirectionIndexAmendment", addMasterDirectionIndexAmendmentRequest, "Error while adding MasterDirectionIndexAmendment. (MasterDirectionIndexAmendmentAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("masterdirectionindexamendments/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateMasterDirectionIndexAmendment(UpdateMasterDirectionIndexAmendmentRequest updateMasterDirectionIndexAmendmentRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var masterDirectionIndexAmendment = new MasterDirectionIndexAmendment()
                {
                    MasterDirectionIndexAmendmentId = updateMasterDirectionIndexAmendmentRequest.MasterDirectionIndexAmendmentId,
                    MasterDirectionId = updateMasterDirectionIndexAmendmentRequest.MasterDirectionId,
                    APDIRCircularIds = updateMasterDirectionIndexAmendmentRequest.APDIRCircularIds,
                    NotificationIds = updateMasterDirectionIndexAmendmentRequest.NotificationIds,
                    MasterDirectionChapterId = updateMasterDirectionIndexAmendmentRequest.MasterDirectionChapterId,
                    MasterDirectionIndexId = updateMasterDirectionIndexAmendmentRequest.MasterDirectionIndexId,
                    MasterDirectionSubIndexId = updateMasterDirectionIndexAmendmentRequest.MasterDirectionSubIndexId,
                    IndexAmendmentContent = updateMasterDirectionIndexAmendmentRequest.IndexAmendmentContent,
                    Year = updateMasterDirectionIndexAmendmentRequest.Year,
                    UpdatedInsertedByRBI = updateMasterDirectionIndexAmendmentRequest.UpdatedInsertedByRBI,
                    UpdatedInsertedDateByRBI = updateMasterDirectionIndexAmendmentRequest.UpdatedInsertedDateByRBI,
                    ModifiedBy = Utility.UserId
                };
                int result = iMasterDirectionIndexAmendment.UpdateMasterDirectionIndexAmendment(masterDirectionIndexAmendment);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "MasterDirectionIndexAmendment updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "MasterDirectionIndexAmendment already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "MasterDirectionIndexAmendment doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating MasterDirectionIndexAmendment.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating MasterDirectionIndexAmendment.";

                Utility.WriteLog("UpdateMasterDirectionIndexAmendment", updateMasterDirectionIndexAmendmentRequest, "Error while updating MasterDirectionIndexAmendment. (MasterDirectionIndexAmendmentAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("masterdirectionindexamendments/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteMasterDirectionIndexAmendment(DeleteMasterDirectionIndexAmendmentRequest deleteMasterDirectionIndexAmendmentRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var masterDirectionIndexAmendment = new MasterDirectionIndexAmendment()
                {
                    MasterDirectionIndexAmendmentId = deleteMasterDirectionIndexAmendmentRequest.MasterDirectionIndexAmendmentId,
                    ModifiedBy = Utility.UserId
                };

                int result = iMasterDirectionIndexAmendment.DeleteMasterDirectionIndexAmendment(masterDirectionIndexAmendment);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "MasterDirectionIndexAmendment deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "MasterDirectionIndexAmendment doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting MasterDirectionIndexAmendment.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting MasterDirectionIndexAmendment.";

                Utility.WriteLog("DeleteMasterDirectionIndexAmendment", deleteMasterDirectionIndexAmendmentRequest, "Error while deleting MasterDirectionIndexAmendment. (MasterDirectionIndexAmendmentAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpGet]
        [Route("masterdirectionindexamendmentyears")]
        [ResponseType(typeof(List<int>))]
        public IHttpActionResult GetMasterDirectionIndexAmendmentYear()
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var lstSectorDetailYear = Utility.GetYear();

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "MasterDirectionIndexAmendmentYear retrieved successfully";
                responses.Response = lstSectorDetailYear;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving MasterDirectionIndexAmendmentYear.";

                Utility.WriteLog("GetMasterDirectionIndexAmendmentYear", null, "Error while retrieving MasterDirectionIndexAmendmentYear. (MasterDirectionIndexAmendmentAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
