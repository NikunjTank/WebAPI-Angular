using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class RulesIndexAmendmentRepository : IRulesIndexAmendment
    {
        #region Add index amendment
        public int AddRulesIndexAmendment(RulesIndexAmendment indexAmendment)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.RulesIndexAmendmentAdd(indexAmendment.RulesId, indexAmendment.GSRNotificationIds, indexAmendment.IndexId, indexAmendment.SubIndexId,Utility.TrimString(indexAmendment.IndexAmendmentContent), indexAmendment.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update index amendment data
        public int UpdateRulesIndexAmendment(RulesIndexAmendment indexAmendment)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.RulesIndexAmendmentUpdate(indexAmendment.RulesIndexAmendmentId, indexAmendment.RulesId, indexAmendment.GSRNotificationIds, indexAmendment.IndexId, indexAmendment.SubIndexId,Utility.TrimString(indexAmendment.IndexAmendmentContent), indexAmendment.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get index amendment data
        public IEnumerable<RulesIndexAmendment> GetRulesIndexAmendment(RulesIndexAmendment indexAmendment)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var indexAmendments = dataContext.RulesIndexAmendmentGet(indexAmendment.RulesIndexAmendmentId, indexAmendment.RulesId, Utility.TrimString(indexAmendment.SearchText), indexAmendment.IsActive, indexAmendment.PageNumber, indexAmendment.PageSize, indexAmendment.IsPagingRequired, Utility.TrimString(indexAmendment.OrderBy), Utility.TrimString(indexAmendment.OrderByDirection), totalPageCount, totalRecord).ToList();

                var indexAmendmentList = new List<RulesIndexAmendment>();
                foreach (var indexAmendmentDetail in indexAmendments)
                {
                    indexAmendmentList.Add(new RulesIndexAmendment()
                    {
                        RulesIndexAmendmentId = indexAmendmentDetail.RulesIndexAmendmentId,
                        RulesId = indexAmendmentDetail.RulesId,
                        GSRNotificationIds = indexAmendmentDetail.GSRNotificationIds,
                        GSRNotifications = indexAmendmentDetail.GSRNotifications,
                        IndexId = indexAmendmentDetail.IndexId,
                        IndexNo = indexAmendmentDetail.IndexNo,
                        IndexName = indexAmendmentDetail.Indexname,
                        SubIndexId = indexAmendmentDetail.SubIndexId,
                        SubIndexNo = indexAmendmentDetail.RuleSubIndexNo,
                        SubIndexName = indexAmendmentDetail.RuleSubIndexName,
                        IndexAmendmentContent = indexAmendmentDetail.IndexAmendmentContent,
                        IsActive = indexAmendmentDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return indexAmendmentList;
            }
        }
        #endregion

        #region Delete index amendment
        public int DeleteRulesIndexAmendment(RulesIndexAmendment indexAmendment)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.RulesIndexAmendmentDelete(indexAmendment.RulesIndexAmendmentId, indexAmendment.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}