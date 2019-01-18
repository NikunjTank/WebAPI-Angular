using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class GSRNotification
    {
        public int? GSRNotificationId { get; set; }
        public int? RulesId { get; set; }
        public string RulesName { get; set; }
        public string GSRNotificationNo { get; set; }
        public string GSRNotificationName { get; set; }
        public DateTime? GSRNotificationDate { get; set; }
        public DateTime? GSRNotificationEffectiveDate { get; set; }
        public int? GSRNotificationTypeId { get; set; }
        public string GSRNotificationTypeName { get; set; }
        public string PDF { get; set; }
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

    public class GetGSRNotificationRequest
    {
        public int? GSRNotificationId { get; set; }
        public int? RulesId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsVerified { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetGSRNotificationResponse
    {
        public int? GSRNotificationId { get; set; }
        public string RulesName { get; set; }
        public int? RulesId { get; set; }
        public string GSRNotificationNo { get; set; }
        public string GSRNotificationName { get; set; }
        public DateTime? GSRNotificationDate { get; set; }
        public DateTime? GSRNotificationEffectiveDate { get; set; }
        public int? GSRNotificationTypeId { get; set; }
        public string GSRNotificationTypeName { get; set; }
        public string PDF { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddGSRNotificationRequest
    {
        public int? RulesId { get; set; }
        [Required]
        public string GSRNotificationNo { get; set; }
        [Required]
        public string GSRNotificationName { get; set; }
        [Required]
        public DateTime GSRNotificationDate { get; set; }
        [Required]
        public DateTime GSRNotificationEffectiveDate { get; set; }
        [Required]
        public int GSRNotificationTypeId { get; set; }
        [Required]
        public string PDF { get; set; }
    }

    public class UpdateGSRNotificationRequest
    {
        [Required]
        public int GSRNotificationId { get; set; }
        public int? RulesId { get; set; }
        [Required]
        public string GSRNotificationNo { get; set; }
        [Required]
        public string GSRNotificationName { get; set; }
        [Required]
        public DateTime GSRNotificationDate { get; set; }
        [Required]
        public DateTime GSRNotificationEffectiveDate { get; set; }
        [Required]
        public int GSRNotificationTypeId { get; set; }
        [Required]
        public string PDF { get; set; }
    }

    public class DeleteGSRNotificationRequest
    {
        [Required]
        public int GSRNotificationId { get; set; }
    }

    public class GSRNotificationType
    {
        public int? GSRNotificationTypeId { get; set; }
        public string GSRNotificationTypeName { get; set; }
    }

    public class GetGSRNotificationTypeRequest
    {
        public int? GSRNotificationTypeId { get; set; }
    }

    public class GetGSRNotificationTypeResponse
    {
        public int? GSRNotificationTypeId { get; set; }
        public string GSRNotificationTypeName { get; set; }
    }
}