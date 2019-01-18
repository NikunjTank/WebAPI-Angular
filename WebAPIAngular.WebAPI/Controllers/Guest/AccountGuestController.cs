using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using DemystifyFema.Service.Repository;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;

namespace DemystifyFema.Service.Controllers.Guest
{
    [Authorize]
    [RoutePrefix("api")]
    public class AccountGuestController : ApiController
    {
        private IAccount iAccount;
        private ILoginHistory iLoginHistory;
        private IUserProfile iUserProfile;

        #region AccountController Constructor for initialize repositories
        public AccountGuestController()
        {
            try
            {
                iAccount = new AccountRepository();
                iLoginHistory = new LoginHistoryRepository();
                iUserProfile = new UserProfileRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("AccountController (Guest)", null, "Error while initialize repository.", ex.ToString());
            }
        }
        #endregion

        #region Send OTP For Login to User (Access for all users)
        [AllowAnonymous]
        [HttpPost]
        [Route("sendotpforlogin")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult SendOTPForLogin(SendOTPForLoginRequest sendOTPForLoginRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var account = new Account()
                {
                    Mobile = sendOTPForLoginRequest.Mobile
                };
                int resultCheckUserExists = iAccount.CheckUserExists(account);
                if (resultCheckUserExists > 0 && resultCheckUserExists == Convert.ToInt32(Utility.Roles.User))
                {
                    account.MobileOTP = Utility.RandomOtpMobile();

                    string oTPResult = Utility.SendOTPOnSMS(sendOTPForLoginRequest.Mobile, Utility.LoginRegister.Login.ToString(), account.MobileOTP);

                    dynamic deserializeOTPResult = JsonConvert.DeserializeObject<dynamic>(oTPResult);

                    if (deserializeOTPResult.Status == Utility.SUCCESS_STATUS_RESPONSE)
                    {
                        int result = iAccount.OTPUpdateForLogin(account);
                        if (result > 0)
                        {
                            responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                            responses.Description = "OTP sent successfully.";
                        }
                        else
                        {
                            responses.Status = Utility.ERROR_STATUS_RESPONSE;
                            responses.Description = "Invalid Mobile.";
                        }
                    }
                    else
                    {
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Invalid Mobile.";
                    }
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Invalid Mobile.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while sending OTP.";

                Utility.WriteLog("SendOTPForLogin", sendOTPForLoginRequest, "Error while sending OTP. (AccountGuestController)", ex.ToString());
            }
            return Ok(responses);
        }
        #endregion

        #region Login With Mobile for User (Access for all users)
        [AllowAnonymous]
        [HttpPost]
        [Route("loginwithmobile")]
        [ResponseType(typeof(LoginResponse))]
        public IHttpActionResult LoginWithMobile(LoginWithMobileRequest loginWithMobileRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var loginResponse = new LoginResponse();
                var user = iAccount.LoginWithMobile(loginWithMobileRequest);
                if (user != null)
                {
                    int userId = user.UserId;
                    var dateTime = DateTime.Now.ToString("ddMMyyyyhhmmss");
                    var randomText = Convert.ToBase64String(Guid.NewGuid().ToByteArray()).Substring(1, 12);
                    var token = string.Format("{0}|{1}|{2}", userId, dateTime, randomText);

                    loginResponse.Token = Utility.EncryptStringUsingKey(token);
                    loginResponse.RoleId = user.RoleId;
                    loginResponse.UserId = userId;

                    #region Log login 

                    var loginHistory = new LoginHistory()
                    {
                        LoginFrom = loginWithMobileRequest.LoginFrom,
                        UserId = userId,
                        AccessToken = loginResponse.Token
                    };
                    int resultAddLoginHistory = iLoginHistory.AddLoginHistory(loginHistory);

                    #endregion

                    if (resultAddLoginHistory > 0)
                    {
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "Login successfully.";
                    }
                    else
                    {
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while login.";
                    }
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Invalid Mobile or OTP.";
                }

                responses.Response = loginResponse;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while login.";

                Utility.WriteLog("LoginWithMobile", loginWithMobileRequest, "Error while login. (AccountGuestController)", ex.ToString());
            }
            return Ok(responses);
        }
        #endregion

