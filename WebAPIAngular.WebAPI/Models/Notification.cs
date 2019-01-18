using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class Notification
    {
        public int? NotificationId { get; set; }
        public int? RegulationId { get; set; }
        public string RegulationNumber { get; set; }
        public string RegulationName { get; set; }
        public int? MasterDirectionId { get; set; }
        public string MasterDirectionName { get; set; }
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

    public class GetNotificationRequest
    {
        public int? NotificationId { get; set; }
        public int? RegulationId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsVerified { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetNotificationResponse
    {
        public int? NotificationId { get; set; }
        public string RegulationNumber { get; set; }
        public string RegulationName { get; set; }
        public int? RegulationId { get; set; }
        public int? MasterDirectionId { get; set; }
        public string MasterDirectionName { get; set; }
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

    public class AddNotificationRequest
    {
        public int? RegulationId { get; set; }
        public int? MasterDirectionId { get; set; }
        [Required]
        public string NotificationNumber { get; set; }
        [Required]
        public string NotificationName { get; set; }
        [Required]
        public DateTime NotificationDate { get; set; }
        [Required]
        public DateTime NotificationEffectiveDate { get; set; }
        [Required]
        public int NotificationTypeId { get; set; }
        [Required]
        public string GSRNo { get; set; }
        [Required]
        public DateTime GSRDate { get; set; }
        [Required]
        public string NotificationPDF { get; set; }
        public string GSRPDF { get; set; }
    }

    public class UpdateNotificationRequest
    {
        [Required]
        public int NotificationId { get; set; }
        public int? RegulationId { get; set; }
        public int? MasterDirectionId { get; set; }
        [Required]
        public string NotificationNumber { get; set; }
        [Required]
        public string NotificationName { get; set; }
        [Required]
        public DateTime NotificationDate { get; set; }
        [Required]
        public DateTime NotificationEffectiveDate { get; set; }
        [Required]
        public int NotificationTypeId { get; set; }
        [Required]
        public string GSRNo { get; set; }
        [Required]
        public DateTime GSRDate { get; set; }
        [Required]
        public string NotificationPDF { get; set; }
        public string GSRPDF { get; set; }
    }

    public class DeleteNotificationRequest
    {
        [Required]
        public int NotificationId { get; set; }
    }

    public class NotificationType
    {
        public int? NotificationTypeId { get; set; }
        public string NotificationTypeName { get; set; }
    }

    public class GetNotificationTypeRequest
    {
        public int? NotificationTypeId { get; set; }
    }

    public class GetNotificationTypeResponse
    {
        public int? NotificationTypeId { get; set; }
        public string NotificationTypeName { get; set; }
    }
}