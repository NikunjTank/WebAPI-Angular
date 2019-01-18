using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class FDIChapter
    {
        public int? FDIChapterId { get; set; }
        public int? FDICircularId { get; set; }
        public string Chapter { get; set; }
        public int? SortId { get; set; }
        public int? SaveAfterChapterId { get; set; }
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

    public class GetFDIChapterRequest
    {
        public int? FDIChapterId { get; set; }
        public int? FDICircularId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsVerified { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetFDIChapterResponse
    {
        public int? FDIChapterId { get; set; }
        public int? FDICircularId { get; set; }
        public string Chapter { get; set; }
        public int? SortId { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddFDIChapterRequest
    {
        [Required]
        public int? FDICircularId { get; set; }
        [Required]
        public string Chapter { get; set; }
        public int? SaveAfterChapterId { get; set; }
    }

    public class UpdateFDIChapterRequest
    {
        [Required]
        public int FDIChapterId { get; set; }
        [Required]
        public int? FDICircularId { get; set; }
        [Required]
        public string Chapter { get; set; }
        public int? SaveAfterChapterId { get; set; }
    }

    public class DeleteFDIChapterRequest
    {
        [Required]
        public int FDIChapterId { get; set; }
    }
}