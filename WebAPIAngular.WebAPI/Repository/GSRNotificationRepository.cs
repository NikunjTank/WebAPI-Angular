using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class GSRNotificationRepository : IGSRNotification
    {
        #region Add all gSRNotification
        public int AddGSRNotification(GSRNotification gSRNotification)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.GSRNotificationAdd(gSRNotification.RulesId, Utility.TrimString(gSRNotification.GSRNotificationNo), Utility.TrimString(gSRNotification.GSRNotificationName), gSRNotification.GSRNotificationDate, gSRNotification.GSRNotificationEffectiveDate, gSRNotification.GSRNotificationTypeId, Utility.TrimString(gSRNotification.PDF), gSRNotification.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update gSRNotification data
        public int UpdateGSRNotification(GSRNotification gSRNotification)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.GSRNotificationUpdate(gSRNotification.GSRNotificationId, gSRNotification.RulesId,Utility.TrimString(gSRNotification.GSRNotificationNo), Utility.TrimString(gSRNotification.GSRNotificationName), gSRNotification.GSRNotificationDate, gSRNotification.GSRNotificationEffectiveDate, gSRNotification.GSRNotificationTypeId, Utility.TrimString(gSRNotification.PDF), gSRNotification.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get gSRNotification data
        public IEnumerable<GSRNotification> GetGSRNotification(GSRNotification gSRNotification)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var gSRNotifications = dataContext.GSRNotificationGet(gSRNotification.GSRNotificationId, gSRNotification.RulesId, Utility.TrimString(gSRNotification.SearchText), gSRNotification.IsActive, gSRNotification.PageNumber, gSRNotification.PageSize, gSRNotification.IsPagingRequired, Utility.TrimString(gSRNotification.OrderBy), Utility.TrimString(gSRNotification.OrderByDirection), totalPageCount, totalRecord).ToList();

                var gSRNotificationList = new List<GSRNotification>();
                foreach (var gSRNotificationDetail in gSRNotifications)
                {
                    gSRNotificationList.Add(new GSRNotification()
                    {
                        GSRNotificationId = gSRNotificationDetail.GSRNotificationId,
                        RulesId = gSRNotificationDetail.RulesId,
                        GSRNotificationNo = gSRNotificationDetail.GSRNotificationNo,
                        RulesName = gSRNotificationDetail.NameofRules,
                        GSRNotificationName = gSRNotificationDetail.GSRNotificationName,
                        GSRNotificationTypeName = gSRNotificationDetail.GSRNotificationTypeName,
                        GSRNotificationDate = gSRNotificationDetail.GSRNotificationDate,
                        GSRNotificationEffectiveDate = gSRNotificationDetail.GSRNotificationEffectiveDate,
                        GSRNotificationTypeId = gSRNotificationDetail.GSRNotificationTypeId,
                        PDF = gSRNotificationDetail.PDF,
                        IsActive = gSRNotificationDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return gSRNotificationList;
            }
        }
        #endregion

        #region Delete gSRNotification
        public int DeleteGSRNotification(GSRNotification gSRNotification)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.GSRNotificationDelete(gSRNotification.GSRNotificationId, gSRNotification.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get gSRNotification type data
        public IEnumerable<GSRNotificationType> GetGSRNotificationType(GSRNotificationType gSRNotificationType)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                var gSRNotificationTypes = dataContext.GSRNotificationTypeGet(gSRNotificationType.GSRNotificationTypeId).ToList();

                var gSRNotificationTypeList = new List<GSRNotificationType>();
                foreach (var gSRNotificationTypeDetail in gSRNotificationTypes)
                {
                    gSRNotificationTypeList.Add(new GSRNotificationType()
                    {
                        GSRNotificationTypeId = gSRNotificationTypeDetail.GSRNotificationTypeId,
                        GSRNotificationTypeName = gSRNotificationTypeDetail.GSRNotificationTypeName
                    });
                }
                return gSRNotificationTypeList;
            }
        }
        #endregion
    }
}