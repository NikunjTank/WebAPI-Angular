using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class KeyDefinitionEvent
    {
        public int? KeyDefinitionEventId { get; set; }
        public string DefinitionName { get; set; }
        public string DefinitionAuthorNote { get; set; }
        public string DefinitionContent { get; set; }
        public string EventName { get; set; }
        public DateTime? EventDate { get; set; }
        public string EventAuthorNote { get; set; }
        public string ModuleIds { get; set; }
        public string Modules { get; set; }
        public string NotificationIds { get; set; }
        public string GSRNotificationIds { get; set; }
        public string FDICircularIds { get; set; }
        public string PressNoteIds { get; set; }
        public string ActIds { get; set; }
        public string MasterDirectionIds { get; set; }
        public string APDIRCircularIds { get; set; }
        public string Notifications { get; set; }
        public string GSRNotifications { get; set; }
        public string FDICirculars { get; set; }
        public string PressNotes { get; set; }
        public string Acts { get; set; }
        public string MasterDirections { get; set; }
        public string APDIRCirculars { get; set; }
        public string DefinitionEventName { get; set; }
        public int FieldId { get; set; }
        public string FieldName { get; set; }
        public int ModifiedBy { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
        public bool IsPagingRequired { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
        public int Result { get; set; }
    }

    public class GetKeyDefinitionEventRequest
    {
        public int? KeyDefinitionEventId { get; set; }
        public string DefinitionEventName { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetKeyDefinitionEventResponse
    {
        public int KeyDefinitionEventId { get; set; }
        public string DefinitionName { get; set; }
        public string DefinitionAuthorNote { get; set; }
        public string DefinitionContent { get; set; }
        public string EventName { get; set; }
        public DateTime? EventDate { get; set; }
        public string EventAuthorNote { get; set; }
        public string ModuleIds { get; set; }
        public string Modules { get; set; }
        public string NotificationIds { get; set; }
        public string GSRNotificationIds { get; set; }
        public string FDICircularIds { get; set; }
        public string PressNoteIds { get; set; }
        public string ActIds { get; set; }
        public string MasterDirectionIds { get; set; }
        public string APDIRCircularIds { get; set; }
        public string Notifications { get; set; }
        public string GSRNotifications { get; set; }
        public string FDICirculars { get; set; }
        public string PressNotes { get; set; }
        public string Acts { get; set; }
        public string MasterDirections { get; set; }
        public string APDIRCirculars { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddKeyDefinitionEventRequest
    {
        [Required]
        public string DefinitionEventName { get; set; }
        [Required]
        public string ModuleIds { get; set; }
        public string DefinitionName { get; set; }
        public string DefinitionAuthorNote { get; set; }
        public string DefinitionContent { get; set; }
        public string EventName { get; set; }
        public DateTime? EventDate { get; set; }
        public string EventAuthorNote { get; set; }
        public string NotificationIds { get; set; }
        public string GSRNotificationIds { get; set; }
        public string FDICircularIds { get; set; }
        public string PressNoteIds { get; set; }
        public string ActIds { get; set; }
        public string MasterDirectionIds { get; set; }
        public string APDIRCircularIds { get; set; }
    }

    public class UpdateKeyDefinitionEventRequest
    {
        [Required]
        public int KeyDefinitionEventId { get; set; }
        [Required]
        public string DefinitionEventName { get; set; }
        [Required]
        public string ModuleIds { get; set; }
        public string DefinitionName { get; set; }
        public string DefinitionAuthorNote { get; set; }
        public string DefinitionContent { get; set; }
        public string EventName { get; set; }
        public DateTime? EventDate { get; set; }
        public string EventAuthorNote { get; set; }
        public string NotificationIds { get; set; }
        public string GSRNotificationIds { get; set; }
        public string FDICircularIds { get; set; }
        public string PressNoteIds { get; set; }
        public string ActIds { get; set; }
        public string MasterDirectionIds { get; set; }
        public string APDIRCircularIds { get; set; }
    }

    public class DeleteKeyDefinitionEventRequest
    {
        [Required]
        public int KeyDefinitionEventId { get; set; }
    }
}