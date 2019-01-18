using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class MasterDirection
    {
        public int? MasterDirectionId { get; set; }
        public string MasterDirectionName { get; set; }
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

    public class GetMasterDirectionRequest
    {
        public int? MasterDirectionId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsVerified { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetMasterDirectionResponse
    {
        public int? MasterDirectionId { get; set; }
        public string MasterDirectionName { get; set; }
        public string Year { get; set; }
        public string PDF { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddMasterDirectionRequest
    {
        [Required]
        public string MasterDirectionName { get; set; }
        [Required]
        public string Year { get; set; }
        [Required]
        public string PDF { get; set; }
    }

    public class UpdateMasterDirectionRequest
    {
        [Required]
        public int MasterDirectionId { get; set; }
        [Required]
        public string MasterDirectionName { get; set; }
        [Required]
        public string Year { get; set; }
        [Required]
        public string PDF { get; set; }
    }

    public class DeleteMasterDirectionRequest
    {
        [Required]
        public int MasterDirectionId { get; set; }
    }
}