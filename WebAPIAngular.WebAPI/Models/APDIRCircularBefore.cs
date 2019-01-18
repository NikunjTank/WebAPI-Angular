using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class APDIRCircularBefore
    {
        public int? APDIRCircularBeforeId { get; set; }
        public int? APDIRCircularParentId { get; set; }
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

    public class GetAPDIRCircularBeforeRequest
    {
        public int? APDIRCircularBeforeId { get; set; }
        public int? APDIRCircularParentId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsVerified { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetAPDIRCircularBeforeResponse
    {
        public int APDIRCircularBeforeId { get; set; }
        public int? APDIRCircularParentId { get; set; }
        public int APDIRCircularId { get; set; }
        public string APDIRCircularNo { get; set; }
        public string APDIRCircularName { get; set; }
        public DateTime APDIRCircularDate { get; set; }
        public DateTime APDIRCircularEffectiveDate { get; set; }
        public string Year { get; set; }
        public string APDIRCircularYearName { get; set; }
        public string APDIRCircularPDF { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddAPDIRCircularBeforeRequest
    {
        [Required]
        public int APDIRCircularParentId { get; set; }
        [Required]
        public int APDIRCircularId { get; set; }
    }

    public class UpdateAPDIRCircularBeforeRequest
    {
        [Required]
        public int APDIRCircularBeforeId { get; set; }
        [Required]
        public int APDIRCircularParentId { get; set; }
        [Required]
        public int APDIRCircularId { get; set; }
    }

    public class DeleteAPDIRCircularBeforeRequest
    {
        [Required]
        public int APDIRCircularBeforeId { get; set; }
    }
}