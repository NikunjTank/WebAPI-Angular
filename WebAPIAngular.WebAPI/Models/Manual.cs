using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class Manual
    {
        public int? ManualId { get; set; }
        public string ManualName { get; set; }
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

    public class GetManualRequest
    {
        public int? ManualId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsVerified { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetManualResponse
    {
        public int ManualId { get; set; }
        public string ManualName { get; set; }
        public string PDF { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddManualRequest
    {
        [Required]
        public string ManualName { get; set; }
        [Required]
        public string PDF { get; set; }
    }

    public class UpdateManualRequest
    {
        [Required]
        public int ManualId { get; set; }
        [Required]
        public string ManualName { get; set; }
        [Required]
        public string PDF { get; set; }
    }

    public class DeleteManualRequest
    {
        [Required]
        public int ManualId { get; set; }
    }
}