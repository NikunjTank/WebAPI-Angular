using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class IndexAmendment
    {
        public int? IndexAmendmentId { get; set; }
        public int? RegulationId { get; set; }
        public string NotificationIds { get; set; }
        public string Notifications { get; set; }
        public string RegulationName { get; set; }
        public string RegulationNumber { get; set; }
        public int IndexId { get; set; }
        public string IndexNo { get; set; }
        public string IndexName { get; set; }
        public int? SubIndexId { get; set; }
        public string SubIndexNumber { get; set; }
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

    public class GetIndexAmendmentRequest
    {
        public int? IndexAmendmentId { get; set; }
        public int? RegulationId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsVerified { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetIndexAmendmentResponse
    {
        public int? IndexAmendmentId { get; set; }
        public int? RegulationId { get; set; }
        public string NotificationIds { get; set; }
        public string Notifications { get; set; }
        public string RegulationName { get; set; }
        public string RegulationNumber { get; set; }
        public int IndexId { get; set; }
        public string IndexNo { get; set; }
        public string IndexName { get; set; }
        public int? SubIndexId { get; set; }
        public string SubIndexNumber { get; set; }
        public string SubIndexName { get; set; }
        public string IndexAmendmentContent { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddIndexAmendmentRequest
    {
        [Required]
        public int RegulationId { get; set; }
        [Required]
        public string NotificationIds { get; set; }
        [Required]
        public int IndexId { get; set; }
        public int? SubIndexId { get; set; }
        [Required]
        public string IndexAmendmentContent { get; set; }
    }

    public class UpdateIndexAmendmentRequest
    {
        [Required]
        public int IndexAmendmentId { get; set; }
        [Required]
        public int RegulationId { get; set; }
        [Required]
        public string NotificationIds { get; set; }
        [Required]
        public int IndexId { get; set; }
        public int? SubIndexId { get; set; }
        [Required]
        public string IndexAmendmentContent { get; set; }
    }

    public class DeleteIndexAmendmentRequest
    {
        [Required]
        public int IndexAmendmentId { get; set; }
    }
}