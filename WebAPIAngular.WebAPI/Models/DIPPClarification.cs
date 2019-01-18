using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class DIPPClarification
    {
        public int? DIPPClarificationId { get; set; }
        public string ClarificationTopic { get; set; }
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

    public class GetDIPPClarificationRequest
    {
        public int? DIPPClarificationId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsVerified { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetDIPPClarificationResponse
    {
        public int DIPPClarificationId { get; set; }
        public string ClarificationTopic { get; set; }
        public string PDF { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddDIPPClarificationRequest
    {
        [Required]
        public string ClarificationTopic { get; set; }
        [Required]
        public string PDF { get; set; }
    }

    public class UpdateDIPPClarificationRequest
    {
        [Required]
        public int DIPPClarificationId { get; set; }
        [Required]
        public string ClarificationTopic { get; set; }
        [Required]
        public string PDF { get; set; }
    }

    public class DeleteDIPPClarificationRequest
    {
        [Required]
        public int DIPPClarificationId { get; set; }
    }
}