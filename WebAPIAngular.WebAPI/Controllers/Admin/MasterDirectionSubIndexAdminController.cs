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
    public class MasterDirectionSubIndexAdminController : ApiController
    {
        private IMasterDirectionSubIndex iMasterDirectionSubIndex;
        public MasterDirectionSubIndexAdminController()
        {
            try
            {
                iMasterDirectionSubIndex = new MasterDirectionSubIndexRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("MasterDirectionSubIndexAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("masterdirectionsubindexes")]
        [ResponseType(typeof(List<GetMasterDirectionSubIndexResponse>))]
        public IHttpActionResult GetMasterDirectionSubIndex([FromUri]GetMasterDirectionSubIndexRequest getMasterDirectionSubIndexRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getMasterDirectionSubIndexRequest == null)
                    getMasterDirectionSubIndexRequest = new GetMasterDirectionSubIndexRequest();

                if (getMasterDirectionSubIndexRequest.PageSize == null)
                    getMasterDirectionSubIndexRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var masterDirectionSubIndex = new MasterDirectionSubIndex()
                {
                    MasterDirectionSubIndexId = getMasterDirectionSubIndexRequest.MasterDirectionSubIndexId,
                    MasterDirectionIndexId = getMasterDirectionSubIndexRequest.MasterDirectionIndexId,
                    SearchText = getMasterDirectionSubIndexRequest.SearchText,
                    IsActive = getMasterDirectionSubIndexRequest.IsActive,
                    PageNumber = getMasterDirectionSubIndexRequest.PageNumber,
                    PageSize = Convert.ToInt32(getMasterDirectionSubIndexRequest.PageSize),
                    IsPagingRequired = (getMasterDirectionSubIndexRequest.PageNumber != null) ? true : false,
                    OrderBy = getMasterDirectionSubIndexRequest.OrderBy,
                    OrderByDirection = getMasterDirectionSubIndexRequest.OrderByDirection
                };
                var masterDirectionSubIndexes = iMasterDirectionSubIndex.GetMasterDirectionSubIndex(masterDirectionSubIndex);

                var masterDirectionSubIndexList = new List<GetMasterDirectionSubIndexResponse>();
                foreach (var masterDirectionSubIndexDetail in masterDirectionSubIndexes)
                {
                    masterDirectionSubIndexList.Add(new GetMasterDirectionSubIndexResponse()
                    {
                        MasterDirectionSubIndexId = Convert.ToInt32(masterDirectionSubIndexDetail.MasterDirectionSubIndexId),
                        MasterDirectionIndexId = Convert.ToInt32(masterDirectionSubIndexDetail.MasterDirectionIndexId),
                        SubIndexNo = masterDirectionSubIndexDetail.SubIndexNo,
                        SubIndexName = masterDirectionSubIndexDetail.SubIndexName,
                        SubIndexContent = masterDirectionSubIndexDetail.SubIndexContent,
                        SortId = masterDirectionSubIndexDetail.SortId,
                        IsActive = Convert.ToBoolean(masterDirectionSubIndexDetail.IsActive),
                        CreatedBy = masterDirectionSubIndexDetail.CreatedBy,
                        TotalPageCount = masterDirectionSubIndexDetail.TotalPageCount,
                        TotalRecord = masterDirectionSubIndexDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "MasterDirectionSubIndex retrieved successfully";
                responses.Response = masterDirectionSubIndexList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving MasterDirectionSubIndex.";

                Utility.WriteLog("GetMasterDirectionSubIndex", getMasterDirectionSubIndexRequest, "Error while retrieving MasterDirectionSubIndex. (MasterDirectionSubIndexAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("masterdirectionsubindexes/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddMasterDirectionSubIndex(AddMasterDirectionSubIndexRequest addMasterDirectionSubIndexRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var masterDirectionSubIndex = new MasterDirectionSubIndex()
                {
                    MasterDirectionIndexId = addMasterDirectionSubIndexRequest.MasterDirectionIndexId,
                    SubIndexNo = addMasterDirectionSubIndexRequest.SubIndexNo,
                    SubIndexName = addMasterDirectionSubIndexRequest.SubIndexName,
                    SubIndexContent = addMasterDirectionSubIndexRequest.SubIndexContent,
                    SaveAfterSubIndexId = addMasterDirectionSubIndexRequest.SaveAfterSubIndexId
                };
                int result = iMasterDirectionSubIndex.AddMasterDirectionSubIndex(masterDirectionSubIndex);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "MasterDirectionSubIndex added successfully.";
                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "MasterDirectionSubIndex alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding MasterDirectionSubIndex.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding MasterDirectionSubIndex.";

                Utility.WriteLog("AddMasterDirectionSubIndex", addMasterDirectionSubIndexRequest, "Error while adding MasterDirectionSubIndex. (MasterDirectionSubIndexAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("masterdirectionsubindexes/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateMasterDirectionSubIndex(UpdateMasterDirectionSubIndexRequest updateMasterDirectionSubIndexRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var masterDirectionSubIndex = new MasterDirectionSubIndex()
                {
                    MasterDirectionSubIndexId = updateMasterDirectionSubIndexRequest.MasterDirectionSubIndexId,
                    MasterDirectionIndexId = updateMasterDirectionSubIndexRequest.MasterDirectionIndexId,
                    SubIndexNo = updateMasterDirectionSubIndexRequest.SubIndexNo,
                    SubIndexName = updateMasterDirectionSubIndexRequest.SubIndexName,
                    SubIndexContent = updateMasterDirectionSubIndexRequest.SubIndexContent,
                    SaveAfterSubIndexId = updateMasterDirectionSubIndexRequest.SaveAfterSubIndexId,
                    ModifiedBy = Utility.UserId
                };
                int result = iMasterDirectionSubIndex.UpdateMasterDirectionSubIndex(masterDirectionSubIndex);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "MasterDirectionSubIndex updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "MasterDirectionSubIndex already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "MasterDirectionSubIndex doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating MasterDirectionSubIndex.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating MasterDirectionSubIndex.";

                Utility.WriteLog("UpdateMasterDirectionSubIndex", updateMasterDirectionSubIndexRequest, "Error while updating MasterDirectionSubIndex. (MasterDirectionSubIndexAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("masterdirectionsubindexes/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteMasterDirectionSubIndex(DeleteMasterDirectionSubIndexRequest deleteMasterDirectionSubIndexRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var masterDirectionSubIndex = new MasterDirectionSubIndex()
                {
                    MasterDirectionSubIndexId = deleteMasterDirectionSubIndexRequest.MasterDirectionSubIndexId,
                    MasterDirectionIndexId = deleteMasterDirectionSubIndexRequest.MasterDirectionIndexId,
                    ModifiedBy = Utility.UserId
                };

                int result = iMasterDirectionSubIndex.DeleteMasterDirectionSubIndex(masterDirectionSubIndex);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "MasterDirectionSubIndex deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "MasterDirectionSubIndex doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting MasterDirectionSubIndex.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting MasterDirectionSubIndex.";

                Utility.WriteLog("DeleteMasterDirectionSubIndex", deleteMasterDirectionSubIndexRequest, "Error while deleting MasterDirectionSubIndex. (MasterDirectionSubIndexAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
