using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class PressNoteNotification
    {
        public int? PressNoteNotificationId { get; set; }
        public int? PressNoteId { get; set; }
        public int NotificationId { get; set; }
        public int? RegulationId { get; set; }
        public string RegulationNumber { get; set; }
        public string NotificationNumber { get; set; }
        public string NotificationName { get; set; }
        public DateTime? NotificationDate { get; set; }
        public DateTime? NotificationEffectiveDate { get; set; }
        public int? NotificationTypeId { get; set; }
        public string NotificationTypeName { get; set; }
        public string GSRNo { get; set; }
        public DateTime? GSRDate { get; set; }
        public string NotificationPDF { get; set; }
        public string GSRPDF { get; set; }
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

    public class GetPressNoteNotificationRequest
    {
        public int? PressNoteNotificationId { get; set; }
        public int? PressNoteId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsVerified { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetPressNoteNotificationResponse
    {
        public int? PressNoteNotificationId { get; set; }
        public int? PressNoteId { get; set; }
        public int NotificationId { get; set; }
        public int? RegulationId { get; set; }
        public string RegulationNumber { get; set; }
        public string NotificationNumber { get; set; }
        public string NotificationName { get; set; }
        public DateTime? NotificationDate { get; set; }
        public DateTime? NotificationEffectiveDate { get; set; }
        public int? NotificationTypeId { get; set; }
        public string NotificationTypeName { get; set; }
        public string GSRNo { get; set; }
        public DateTime? GSRDate { get; set; }
        public string NotificationPDF { get; set; }
        public string GSRPDF { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddPressNoteNotificationRequest
    {
        [Required]
        public int PressNoteId { get; set; }
        [Required]
        public int NotificationId { get; set; }
    }

    public class UpdatePressNoteNotificationRequest
    {
        [Required]
        public int PressNoteNotificationId { get; set; }
        [Required]
        public int PressNoteId { get; set; }
        [Required]
        public int NotificationId { get; set; }
    }

    public class DeletePressNoteNotificationRequest
    {
        [Required]
        public int PressNoteNotificationId { get; set; }
    }
}