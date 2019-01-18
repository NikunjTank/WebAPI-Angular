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
    public class MasterDirectionIndexAdminController : ApiController
    {
        private IMasterDirectionIndex iMasterDirectionIndex;
        public MasterDirectionIndexAdminController()
        {
            try
            {
                iMasterDirectionIndex = new MasterDirectionIndexRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("MasterDirectionIndexAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("masterdirectionindexes")]
        [ResponseType(typeof(List<GetMasterDirectionIndexResponse>))]
        public IHttpActionResult GetMasterDirectionIndex([FromUri]GetMasterDirectionIndexRequest getMasterDirectionIndexRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getMasterDirectionIndexRequest == null)
                    getMasterDirectionIndexRequest = new GetMasterDirectionIndexRequest();

                if (getMasterDirectionIndexRequest.PageSize == null)
                    getMasterDirectionIndexRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var masterDirectionIndex = new MasterDirectionIndex()
                {
                    MasterDirectionIndexId = getMasterDirectionIndexRequest.MasterDirectionIndexId,
                    MasterDirectionChapterId = getMasterDirectionIndexRequest.MasterDirectionChapterId,
                    SearchText = getMasterDirectionIndexRequest.SearchText,
                    IsActive = getMasterDirectionIndexRequest.IsActive,
                    PageNumber = getMasterDirectionIndexRequest.PageNumber,
                    PageSize = Convert.ToInt32(getMasterDirectionIndexRequest.PageSize),
                    IsPagingRequired = (getMasterDirectionIndexRequest.PageNumber != null) ? true : false,
                    OrderBy = getMasterDirectionIndexRequest.OrderBy,
                    OrderByDirection = getMasterDirectionIndexRequest.OrderByDirection
                };
                var masterDirectionIndexes = iMasterDirectionIndex.GetMasterDirectionIndex(masterDirectionIndex);

                var masterDirectionIndexList = new List<GetMasterDirectionIndexResponse>();
                foreach (var masterDirectionIndexDetail in masterDirectionIndexes)
                {
                    masterDirectionIndexList.Add(new GetMasterDirectionIndexResponse()
                    {
                        MasterDirectionIndexId = Convert.ToInt32(masterDirectionIndexDetail.MasterDirectionIndexId),
                        MasterDirectionChapterId = Convert.ToInt32(masterDirectionIndexDetail.MasterDirectionChapterId),
                        IndexNo = masterDirectionIndexDetail.IndexNo,
                        IndexName = masterDirectionIndexDetail.IndexName,
                        IndexContent = masterDirectionIndexDetail.IndexContent,
                        SortId = masterDirectionIndexDetail.SortId,
                        IsActive = Convert.ToBoolean(masterDirectionIndexDetail.IsActive),
                        CreatedBy = masterDirectionIndexDetail.CreatedBy,
                        TotalPageCount = masterDirectionIndexDetail.TotalPageCount,
                        TotalRecord = masterDirectionIndexDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "MasterDirectionIndex retrieved successfully";
                responses.Response = masterDirectionIndexList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving MasterDirectionIndex.";

                Utility.WriteLog("GetMasterDirectionIndex", getMasterDirectionIndexRequest, "Error while retrieving MasterDirectionIndex. (MasterDirectionIndexAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("masterdirectionindexes/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddMasterDirectionIndex(AddMasterDirectionIndexRequest addMasterDirectionIndexRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var masterDirectionIndex = new MasterDirectionIndex()
                {
                    MasterDirectionChapterId = addMasterDirectionIndexRequest.MasterDirectionChapterId,
                    IndexNo = addMasterDirectionIndexRequest.IndexNo,
                    IndexName = addMasterDirectionIndexRequest.IndexName,
                    IndexContent = addMasterDirectionIndexRequest.IndexContent,
                    SaveAfterIndexId = addMasterDirectionIndexRequest.SaveAfterIndexId
                };
                int result = iMasterDirectionIndex.AddMasterDirectionIndex(masterDirectionIndex);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "MasterDirectionIndex added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "MasterDirectionIndex alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding MasterDirectionIndex.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding MasterDirectionIndex.";

                Utility.WriteLog("AddMasterDirectionIndex", addMasterDirectionIndexRequest, "Error while adding MasterDirectionIndex. (MasterDirectionIndexAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("masterdirectionindexes/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateMasterDirectionIndex(UpdateMasterDirectionIndexRequest updateMasterDirectionIndexRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var masterDirectionIndex = new MasterDirectionIndex()
                {
                    MasterDirectionIndexId = updateMasterDirectionIndexRequest.MasterDirectionIndexId,
                    MasterDirectionChapterId = updateMasterDirectionIndexRequest.MasterDirectionChapterId,
                    IndexNo = updateMasterDirectionIndexRequest.IndexNo,
                    IndexName = updateMasterDirectionIndexRequest.IndexName,
                    IndexContent = updateMasterDirectionIndexRequest.IndexContent,
                    SaveAfterIndexId = updateMasterDirectionIndexRequest.SaveAfterIndexId,
                    ModifiedBy = Utility.UserId
                };
                int result = iMasterDirectionIndex.UpdateMasterDirectionIndex(masterDirectionIndex);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "MasterDirectionIndex updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "MasterDirectionIndex already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "MasterDirectionIndex doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating MasterDirectionIndex.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating MasterDirectionIndex.";

                Utility.WriteLog("UpdateMasterDirectionIndex", updateMasterDirectionIndexRequest, "Error while updating MasterDirectionIndex. (MasterDirectionIndexAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("masterdirectionindexes/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteMasterDirectionIndex(DeleteMasterDirectionIndexRequest deleteMasterDirectionIndexRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var masterDirectionIndex = new MasterDirectionIndex()
                {
                    MasterDirectionIndexId = deleteMasterDirectionIndexRequest.MasterDirectionIndexId,
                    MasterDirectionChapterId = deleteMasterDirectionIndexRequest.MasterDirectionChapterId,
                    ModifiedBy = Utility.UserId
                };

                int result = iMasterDirectionIndex.DeleteMasterDirectionIndex(masterDirectionIndex);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "MasterDirectionIndex deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "MasterDirectionIndex doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting MasterDirectionIndex.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting MasterDirectionIndex.";

                Utility.WriteLog("DeleteMasterDirectionIndex", deleteMasterDirectionIndexRequest, "Error while deleting MasterDirectionIndex. (MasterDirectionIndexAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
