using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface INotification
    {
        #region Add notification data
        int AddNotification(Notification notification);
        #endregion

        #region Update notification data
        int UpdateNotification(Notification notification);
        #endregion

        #region Get notification data
        IEnumerable<Notification> GetNotification(Notification notification);
        #endregion

        #region Delete notification
        int DeleteNotification(Notification notification);
        #endregion

        #region Get notification type data
        IEnumerable<NotificationType> GetNotificationType(NotificationType notificationType);
        #endregion
    }
}
