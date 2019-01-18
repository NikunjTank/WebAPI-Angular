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
    public class SectorAdminController : ApiController
    {
        private ISector iSector;
        public SectorAdminController()
        {
            try
            {
                iSector = new SectorRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("SectorAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
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
                responses.Response = sectorList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving sector.";

                Utility.WriteLog("GetSector", getSectorRequest, "Error while retrieving sector. (SectorAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
        
        [HttpPost]
        [Route("sectors/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddSector(AddSectorRequest addSectorRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var sector = new Sector()
                {
                    Name = addSectorRequest.Name,
                    CreatedBy = Utility.UserId
                };
                int result = iSector.AddSector(sector);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "Sector added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Sector alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding sector.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding sector.";

                Utility.WriteLog("AddSector", addSectorRequest, "Error while adding sector. (SectorAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("sectors/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateSector(UpdateSectorRequest updateSectorRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var sector = new Sector()
                {
                    SectorId = updateSectorRequest.SectorId,
                    Name = updateSectorRequest.Name,
                    ModifiedBy = Utility.UserId
                };
                int result = iSector.UpdateSector(sector);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "Sector updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Sector already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Sector doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating sector.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating admin profile.";

                Utility.WriteLog("UpdateSector", updateSectorRequest, "Error while updating sector. (SectorAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("sectors/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteSector(DeleteSectorRequest deleteSectorRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var sector = new Sector()
                {
                    SectorId = deleteSectorRequest.SectorId,
                    ModifiedBy = Utility.UserId
                };

                int result = iSector.DeleteSector(sector);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "Sector deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Sector doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting sector.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting sector.";

                Utility.WriteLog("DeleteSector", deleteSectorRequest, "Error while deleting sector. (SectorAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
