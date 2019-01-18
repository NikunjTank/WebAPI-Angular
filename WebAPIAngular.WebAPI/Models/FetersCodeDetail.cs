using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class FetersCodeDetail
    {
        public int? FetersCodeDetailId { get; set; }
        public int? FetersCodeId { get; set; }
        public string GroupNo { get; set; }
        public string PurposeGroupName { get; set; }
        public int? SerialNo { get; set; }
        public string LRSItem { get; set; }
        public string LRSFetersCode { get; set; }
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

    public class GetFetersCodeDetailRequest
    {
        public int? FetersCodeDetailId { get; set; }
        public int? FetersCodeId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsVerified { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetFetersCodeDetailResponse
    {
        public int FetersCodeDetailId { get; set; }
        public int? FetersCodeId { get; set; }
        public string GroupNo { get; set; }
        public string PurposeGroupName { get; set; }
        public int? SerialNo { get; set; }
        public string LRSItem { get; set; }
        public string LRSFetersCode { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddFetersCodeDetailRequest
    {
        [Required]
        public int FetersCodeId { get; set; }
        public string GroupNo { get; set; }
        public string PurposeGroupName { get; set; }
        public string LRSItem { get; set; }
        public string LRSFetersCode { get; set; }
    }

    public class UpdateFetersCodeDetailRequest
    {
        [Required]
        public int FetersCodeDetailId { get; set; }
        [Required]
        public int FetersCodeId { get; set; }
        public string GroupNo { get; set; }
        public string PurposeGroupName { get; set; }
        public string LRSItem { get; set; }
        public string LRSFetersCode { get; set; }
    }

    public class DeleteFetersCodeDetailRequest
    {
        [Required]
        public int FetersCodeDetailId { get; set; }
    }
}