using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class MasterDirectionFAQ
    {
        public int? MasterDirectionFAQId { get; set; }
        public int? MasterDirectionId { get; set; }
        public int FAQId { get; set; }
        public string TopicName { get; set; }
        public string CategoryName { get; set; }
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

    public class GetMasterDirectionFAQRequest
    {
        public int? MasterDirectionFAQId { get; set; }
        public int? MasterDirectionId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsVerified { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetMasterDirectionFAQResponse
    {
        public int? MasterDirectionFAQId { get; set; }
        public int? MasterDirectionId { get; set; }
        public int FAQId { get; set; }
        public string TopicName { get; set; }
        public string CategoryName { get; set; }
        public string PDF { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddMasterDirectionFAQRequest
    {
        [Required]
        public int MasterDirectionId { get; set; }
        [Required]
        public int FAQId { get; set; }
    }

    public class UpdateMasterDirectionFAQRequest
    {
        [Required]
        public int MasterDirectionFAQId { get; set; }
        [Required]
        public int MasterDirectionId { get; set; }
        [Required]
        public int FAQId { get; set; }
    }

    public class DeleteMasterDirectionFAQRequest
    {
        [Required]
        public int MasterDirectionFAQId { get; set; }
    }
}