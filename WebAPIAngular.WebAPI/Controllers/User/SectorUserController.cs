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

namespace DemystifyFema.Service.Controllers.User
{
    [Authorize(Roles = "User")]
    [RoutePrefix("user/api")]
    public class SectorUserController : ApiController
    {
        private ISector iSector;
        private ISubSector iSubSector;
        private ISectorDetail iSectorDetail;
        public SectorUserController()
        {
            try
            {
                iSector = new SectorRepository();
                iSubSector = new SubSectorRepository();
                iSectorDetail = new SectorDetailRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("SectorUserController (User)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("sectors")]
        [ResponseType(typeof(List<GetSectorResponse>))]
        public IHttpActionResult GetSector([FromUri]GetSectorRequest getSectorRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getSectorRequest == null)
                    getSectorRequest = new GetSectorRequest();

                if (getSectorRequest.PageSize == null)
                    getSectorRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var sector = new Sector()
                {
                    SectorId = getSectorRequest.SectorId,
                    SearchText = getSectorRequest.SearchText,
                    IsActive = getSectorRequest.IsActive,
                    PageNumber = getSectorRequest.PageNumber,
                    PageSize = Convert.ToInt32(getSectorRequest.PageSize),
                    IsPagingRequired = (getSectorRequest.PageNumber != null) ? true : false,
                    OrderBy = getSectorRequest.OrderBy,
                    OrderByDirection = getSectorRequest.OrderByDirection
                };
                var sectors = iSector.GetSector(sector);

                var sectorList = new List<GetSectorResponse>();
                foreach (var sectorDetail in sectors)
                {
                    sectorList.Add(new GetSectorResponse()
                    {
                        SectorId = Convert.ToInt32(sectorDetail.SectorId),
                        Name = sectorDetail.Name,
                        IsActive = Convert.ToBoolean(sectorDetail.IsActive),
                        CreatedBy = sectorDetail.CreatedBy,
                        TotalPageCount = sectorDetail.TotalPageCount,
                        TotalRecord = sectorDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "Sector retrieved successfully";
                responses.Response = sectorList.OrderBy(x => x.Name).ToList();
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving sector.";

                Utility.WriteLog("GetSector", getSectorRequest, "Error while retrieving sector. (SectorUserController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpGet]
        [Route("subsectors")]
        [ResponseType(typeof(List<GetSubSectorResponse>))]
        public IHttpActionResult GetSubSector([FromUri]GetSubSectorRequest getSubSectorRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getSubSectorRequest == null)
                    getSubSectorRequest = new GetSubSectorRequest();

                if (getSubSectorRequest.PageSize == null)
                    getSubSectorRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var subSector = new SubSector()
                {
                    SubSectorId = getSubSectorRequest.SubSectorId,
                    SectorId = getSubSectorRequest.SectorId,
                    SearchText = getSubSectorRequest.SearchText,
                    IsActive = getSubSectorRequest.IsActive,
                    PageNumber = getSubSectorRequest.PageNumber,
                    PageSize = Convert.ToInt32(getSubSectorRequest.PageSize),
                    IsPagingRequired = (getSubSectorRequest.PageNumber != null) ? true : false,
                    OrderBy = getSubSectorRequest.OrderBy,
                    OrderByDirection = getSubSectorRequest.OrderByDirection
                };
                var subSectors = iSubSector.GetSubSector(subSector);

                var subSectorList = new List<GetSubSectorResponse>();
                foreach (var subSectorDetail in subSectors)
                {
                    subSectorList.Add(new GetSubSectorResponse()
                    {
                        SubSectorId = Convert.ToInt32(subSectorDetail.SubSectorId),
                        SectorId = subSectorDetail.SectorId,
                        Name = subSectorDetail.Name,
                        IsActive = Convert.ToBoolean(subSectorDetail.IsActive),
                        CreatedBy = subSectorDetail.CreatedBy,
                        TotalPageCount = subSectorDetail.TotalPageCount,
                        TotalRecord = subSectorDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "SubSector retrieved successfully";
                responses.Response = subSectorList.OrderBy(x => x.Name).ToList();
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving SubSector.";

                Utility.WriteLog("GetSubSector", getSubSectorRequest, "Error while retrieving SubSector. (SectorUserController)", ex.ToString());
            }
            return Ok(responses);
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
                responses.Response = sectorList.OrderByDescending(x => x.Year).ToList();
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving sectorDetail.";

                Utility.WriteLog("GetSectorDetail", getSectorDetailRequest, "Error while retrieving sectorDetail. (SectorUserController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
