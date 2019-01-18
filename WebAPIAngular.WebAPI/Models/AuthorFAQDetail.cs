using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class AuthorFAQDetail
    {
        public int? AuthorFAQDetailId { get; set; }
        public int? AuthorFAQId { get; set; }
        public int SubTopicId { get; set; }
        public string SubTopicName { get; set; }
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

    public class GetAuthorFAQDetailRequest
    {
        public int? AuthorFAQDetailId { get; set; }
        public int? AuthorFAQId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetAuthorFAQDetailResponse
    {
        public int AuthorFAQDetailId { get; set; }
        public int AuthorFAQId { get; set; }
        public int SubTopicId { get; set; }
        public string SubTopicName { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddAuthorFAQDetailRequest
    {
        [Required]
        public int AuthorFAQId { get; set; }
        [Required]
        public int SubTopicId { get; set; }
    }

    public class UpdateAuthorFAQDetailRequest
    {
        [Required]
        public int AuthorFAQDetailId { get; set; }
        [Required]
        public int AuthorFAQId { get; set; }
        [Required]
        public int SubTopicId { get; set; }
    }

    public class DeleteAuthorFAQDetailRequest
    {
        [Required]
        public int AuthorFAQDetailId { get; set; }
    }
}