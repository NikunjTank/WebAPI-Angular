using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class SupportTicketSubTopic
    {
        public int? FEMAModuleId { get; set; }
        public int? SupportTicketSubTopicId { get; set; }
        public string SupportTicketSubTopicName { get; set; }
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

    public class GetSupportTicketSubTopicRequest
    {
        public int? FEMAModuleId { get; set; }
        public int? SupportTicketSubTopicId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetSupportTicketSubTopicResponse
    {
        public int? FEMAModuleId { get; set; }
        public int? SupportTicketSubTopicId { get; set; }
        public string SupportTicketSubTopicName { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

}