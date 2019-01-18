using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class DIPPClarificationRepository : IDIPPClarification
    {
        #region Add DIPPClarification
        public int AddDIPPClarification(DIPPClarification dIPPClarification)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.DIPPClarificationAdd(Utility.TrimString(dIPPClarification.ClarificationTopic), Utility.TrimString(dIPPClarification.PDF), dIPPClarification.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update DIPPClarification data
        public int UpdateDIPPClarification(DIPPClarification dIPPClarification)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.DIPPClarificationUpdate(dIPPClarification.DIPPClarificationId, Utility.TrimString(dIPPClarification.ClarificationTopic), Utility.TrimString(dIPPClarification.PDF), dIPPClarification.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get DIPPClarification data
        public IEnumerable<DIPPClarification> GetDIPPClarification(DIPPClarification dIPPClarification)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var dIPPClarifications = dataContext.DIPPClarificationGet(dIPPClarification.DIPPClarificationId, Utility.TrimString(dIPPClarification.SearchText), dIPPClarification.IsActive, dIPPClarification.PageNumber, dIPPClarification.PageSize, dIPPClarification.IsPagingRequired, Utility.TrimString(dIPPClarification.OrderBy), Utility.TrimString(dIPPClarification.OrderByDirection), totalPageCount, totalRecord).ToList();

                var dIPPClarificationList = new List<DIPPClarification>();
                foreach (var dIPPClarificationDetail in dIPPClarifications)
                {
                    dIPPClarificationList.Add(new DIPPClarification()
                    {
                        DIPPClarificationId = dIPPClarificationDetail.DIPPClarificationsID,
                        ClarificationTopic = dIPPClarificationDetail.Title,
                        PDF = dIPPClarificationDetail.PDF,
                        IsActive = dIPPClarificationDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return dIPPClarificationList;
            }
        }
        #endregion

        #region Delete DIPPClarification
        public int DeleteDIPPClarification(DIPPClarification dIPPClarification)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.DIPPClarificationDelete(dIPPClarification.DIPPClarificationId, dIPPClarification.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}