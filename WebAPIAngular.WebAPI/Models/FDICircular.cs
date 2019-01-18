using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class FDICircular
    {
        public int? FDICircularId { get; set; }
        public string FDICircularName { get; set; }
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

    public class GetFDICircularRequest
    {
        public int? FDICircularId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsVerified { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetFDICircularResponse
    {
        public int? FDICircularId { get; set; }
        public string FDICircularName { get; set; }
        public string Year { get; set; }
        public string PDF { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddFDICircularRequest
    {
        [Required]
        public string FDICircularName { get; set; }
        [Required]
        public string Year { get; set; }
        [Required]
        public string PDF { get; set; }
    }

    public class UpdateFDICircularRequest
    {
        [Required]
        public int FDICircularId { get; set; }
        [Required]
        public string FDICircularName { get; set; }
        [Required]
        public string Year { get; set; }
        [Required]
        public string PDF { get; set; }
    }

    public class DeleteFDICircularRequest
    {
        [Required]
        public int FDICircularId { get; set; }
    }
}