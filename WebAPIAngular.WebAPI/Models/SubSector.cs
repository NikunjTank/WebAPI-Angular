using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class SubSector
    {
        public int? SubSectorId { get; set; }
        public int? SectorId { get; set; }
        public string Name { get; set; }
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

    public class GetSubSectorRequest
    {
        public int? SubSectorId { get; set; }
        public int? SectorId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsVerified { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetSubSectorResponse
    {
        public int? SubSectorId { get; set; }
        public int? SectorId { get; set; }
        public string Name { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddSubSectorRequest
    {
        [Required]
        public int SectorId { get; set; }
        [Required]
        public string Name { get; set; }
    }

    public class UpdateSubSectorRequest
    {
        [Required]
        public int SubSectorId { get; set; }
        [Required]
        public int SectorId { get; set; }
        [Required]
        public string Name { get; set; }
    }

    public class DeleteSubSectorRequest
    {
        [Required]
        public int SubSectorId { get; set; }
    }
}