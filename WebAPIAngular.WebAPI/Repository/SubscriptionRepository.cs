using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class SubscriptionRepository : ISubscription
    {
        #region Add Subscription
        public int AddSubscription(Subscription subscription)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.SubscriptionAdd(subscription.UserId, subscription.PackageId, subscription.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update Subscription data
        public int UpdateSubscription(Subscription subscription)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.SubscriptionUpdate(subscription.SubscriptionId, subscription.StartDate, subscription.PaymentDate, subscription.IsExpired, subscription.IsActive, subscription.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get Subscription data
        public IEnumerable<Subscription> GetSubscription(Subscription subscription)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var subscriptions = dataContext.SubscriptionGet(subscription.SubscriptionId, subscription.UserId, subscription.PackageId, Utility.TrimString(subscription.SearchText), subscription.IsActive, subscription.PageNumber, subscription.PageSize, subscription.IsPagingRequired, Utility.TrimString(subscription.OrderBy), Utility.TrimString(subscription.OrderByDirection), totalPageCount, totalRecord).ToList();

                var subscriptionList = new List<Subscription>();
                foreach (var subscriptionDetail in subscriptions)
                {
                    subscriptionList.Add(new Subscription()
                    {
                        SubscriptionId = subscriptionDetail.SubscriptionId,
                        UserId = subscriptionDetail.UserId,
                        UserName = subscriptionDetail.UserName,
                        PackageId = subscriptionDetail.PackageId,
                        PackageName = subscriptionDetail.PackageName,
                        StartDate = subscriptionDetail.StartDate,
                        EndDate = subscriptionDetail.EndDate,
                        PaymentDate = subscriptionDetail.PaymentDate,
                        SubscriptionStatus = subscriptionDetail.SubscriptionStatus,
                        Amount = subscriptionDetail.Amount,
                        IsExpired = subscriptionDetail.IsExpired,
                        IsPending = subscriptionDetail.IsPending,
                        IsCanceled = subscriptionDetail.IsCanceled,
                        CancellationDate = subscriptionDetail.CancellationDate,
                        ActivationDate = subscriptionDetail.ActivationDate,
                        CreatedBy = subscriptionDetail.CreatedBy,
                        IsActive = subscriptionDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return subscriptionList;
            }
        }
        #endregion

        #region Update Subscription MailSent
        public int UpdateSubscriptionMailSent(Subscription subscription)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.SubscriptionMailSentUpdate(subscription.SubscriptionId, subscription.IsMailSentToUser, subscription.IsMailSentToAdmin, subscription.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update SubscriptionHistory MailSent
        public int UpdateSubscriptionHistoryMailSent(SubscriptionHistory subscriptionHistory)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.SubscriptionHistoryMailSentUpdate(subscriptionHistory.SubscriptionHistoryId, subscriptionHistory.IsMailSentToUser, subscriptionHistory.IsMailSentToAdmin, subscriptionHistory.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}