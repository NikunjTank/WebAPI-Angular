using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class AuthorWriteUp
    {
        public int? AuthorWriteUpId { get; set; }
        public int? TopicId { get; set; }
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

    public class GetAuthorWriteUpRequest
    {
        public int? AuthorWriteUpId { get; set; }
        public int? TopicId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetAuthorWriteUpResponse
    {
        public int AuthorWriteUpId { get; set; }
        public int TopicId { get; set; }
        public string TopicName { get; set; }
        public string PDF { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddAuthorWriteUpRequest
    {
        [Required]
        public int TopicId { get; set; }
        [Required]
        public string PDF { get; set; }
    }

    public class UpdateAuthorWriteUpRequest
    {
        [Required]
        public int AuthorWriteUpId { get; set; }
        [Required]
        public int TopicId { get; set; }
        [Required]
        public string PDF { get; set; }
    }

    public class DeleteAuthorWriteUpRequest
    {
        [Required]
        public int AuthorWriteUpId { get; set; }
    }

    //public class Topic
    //{
    //    public int? TopicId { get; set; }
    //    public string TopicName { get; set; }
    //}

    //public class GetTopicRequest
    //{
    //    public int? TopicId { get; set; }
    //}

    //public class GetTopicResponse
    //{
    //    public int? TopicId { get; set; }
    //    public string TopicName { get; set; }
    //}
}