using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class Account
    {
        public int UserId { get; set; }
        public int RoleId { get; set; }
        public string RoleName { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string NewPassword { get; set; }
        public string Mobile { get; set; }
        public string MobileOTP { get; set; }
        public string VerificationToken { get; set; }
        public int ModifiedBy { get; set; }
        public bool? IsActive { get; set; }
        public int? Result { get; set; }
    }

    public class UserRegisterRequest
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
        public string Gender { get; set; }
        [Required]
        public string CompanyName { get; set; }
        [Required]
        public int ProfessionalQualificationId { get; set; }
    }

    public class VerifyAccountForMobileRequest
    {
        [Required]
        public string UserName { get; set; }
        [Required]
        public string Mobile { get; set; }
        [Required]
        public string MobileOTP { get; set; }
        [Required]
        public string EmailOTP { get; set; }
    }

    public class SendOTPForLoginRequest
    {
        [Required]
        public string Mobile { get; set; }
    }

    public class LoginWithMobileRequest
    {
        [Required]
        public string Mobile { get; set; }
        [Required]
        public string MobileOTP { get; set; }
        public string LoginFrom { get; set; }
    }

    public class LoginWithUserNameRequest
    {
        [Required]
        public string UserName { get; set; }
        [Required]
        public string Password { get; set; }
        public string LoginFrom { get; set; }
    }

    public class LoginResponse
    {
        public string Token { get; set; }
        public int RoleId { get; set; }
        public int UserId { get; set; }
    }

    public class LogoutRequest
    {
        public string AccessToken { get; set; }
    }
}