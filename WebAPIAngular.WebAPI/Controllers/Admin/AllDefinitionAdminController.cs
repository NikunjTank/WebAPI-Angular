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
    public class AllDefinitionAdminController : ApiController
    {
        private IAllDefinition iAllDefinition;
        public AllDefinitionAdminController()
        {
            try
            {
                iAllDefinition = new AllDefinitionRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("AllDefinitionAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("alldefinitions")]
        [ResponseType(typeof(List<GetAllDefinitionResponse>))]
        public IHttpActionResult GetAllDefinition([FromUri]GetAllDefinitionRequest getAllDefinitionRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getAllDefinitionRequest == null)
                    getAllDefinitionRequest = new GetAllDefinitionRequest();

                if (getAllDefinitionRequest.PageSize == null)
                    getAllDefinitionRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var allDefinition = new AllDefinition()
                {
                    Id = getAllDefinitionRequest.Id,
                    ActId = getAllDefinitionRequest.ActId,
                    SearchText = getAllDefinitionRequest.SearchText,
                    IsActive = getAllDefinitionRequest.IsActive,
                    PageNumber = getAllDefinitionRequest.PageNumber,
                    PageSize = Convert.ToInt32(getAllDefinitionRequest.PageSize),
                    IsPagingRequired = (getAllDefinitionRequest.PageNumber != null) ? true : false,
                    OrderBy = getAllDefinitionRequest.OrderBy,
                    OrderByDirection = getAllDefinitionRequest.OrderByDirection
                };
                var allDefinitions = iAllDefinition.GetAllDefinition(allDefinition);

                var allDefinitionList = new List<GetAllDefinitionResponse>();
                foreach (var allDefinitionDetail in allDefinitions)
                {
                    allDefinitionList.Add(new GetAllDefinitionResponse()
                    {
                        Id = Convert.ToInt32(allDefinitionDetail.Id),
                        ActId = Convert.ToInt32(allDefinitionDetail.ActId),
                        DefinitionName = allDefinitionDetail.DefinitionName,
                        FullDInsertion = allDefinitionDetail.FullDInsertion,
                        AuthorNote = allDefinitionDetail.AuthorNote,
                        IsActive = Convert.ToBoolean(allDefinitionDetail.IsActive),
                        CreatedBy = allDefinitionDetail.CreatedBy,
                        TotalPageCount = allDefinitionDetail.TotalPageCount,
                        TotalRecord = allDefinitionDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "AllDefinition retrieved successfully";
                responses.Response = allDefinitionList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving all definition.";

                Utility.WriteLog("GetAllDefinition", getAllDefinitionRequest, "Error while retrieving all definition. (AllDefinitionAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
        
        [HttpPost]
        [Route("alldefinitions/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddAllDefinition(AddAllDefinitionRequest addAllDefinitionRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var allDefinition = new AllDefinition()
                {
                    ActId = addAllDefinitionRequest.ActId,
                    DefinitionName = addAllDefinitionRequest.DefinitionName,
                    FullDInsertion = addAllDefinitionRequest.FullDInsertion,
                    AuthorNote = addAllDefinitionRequest.AuthorNote
                };
                int result = iAllDefinition.AddAllDefinition(allDefinition);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "AllDefinition added successfully.";

                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "AllDefinition alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding all definition.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding all definition.";

                Utility.WriteLog("AddAllDefinition", addAllDefinitionRequest, "Error while adding all definition. (AllDefinitionAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("alldefinitions/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateAllDefinition(UpdateAllDefinitionRequest updateAllDefinitionRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var allDefinition = new AllDefinition()
                {
                    Id = updateAllDefinitionRequest.Id,
                    ActId = updateAllDefinitionRequest.ActId,
                    DefinitionName = updateAllDefinitionRequest.DefinitionName,
                    FullDInsertion = updateAllDefinitionRequest.FullDInsertion,
                    AuthorNote = updateAllDefinitionRequest.AuthorNote,
                    ModifiedBy = Utility.UserId
                };
                int result = iAllDefinition.UpdateAllDefinition(allDefinition);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "AllDefinition updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "AllDefinition already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "AllDefinition doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating all definition.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating all definition.";

                Utility.WriteLog("UpdateAllDefinition", updateAllDefinitionRequest, "Error while updating all definition. (AllDefinitionAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("alldefinitions/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteAllDefinition(DeleteAllDefinitionRequest deleteAllDefinitionRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var allDefinition = new AllDefinition()
                {
                    Id = deleteAllDefinitionRequest.Id,
                    ModifiedBy = Utility.UserId
                };

                int result = iAllDefinition.DeleteAllDefinition(allDefinition);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "AllDefinition deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "AllDefinition doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting all definition.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting all definition.";

                Utility.WriteLog("DeleteAllDefinition", deleteAllDefinitionRequest, "Error while deleting all definition. (AllDefinitionAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
