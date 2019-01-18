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
    public class FDICircularIndexAmendmentAdminController : ApiController
    {
        private IFDICircularIndexAmendment iFDICircularIndexAmendment;
        public FDICircularIndexAmendmentAdminController()
        {
            try
            {
                iFDICircularIndexAmendment = new FDICircularIndexAmendmentRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("FDICircularIndexAmendmentAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("fdicircularindexamendments")]
        [ResponseType(typeof(List<GetFDICircularIndexAmendmentResponse>))]
        public IHttpActionResult GetFDICircularIndexAmendment([FromUri]GetFDICircularIndexAmendmentRequest getFDICircularIndexAmendmentRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getFDICircularIndexAmendmentRequest == null)
                    getFDICircularIndexAmendmentRequest = new GetFDICircularIndexAmendmentRequest();

                if (getFDICircularIndexAmendmentRequest.PageSize == null)
                    getFDICircularIndexAmendmentRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var fDICircularIndexAmendment = new FDICircularIndexAmendment()
                {
                    FDICircularIndexAmendmentId = getFDICircularIndexAmendmentRequest.FDICircularIndexAmendmentId,
                    FDICircularId = getFDICircularIndexAmendmentRequest.FDICircularId,
                    SearchText = getFDICircularIndexAmendmentRequest.SearchText,
                    IsActive = getFDICircularIndexAmendmentRequest.IsActive,
                    PageNumber = getFDICircularIndexAmendmentRequest.PageNumber,
                    PageSize = Convert.ToInt32(getFDICircularIndexAmendmentRequest.PageSize),
                    IsPagingRequired = (getFDICircularIndexAmendmentRequest.PageNumber != null) ? true : false,
                    OrderBy = getFDICircularIndexAmendmentRequest.OrderBy,
                    OrderByDirection = getFDICircularIndexAmendmentRequest.OrderByDirection
                };
                var fDICircularIndexAmendments = iFDICircularIndexAmendment.GetFDICircularIndexAmendment(fDICircularIndexAmendment);

                var fDICircularIndexAmendmentList = new List<GetFDICircularIndexAmendmentResponse>();
                foreach (var fDICircularIndexAmendmentDetail in fDICircularIndexAmendments)
                {
                    fDICircularIndexAmendmentList.Add(new GetFDICircularIndexAmendmentResponse()
                    {
                        FDICircularIndexAmendmentId = fDICircularIndexAmendmentDetail.FDICircularIndexAmendmentId,
                        FDICircularId = fDICircularIndexAmendmentDetail.FDICircularId,
                        PressNoteIds = fDICircularIndexAmendmentDetail.PressNoteIds,
                        PressNotes = fDICircularIndexAmendmentDetail.PressNotes,
                        FDIChapterId = fDICircularIndexAmendmentDetail.FDIChapterId,
                        Chapter = fDICircularIndexAmendmentDetail.Chapter,
                        FDICircularIndexId = fDICircularIndexAmendmentDetail.FDICircularIndexId,
                        IndexNo = fDICircularIndexAmendmentDetail.IndexNo,
                        FDICircularSubIndexId = fDICircularIndexAmendmentDetail.FDICircularSubIndexId,
                        SubIndexNo = fDICircularIndexAmendmentDetail.SubIndexNo,
                        IndexAmendmentContent = fDICircularIndexAmendmentDetail.IndexAmendmentContent,
                        Year = fDICircularIndexAmendmentDetail.Year,
                        IsActive = Convert.ToBoolean(fDICircularIndexAmendmentDetail.IsActive),
                        CreatedBy = fDICircularIndexAmendmentDetail.CreatedBy,
                        TotalPageCount = fDICircularIndexAmendmentDetail.TotalPageCount,
                        TotalRecord = fDICircularIndexAmendmentDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "FDICircularIndexAmendment retrieved successfully";
                responses.Response = fDICircularIndexAmendmentList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving FDICircularIndexAmendment.";

                Utility.WriteLog("GetFDICircularIndexAmendment", getFDICircularIndexAmendmentRequest, "Error while retrieving FDICircularIndexAmendment. (FDICircularIndexAmendmentAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("fdicircularindexamendments/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddFDICircularIndexAmendment(AddFDICircularIndexAmendmentRequest addFDICircularIndexAmendmentRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var fDICircularIndexAmendment = new FDICircularIndexAmendment()
                {
                    FDICircularId = addFDICircularIndexAmendmentRequest.FDICircularId,
                    PressNoteIds = addFDICircularIndexAmendmentRequest.PressNoteIds,
                    FDIChapterId = addFDICircularIndexAmendmentRequest.FDIChapterId,
                    FDICircularIndexId = addFDICircularIndexAmendmentRequest.FDICircularIndexId,
                    FDICircularSubIndexId = addFDICircularIndexAmendmentRequest.FDICircularSubIndexId,
                    IndexAmendmentContent = addFDICircularIndexAmendmentRequest.IndexAmendmentContent,
                    Year = addFDICircularIndexAmendmentRequest.Year
                };
                int result = iFDICircularIndexAmendment.AddFDICircularIndexAmendment(fDICircularIndexAmendment);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "FDICircularIndexAmendment added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "FDICircularIndexAmendment alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding FDICircularIndexAmendment.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding FDICircularIndexAmendment.";

                Utility.WriteLog("AddFDICircularIndexAmendment", addFDICircularIndexAmendmentRequest, "Error while adding FDICircularIndexAmendment. (FDICircularIndexAmendmentAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("fdicircularindexamendments/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateFDICircularIndexAmendment(UpdateFDICircularIndexAmendmentRequest updateFDICircularIndexAmendmentRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var fDICircularIndexAmendment = new FDICircularIndexAmendment()
                {
                    FDICircularIndexAmendmentId = updateFDICircularIndexAmendmentRequest.FDICircularIndexAmendmentId,
                    FDICircularId = updateFDICircularIndexAmendmentRequest.FDICircularId,
                    PressNoteIds = updateFDICircularIndexAmendmentRequest.PressNoteIds,
                    FDIChapterId = updateFDICircularIndexAmendmentRequest.FDIChapterId,
                    FDICircularIndexId = updateFDICircularIndexAmendmentRequest.FDICircularIndexId,
                    FDICircularSubIndexId = updateFDICircularIndexAmendmentRequest.FDICircularSubIndexId,
                    IndexAmendmentContent = updateFDICircularIndexAmendmentRequest.IndexAmendmentContent,
                    Year = updateFDICircularIndexAmendmentRequest.Year,
                    ModifiedBy = Utility.UserId
                };
                int result = iFDICircularIndexAmendment.UpdateFDICircularIndexAmendment(fDICircularIndexAmendment);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "FDICircularIndexAmendment updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FDICircularIndexAmendment already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FDICircularIndexAmendment doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating FDICircularIndexAmendment.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating FDICircularIndexAmendment.";

                Utility.WriteLog("UpdateFDICircularIndexAmendment", updateFDICircularIndexAmendmentRequest, "Error while updating FDICircularIndexAmendment. (FDICircularIndexAmendmentAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("fdicircularindexamendments/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteFDICircularIndexAmendment(DeleteFDICircularIndexAmendmentRequest deleteFDICircularIndexAmendmentRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var fDICircularIndexAmendment = new FDICircularIndexAmendment()
                {
                    FDICircularIndexAmendmentId = deleteFDICircularIndexAmendmentRequest.FDICircularIndexAmendmentId,
                    ModifiedBy = Utility.UserId
                };

                int result = iFDICircularIndexAmendment.DeleteFDICircularIndexAmendment(fDICircularIndexAmendment);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "FDICircularIndexAmendment deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "FDICircularIndexAmendment doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting FDICircularIndexAmendment.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting FDICircularIndexAmendment.";

                Utility.WriteLog("DeleteFDICircularIndexAmendment", deleteFDICircularIndexAmendmentRequest, "Error while deleting FDICircularIndexAmendment. (FDICircularIndexAmendmentAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
