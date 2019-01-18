using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class NICCode
    {
        public int? NICCodeId { get; set; }
        public string NICCodeName { get; set; }
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

    public class GetNICCodeRequest
    {
        public int? NICCodeId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsVerified { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetNICCodeResponse
    {
        public int NICCodeId { get; set; }
        public string NICCodeName { get; set; }
        public string PDF { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddNICCodeRequest
    {
        [Required]
        public string NICCodeName { get; set; }
        [Required]
        public string PDF { get; set; }
    }

    public class UpdateNICCodeRequest
    {
        [Required]
        public int NICCodeId { get; set; }
        [Required]
        public string NICCodeName { get; set; }
        [Required]
        public string PDF { get; set; }
    }

    public class DeleteNICCodeRequest
    {
        [Required]
        public int NICCodeId { get; set; }
    }
}