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
    public class APDIRCircularBeforeAdminController : ApiController
    {
        private IAPDIRCircularBefore iAPDIRCircularBefore;
        public APDIRCircularBeforeAdminController()
        {
            try
            {
                iAPDIRCircularBefore = new APDIRCircularBeforeRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("APDIRCircularBeforeAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("apdircircularbefores")]
        [ResponseType(typeof(List<GetAPDIRCircularBeforeResponse>))]
        public IHttpActionResult GetAPDIRCircularBefore([FromUri]GetAPDIRCircularBeforeRequest getAPDIRCircularBeforeRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getAPDIRCircularBeforeRequest == null)
                    getAPDIRCircularBeforeRequest = new GetAPDIRCircularBeforeRequest();

                if (getAPDIRCircularBeforeRequest.PageSize == null)
                    getAPDIRCircularBeforeRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var aPDIRCircularBefore = new APDIRCircularBefore()
                {
                    APDIRCircularBeforeId = getAPDIRCircularBeforeRequest.APDIRCircularBeforeId,
                    APDIRCircularParentId = getAPDIRCircularBeforeRequest.APDIRCircularParentId,
                    SearchText = getAPDIRCircularBeforeRequest.SearchText,
                    IsActive = getAPDIRCircularBeforeRequest.IsActive,
                    PageNumber = getAPDIRCircularBeforeRequest.PageNumber,
                    PageSize = Convert.ToInt32(getAPDIRCircularBeforeRequest.PageSize),
                    IsPagingRequired = (getAPDIRCircularBeforeRequest.PageNumber != null) ? true : false,
                    OrderBy = getAPDIRCircularBeforeRequest.OrderBy,
                    OrderByDirection = getAPDIRCircularBeforeRequest.OrderByDirection
                };
                var aPDIRCircularBefores = iAPDIRCircularBefore.GetAPDIRCircularBefore(aPDIRCircularBefore);

                var aPDIRCircularBeforeList = new List<GetAPDIRCircularBeforeResponse>();
                foreach (var aPDIRCircularBeforeDetail in aPDIRCircularBefores)
                {
                    aPDIRCircularBeforeList.Add(new GetAPDIRCircularBeforeResponse()
                    {
                        APDIRCircularBeforeId = Convert.ToInt32(aPDIRCircularBeforeDetail.APDIRCircularBeforeId),
                        APDIRCircularParentId = aPDIRCircularBeforeDetail.APDIRCircularParentId,
                        APDIRCircularId = aPDIRCircularBeforeDetail.APDIRCircularId,
                        APDIRCircularNo = aPDIRCircularBeforeDetail.APDIRCircularNo,
                        APDIRCircularName = aPDIRCircularBeforeDetail.APDIRCircularName,
                        APDIRCircularDate = aPDIRCircularBeforeDetail.APDIRCircularDate,
                        APDIRCircularEffectiveDate = aPDIRCircularBeforeDetail.APDIRCircularEffectiveDate,
                        Year = aPDIRCircularBeforeDetail.Year,
                        APDIRCircularYearName = Utility.GetAPDIRCircularYear(Convert.ToInt32(aPDIRCircularBeforeDetail.Year)).First().APDIRCircularYearName,
                        APDIRCircularPDF = aPDIRCircularBeforeDetail.APDIRCircularPDF,
                        IsActive = Convert.ToBoolean(aPDIRCircularBeforeDetail.IsActive),
                        CreatedBy = aPDIRCircularBeforeDetail.CreatedBy,
                        TotalPageCount = aPDIRCircularBeforeDetail.TotalPageCount,
                        TotalRecord = aPDIRCircularBeforeDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "Before AP DIR Circular retrieved successfully";
                responses.Response = aPDIRCircularBeforeList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving Before AP DIR Circular.";

                Utility.WriteLog("GetAPDIRCircularBefore", getAPDIRCircularBeforeRequest, "Error while retrieving Before AP DIR Circular. (APDIRCircularBeforeAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("apdircircularbefores/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddAPDIRCircularBefore(AddAPDIRCircularBeforeRequest addAPDIRCircularBeforeRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var aPDIRCircularBefore = new APDIRCircularBefore()
                {
                    APDIRCircularParentId = addAPDIRCircularBeforeRequest.APDIRCircularParentId,
                    APDIRCircularId = addAPDIRCircularBeforeRequest.APDIRCircularId
                };
                int result = iAPDIRCircularBefore.AddAPDIRCircularBefore(aPDIRCircularBefore);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "Before AP DIR Circular added successfully.";

                }
                else if (result == -3)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Before AP DIR Circular alread exists in After AP DIR Circular.";
                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Before AP DIR Circular alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding Before AP DIR Circular.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding Before AP DIR Circular.";

                Utility.WriteLog("AddAPDIRCircularBefore", addAPDIRCircularBeforeRequest, "Error while adding Before AP DIR Circular. (APDIRCircularBeforeAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("apdircircularbefores/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateAPDIRCircularBefore(UpdateAPDIRCircularBeforeRequest updateAPDIRCircularBeforeRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var aPDIRCircularBefore = new APDIRCircularBefore()
                {
                    APDIRCircularBeforeId = updateAPDIRCircularBeforeRequest.APDIRCircularBeforeId,
                    APDIRCircularParentId = updateAPDIRCircularBeforeRequest.APDIRCircularParentId,
                    APDIRCircularId = updateAPDIRCircularBeforeRequest.APDIRCircularId,
                    ModifiedBy = Utility.UserId
                };
                int result = iAPDIRCircularBefore.UpdateAPDIRCircularBefore(aPDIRCircularBefore);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "Before AP DIR Circular updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Before AP DIR Circular already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Before AP DIR Circular doesn't exist.";
                        break;
                    case -4:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Before AP DIR Circular already exists in After AP DIR Circular.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating Before AP DIR Circular.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating Before AP DIR Circular.";

                Utility.WriteLog("UpdateAPDIRCircularBefore", updateAPDIRCircularBeforeRequest, "Error while updating Before AP DIR Circular. (APDIRCircularBeforeAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("apdircircularbefores/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteAPDIRCircularBefore(DeleteAPDIRCircularBeforeRequest deleteAPDIRCircularBeforeRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var aPDIRCircularBefore = new APDIRCircularBefore()
                {
                    APDIRCircularBeforeId = deleteAPDIRCircularBeforeRequest.APDIRCircularBeforeId,
                    ModifiedBy = Utility.UserId
                };

                int result = iAPDIRCircularBefore.DeleteAPDIRCircularBefore(aPDIRCircularBefore);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "Before AP DIR Circular deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Before AP DIR Circular doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting Before AP DIR Circular.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting Before AP DIR Circular.";

                Utility.WriteLog("DeleteAPDIRCircularBefore", deleteAPDIRCircularBeforeRequest, "Error while deleting Before AP DIR Circular. (APDIRCircularBeforeAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
