using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class MasterDirectionIndexAmendment
    {
        public int? MasterDirectionIndexAmendmentId { get; set; }
        public int? MasterDirectionId { get; set; }
        public string APDIRCircularIds { get; set; }
        public string APDIRCirculars { get; set; }
        public string NotificationIds { get; set; }
        public string Notifications { get; set; }
        public int MasterDirectionChapterId { get; set; }
        public string Chapter { get; set; }
        public int MasterDirectionIndexId { get; set; }
        public string IndexNo { get; set; }
        public string IndexName { get; set; }
        public int? MasterDirectionSubIndexId { get; set; }
        public string SubIndexNo { get; set; }
        public string SubIndexName { get; set; }
        public string IndexAmendmentContent { get; set; }
        public string Year { get; set; }
        public bool? UpdatedInsertedByRBI { get; set; }
        public DateTime? UpdatedInsertedDateByRBI { get; set; }
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

    public class GetMasterDirectionIndexAmendmentRequest
    {
        public int? MasterDirectionIndexAmendmentId { get; set; }
        public int MasterDirectionId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsVerified { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetMasterDirectionIndexAmendmentResponse
    {
        public int? MasterDirectionIndexAmendmentId { get; set; }
        public int? MasterDirectionId { get; set; }
        public string APDIRCircularIds { get; set; }
        public string APDIRCirculars { get; set; }
        public string NotificationIds { get; set; }
        public string Notifications { get; set; }
        public int MasterDirectionChapterId { get; set; }
        public string Chapter { get; set; }
        public int MasterDirectionIndexId { get; set; }
        public string IndexNo { get; set; }
        public string IndexName { get; set; }
        public int? MasterDirectionSubIndexId { get; set; }
        public string SubIndexNo { get; set; }
        public string SubIndexName { get; set; }
        public string IndexAmendmentContent { get; set; }
        public string Year { get; set; }
        public bool? UpdatedInsertedByRBI { get; set; }
        public DateTime? UpdatedInsertedDateByRBI { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddMasterDirectionIndexAmendmentRequest
    {
        [Required]
        public int MasterDirectionId { get; set; }
        public string APDIRCircularIds { get; set; }
        public string NotificationIds { get; set; }
        [Required]
        public int MasterDirectionChapterId { get; set; }
        [Required]
        public int MasterDirectionIndexId { get; set; }
        public int? MasterDirectionSubIndexId { get; set; }
        [Required]
        public string IndexAmendmentContent { get; set; }
        [Required]
        public string Year { get; set; }
        public bool? UpdatedInsertedByRBI { get; set; }
        public DateTime? UpdatedInsertedDateByRBI { get; set; }
    }

    public class UpdateMasterDirectionIndexAmendmentRequest
    {
        [Required]
        public int MasterDirectionIndexAmendmentId { get; set; }
        [Required]
        public int MasterDirectionId { get; set; }
        public string APDIRCircularIds { get; set; }
        public string NotificationIds { get; set; }
        [Required]
        public int MasterDirectionChapterId { get; set; }
        [Required]
        public int MasterDirectionIndexId { get; set; }
        public int? MasterDirectionSubIndexId { get; set; }
        [Required]
        public string IndexAmendmentContent { get; set; }
        [Required]
        public string Year { get; set; }
        public bool? UpdatedInsertedByRBI { get; set; }
        public DateTime? UpdatedInsertedDateByRBI { get; set; }
    }

    public class DeleteMasterDirectionIndexAmendmentRequest
    {
        [Required]
        public int MasterDirectionIndexAmendmentId { get; set; }
    }
}