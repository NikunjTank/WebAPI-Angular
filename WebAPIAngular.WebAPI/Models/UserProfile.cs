using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class UserProfile
    {
        public int? UserId { get; set; }
        public int? RoleId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string CompanyName { get; set; }
        public int ProfessionalQualificationId { get; set; }
        public string ProfessionalQualificationName { get; set; }
        public string SubscriptionStatus { get; set; }
        public string City { get; set; }
        public string UserName { get; set; }
        public string Mobile { get; set; }
        public string MobileOTP { get; set; }
        public string EmailOTP { get; set; }
        public string Gender { get; set; }
        public bool? IsDeleted { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsVerified { get; set; }
        public int? SubscriptionId { get; set; }
        public int CreatedBy { get; set; }
        public int ModifiedBy { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
        public bool IsPagingRequired { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
        public int Result { get; set; }
    }

    public class GetUserProfileRequest
    {
        public int? UserId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsVerified { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetUserProfileResponse
    {
        public int? UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string CompanyName { get; set; }
        public int ProfessionalQualificationId { get; set; }
        public string ProfessionalQualificationName { get; set; }
        public string SubscriptionStatus { get; set; }
        public string City { get; set; }
        public string UserName { get; set; }
        public int? SubscriptionId { get; set; }
        public string Mobile { get; set; }
        public string Gender { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class AddUserProfileRequest
    {
        [Required]
        public int RoleId { get; set; }
        [Required]
        public string UserName { get; set; }
        [Required]
        public string Mobile { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public int ProfessionalQualificationId { get; set; }
        public string CompanyName { get; set; }
        public string City { get; set; }
        [Required]
        public string Gender { get; set; }
    }

    public class UpdateUserProfileRequest
    {
        public int UserId { get; set; }
        [Required]
        public string Mobile { get; set; }
        [Required]
        public string UserName { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public string Gender { get; set; }
        [Required]
        public int ProfessionalQualificationId { get; set; }
        public string CompanyName { get; set; }
        public string City { get; set; }
        public string MobileOTP { get; set; }
        public string EmailOTP { get; set; }
    }

    public class SendOTPForUserProfileRequest
    {
        public int UserId { get; set; }
        [Required]
        public string Mobile { get; set; }
        [Required]
        public string UserName { get; set; }
        [Required]
        public bool IsSendOTPtoMobile { get; set; }
        [Required]
        public bool IsSendOTPtoEmail { get; set; }
        public bool IsVerified { get; set; }
    }
}