using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class FIPBReview
    {
        public int? FIPBReviewId { get; set; }
        public string Name { get; set; }
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

    public class GetFIPBReviewRequest
    {
        public int? FIPBReviewId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsVerified { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetFIPBReviewResponse
    {
        public int FIPBReviewId { get; set; }
        public string Name { get; set; }
        public string PDF { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddFIPBReviewRequest
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string PDF { get; set; }
    }

    public class UpdateFIPBReviewRequest
    {
        [Required]
        public int FIPBReviewId { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string PDF { get; set; }
    }

    public class DeleteFIPBReviewRequest
    {
        [Required]
        public int FIPBReviewId { get; set; }
    }
}