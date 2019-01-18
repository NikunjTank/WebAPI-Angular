using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class PressNoteNotificationRepository : IPressNoteNotification
    {
        #region Add PressNoteNotification
        public int AddPressNoteNotification(PressNoteNotification pressNoteNotification)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.PressNoteNotificationAdd(pressNoteNotification.PressNoteId, pressNoteNotification.NotificationId, pressNoteNotification.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update PressNoteNotification data
        public int UpdatePressNoteNotification(PressNoteNotification pressNoteNotification)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.PressNoteNotificationUpdate(pressNoteNotification.PressNoteNotificationId, pressNoteNotification.PressNoteId, pressNoteNotification.NotificationId, pressNoteNotification.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get PressNoteNotification data
        public IEnumerable<PressNoteNotification> GetPressNoteNotification(PressNoteNotification pressNoteNotification)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var pressNoteNotifications = dataContext.PressNoteNotificationGet(pressNoteNotification.PressNoteNotificationId, pressNoteNotification.PressNoteId, Utility.TrimString(pressNoteNotification.SearchText), pressNoteNotification.IsActive, pressNoteNotification.PageNumber, pressNoteNotification.PageSize, pressNoteNotification.IsPagingRequired, Utility.TrimString(pressNoteNotification.OrderBy), Utility.TrimString(pressNoteNotification.OrderByDirection), totalPageCount, totalRecord).ToList();

                var pressNoteNotificationList = new List<PressNoteNotification>();
                foreach (var pressNoteNotificationDetail in pressNoteNotifications)
                {
                    pressNoteNotificationList.Add(new PressNoteNotification()
                    {
                        PressNoteNotificationId = pressNoteNotificationDetail.PressNoteNotificationId,
                        PressNoteId = pressNoteNotificationDetail.PressNoteId,
                        NotificationId = pressNoteNotificationDetail.Notificationid,
                        RegulationId = pressNoteNotificationDetail.Regulationid,
                        NotificationNumber = pressNoteNotificationDetail.Notificationnumber,
                        RegulationNumber = pressNoteNotificationDetail.Regulationnumber,
                        NotificationName = pressNoteNotificationDetail.NotificationName,
                        NotificationTypeName = pressNoteNotificationDetail.NotificationTypeName,
                        NotificationDate = pressNoteNotificationDetail.NotificationDate,
                        NotificationEffectiveDate = pressNoteNotificationDetail.NotificationEffectiveDate,
                        NotificationTypeId = pressNoteNotificationDetail.NotificationTypeId,
                        GSRNo = pressNoteNotificationDetail.GSRNo,
                        GSRDate = pressNoteNotificationDetail.GSRDate,
                        NotificationPDF = pressNoteNotificationDetail.NotificationPDF,
                        GSRPDF = pressNoteNotificationDetail.GSRPDF,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return pressNoteNotificationList;
            }
        }
        #endregion

        #region Delete PressNoteNotification
        public int DeletePressNoteNotification(PressNoteNotification pressNoteNotification)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.PressNoteNotificationDelete(pressNoteNotification.PressNoteNotificationId, pressNoteNotification.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}