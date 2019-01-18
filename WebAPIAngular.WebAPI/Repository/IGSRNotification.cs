using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IGSRNotification
    {
        #region Add notification data
        int AddGSRNotification(GSRNotification notification);
        #endregion

        #region Update notification data
        int UpdateGSRNotification(GSRNotification notification);
        #endregion

        #region Get notification data
        IEnumerable<GSRNotification> GetGSRNotification(GSRNotification notification);
        #endregion

        #region Delete notification
        int DeleteGSRNotification(GSRNotification notification);
        #endregion

        #region Get notification type data
        IEnumerable<GSRNotificationType> GetGSRNotificationType(GSRNotificationType notificationType);
        #endregion
    }
}
