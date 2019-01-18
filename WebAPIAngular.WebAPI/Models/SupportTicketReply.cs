using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class SupportTicketReply
    {
        public int? SupportTicketId { get; set; }
        public int? SupportTicketReplyId { get; set; }
        public int? UserId { get; set; }
        public string QueryReply { get; set; }
        public string EmailId { get; set; }
        public bool? IsMailSentToAdmin { get; set; }
        public bool? IsMailSentToUser { get; set; }
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

    public class GetSupportTicketReplyRequest
    {
        public int? SupportTicketId { get; set; }
        public int? UserId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetSupportTicketReplyResponse
    {
        public int? SupportTicketId { get; set; }
        public int? SupportTicketReplyId { get; set; }
        public int? UserId { get; set; }
        public int? CurrentUserId { get; set; }
        public string QueryReply { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddSupportTicketReplyRequest
    {
        [Required]
        public bool IsForPostQuery { get; set; }
        [Required]
        public int SupportTicketId { get; set; }
        [Required]
        public string QueryReply { get; set; }
    }

    public class DeleteSupportTicketReplyRequest
    {
        [Required]
        public int SupportTicketReplyId { get; set; }
    }
}