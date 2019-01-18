using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class PressNote
    {
        public int? PressNoteId { get; set; }
        public string PressNoteNo { get; set; }
        public string PressNoteName { get; set; }
        public DateTime PressNoteDate { get; set; }
        public DateTime PressNoteEffectiveDate { get; set; }
        public string Year { get; set; }
        public string PressNotePDF { get; set; }
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

    public class GetPressNoteRequest
    {
        public int? PressNoteId { get; set; }
        public string Year { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsVerified { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetPressNoteResponse
    {
        public int PressNoteId { get; set; }
        public string PressNoteNo { get; set; }
        public string PressNoteName { get; set; }
        public DateTime PressNoteDate { get; set; }
        public DateTime PressNoteEffectiveDate { get; set; }
        public string Year { get; set; }
        public string PressNotePDF { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddPressNoteRequest
    {
        [Required]
        public string PressNoteNo { get; set; }
        [Required]
        public string PressNoteName { get; set; }
        [Required]
        public DateTime PressNoteDate { get; set; }
        [Required]
        public DateTime PressNoteEffectiveDate { get; set; }
        [Required]
        public string Year { get; set; }
        [Required]
        public string PressNotePDF { get; set; }
    }

    public class UpdatePressNoteRequest
    {
        [Required]
        public int PressNoteId { get; set; }
        [Required]
        public string PressNoteNo { get; set; }
        [Required]
        public string PressNoteName { get; set; }
        [Required]
        public DateTime PressNoteDate { get; set; }
        [Required]
        public DateTime PressNoteEffectiveDate { get; set; }
        [Required]
        public string Year { get; set; }
        [Required]
        public string PressNotePDF { get; set; }
    }

    public class DeletePressNoteRequest
    {
        [Required]
        public int PressNoteId { get; set; }
    }
}