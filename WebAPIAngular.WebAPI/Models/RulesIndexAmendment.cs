using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class RulesIndexAmendment
    {
        public int? RulesIndexAmendmentId { get; set; }
        public int? RulesId { get; set; }
        public string GSRNotificationIds { get; set; }
        public string GSRNotifications { get; set; }
        public int IndexId { get; set; }
        public string IndexNo { get; set; }
        public string IndexName { get; set; }
        public int? SubIndexId { get; set; }
        public string SubIndexNo { get; set; }
        public string SubIndexName { get; set; }
        public string IndexAmendmentContent { get; set; }
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

    public class GetRulesIndexAmendmentRequest
    {
        public int? RulesIndexAmendmentId { get; set; }
        public int RulesId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsVerified { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetRulesIndexAmendmentResponse
    {
        public int? RulesIndexAmendmentId { get; set; }
        public int? RulesId { get; set; }
        public string GSRNotifications { get; set; }
        public string GSRNotificationIds { get; set; }
        public int IndexId { get; set; }
        public string IndexNo { get; set; }
        public string IndexName { get; set; }
        public int? SubIndexId { get; set; }
        public string SubIndexNo { get; set; }
        public string SubIndexName { get; set; }
        public string IndexAmendmentContent { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddRulesIndexAmendmentRequest
    {
        [Required]
        public int RulesId { get; set; }
        [Required]
        public string GSRNotificationIds { get; set; }
        [Required]
        public int IndexId { get; set; }
        public int? SubIndexId { get; set; }
        [Required]
        public string IndexAmendmentContent { get; set; }
    }

    public class UpdateRulesIndexAmendmentRequest
    {
        [Required]
        public int RulesIndexAmendmentId { get; set; }
        [Required]
        public int RulesId { get; set; }
        [Required]
        public string GSRNotificationIds { get; set; }
        [Required]
        public int IndexId { get; set; }
        public int? SubIndexId { get; set; }
        [Required]
        public string IndexAmendmentContent { get; set; }
    }

    public class DeleteRulesIndexAmendmentRequest
    {
        [Required]
        public int RulesIndexAmendmentId { get; set; }
    }
}