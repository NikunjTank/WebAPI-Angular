using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class PressNoteAPDIRCircular
    {
        public int? PressNoteAPDIRCircularId { get; set; }
        public int? PressNoteId { get; set; }
        public int APDIRCircularId { get; set; }
        public string APDIRCircularNo { get; set; }
        public string APDIRCircularName { get; set; }
        public DateTime APDIRCircularDate { get; set; }
        public DateTime APDIRCircularEffectiveDate { get; set; }
        public string Year { get; set; }
        public string APDIRCircularPDF { get; set; }
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

    public class GetPressNoteAPDIRCircularRequest
    {
        public int? PressNoteAPDIRCircularId { get; set; }
        public int? PressNoteId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsVerified { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetPressNoteAPDIRCircularResponse
    {
        public int? PressNoteAPDIRCircularId { get; set; }
        public int? PressNoteId { get; set; }
        public int APDIRCircularId { get; set; }
        public string APDIRCircularNo { get; set; }
        public string APDIRCircularName { get; set; }
        public DateTime APDIRCircularDate { get; set; }
        public DateTime APDIRCircularEffectiveDate { get; set; }
        public string Year { get; set; }
        public string APDIRCircularPDF { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddPressNoteAPDIRCircularRequest
    {
        [Required]
        public int PressNoteId { get; set; }
        [Required]
        public int APDIRCircularId { get; set; }
    }

    public class UpdatePressNoteAPDIRCircularRequest
    {
        [Required]
        public int PressNoteAPDIRCircularId { get; set; }
        [Required]
        public int PressNoteId { get; set; }
        [Required]
        public int APDIRCircularId { get; set; }
    }

    public class DeletePressNoteAPDIRCircularRequest
    {
        [Required]
        public int PressNoteAPDIRCircularId { get; set; }
    }
}