        #region Login With UserName for User (Access for all users)
        [AllowAnonymous]
        [HttpPost]
        [Route("loginwithusername")]
        [ResponseType(typeof(LoginResponse))]
        public IHttpActionResult LoginWithUserName(LoginWithUserNameRequest loginWithUserNameRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var loginResponse = new LoginResponse();
                var user = iAccount.LoginWithUserName(loginWithUserNameRequest);
                if (user != null)
                {
                    int userId = user.UserId;
                    var dateTime = DateTime.Now.ToString("ddMMyyyyhhmmss");
                    var randomText = Convert.ToBase64String(Guid.NewGuid().ToByteArray()).Substring(1, 12);
                    var token = string.Format("{0}|{1}|{2}", userId, dateTime, randomText);

                    loginResponse.Token = Utility.EncryptStringUsingKey(token);
                    loginResponse.RoleId = user.RoleId;

                    #region Log login 

                    var loginHistory = new LoginHistory()
                    {
                        LoginFrom = loginWithUserNameRequest.LoginFrom,
                        UserId = userId,
                        AccessToken = loginResponse.Token
                    };
                    int resultAddLoginHistory = iLoginHistory.AddLoginHistory(loginHistory);

                    #endregion

                    if (resultAddLoginHistory > 0)
                    {
                        responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                        responses.Description = "Login successfully.";
                    }
                    else
                    {
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while login.";
                    }
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Invalid username and password.";
                }

                responses.Response = loginResponse;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while login.";

                Utility.WriteLog("LoginWithUserName", loginWithUserNameRequest, "Error while login. (AccountGuestController)", ex.ToString());
            }
            return Ok(responses);
        }
        #endregion

        #region Logout for User (Access for only logined users)
        [Authorize]
        [HttpPost]
        [Route("logout")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult Logout()
        {
            var responses = new Responses();
            try
            {
                var logoutRequest = new LogoutRequest()
                {
                    AccessToken = Request.Headers.GetValues(ConfigurationManager.AppSettings["TokenKey"]).First().Split(' ')[1]
                };
                int resultLogout = iAccount.Logout(logoutRequest);
                if (resultLogout > 0)
                {
                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "Logout successfully.";
                }
                else if (resultLogout == -1)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Error while logout.";
                }
                else if (resultLogout == -2)
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Invalid User.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while logout.";

                Utility.WriteLog("Logout", null, "Error while logout. (AccountGuestController)", ex.ToString());
            }
            return Ok(responses);
        }
        #endregion

