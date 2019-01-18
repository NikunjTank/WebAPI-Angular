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
    public class SectorDetailAdminController : ApiController
    {
        private ISectorDetail iSectorDetail;
        public SectorDetailAdminController()
        {
            try
            {
                iSectorDetail = new SectorDetailRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("SectorDetailAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("sectordetails")]
        [ResponseType(typeof(List<GetSectorDetailResponse>))]
        public IHttpActionResult GetSectorDetail([FromUri]GetSectorDetailRequest getSectorDetailRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getSectorDetailRequest == null)
                    getSectorDetailRequest = new GetSectorDetailRequest();

                if (getSectorDetailRequest.PageSize == null)
                    getSectorDetailRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var sectorDetail = new SectorDetail()
                {
                    SectorDetailId = getSectorDetailRequest.SectorDetailId,
                    SectorId = getSectorDetailRequest.SectorId,
                    SubSectorId = getSectorDetailRequest.SubSectorId,
                    SearchText = getSectorDetailRequest.SearchText,
                    IsActive = getSectorDetailRequest.IsActive,
                    PageNumber = getSectorDetailRequest.PageNumber,
                    PageSize = Convert.ToInt32(getSectorDetailRequest.PageSize),
                    IsPagingRequired = (getSectorDetailRequest.PageNumber != null) ? true : false,
                    OrderBy = getSectorDetailRequest.OrderBy,
                    OrderByDirection = getSectorDetailRequest.OrderByDirection
                };
                var sectorDetails = iSectorDetail.GetSectorDetail(sectorDetail);

                var sectorList = new List<GetSectorDetailResponse>();
                foreach (var sector in sectorDetails)
                {
                    sectorList.Add(new GetSectorDetailResponse()
                    {
                        SectorDetailId = sector.SectorDetailId,
                        SectorId = sector.SectorId,
                        SubSectorId = sector.SubSectorId,
                        SubSectorName = sector.SubSectorName,
                        Year = sector.Year,
                        PressNoteId = sector.PressNoteId,
                        PressNoteNos = sector.PressNoteNos,
                        NotificationId = sector.NotificationId,
                        NotificationNos = sector.NotificationNos,
                        APDIRCircularId = sector.APDIRCircularId,
                        APDIRCircularNos = sector.APDIRCircularNos,
                        PressNotePDFs = sector.PressNotePDFs,
                        NotificationPDFs = sector.NotificationPDFs,
                        APDIRCircularPDFs = sector.APDIRCircularPDFs,
                        IsActive = Convert.ToBoolean(sector.IsActive),
                        CreatedBy = sector.CreatedBy,
                        TotalPageCount = sector.TotalPageCount,
                        TotalRecord = sector.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "SectorDetail retrieved successfully";
                responses.Response = sectorList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving sectorDetail.";

                Utility.WriteLog("GetSectorDetail", getSectorDetailRequest, "Error while retrieving sectorDetail. (SectorDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("sectordetails/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddSectorDetail(AddSectorDetailRequest addSectorDetailRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var sectorDetail = new SectorDetail()
                {
                    SectorId = addSectorDetailRequest.SectorId,
                    SubSectorId = addSectorDetailRequest.SubSectorId,
                    Year = addSectorDetailRequest.Year,
                    PressNoteId = addSectorDetailRequest.PressNoteId,
                    NotificationId = addSectorDetailRequest.NotificationId,
                    APDIRCircularId = addSectorDetailRequest.APDIRCircularId,
                    CreatedBy = Utility.UserId
                };
                int result = iSectorDetail.AddSectorDetail(sectorDetail);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "SectorDetail added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "SectorDetail alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding sectorDetail.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding sectorDetail.";

                Utility.WriteLog("AddSectorDetail", addSectorDetailRequest, "Error while adding sectorDetail. (SectorDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("sectordetails/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateSectorDetail(UpdateSectorDetailRequest updateSectorDetailRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var sectorDetail = new SectorDetail()
                {
                    SectorDetailId = updateSectorDetailRequest.SectorDetailId,
                    SubSectorId = updateSectorDetailRequest.SubSectorId,
                    SectorId = updateSectorDetailRequest.SectorId,
                    Year = updateSectorDetailRequest.Year,
                    PressNoteId = updateSectorDetailRequest.PressNoteId,
                    NotificationId = updateSectorDetailRequest.NotificationId,
                    APDIRCircularId = updateSectorDetailRequest.APDIRCircularId,
                    ModifiedBy = Utility.UserId
                };
                int result = iSectorDetail.UpdateSectorDetail(sectorDetail);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "SectorDetail updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "SectorDetail already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "SectorDetail doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating sectorDetail.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating admin profile.";

                Utility.WriteLog("UpdateSectorDetail", updateSectorDetailRequest, "Error while updating sectorDetail. (SectorDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("sectordetails/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteSectorDetail(DeleteSectorDetailRequest deleteSectorDetailRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var sectorDetail = new SectorDetail()
                {
                    SectorDetailId = deleteSectorDetailRequest.SectorDetailId,
                    ModifiedBy = Utility.UserId
                };

                int result = iSectorDetail.DeleteSectorDetail(sectorDetail);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "SectorDetail deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "SectorDetail doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting sectorDetail.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting sectorDetail.";

                Utility.WriteLog("DeleteSectorDetail", deleteSectorDetailRequest, "Error while deleting sectorDetail. (SectorDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpGet]
        [Route("sectordetailyears")]
        [ResponseType(typeof(List<int>))]
        public IHttpActionResult GetSectorDetailYear()
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var lstSectorDetailYear = Utility.GetYear().Where(x => x >= 1999 && x <= DateTime.Now.Year).OrderByDescending(x => x).ToList();

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "SectorDetailYear retrieved successfully";
                responses.Response = lstSectorDetailYear;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving SectorDetailYear.";

                Utility.WriteLog("GetSectorDetailYear", null, "Error while retrieving SectorDetailYear. (SectorDetailAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
