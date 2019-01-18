using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class FIPBPressReleaseCase
    {
        public int? FIPBPressReleaseCaseId { get; set; }
        public string MinistryName { get; set; }
        public string MeetingNo_Detail { get; set; }
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

    public class GetFIPBPressReleaseCaseRequest
    {
        public int? FIPBPressReleaseCaseId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsVerified { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetFIPBPressReleaseCaseResponse
    {
        public int FIPBPressReleaseCaseId { get; set; }
        public string MinistryName { get; set; }
        public string MeetingNo_Detail { get; set; }
        public string PDF { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddFIPBPressReleaseCaseRequest
    {
        [Required]
        public string MinistryName { get; set; }
        [Required]
        public string MeetingNo_Detail { get; set; }
        [Required]
        public string PDF { get; set; }
    }

    public class UpdateFIPBPressReleaseCaseRequest
    {
        [Required]
        public int FIPBPressReleaseCaseId { get; set; }
        [Required]
        public string MinistryName { get; set; }
        [Required]
        public string MeetingNo_Detail { get; set; }
        [Required]
        public string PDF { get; set; }
    }

    public class DeleteFIPBPressReleaseCaseRequest
    {
        [Required]
        public int FIPBPressReleaseCaseId { get; set; }
    }
}