        #region Register for User (Access for all users)
        [AllowAnonymous]
        [HttpPost]
        [Route("userregister")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UserRegister(UserRegisterRequest registerRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var account = new Account()
                {
                    Mobile = registerRequest.Mobile
                };
                int resultCheckUserExists = iAccount.CheckUserExists(account);
                if (resultCheckUserExists == 0)
                {
                    if (registerRequest.RoleId == Convert.ToInt32(Utility.Roles.User))
                    {
                        string mobileOTP = Utility.RandomOtpMobile();
                        string emailOTP = Utility.RandomOtpEmail();

                        string oTPResult = Utility.SendOTPOnSMS(registerRequest.Mobile, Utility.LoginRegister.Register.ToString(), mobileOTP);

                        dynamic deserializeOTPResult = JsonConvert.DeserializeObject<dynamic>(oTPResult);

                        if (deserializeOTPResult.Status == Utility.SUCCESS_STATUS_RESPONSE)
                        {
                            var userProfile = new UserProfile()
                            {
                                RoleId = registerRequest.RoleId,
                                UserName = registerRequest.UserName,
                                Mobile = registerRequest.Mobile,
                                MobileOTP = mobileOTP,
                                EmailOTP = emailOTP,
                                FirstName = registerRequest.FirstName,
                                LastName = registerRequest.LastName,
                                Gender = registerRequest.Gender,
                                CompanyName = registerRequest.CompanyName,
                                ProfessionalQualificationId = registerRequest.ProfessionalQualificationId
                            };
                            int result = iUserProfile.AddUserProfile(userProfile);

                            if (result > 0)
                            {
                                var welComeEmailHtmlCode = System.IO.File.ReadAllText(string.Format("{0}", HttpContext.Current.Server.MapPath(string.Format("{0}{1}", ConfigurationManager.AppSettings["EmailTemplatePath"], ConfigurationManager.AppSettings["WelcomeForUserEmailTemplate"]))));
                                welComeEmailHtmlCode = welComeEmailHtmlCode.Replace("[EMAILID]", registerRequest.UserName);
                                welComeEmailHtmlCode = welComeEmailHtmlCode.Replace("[EMAILOTP]", emailOTP);
                                welComeEmailHtmlCode = welComeEmailHtmlCode.Replace("[SITEURL]", ConfigurationManager.AppSettings["SiteUrl"]);
                                welComeEmailHtmlCode = welComeEmailHtmlCode.Replace("[SITENAME]", ConfigurationManager.AppSettings["SiteName"]);

                                var mainTemplateHtmlCode = System.IO.File.ReadAllText(string.Format("{0}", HttpContext.Current.Server.MapPath(string.Format("{0}{1}", ConfigurationManager.AppSettings["EmailTemplatePath"], ConfigurationManager.AppSettings["MainEmailTemplate"]))));
                                mainTemplateHtmlCode = mainTemplateHtmlCode.Replace("[SITEURL]", ConfigurationManager.AppSettings["SiteUrl"]);
                                mainTemplateHtmlCode = mainTemplateHtmlCode.Replace("[SITENAME]", ConfigurationManager.AppSettings["SiteName"]);
                                mainTemplateHtmlCode = mainTemplateHtmlCode.Replace("[PAGECONTENT]", welComeEmailHtmlCode);

                                string subject = "Welcome in Demystify Fema";
                                string body = mainTemplateHtmlCode;
                                string displayName = ConfigurationManager.AppSettings["SiteName"];
                                bool isSentMail = Utility.SendMail(registerRequest.UserName, string.Empty, string.Empty, subject, body, displayName, string.Empty, true);

                                if (isSentMail)
                                {
                                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                                    responses.Description = "User added successfully. Please verify account by entering OTP which you have received in email and mobile.";
                                }
                                else
                                {
                                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                                    responses.Description = "Error while sending OTP.";
                                }
                            }
                            else if (result == -2)
                            {
                                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                                responses.Description = "Another user is already registered with same mobile.";
                            }
                            else
                            {
                                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                                responses.Description = "Error while adding user.";
                            }
                        }
                        else
                        {
                            responses.Status = Utility.ERROR_STATUS_RESPONSE;
                            responses.Description = "Error while sending OTP.";
                        }
                    }
                }
                else
                {
                    responses.Status = Utility.ERROR_STATUS_RESPONSE;
                    responses.Description = "Another user is already registered with same mobile.";
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while registration.";

                Utility.WriteLog("Register", registerRequest, "Error while registration. (AccountGuestController)", ex.ToString());
            }
            return Ok(responses);
        }
        #endregion

        #region Verify register
        [AllowAnonymous]
        [HttpPost]
        [Route("verifyaccountformobile")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult VerifyAccountForMobile(VerifyAccountForMobileRequest verifyAccountForMobileRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                int result = iAccount.VerifyAccountForMobile(verifyAccountForMobileRequest);
                if (result > 0)
                {
                    try
                    {
                        var verifyAccountHtmlCode = System.IO.File.ReadAllText(string.Format("{0}", HttpContext.Current.Server.MapPath(string.Format("{0}{1}", ConfigurationManager.AppSettings["EmailTemplatePath"], ConfigurationManager.AppSettings["VerifiedAccountEmailTemplate"]))));

                        verifyAccountHtmlCode = verifyAccountHtmlCode.Replace("[EMAILID]", verifyAccountForMobileRequest.UserName);
                        verifyAccountHtmlCode = verifyAccountHtmlCode.Replace("[SITEURL]", ConfigurationManager.AppSettings["SiteUrl"]);
                        verifyAccountHtmlCode = verifyAccountHtmlCode.Replace("[SITENAME]", ConfigurationManager.AppSettings["SiteName"]);

                        var mainTemplateHtmlCode = System.IO.File.ReadAllText(string.Format("{0}", HttpContext.Current.Server.MapPath(string.Format("{0}{1}", ConfigurationManager.AppSettings["EmailTemplatePath"], ConfigurationManager.AppSettings["MainEmailTemplate"]))));
                        mainTemplateHtmlCode = mainTemplateHtmlCode.Replace("[SITEURL]", ConfigurationManager.AppSettings["SiteUrl"]);
                        mainTemplateHtmlCode = mainTemplateHtmlCode.Replace("[SITENAME]", ConfigurationManager.AppSettings["SiteName"]);
                        mainTemplateHtmlCode = mainTemplateHtmlCode.Replace("[PAGECONTENT]", verifyAccountHtmlCode);

                        string subject = "Verified Account";
                        string mailTo = verifyAccountForMobileRequest.UserName;
                        string CC = string.Empty;
                        string BCC = string.Empty;
                        string body = mainTemplateHtmlCode;
                        string displayName = ConfigurationManager.AppSettings["SiteName"];
                        string attachments = string.Empty;
                        Utility.SendMail(mailTo, CC, BCC, subject, body, displayName, attachments, true);
                    }
                    catch (Exception ex)
                    {
                        Utility.WriteLog("VerifyAccount", verifyAccountForMobileRequest, "Error while sending verification email. (AccountController)", ex.ToString());
                    }

                    responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                    responses.Description = "User verified successfully.";
                }
                else
                {
                    if (result == -1)
                    {
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Invalid OTP.";
                    }
                    else
                    {
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Error while verifying user.";
                    }
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while verifying user.";

                Utility.WriteLog("VerifyAccountForMobile", verifyAccountForMobileRequest, "Error while verifying user. (AccountGuestController)", ex.ToString());
            }
            return Ok(responses);
        }
        #endregion
    }
}
