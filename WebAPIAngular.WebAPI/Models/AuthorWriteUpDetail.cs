using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class AuthorWriteUpDetail
    {
        public int? AuthorWriteUpDetailId { get; set; }
        public int? AuthorWriteUpId { get; set; }
        public int SubTopicId { get; set; }
        public string SubTopicName { get; set; }
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

    public class GetAuthorWriteUpDetailRequest
    {
        public int? AuthorWriteUpDetailId { get; set; }
        public int? AuthorWriteUpId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetAuthorWriteUpDetailResponse
    {
        public int AuthorWriteUpDetailId { get; set; }
        public int AuthorWriteUpId { get; set; }
        public int SubTopicId { get; set; }
        public string SubTopicName { get; set; }
        public string PDF { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddAuthorWriteUpDetailRequest
    {
        [Required]
        public int AuthorWriteUpId { get; set; }
        [Required]
        public int SubTopicId { get; set; }
        [Required]
        public string PDF { get; set; }
    }

    public class UpdateAuthorWriteUpDetailRequest
    {
        [Required]
        public int AuthorWriteUpDetailId { get; set; }
        [Required]
        public int AuthorWriteUpId { get; set; }
        [Required]
        public int SubTopicId { get; set; }
        [Required]
        public string PDF { get; set; }
    }

    public class DeleteAuthorWriteUpDetailRequest
    {
        [Required]
        public int AuthorWriteUpDetailId { get; set; }
    }

    public class SubTopic
    {
        public int? SubTopicId { get; set; }
        public string SubTopicName { get; set; }
    }

    public class GetSubTopicRequest
    {
        public int? SubTopicId { get; set; }
    }

    public class GetSubTopicResponse
    {
        public int? SubTopicId { get; set; }
        public string SubTopicName { get; set; }
    }
}