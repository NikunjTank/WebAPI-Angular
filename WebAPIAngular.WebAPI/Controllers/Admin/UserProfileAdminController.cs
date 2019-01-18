using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using DemystifyFema.Service.Repository;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;

namespace DemystifyFema.Service.Controllers.Admin
{
    [Authorize(Roles = "Admin")]
    [RoutePrefix("admin/api")]
    public class UserProfileAdminController : ApiController
    {
        private IUserProfile iUserProfile;
        public UserProfileAdminController()
        {
            try
            {
                iUserProfile = new UserProfileRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("UserProfileAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("userprofiles")]
        [ResponseType(typeof(List<GetUserProfileResponse>))]
        public IHttpActionResult GetUserProfile([FromUri]GetUserProfileRequest getUserProfileRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getUserProfileRequest == null)
                    getUserProfileRequest = new GetUserProfileRequest();

                if (getUserProfileRequest.PageSize == null)
                    getUserProfileRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var userProfile = new UserProfile()
                {
                    UserId = getUserProfileRequest.UserId,
                    SearchText = getUserProfileRequest.SearchText,
                    IsActive = getUserProfileRequest.IsActive,
                    PageNumber = getUserProfileRequest.PageNumber,
                    PageSize = Convert.ToInt32(getUserProfileRequest.PageSize),
                    IsPagingRequired = (getUserProfileRequest.PageNumber != null) ? true : false,
                    OrderBy = getUserProfileRequest.OrderBy,
                    OrderByDirection = getUserProfileRequest.OrderByDirection
                };
                var userProfiles = iUserProfile.GetUserProfile(userProfile);

                var userProfileList = new List<GetUserProfileResponse>();
                foreach (var userProfileItem in userProfiles)
                {
                    userProfileList.Add(new GetUserProfileResponse()
                    {
                        UserId= userProfileItem.UserId,
                        FirstName = userProfileItem.FirstName,
                        LastName = userProfileItem.LastName,
                        CompanyName = userProfileItem.CompanyName,
                        ProfessionalQualificationId = userProfileItem.ProfessionalQualificationId,
                        ProfessionalQualificationName = userProfileItem.ProfessionalQualificationName,
                        SubscriptionStatus = userProfileItem.SubscriptionStatus,
                        City = userProfileItem.City,
                        UserName = userProfileItem.UserName,
                        Mobile = userProfileItem.Mobile,
                        Gender = userProfileItem.Gender,
                        SubscriptionId = userProfileItem.SubscriptionId,
                        IsActive = Convert.ToBoolean(userProfileItem.IsActive),
                        CreatedBy = userProfileItem.CreatedBy,
                        TotalPageCount = userProfileItem.TotalPageCount,
                        TotalRecord = userProfileItem.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "UserProfile retrieved successfully";
                responses.Response = userProfileList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving UserProfile.";

                Utility.WriteLog("GetUserProfile", getUserProfileRequest, "Error while retrieving UserProfile. (UserProfileAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        #region Send OTP For UserProfile to User
        [HttpPost]
        [Route("sendotpforuserprofile")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult SendOTPForUserProfile(SendOTPForUserProfileRequest sendOTPForUserProfileRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                string mobileOTP = Utility.RandomOtpMobile();
                string emailOTP = Utility.RandomOtpEmail();

                var userProfile = new UserProfile()
                {
                    UserId = sendOTPForUserProfileRequest.UserId,
                    Mobile = sendOTPForUserProfileRequest.Mobile,
                    IsVerified = true
                };

                if (sendOTPForUserProfileRequest.IsSendOTPtoMobile)
                    userProfile.MobileOTP = mobileOTP;

                if (sendOTPForUserProfileRequest.IsSendOTPtoEmail)
                    userProfile.EmailOTP = emailOTP;

                int result = iUserProfile.OTPUpdateForUserProfile(userProfile);
                if (result > 0)
                {
                    bool isSentMessage = false, isSentMail = false;

                    if (sendOTPForUserProfileRequest.IsSendOTPtoMobile)
                    {
                        string oTPResult = Utility.SendOTPOnSMS(sendOTPForUserProfileRequest.Mobile, Utility.LoginRegister.Login.ToString(), mobileOTP);

                        dynamic deserializeOTPResult = JsonConvert.DeserializeObject<dynamic>(oTPResult);
                        isSentMessage = (deserializeOTPResult.Status == Utility.SUCCESS_STATUS_RESPONSE) ? true : false;
                    }

                    if (sendOTPForUserProfileRequest.IsSendOTPtoEmail)
                    {
                        var welComeEmailHtmlCode = System.IO.File.ReadAllText(string.Format("{0}", HttpContext.Current.Server.MapPath(string.Format("{0}{1}", ConfigurationManager.AppSettings["EmailTemplatePath"], ConfigurationManager.AppSettings["WelcomeForUserEmailTemplate"]))));
                        welComeEmailHtmlCode = welComeEmailHtmlCode.Replace("[EMAILID]", sendOTPForUserProfileRequest.UserName);
                        welComeEmailHtmlCode = welComeEmailHtmlCode.Replace("[EMAILOTP]", emailOTP);
                        welComeEmailHtmlCode = welComeEmailHtmlCode.Replace("[SITEURL]", ConfigurationManager.AppSettings["SiteUrl"]);
                        welComeEmailHtmlCode = welComeEmailHtmlCode.Replace("[SITENAME]", ConfigurationManager.AppSettings["SiteName"]);

                        var mainTemplateHtmlCode = System.IO.File.ReadAllText(string.Format("{0}", HttpContext.Current.Server.MapPath(string.Format("{0}{1}", ConfigurationManager.AppSettings["EmailTemplatePath"], ConfigurationManager.AppSettings["MainEmailTemplate"]))));
                        mainTemplateHtmlCode = mainTemplateHtmlCode.Replace("[SITEURL]", ConfigurationManager.AppSettings["SiteUrl"]);
                        mainTemplateHtmlCode = mainTemplateHtmlCode.Replace("[SITENAME]", ConfigurationManager.AppSettings["SiteName"]);
                        mainTemplateHtmlCode = mainTemplateHtmlCode.Replace("[PAGECONTENT]", welComeEmailHtmlCode);

                        string subject = "Verification Email";
                        string body = mainTemplateHtmlCode;
                        string displayName = ConfigurationManager.AppSettings["SiteName"];
                        isSentMail = Utility.SendMail(sendOTPForUserProfileRequest.UserName, string.Empty, string.Empty, subject, body, displayName, string.Empty, true);
                    }

                    if ((!sendOTPForUserProfileRequest.IsSendOTPtoMobile || isSentMessage) && (!sendOTPForUserProfileRequest.IsSendOTPtoEmail || isSentMail))
                    {
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "OTP sent successfully.";
                    }
                    else
                    {
                        if (sendOTPForUserProfileRequest.IsSendOTPtoMobile)
                        {
                            responses.Status = Utility.ERROR_STATUS_RESPONSE;
                            responses.Description = "Invalid Mobile.";
                        }
                        else
                        {
                            responses.Status = Utility.ERROR_STATUS_RESPONSE;
                            responses.Description = "Error while sending OTP.";
                        }
                    }
                }
                else if (result == -1)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "User doesn't exists.";
                }
                else if (result == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Mobile already exists.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while sending OTP.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while sending OTP.";

                Utility.WriteLog("SendOTPForUserProfile", sendOTPForUserProfileRequest, "Error while sending OTP. (UserProfileAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
        #endregion

        [HttpPost]
        [Route("userprofiles/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateUserProfile(UpdateUserProfileRequest updateUserProfileRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var user = new UserProfile()
                {
                    UserId = updateUserProfileRequest.UserId,
                    UserName = updateUserProfileRequest.UserName,
                    FirstName = updateUserProfileRequest.FirstName,
                    LastName = updateUserProfileRequest.LastName,
                    Mobile = updateUserProfileRequest.Mobile,
                    Gender = updateUserProfileRequest.Gender,
                    CompanyName = updateUserProfileRequest.CompanyName,
                    ProfessionalQualificationId = updateUserProfileRequest.ProfessionalQualificationId,
                    City = updateUserProfileRequest.City,
                    MobileOTP = updateUserProfileRequest.MobileOTP,
                    EmailOTP = updateUserProfileRequest.EmailOTP,
                    ModifiedBy = Utility.UserId
                };

                int result = iUserProfile.UpdateUserProfile(user);

                if (result > 0)
                {
                    if (updateUserProfileRequest.MobileOTP != null || updateUserProfileRequest.EmailOTP != null)
                    {
                        var verifyAccountHtmlCode = System.IO.File.ReadAllText(string.Format("{0}", HttpContext.Current.Server.MapPath(string.Format("{0}{1}", ConfigurationManager.AppSettings["EmailTemplatePath"], ConfigurationManager.AppSettings["VerifiedAccountEmailTemplate"]))));

                        verifyAccountHtmlCode = verifyAccountHtmlCode.Replace("[EMAILID]", updateUserProfileRequest.UserName);
                        verifyAccountHtmlCode = verifyAccountHtmlCode.Replace("[SITEURL]", ConfigurationManager.AppSettings["SiteUrl"]);
                        verifyAccountHtmlCode = verifyAccountHtmlCode.Replace("[SITENAME]", ConfigurationManager.AppSettings["SiteName"]);

                        var mainTemplateHtmlCode = System.IO.File.ReadAllText(string.Format("{0}", HttpContext.Current.Server.MapPath(string.Format("{0}{1}", ConfigurationManager.AppSettings["EmailTemplatePath"], ConfigurationManager.AppSettings["MainEmailTemplate"]))));
                        mainTemplateHtmlCode = mainTemplateHtmlCode.Replace("[SITEURL]", ConfigurationManager.AppSettings["SiteUrl"]);
                        mainTemplateHtmlCode = mainTemplateHtmlCode.Replace("[SITENAME]", ConfigurationManager.AppSettings["SiteName"]);
                        mainTemplateHtmlCode = mainTemplateHtmlCode.Replace("[PAGECONTENT]", verifyAccountHtmlCode);

                        string subject = "Verified Account";
                        string mailTo = updateUserProfileRequest.UserName;
                        string CC = string.Empty;
                        string BCC = string.Empty;
                        string body = mainTemplateHtmlCode;
                        string displayName = ConfigurationManager.AppSettings["SiteName"];
                        string attachments = string.Empty;
                        Utility.SendMail(mailTo, CC, BCC, subject, body, displayName, attachments, true);
                    }
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "Profile updated successfully.";
                }
                else if (result == -1)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Invalid OTP.";
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while updating profile.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating profile.";

                Utility.WriteLog("UpdateUserProfile", updateUserProfileRequest, "Error while updating profile. (UserProfileAdminController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
