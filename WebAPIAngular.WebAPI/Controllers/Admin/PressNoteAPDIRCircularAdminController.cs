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
    public class PressNoteAPDIRCircularAdminController : ApiController
    {
        private IPressNoteAPDIRCircular iPressNoteAPDIRCircular;
        public PressNoteAPDIRCircularAdminController()
        {
            try
            {
                iPressNoteAPDIRCircular = new PressNoteAPDIRCircularRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("PressNoteAPDIRCircularAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("pressnoteapdircirculars")]
        [ResponseType(typeof(List<GetPressNoteAPDIRCircularResponse>))]
        public IHttpActionResult GetPressNoteAPDIRCircular([FromUri]GetPressNoteAPDIRCircularRequest getPressNoteAPDIRCircularRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getPressNoteAPDIRCircularRequest == null)
                    getPressNoteAPDIRCircularRequest = new GetPressNoteAPDIRCircularRequest();

                if (getPressNoteAPDIRCircularRequest.PageSize == null)
                    getPressNoteAPDIRCircularRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var pressNoteAPDIRCircular = new PressNoteAPDIRCircular()
                {
                    PressNoteAPDIRCircularId = getPressNoteAPDIRCircularRequest.PressNoteAPDIRCircularId,
                    PressNoteId = getPressNoteAPDIRCircularRequest.PressNoteId,
                    SearchText = getPressNoteAPDIRCircularRequest.SearchText,
                    IsActive = getPressNoteAPDIRCircularRequest.IsActive,
                    PageNumber = getPressNoteAPDIRCircularRequest.PageNumber,
                    PageSize = Convert.ToInt32(getPressNoteAPDIRCircularRequest.PageSize),
                    IsPagingRequired = (getPressNoteAPDIRCircularRequest.PageNumber != null) ? true : false,
                    OrderBy = getPressNoteAPDIRCircularRequest.OrderBy,
                    OrderByDirection = getPressNoteAPDIRCircularRequest.OrderByDirection
                };
                var pressNoteAPDIRCirculars = iPressNoteAPDIRCircular.GetPressNoteAPDIRCircular(pressNoteAPDIRCircular);

                var pressNoteAPDIRCircularList = new List<GetPressNoteAPDIRCircularResponse>();
                foreach (var pressNoteAPDIRCircularDetail in pressNoteAPDIRCirculars)
                {
                    pressNoteAPDIRCircularList.Add(new GetPressNoteAPDIRCircularResponse()
                    {
                        PressNoteAPDIRCircularId = Convert.ToInt32(pressNoteAPDIRCircularDetail.PressNoteAPDIRCircularId),
                        PressNoteId = pressNoteAPDIRCircularDetail.PressNoteId,
                        APDIRCircularId = pressNoteAPDIRCircularDetail.APDIRCircularId,
                        APDIRCircularNo = pressNoteAPDIRCircularDetail.APDIRCircularNo,
                        APDIRCircularName = pressNoteAPDIRCircularDetail.APDIRCircularName,
                        APDIRCircularDate = pressNoteAPDIRCircularDetail.APDIRCircularDate,
                        APDIRCircularEffectiveDate = pressNoteAPDIRCircularDetail.APDIRCircularEffectiveDate,
                        Year = pressNoteAPDIRCircularDetail.Year,
                        APDIRCircularPDF = pressNoteAPDIRCircularDetail.APDIRCircularPDF,
                        IsActive = Convert.ToBoolean(pressNoteAPDIRCircularDetail.IsActive),
                        CreatedBy = pressNoteAPDIRCircularDetail.CreatedBy,
                        TotalPageCount = pressNoteAPDIRCircularDetail.TotalPageCount,
                        TotalRecord = pressNoteAPDIRCircularDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "Press Note APDIRCircular retrieved successfully";
                responses.Response = pressNoteAPDIRCircularList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving Press Note APDIRCircular.";

                Utility.WriteLog("GetPressNoteAPDIRCircular", getPressNoteAPDIRCircularRequest, "Error while retrieving Press Note APDIRCircular. (PressNoteAPDIRCircularAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("pressnoteapdircirculars/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddPressNoteAPDIRCircular(AddPressNoteAPDIRCircularRequest addPressNoteAPDIRCircularRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var pressNoteAPDIRCircular = new PressNoteAPDIRCircular()
                {
                    PressNoteId = addPressNoteAPDIRCircularRequest.PressNoteId,
                    APDIRCircularId = addPressNoteAPDIRCircularRequest.APDIRCircularId,
                    CreatedBy = Utility.UserId
                };
                int result = iPressNoteAPDIRCircular.AddPressNoteAPDIRCircular(pressNoteAPDIRCircular);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "Press Note APDIRCircular added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Press Note APDIRCircular alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding Press Note APDIRCircular.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding Press Note APDIRCircular.";

                Utility.WriteLog("AddPressNoteAPDIRCircular", addPressNoteAPDIRCircularRequest, "Error while adding Press Note APDIRCircular. (PressNoteAPDIRCircularAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("pressnoteapdircirculars/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdatePressNoteAPDIRCircular(UpdatePressNoteAPDIRCircularRequest updatePressNoteAPDIRCircularRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var pressNoteAPDIRCircular = new PressNoteAPDIRCircular()
                {
                    PressNoteAPDIRCircularId = updatePressNoteAPDIRCircularRequest.PressNoteAPDIRCircularId,
                    PressNoteId = updatePressNoteAPDIRCircularRequest.PressNoteId,
                    APDIRCircularId = updatePressNoteAPDIRCircularRequest.APDIRCircularId,
                    ModifiedBy = Utility.UserId
                };
                int result = iPressNoteAPDIRCircular.UpdatePressNoteAPDIRCircular(pressNoteAPDIRCircular);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "Press Note APDIRCircular updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Press Note APDIRCircular already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Press Note APDIRCircular doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating Press Note APDIRCircular.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating Press Note APDIRCircular.";

                Utility.WriteLog("UpdatePressNoteAPDIRCircular", updatePressNoteAPDIRCircularRequest, "Error while updating Press Note APDIRCircular. (PressNoteAPDIRCircularAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("pressnoteapdircirculars/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeletePressNoteAPDIRCircular(DeletePressNoteAPDIRCircularRequest deletePressNoteAPDIRCircularRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var pressNoteAPDIRCircular = new PressNoteAPDIRCircular()
                {
                    PressNoteAPDIRCircularId = deletePressNoteAPDIRCircularRequest.PressNoteAPDIRCircularId,
                    ModifiedBy = Utility.UserId
                };

                int result = iPressNoteAPDIRCircular.DeletePressNoteAPDIRCircular(pressNoteAPDIRCircular);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "Press Note APDIRCircular deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Press Note APDIRCircular doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting Press Note APDIRCircular.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting Press Note APDIRCircular.";

                Utility.WriteLog("DeletePressNoteAPDIRCircular", deletePressNoteAPDIRCircularRequest, "Error while deleting Press Note APDIRCircular. (PressNoteAPDIRCircularAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
