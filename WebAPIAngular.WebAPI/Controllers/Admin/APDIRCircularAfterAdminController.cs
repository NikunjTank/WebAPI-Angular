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
    public class APDIRCircularAfterAdminController : ApiController
    {
        private IAPDIRCircularAfter iAPDIRCircularAfter;
        public APDIRCircularAfterAdminController()
        {
            try
            {
                iAPDIRCircularAfter = new APDIRCircularAfterRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("APDIRCircularAfterAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("apdircircularafters")]
        [ResponseType(typeof(List<GetAPDIRCircularAfterResponse>))]
        public IHttpActionResult GetAPDIRCircularAfter([FromUri]GetAPDIRCircularAfterRequest getAPDIRCircularAfterRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getAPDIRCircularAfterRequest == null)
                    getAPDIRCircularAfterRequest = new GetAPDIRCircularAfterRequest();

                if (getAPDIRCircularAfterRequest.PageSize == null)
                    getAPDIRCircularAfterRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var aPDIRCircularAfter = new APDIRCircularAfter()
                {
                    APDIRCircularAfterId = getAPDIRCircularAfterRequest.APDIRCircularAfterId,
                    APDIRCircularParentId = getAPDIRCircularAfterRequest.APDIRCircularParentId,
                    SearchText = getAPDIRCircularAfterRequest.SearchText,
                    IsActive = getAPDIRCircularAfterRequest.IsActive,
                    PageNumber = getAPDIRCircularAfterRequest.PageNumber,
                    PageSize = Convert.ToInt32(getAPDIRCircularAfterRequest.PageSize),
                    IsPagingRequired = (getAPDIRCircularAfterRequest.PageNumber != null) ? true : false,
                    OrderBy = getAPDIRCircularAfterRequest.OrderBy,
                    OrderByDirection = getAPDIRCircularAfterRequest.OrderByDirection
                };
                var aPDIRCircularAfters = iAPDIRCircularAfter.GetAPDIRCircularAfter(aPDIRCircularAfter);

                var aPDIRCircularAfterList = new List<GetAPDIRCircularAfterResponse>();
                foreach (var aPDIRCircularAfterDetail in aPDIRCircularAfters)
                {
                    aPDIRCircularAfterList.Add(new GetAPDIRCircularAfterResponse()
                    {
                        APDIRCircularAfterId = Convert.ToInt32(aPDIRCircularAfterDetail.APDIRCircularAfterId),
                        APDIRCircularParentId = aPDIRCircularAfterDetail.APDIRCircularParentId,
                        APDIRCircularId = aPDIRCircularAfterDetail.APDIRCircularId,
                        APDIRCircularNo = aPDIRCircularAfterDetail.APDIRCircularNo,
                        APDIRCircularName = aPDIRCircularAfterDetail.APDIRCircularName,
                        APDIRCircularDate = aPDIRCircularAfterDetail.APDIRCircularDate,
                        APDIRCircularEffectiveDate = aPDIRCircularAfterDetail.APDIRCircularEffectiveDate,
                        Year = aPDIRCircularAfterDetail.Year,
                        APDIRCircularYearName = Utility.GetAPDIRCircularYear(Convert.ToInt32(aPDIRCircularAfterDetail.Year)).First().APDIRCircularYearName,
                        APDIRCircularPDF = aPDIRCircularAfterDetail.APDIRCircularPDF,
                        IsActive = Convert.ToBoolean(aPDIRCircularAfterDetail.IsActive),
                        CreatedBy = aPDIRCircularAfterDetail.CreatedBy,
                        TotalPageCount = aPDIRCircularAfterDetail.TotalPageCount,
                        TotalRecord = aPDIRCircularAfterDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "APDIRCircularAfter retrieved successfully";
                responses.Response = aPDIRCircularAfterList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving APDIRCircularAfter.";

                Utility.WriteLog("GetAPDIRCircularAfter", getAPDIRCircularAfterRequest, "Error while retrieving APDIRCircularAfter. (APDIRCircularAfterAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("apdircircularafters/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddAPDIRCircularAfter(AddAPDIRCircularAfterRequest addAPDIRCircularAfterRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var aPDIRCircularAfter = new APDIRCircularAfter()
                {
                    APDIRCircularParentId = addAPDIRCircularAfterRequest.APDIRCircularParentId,
                    APDIRCircularId = addAPDIRCircularAfterRequest.APDIRCircularId
                };
                int result = iAPDIRCircularAfter.AddAPDIRCircularAfter(aPDIRCircularAfter);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "After AP DIR Circular added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "After AP DIR Circular alread exists.";
                }
                else if (result == -3)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "After AP DIR Circular alread exists in Before AP DIR Circular.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding After AP DIR Circular.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding After AP DIR Circular.";

                Utility.WriteLog("AddAPDIRCircularAfter", addAPDIRCircularAfterRequest, "Error while adding After AP DIR Circular. (APDIRCircularAfterAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("apdircircularafters/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateAPDIRCircularAfter(UpdateAPDIRCircularAfterRequest updateAPDIRCircularAfterRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var aPDIRCircularAfter = new APDIRCircularAfter()
                {
                    APDIRCircularAfterId = updateAPDIRCircularAfterRequest.APDIRCircularAfterId,
                    APDIRCircularParentId = updateAPDIRCircularAfterRequest.APDIRCircularParentId,
                    APDIRCircularId = updateAPDIRCircularAfterRequest.APDIRCircularId,
                    ModifiedBy = Utility.UserId
                };
                int result = iAPDIRCircularAfter.UpdateAPDIRCircularAfter(aPDIRCircularAfter);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "After AP DIR Circular updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "After AP DIR Circular already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "After AP DIR Circular doesn't exist.";
                        break;
                    case -4:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "After AP DIR Circular already exists in Before AP DIR Circular.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating After AP DIR Circular.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating After AP DIR Circular.";

                Utility.WriteLog("UpdateAPDIRCircularAfter", updateAPDIRCircularAfterRequest, "Error while updating After AP DIR Circular. (APDIRCircularAfterAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("apdircircularafters/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteAPDIRCircularAfter(DeleteAPDIRCircularAfterRequest deleteAPDIRCircularAfterRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var aPDIRCircularAfter = new APDIRCircularAfter()
                {
                    APDIRCircularAfterId = deleteAPDIRCircularAfterRequest.APDIRCircularAfterId,
                    ModifiedBy = Utility.UserId
                };

                int result = iAPDIRCircularAfter.DeleteAPDIRCircularAfter(aPDIRCircularAfter);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "After AP DIR Circular deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "After AP DIR Circular doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting After AP DIR Circular.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting After AP DIR Circular.";

                Utility.WriteLog("DeleteAPDIRCircularAfter", deleteAPDIRCircularAfterRequest, "Error while deleting After AP DIR Circular. (APDIRCircularAfterAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
