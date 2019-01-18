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
    public class SubSectorAdminController : ApiController
    {
        private ISubSector iSubSector;
        public SubSectorAdminController()
        {
            try
            {
                iSubSector = new SubSectorRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("SubSectorAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
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
                responses.Response = subSectorList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving SubSector.";

                Utility.WriteLog("GetSubSector", getSubSectorRequest, "Error while retrieving SubSector. (SubSectorAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("subsectors/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddSubSector(AddSubSectorRequest addSubSectorRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var subSector = new SubSector()
                {
                    SectorId = addSubSectorRequest.SectorId,
                    Name = addSubSectorRequest.Name,
                    CreatedBy = Utility.UserId
                };
                int result = iSubSector.AddSubSector(subSector);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "SubSector added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "SubSector alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding SubSector.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding SubSector.";

                Utility.WriteLog("AddSubSector", addSubSectorRequest, "Error while adding SubSector. (SubSectorAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("subsectors/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateSubSector(UpdateSubSectorRequest updateSubSectorRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var subSector = new SubSector()
                {
                    SubSectorId = updateSubSectorRequest.SubSectorId,
                    SectorId = updateSubSectorRequest.SectorId,
                    Name = updateSubSectorRequest.Name,
                    ModifiedBy = Utility.UserId
                };
                int result = iSubSector.UpdateSubSector(subSector);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "SubSector updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "SubSector already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "SubSector doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating SubSector.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating SubSector.";

                Utility.WriteLog("UpdateSubSector", updateSubSectorRequest, "Error while updating SubSector. (SubSectorAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("subsectors/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteSubSector(DeleteSubSectorRequest deleteSubSectorRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var subSector = new SubSector()
                {
                    SubSectorId = deleteSubSectorRequest.SubSectorId,
                    ModifiedBy = Utility.UserId
                };

                int result = iSubSector.DeleteSubSector(subSector);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "SubSector deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "SubSector doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting SubSector.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting SubSector.";

                Utility.WriteLog("DeleteSubSector", deleteSubSectorRequest, "Error while deleting SubSector. (SubSectorAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpGet]
        [Route("subsectoryears")]
        [ResponseType(typeof(List<int>))]
        public IHttpActionResult GetSubSectorYear()
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var lstSectorDetailYear = Utility.GetYear();

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "SubSectorYear retrieved successfully";
                responses.Response = lstSectorDetailYear;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving SubSectorYear.";

                Utility.WriteLog("GetSubSectorYear", null, "Error while retrieving SubSectorYear. (SubSectorAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
