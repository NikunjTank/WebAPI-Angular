using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class RBIData
    {
        public int? RBIDataId { get; set; }
        public string RBIDataName { get; set; }
        public string Excel { get; set; }
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

    public class GetRBIDataRequest
    {
        public int? RBIDataId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetRBIDataResponse
    {
        public int RBIDataId { get; set; }
        public string RBIDataName { get; set; }
        public string Excel { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddRBIDataRequest
    {
        [Required]
        public string RBIDataName { get; set; }
        [Required]
        public string Excel { get; set; }
    }

    public class UpdateRBIDataRequest
    {
        [Required]
        public int RBIDataId { get; set; }
        [Required]
        public string RBIDataName { get; set; }
        [Required]
        public string Excel { get; set; }
    }

    public class DeleteRBIDataRequest
    {
        [Required]
        public int RBIDataId { get; set; }
    }
}