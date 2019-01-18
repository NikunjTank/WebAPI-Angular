using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface ISubscription
    {
        #region Add Subscription data
        int AddSubscription(Subscription subscription);
        #endregion

        #region Update Subscription data
        int UpdateSubscription(Subscription subscription);
        #endregion

        #region Get Subscription data
        IEnumerable<Subscription> GetSubscription(Subscription subscription);
        #endregion

        #region Update Subscription MailSent
        int UpdateSubscriptionMailSent(Subscription subscription);
        #endregion

        #region Update SubscriptionHistory MailSent
        int UpdateSubscriptionHistoryMailSent(SubscriptionHistory subscriptionHistory);
        #endregion
    }
}
