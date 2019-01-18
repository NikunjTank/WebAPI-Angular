using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class SectorDetail
    {
        public int? SectorDetailId { get; set; }
        public int? SectorId { get; set; }
        public int? SubSectorId { get; set; }
        public string SubSectorName { get; set; }
        public int? Year { get; set; }
        public string PressNoteId { get; set; }
        public string PressNoteNos { get; set; }
        public string NotificationId { get; set; }
        public string NotificationNos { get; set; }
        public string APDIRCircularId { get; set; }
        public string APDIRCircularNos { get; set; }
        public string PressNotePDFs { get; set; }
        public string NotificationPDFs { get; set; }
        public string APDIRCircularPDFs { get; set; }
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

    public class GetSectorDetailRequest
    {
        public int? SectorDetailId { get; set; }
        public int? SectorId { get; set; }
        public int? SubSectorId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsVerified { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetSectorDetailResponse
    {
        public int? SectorDetailId { get; set; }
        public int? SectorId { get; set; }
        public int? SubSectorId { get; set; }
        public string SubSectorName { get; set; }
        public int? Year { get; set; }
        public string PressNoteId { get; set; }
        public string PressNoteNos { get; set; }
        public string NotificationId { get; set; }
        public string NotificationNos { get; set; }
        public string APDIRCircularId { get; set; }
        public string APDIRCircularNos { get; set; }
        public string PressNotePDFs { get; set; }
        public string NotificationPDFs { get; set; }
        public string APDIRCircularPDFs { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddSectorDetailRequest
    {
        [Required]
        public int SectorId { get; set; }        
        public int? SubSectorId { get; set; }
        [Required]
        public int Year { get; set; }
        public string PressNoteId { get; set; }
        public string NotificationId { get; set; }
        public string APDIRCircularId { get; set; }
    }

    public class UpdateSectorDetailRequest
    {
        [Required]
        public int SectorDetailId { get; set; }
        [Required]
        public int SectorId { get; set; }
        public int? SubSectorId { get; set; }
        [Required]
        public int Year { get; set; }
        public string PressNoteId { get; set; }
        public string NotificationId { get; set; }
        public string APDIRCircularId { get; set; }
    }

    public class DeleteSectorDetailRequest
    {
        [Required]
        public int SectorDetailId { get; set; }
    }
}