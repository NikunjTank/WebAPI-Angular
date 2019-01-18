using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class NotificationRepository : INotification
    {
        #region Add all notification
        public int AddNotification(Notification notification)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.NotificationAdd(notification.RegulationId,notification.MasterDirectionId, Utility.TrimString(notification.NotificationNumber), Utility.TrimString(notification.NotificationName), notification.NotificationDate, notification.NotificationEffectiveDate, notification.NotificationTypeId, Utility.TrimString(notification.GSRNo), notification.GSRDate, Utility.TrimString(notification.NotificationPDF), Utility.TrimString(notification.GSRPDF), notification.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update notification data
        public int UpdateNotification(Notification notification)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.NotificationUpdate(notification.NotificationId, notification.RegulationId,notification.MasterDirectionId, Utility.TrimString(notification.NotificationNumber), Utility.TrimString(notification.NotificationName), notification.NotificationDate, notification.NotificationEffectiveDate, notification.NotificationTypeId, Utility.TrimString(notification.GSRNo), notification.GSRDate, Utility.TrimString(notification.NotificationPDF), Utility.TrimString(notification.GSRPDF), notification.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get notification data
        public IEnumerable<Notification> GetNotification(Notification notification)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var notifications = dataContext.NotificationGet(notification.NotificationId, notification.RegulationId, Utility.TrimString(notification.SearchText), notification.IsActive, notification.PageNumber, notification.PageSize, notification.IsPagingRequired, Utility.TrimString(notification.OrderBy), Utility.TrimString(notification.OrderByDirection), totalPageCount, totalRecord).ToList();

                var notificationList = new List<Notification>();
                foreach (var notificationDetail in notifications)
                {
                    notificationList.Add(new Notification()
                    {
                        NotificationId = notificationDetail.Notificationid,
                        RegulationId = notificationDetail.Regulationid,
                        NotificationNumber = notificationDetail.Notificationnumber,
                        RegulationNumber = notificationDetail.Regulationnumber,
                        RegulationName = notificationDetail.Regulationname,
                        MasterDirectionId = notificationDetail.MasterDirectionId,
                        MasterDirectionName = notificationDetail.MasterDIrectionName,
                        NotificationName = notificationDetail.NotificationName,
                        NotificationTypeName = notificationDetail.NotificationTypeName,
                        NotificationDate = notificationDetail.NotificationDate,
                        NotificationEffectiveDate = notificationDetail.NotificationEffectiveDate,
                        NotificationTypeId = notificationDetail.NotificationTypeId,
                        GSRNo = notificationDetail.GSRNo,
                        GSRDate = notificationDetail.GSRDate,
                        NotificationPDF = notificationDetail.NotificationPDF,
                        GSRPDF = notificationDetail.GSRPDF,
                        IsActive = notificationDetail.Isactive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return notificationList;
            }
        }
        #endregion

        #region Delete notification
        public int DeleteNotification(Notification notification)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.NotificationDelete(notification.NotificationId, notification.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get notification type data
        public IEnumerable<NotificationType> GetNotificationType(NotificationType notificationType)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                var notificationTypes = dataContext.NotificationTypeGet(notificationType.NotificationTypeId).ToList();

                var notificationTypeList = new List<NotificationType>();
                foreach (var notificationTypeDetail in notificationTypes)
                {
                    notificationTypeList.Add(new NotificationType()
                    {
                        NotificationTypeId = notificationTypeDetail.NotificationTypeId,
                        NotificationTypeName = notificationTypeDetail.NotificationTypeName
                    });
                }
                return notificationTypeList;
            }
        }
        #endregion
    }
}