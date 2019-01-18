using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class AuthorFAQQuestionReply
    {
        public int? AuthorFAQQuestionReplyId { get; set; }
        public int? AuthorFAQDetailId { get; set; }
        public string Question { get; set; }
        public string Reply { get; set; }
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

    public class GetAuthorFAQQuestionReplyRequest
    {
        public int? AuthorFAQQuestionReplyId { get; set; }
        public int? AuthorFAQDetailId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetAuthorFAQQuestionReplyResponse
    {
        public int AuthorFAQQuestionReplyId { get; set; }
        public int AuthorFAQDetailId { get; set; }
        public string Question { get; set; }
        public string Reply { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddAuthorFAQQuestionReplyRequest
    {
        [Required]
        public int AuthorFAQDetailId { get; set; }
        [Required]
        public string Question { get; set; }
        [Required]
        public string Reply { get; set; }
    }

    public class UpdateAuthorFAQQuestionReplyRequest
    {
        [Required]
        public int AuthorFAQQuestionReplyId { get; set; }
        [Required]
        public int AuthorFAQDetailId { get; set; }
        [Required]
        public string Question { get; set; }
        [Required]
        public string Reply { get; set; }
    }

    public class DeleteAuthorFAQQuestionReplyRequest
    {
        [Required]
        public int AuthorFAQQuestionReplyId { get; set; }
    }
}