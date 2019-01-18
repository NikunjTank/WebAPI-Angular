using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using DemystifyFema.Service.Repository;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;

namespace DemystifyFema.Service.Controllers.Admin
{
    [Authorize(Roles = "Admin")]
    [RoutePrefix("admin/api")]
    public class MasterCircularAdminController : ApiController
    {
        private IMasterCircular iMasterCircular;
        public MasterCircularAdminController()
        {
            try
            {
                iMasterCircular = new MasterCircularRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("MasterCircularAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("mastercirculars")]
        [ResponseType(typeof(List<GetMasterCircularResponse>))]
        public IHttpActionResult GetMasterCircular([FromUri]GetMasterCircularRequest getMasterCircularRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getMasterCircularRequest == null)
                    getMasterCircularRequest = new GetMasterCircularRequest();

                if (getMasterCircularRequest.PageSize == null)
                    getMasterCircularRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var masterCircular = new MasterCircular()
                {
                    MasterCircularId = getMasterCircularRequest.MasterCircularId,
                    SearchText = getMasterCircularRequest.SearchText,
                    IsActive = getMasterCircularRequest.IsActive,
                    PageNumber = getMasterCircularRequest.PageNumber,
                    PageSize = Convert.ToInt32(getMasterCircularRequest.PageSize),
                    IsPagingRequired = (getMasterCircularRequest.PageNumber != null) ? true : false,
                    OrderBy = getMasterCircularRequest.OrderBy,
                    OrderByDirection = getMasterCircularRequest.OrderByDirection
                };
                var masterCirculars = iMasterCircular.GetMasterCircular(masterCircular);

                var masterCircularList = new List<GetMasterCircularResponse>();
                foreach (var masterCircularDetail in masterCirculars)
                {
                    masterCircularList.Add(new GetMasterCircularResponse()
                    {
                        MasterCircularId = Convert.ToInt32(masterCircularDetail.MasterCircularId),
                        MasterCircularName = masterCircularDetail.MasterCircularName,
                        IsActive = Convert.ToBoolean(masterCircularDetail.IsActive),
                        CreatedBy = masterCircularDetail.CreatedBy,
                        TotalPageCount = masterCircularDetail.TotalPageCount,
                        TotalRecord = masterCircularDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "MasterCircular retrieved successfully";
                responses.Response = masterCircularList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving MasterCircular.";

                Utility.WriteLog("GetMasterCircular", getMasterCircularRequest, "Error while retrieving MasterCircular. (MasterCircularAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
        
        [HttpPost]
        [Route("mastercirculars/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddMasterCircular(AddMasterCircularRequest addMasterCircularRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var masterCircular = new MasterCircular()
                {
                    MasterCircularName = addMasterCircularRequest.MasterCircularName,
                    CreatedBy = Utility.UserId
                };
                int result = iMasterCircular.AddMasterCircular(masterCircular);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "MasterCircular added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "MasterCircular alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding MasterCircular.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding MasterCircular.";

                Utility.WriteLog("AddMasterCircular", addMasterCircularRequest, "Error while adding MasterCircular. (MasterCircularAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("mastercirculars/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateMasterCircular(UpdateMasterCircularRequest updateMasterCircularRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var masterCircular = new MasterCircular()
                {
                    MasterCircularId = updateMasterCircularRequest.MasterCircularId,
                    MasterCircularName = updateMasterCircularRequest.MasterCircularName,
                    ModifiedBy = Utility.UserId
                };
                int result = iMasterCircular.UpdateMasterCircular(masterCircular);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "MasterCircular updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "MasterCircular already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "MasterCircular doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating MasterCircular.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating MasterCircular.";

                Utility.WriteLog("UpdateMasterCircular", updateMasterCircularRequest, "Error while updating MasterCircular. (MasterCircularAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("mastercirculars/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteMasterCircular(DeleteMasterCircularRequest deleteMasterCircularRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var masterCircular = new MasterCircular()
                {
                    MasterCircularId = deleteMasterCircularRequest.MasterCircularId,
                    ModifiedBy = Utility.UserId
                };

                int result = iMasterCircular.DeleteMasterCircular(masterCircular);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "MasterCircular deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "MasterCircular doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting MasterCircular.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting MasterCircular.";

                Utility.WriteLog("DeleteMasterCircular", deleteMasterCircularRequest, "Error while deleting MasterCircular. (MasterCircularAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
