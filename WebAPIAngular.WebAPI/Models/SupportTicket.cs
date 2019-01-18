using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class SupportTicket
    {
        public int? SupportTicketId { get; set; }
        public int? UserId { get; set; }
        public bool IsForPostQuery { get; set; }
        public int? DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public int? TopicId { get; set; }
        public int? SubTopicId { get; set; }
        public bool IsMailSentToAdmin { get; set; }
        public string TopicName { get; set; }
        public string SubTopicName { get; set; }
        public string QueryTitle { get; set; }
        public string Query { get; set; }
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

    public class GetSupportTicketRequest
    {
        public int? SupportTicketId { get; set; }
        public bool IsForPostQuery { get; set; }
        public int? TopicId { get; set; }
        public int? SubTopicId { get; set; }
        public int? DepartmentId { get; set; }
        public string SearchText { get; set; }
        public bool IsCurrentUser { get; set; }
        public bool? IsActive { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetSupportTicketResponse
    {
        public int? SupportTicketId { get; set; }
        public int? UserId { get; set; }
        public int? DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public int? TopicId { get; set; }
        public int? SubTopicId { get; set; }
        public string QueryTitle { get; set; }
        public string Query { get; set; }
        public string TopicName { get; set; }
        public string SubTopicName { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddSupportTicketRequest
    {
        public int? TopicId { get; set; }
        public int? SubTopicId { get; set; }
        public int? DepartmentId { get; set; }
        public string QueryTitle { get; set; }
        [Required]
        public string Query { get; set; }
    }

    public class DeleteSupportTicketRequest
    {
        [Required]
        public int SupportTicketId { get; set; }
    }
}