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
    public class KeyDefinitionEventAdminController : ApiController
    {
        private IKeyDefinitionEvent iKeyDefinitionEvent;
        public KeyDefinitionEventAdminController()
        {
            try
            {
                iKeyDefinitionEvent = new KeyDefinitionEventRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("KeyDefinitionEventAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("keydefinitionevents")]
        [ResponseType(typeof(List<GetKeyDefinitionEventResponse>))]
        public IHttpActionResult GetKeyDefinitionEvent([FromUri]GetKeyDefinitionEventRequest getKeyDefinitionEventRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getKeyDefinitionEventRequest == null)
                    getKeyDefinitionEventRequest = new GetKeyDefinitionEventRequest();

                if (getKeyDefinitionEventRequest.PageSize == null)
                    getKeyDefinitionEventRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var keyDefinitionEvent = new KeyDefinitionEvent()
                {
                    KeyDefinitionEventId = getKeyDefinitionEventRequest.KeyDefinitionEventId,
                    DefinitionEventName = getKeyDefinitionEventRequest.DefinitionEventName,
                    SearchText = getKeyDefinitionEventRequest.SearchText,
                    IsActive = getKeyDefinitionEventRequest.IsActive,
                    PageNumber = getKeyDefinitionEventRequest.PageNumber,
                    PageSize = Convert.ToInt32(getKeyDefinitionEventRequest.PageSize),
                    IsPagingRequired = (getKeyDefinitionEventRequest.PageNumber != null) ? true : false,
                    OrderBy = getKeyDefinitionEventRequest.OrderBy,
                    OrderByDirection = getKeyDefinitionEventRequest.OrderByDirection
                };
                var keyDefinitionEvents = iKeyDefinitionEvent.GetKeyDefinitionEvent(keyDefinitionEvent);

                var keyDefinitionEventList = new List<GetKeyDefinitionEventResponse>();
                foreach (var keyDefinitionEventDetail in keyDefinitionEvents)
                {
                    keyDefinitionEventList.Add(new GetKeyDefinitionEventResponse()
                    {
                        KeyDefinitionEventId = Convert.ToInt32(keyDefinitionEventDetail.KeyDefinitionEventId),
                        DefinitionName = keyDefinitionEventDetail.DefinitionName,
                        DefinitionAuthorNote = keyDefinitionEventDetail.DefinitionAuthorNote,
                        DefinitionContent = keyDefinitionEventDetail.DefinitionContent,
                        EventName = keyDefinitionEventDetail.EventName,
                        EventAuthorNote = keyDefinitionEventDetail.EventAuthorNote,
                        EventDate = keyDefinitionEventDetail.EventDate,
                        ModuleIds = keyDefinitionEventDetail.ModuleIds,
                        Modules = keyDefinitionEventDetail.Modules,
                        Notifications = keyDefinitionEventDetail.Notifications,
                        GSRNotifications = keyDefinitionEventDetail.GSRNotifications,
                        FDICirculars = keyDefinitionEventDetail.FDICirculars,
                        PressNotes = keyDefinitionEventDetail.PressNotes,
                        Acts = keyDefinitionEventDetail.Acts,
                        MasterDirections = keyDefinitionEventDetail.MasterDirections,
                        APDIRCirculars = keyDefinitionEventDetail.APDIRCirculars,
                        NotificationIds = keyDefinitionEventDetail.NotificationIds,
                        GSRNotificationIds = keyDefinitionEventDetail.GSRNotificationIds,
                        FDICircularIds = keyDefinitionEventDetail.FDICircularIds,
                        PressNoteIds = keyDefinitionEventDetail.PressNoteIds,
                        ActIds = keyDefinitionEventDetail.ActIds,
                        MasterDirectionIds = keyDefinitionEventDetail.MasterDirectionIds,
                        APDIRCircularIds = keyDefinitionEventDetail.APDIRCircularIds,
                        IsActive = Convert.ToBoolean(keyDefinitionEventDetail.IsActive),
                        CreatedBy = keyDefinitionEventDetail.CreatedBy,
                        TotalPageCount = keyDefinitionEventDetail.TotalPageCount,
                        TotalRecord = keyDefinitionEventDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "KeyDefinitionEvent retrieved successfully";
                responses.Response = keyDefinitionEventList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving KeyDefinitionEvent.";

                Utility.WriteLog("GetKeyDefinitionEvent", getKeyDefinitionEventRequest, "Error while retrieving KeyDefinitionEvent. (KeyDefinitionEventAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("keydefinitionevents/add")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult AddKeyDefinitionEvent(AddKeyDefinitionEventRequest addKeyDefinitionEventRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var keyDefinitionEvent = new KeyDefinitionEvent()
                {
                    DefinitionEventName = addKeyDefinitionEventRequest.DefinitionEventName,
                    ModuleIds = addKeyDefinitionEventRequest.ModuleIds,
                    DefinitionName = addKeyDefinitionEventRequest.DefinitionName,
                    DefinitionAuthorNote = addKeyDefinitionEventRequest.DefinitionAuthorNote,
                    DefinitionContent = addKeyDefinitionEventRequest.DefinitionContent,
                    EventName = addKeyDefinitionEventRequest.EventName,
                    EventDate = addKeyDefinitionEventRequest.EventDate,
                    EventAuthorNote = addKeyDefinitionEventRequest.EventAuthorNote,
                    NotificationIds = addKeyDefinitionEventRequest.NotificationIds,
                    GSRNotificationIds = addKeyDefinitionEventRequest.GSRNotificationIds,
                    FDICircularIds = addKeyDefinitionEventRequest.FDICircularIds,
                    PressNoteIds = addKeyDefinitionEventRequest.PressNoteIds,
                    ActIds = addKeyDefinitionEventRequest.ActIds,
                    MasterDirectionIds = addKeyDefinitionEventRequest.MasterDirectionIds,
                    APDIRCircularIds = addKeyDefinitionEventRequest.APDIRCircularIds,
                    CreatedBy = Utility.UserId
                };
                int result = iKeyDefinitionEvent.AddKeyDefinitionEvent(keyDefinitionEvent);
                if (result > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "KeyDefinitionEvent added successfully.";
                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "KeyDefinitionEvent alread exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while adding KeyDefinitionEvent.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while adding KeyDefinitionEvent.";

                Utility.WriteLog("AddKeyDefinitionEvent", addKeyDefinitionEventRequest, "Error while adding KeyDefinitionEvent. (KeyDefinitionEventAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("keydefinitionevents/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateKeyDefinitionEvent(UpdateKeyDefinitionEventRequest updateKeyDefinitionEventRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var keyDefinitionEvent = new KeyDefinitionEvent()
                {
                    KeyDefinitionEventId = updateKeyDefinitionEventRequest.KeyDefinitionEventId,
                    DefinitionEventName = updateKeyDefinitionEventRequest.DefinitionEventName,
                    ModuleIds = updateKeyDefinitionEventRequest.ModuleIds,
                    DefinitionName = updateKeyDefinitionEventRequest.DefinitionName,
                    DefinitionAuthorNote = updateKeyDefinitionEventRequest.DefinitionAuthorNote,
                    DefinitionContent = updateKeyDefinitionEventRequest.DefinitionContent,
                    EventName = updateKeyDefinitionEventRequest.EventName,
                    EventDate = updateKeyDefinitionEventRequest.EventDate,
                    EventAuthorNote = updateKeyDefinitionEventRequest.EventAuthorNote,
                    NotificationIds = updateKeyDefinitionEventRequest.NotificationIds,
                    GSRNotificationIds = updateKeyDefinitionEventRequest.GSRNotificationIds,
                    FDICircularIds = updateKeyDefinitionEventRequest.FDICircularIds,
                    PressNoteIds = updateKeyDefinitionEventRequest.PressNoteIds,
                    ActIds = updateKeyDefinitionEventRequest.ActIds,
                    MasterDirectionIds = updateKeyDefinitionEventRequest.MasterDirectionIds,
                    APDIRCircularIds = updateKeyDefinitionEventRequest.APDIRCircularIds,
                    ModifiedBy = Utility.UserId
                };
                int result = iKeyDefinitionEvent.UpdateKeyDefinitionEvent(keyDefinitionEvent);

                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "KeyDefinitionEvent updated successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "KeyDefinitionEvent already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "KeyDefinitionEvent doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while updating KeyDefinitionEvent.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating KeyDefinitionEvent.";

                Utility.WriteLog("UpdateKeyDefinitionEvent", updateKeyDefinitionEventRequest, "Error while updating KeyDefinitionEvent. (KeyDefinitionEventAdminController)", ex.ToString());
            }
            return Ok(responses);
        }


        [HttpPost]
        [Route("keydefinitionevents/delete")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult DeleteKeyDefinitionEvent(DeleteKeyDefinitionEventRequest deleteKeyDefinitionEventRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var keyDefinitionEvent = new KeyDefinitionEvent()
                {
                    KeyDefinitionEventId = deleteKeyDefinitionEventRequest.KeyDefinitionEventId,
                    ModifiedBy = Utility.UserId
                };

                int result = iKeyDefinitionEvent.DeleteKeyDefinitionEvent(keyDefinitionEvent);
                switch (result)
                {
                    case 1:
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "KeyDefinitionEvent deleted successfully.";
                        break;
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "KeyDefinitionEvent doesn't exist.";
                        break;
                    default:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while deleting KeyDefinitionEvent.";
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while deleting KeyDefinitionEvent.";

                Utility.WriteLog("DeleteKeyDefinitionEvent", deleteKeyDefinitionEventRequest, "Error while deleting KeyDefinitionEvent. (KeyDefinitionEventAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
