using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class FAQ
    {
        public int? FAQId { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string TopicName { get; set; }
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

    public class GetFAQRequest
    {
        public int? FAQId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsVerified { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetFAQResponse
    {
        public int? FAQId { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string TopicName { get; set; }
        public string PDF { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddFAQRequest
    {
        [Required]
        public int CategoryId { get; set; }
        [Required]
        public string TopicName { get; set; }
        [Required]
        public string PDF { get; set; }
    }

    public class UpdateFAQRequest
    {
        [Required]
        public int FAQId { get; set; }
        [Required]
        public int CategoryId { get; set; }
        [Required]
        public string TopicName { get; set; }
        [Required]
        public string PDF { get; set; }
    }

    public class DeleteFAQRequest
    {
        [Required]
        public int FAQId { get; set; }
    }
}