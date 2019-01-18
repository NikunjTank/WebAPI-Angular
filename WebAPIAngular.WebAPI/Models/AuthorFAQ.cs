using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class AuthorFAQ
    {
        public int? AuthorFAQId { get; set; }
        public int TopicId { get; set; }
        public string TopicName { get; set; }
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

    public class GetAuthorFAQRequest
    {
        public int? AuthorFAQId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetAuthorFAQResponse
    {
        public int AuthorFAQId { get; set; }
        public int TopicId { get; set; }
        public string TopicName { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddAuthorFAQRequest
    {
        [Required]
        public int TopicId { get; set; }
    }

    public class UpdateAuthorFAQRequest
    {
        [Required]
        public int AuthorFAQId { get; set; }
        [Required]
        public int TopicId { get; set; }
    }

    public class DeleteAuthorFAQRequest
    {
        [Required]
        public int AuthorFAQId { get; set; }
    }
}