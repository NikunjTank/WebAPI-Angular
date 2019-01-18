using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class FetersCodeGroupDetail
    {
        public int? FetersCodeGroupDetailId { get; set; }
        public int? FetersCodeDetailId { get; set; }
        public string PurposeCode { get; set; }
        public string Description { get; set; }
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

    public class GetFetersCodeGroupDetailRequest
    {
        public int? FetersCodeGroupDetailId { get; set; }
        public int? FetersCodeDetailId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsVerified { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetFetersCodeGroupDetailResponse
    {
        public int FetersCodeGroupDetailId { get; set; }
        public int? FetersCodeDetailId { get; set; }
        public string PurposeCode { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddFetersCodeGroupDetailRequest
    {
        [Required]
        public int FetersCodeDetailId { get; set; }
        public string PurposeCode { get; set; }
        public string Description { get; set; }
    }

    public class UpdateFetersCodeGroupDetailRequest
    {
        [Required]
        public int FetersCodeGroupDetailId { get; set; }
        [Required]
        public int FetersCodeDetailId { get; set; }
        public string PurposeCode { get; set; }
        public string Description { get; set; }
    }

    public class DeleteFetersCodeGroupDetailRequest
    {
        [Required]
        public int FetersCodeGroupDetailId { get; set; }
    }
}