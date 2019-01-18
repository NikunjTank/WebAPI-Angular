using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class RBIDataDetail
    {
        public int? RBIDataDetailId { get; set; }
        public int? RBIDataId { get; set; }
        public int? Month { get; set; }
        public int? Year { get; set; }
        public string Excel { get; set; }
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

    public class GetRBIDataDetailRequest
    {
        public int? RBIDataDetailId { get; set; }
        public int? RBIDataId { get; set; }
        public int? Month { get; set; }
        public int? Year { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetRBIDataDetailResponse
    {
        public int RBIDataDetailId { get; set; }
        public int RBIDataId { get; set; }
        public int? Month { get; set; }
        public int? Year { get; set; }
        public string Excel { get; set; }
        public string PDF { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddRBIDataDetailRequest
    {
        [Required]
        public int RBIDataId { get; set; }
        [Required]
        public int Month { get; set; }
        [Required]
        public int Year { get; set; }
        [Required]
        public string Excel { get; set; }
        [Required]
        public string PDF { get; set; }
    }

    public class UpdateRBIDataDetailRequest
    {
        [Required]
        public int RBIDataDetailId { get; set; }
        [Required]
        public int RBIDataId { get; set; }
        [Required]
        public int Month { get; set; }
        [Required]
        public int Year { get; set; }
        [Required]
        public string Excel { get; set; }
        [Required]
        public string PDF { get; set; }
    }

    public class DeleteRBIDataDetailRequest
    {
        [Required]
        public int RBIDataDetailId { get; set; }
    }
}