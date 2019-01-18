using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class MasterCircularDetail
    {
        public int? MasterCircularDetailId { get; set; }
        public int? MasterCircularId { get; set; }
        public string Year { get; set; }
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

    public class GetMasterCircularDetailRequest
    {
        public int? MasterCircularDetailId { get; set; }
        public int? MasterCircularId { get; set; }
        public string Year { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsVerified { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetMasterCircularDetailResponse
    {
        public int? MasterCircularDetailId { get; set; }
        public int? MasterCircularId { get; set; }
        public string Year { get; set; }
        public string PDF { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddMasterCircularDetailRequest
    {
        [Required]
        public int MasterCircularId { get; set; }
        [Required]
        public string Year { get; set; }
        [Required]
        public string PDF { get; set; }
    }

    public class UpdateMasterCircularDetailRequest
    {
        [Required]
        public int MasterCircularDetailId { get; set; }
        [Required]
        public int MasterCircularId { get; set; }
        [Required]
        public string Year { get; set; }
        [Required]
        public string PDF { get; set; }
    }

    public class DeleteMasterCircularDetailRequest
    {
        [Required]
        public int MasterCircularDetailId { get; set; }
    }
}