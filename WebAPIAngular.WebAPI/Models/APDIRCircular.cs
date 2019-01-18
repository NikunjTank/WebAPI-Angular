using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class APDIRCircular
    {
        public int? APDIRCircularId { get; set; }
        public int? MasterDirectionId { get; set; }
        public string MasterDirectionName { get; set; }
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

    public class GetAPDIRCircularRequest
    {
        public int? APDIRCircularId { get; set; }
        public int? MasterDirectionId { get; set; }
        public string Year { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsVerified { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetAPDIRCircularResponse
    {
        public int APDIRCircularId { get; set; }
        public int? MasterDirectionId { get; set; }
        public string MasterDirectionName { get; set; }
        public string APDIRCircularNo { get; set; }
        public string APDIRCircularName { get; set; }
        public DateTime APDIRCircularDate { get; set; }
        public DateTime APDIRCircularEffectiveDate { get; set; }
        public string APDIRCircularYearName { get; set; }
        public string Year { get; set; }
        public string APDIRCircularPDF { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddAPDIRCircularRequest
    {
        public int? MasterDirectionId { get; set; }
        [Required]
        public string APDIRCircularNo { get; set; }
        [Required]
        public string APDIRCircularName { get; set; }
        [Required]
        public DateTime APDIRCircularDate { get; set; }
        [Required]
        public DateTime APDIRCircularEffectiveDate { get; set; }
        [Required]
        public string Year { get; set; }
        [Required]
        public string APDIRCircularPDF { get; set; }
    }

    public class UpdateAPDIRCircularRequest
    {
        [Required]
        public int APDIRCircularId { get; set; }
        public int? MasterDirectionId { get; set; }
        [Required]
        public string APDIRCircularNo { get; set; }
        [Required]
        public string APDIRCircularName { get; set; }
        [Required]
        public DateTime APDIRCircularDate { get; set; }
        [Required]
        public DateTime APDIRCircularEffectiveDate { get; set; }
        [Required]
        public string Year { get; set; }
        [Required]
        public string APDIRCircularPDF { get; set; }
    }

    public class DeleteAPDIRCircularRequest
    {
        [Required]
        public int APDIRCircularId { get; set; }
    }

    public class APDIRCircularYear
    {
        public int APDIRCircularYearId { get; set; }
        public string APDIRCircularYearName { get; set; }
    }
}