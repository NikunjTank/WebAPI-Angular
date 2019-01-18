using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class MasterCircular
    {
        public int? MasterCircularId { get; set; }
        public string MasterCircularName { get; set; }
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

    public class GetMasterCircularRequest
    {
        public int? MasterCircularId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsVerified { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetMasterCircularResponse
    {
        public int? MasterCircularId { get; set; }
        public string MasterCircularName { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddMasterCircularRequest
    {
        [Required]
        public string MasterCircularName { get; set; }
    }

    public class UpdateMasterCircularRequest
    {
        [Required]
        public int MasterCircularId { get; set; }
        [Required]
        public string MasterCircularName { get; set; }
    }

    public class DeleteMasterCircularRequest
    {
        [Required]
        public int MasterCircularId { get; set; }
    }
}