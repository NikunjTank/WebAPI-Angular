using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using DemystifyFema.Service.Repository;
using System;
using System.Collections.Generic;
using System.Configuration;
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
    public class SubscriptionAdminController : ApiController
    {
        private ISubscription iSubscription;
        private IUserProfile iUserProfile;
        public SubscriptionAdminController()
        {
            try
            {
                iSubscription = new SubscriptionRepository();
                iUserProfile = new UserProfileRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("SubscriptionAdminController (Admin)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("subscriptions")]
        [ResponseType(typeof(List<GetSubscriptionResponse>))]
        public IHttpActionResult GetSubscription([FromUri]GetSubscriptionRequest getSubscriptionRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getSubscriptionRequest == null)
                    getSubscriptionRequest = new GetSubscriptionRequest();

                if (getSubscriptionRequest.PageSize == null)
                    getSubscriptionRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var subscription = new Subscription()
                {
                    SubscriptionId = getSubscriptionRequest.SubscriptionId,
                    UserId = getSubscriptionRequest.UserId,
                    PackageId = getSubscriptionRequest.PackageId,
                    SearchText = getSubscriptionRequest.SearchText,
                    IsActive = getSubscriptionRequest.IsActive,
                    PageNumber = getSubscriptionRequest.PageNumber,
                    PageSize = Convert.ToInt32(getSubscriptionRequest.PageSize),
                    IsPagingRequired = (getSubscriptionRequest.PageNumber != null) ? true : false,
                    OrderBy = getSubscriptionRequest.OrderBy,
                    OrderByDirection = getSubscriptionRequest.OrderByDirection
                };
                var subscriptions = iSubscription.GetSubscription(subscription);

                var subscriptionList = new List<GetSubscriptionResponse>();
                foreach (var subscriptionDetail in subscriptions)
                {
                    subscriptionList.Add(new GetSubscriptionResponse()
                    {
                        SubscriptionId = Convert.ToInt32(subscriptionDetail.SubscriptionId),
                        UserId = Convert.ToInt32(subscriptionDetail.UserId),
                        UserName = subscriptionDetail.UserName,
                        PackageId = Convert.ToInt32(subscriptionDetail.PackageId),
                        PackageName = subscriptionDetail.PackageName,
                        StartDate = subscriptionDetail.StartDate,
                        EndDate = subscriptionDetail.EndDate,
                        PaymentDate = subscriptionDetail.PaymentDate,
                        SubscriptionStatus = subscriptionDetail.SubscriptionStatus,
                        Amount = subscriptionDetail.Amount,
                        IsExpired = Convert.ToBoolean(subscriptionDetail.IsExpired),
                        IsPending = subscriptionDetail.IsPending,
                        IsCanceled = subscriptionDetail.IsCanceled,
                        CancellationDate = subscriptionDetail.CancellationDate,
                        ActivationDate = subscriptionDetail.ActivationDate,
                        IsActive = Convert.ToBoolean(subscriptionDetail.IsActive),
                        CreatedBy = subscriptionDetail.CreatedBy,
                        TotalPageCount = subscriptionDetail.TotalPageCount,
                        TotalRecord = subscriptionDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "Subscription retrieved successfully";
                responses.Response = subscriptionList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving Subscription.";

                Utility.WriteLog("GetSubscription", getSubscriptionRequest, "Error while retrieving Subscription. (SubscriptionAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

        [HttpPost]
        [Route("subscriptions/update")]
        [ResponseType(typeof(Responses))]
        public IHttpActionResult UpdateSubscription(UpdateSubscriptionRequest updateSubscriptionRequest)
        {
            var responses = new Responses();
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                var Subscription = new Subscription()
                {
                    SubscriptionId = updateSubscriptionRequest.SubscriptionId,
                    StartDate = updateSubscriptionRequest.StartDate,
                    PaymentDate = updateSubscriptionRequest.PaymentDate,
                    IsExpired = updateSubscriptionRequest.IsExpired,
                    IsActive = updateSubscriptionRequest.IsActive,
                    ModifiedBy = Utility.UserId
                };
                int result = iSubscription.UpdateSubscription(Subscription);
                switch (result)
                {
                    case -2:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Subscription already exists.";
                        break;
                    case -3:
                        responses.Status = Utility.ERROR_STATUS_RESPONSE;
                        responses.Description = "Subscription doesn't exist.";
                        break;
                    default:
                        if (result > 0)
                        {
                            string userName = string.Empty;
                            var userProfile = new UserProfile()
                            {
                                UserId = updateSubscriptionRequest.UserId
                            };
                            var userProfiles = iUserProfile.GetUserProfile(userProfile);
                            if (userProfiles != null)
                            {
                                userName = userProfiles.First().UserName;

                                var SubscriptionEmailHtmlCode = System.IO.File.ReadAllText(string.Format("{0}", HttpContext.Current.Server.MapPath(string.Format("{0}{1}", ConfigurationManager.AppSettings["EmailTemplatePath"], (updateSubscriptionRequest.StartDate != null ? ConfigurationManager.AppSettings["SubscriptionUpdateEmailTemplateForUser"] : ConfigurationManager.AppSettings["UnsubscriptionEmailTemplateForUser"])))));

                                var mainTemplateHtmlCode = System.IO.File.ReadAllText(string.Format("{0}", HttpContext.Current.Server.MapPath(string.Format("{0}{1}", ConfigurationManager.AppSettings["EmailTemplatePath"], ConfigurationManager.AppSettings["MainEmailTemplate"]))));
                                mainTemplateHtmlCode = mainTemplateHtmlCode.Replace("[SITEURL]", ConfigurationManager.AppSettings["SiteUrl"]);
                                mainTemplateHtmlCode = mainTemplateHtmlCode.Replace("[SITENAME]", ConfigurationManager.AppSettings["SiteName"]);
                                mainTemplateHtmlCode = mainTemplateHtmlCode.Replace("[PAGECONTENT]", SubscriptionEmailHtmlCode);

                                string subject = "Subscription | Demystify Fema";
                                string body = mainTemplateHtmlCode;
                                string displayName = ConfigurationManager.AppSettings["SiteName"];
                                string emailTo = userName;
                                bool isMailSentToUser = Utility.SendMail(emailTo, string.Empty, string.Empty, subject, body, displayName, string.Empty, true);

                                try
                                {
                                    var subscriptionHistory = new SubscriptionHistory()
                                    {
                                        SubscriptionHistoryId = result,
                                        IsMailSentToUser = isMailSentToUser,
                                        ModifiedBy = Utility.UserId
                                    };
                                    iSubscription.UpdateSubscriptionHistoryMailSent(subscriptionHistory);
                                }
                                catch (Exception ex)
                                {
                                    Utility.WriteLog("AddSubscription", updateSubscriptionRequest, "Error while updating Subscription History mail sent. (SubscriptionUserController)", ex.ToString());
                                }
                            }

                            responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                            responses.Description = "Subscription updated successfully.";
                        }
                        else
                        {
                            responses.Status = Utility.ERROR_STATUS_RESPONSE;
                            responses.Description = "Error while updating Subscription.";
                        }
                        break;
                }
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while updating Subscription.";

                Utility.WriteLog("UpdateSubscription", updateSubscriptionRequest, "Error while updating Subscription. (SubscriptionAdminController)", ex.ToString());
            }
            return Ok(responses);
        }

    }
}
