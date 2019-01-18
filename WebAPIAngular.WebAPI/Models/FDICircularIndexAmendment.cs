using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class FDICircularIndexAmendment
    {
        public int? FDICircularIndexAmendmentId { get; set; }
        public int? FDICircularId { get; set; }
        public string PressNoteIds { get; set; }
        public string PressNotes { get; set; }
        public int FDIChapterId { get; set; }
        public string Chapter { get; set; }
        public int FDICircularIndexId { get; set; }
        public string IndexNo { get; set; }
        public int? FDICircularSubIndexId { get; set; }
        public string SubIndexNo { get; set; }
        public string IndexAmendmentContent { get; set; }
        public string Year { get; set; }
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

    public class GetFDICircularIndexAmendmentRequest
    {
        public int? FDICircularIndexAmendmentId { get; set; }
        public int FDICircularId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsVerified { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetFDICircularIndexAmendmentResponse
    {
        public int? FDICircularIndexAmendmentId { get; set; }
        public int? FDICircularId { get; set; }
        public string PressNoteIds { get; set; }
        public string PressNotes { get; set; }
        public int FDIChapterId { get; set; }
        public string Chapter { get; set; }
        public int FDICircularIndexId { get; set; }
        public string IndexNo { get; set; }
        public int? FDICircularSubIndexId { get; set; }
        public string SubIndexNo { get; set; }
        public string IndexAmendmentContent { get; set; }
        public string Year { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddFDICircularIndexAmendmentRequest
    {
        [Required]
        public int FDICircularId { get; set; }
        [Required]
        public string PressNoteIds { get; set; }
        [Required]
        public int FDIChapterId { get; set; }
        [Required]
        public int FDICircularIndexId { get; set; }
        public int? FDICircularSubIndexId { get; set; }
        [Required]
        public string IndexAmendmentContent { get; set; }
        [Required]
        public string Year { get; set; }
    }

    public class UpdateFDICircularIndexAmendmentRequest
    {
        [Required]
        public int FDICircularIndexAmendmentId { get; set; }
        [Required]
        public int FDICircularId { get; set; }
        [Required]
        public string PressNoteIds { get; set; }
        [Required]
        public int FDIChapterId { get; set; }
        [Required]
        public int FDICircularIndexId { get; set; }
        public int? FDICircularSubIndexId { get; set; }
        [Required]
        public string IndexAmendmentContent { get; set; }
        [Required]
        public string Year { get; set; }
    }

    public class DeleteFDICircularIndexAmendmentRequest
    {
        [Required]
        public int FDICircularIndexAmendmentId { get; set; }
    }
}