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
    public class KeyDefinitionEventUserController : ApiController
    {
        private IKeyDefinitionEvent iKeyDefinitionEvent;
        public KeyDefinitionEventUserController()
        {
            try
            {
                iKeyDefinitionEvent = new KeyDefinitionEventRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("KeyDefinitionEventUserController (User)", null, "Error while initialize repository.", ex.ToString());
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

                Utility.WriteLog("GetKeyDefinitionEvent", getKeyDefinitionEventRequest, "Error while retrieving KeyDefinitionEvent. (KeyDefinitionEventUserController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
