using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class IndexAmendmentRepository : IIndexAmendment
    {
        #region Add index amendment
        public int AddIndexAmendment(IndexAmendment indexAmendment)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.IndexAmendmentAdd(indexAmendment.RegulationId, indexAmendment.NotificationIds, indexAmendment.IndexId, indexAmendment.SubIndexId, Utility.TrimString(indexAmendment.IndexAmendmentContent), indexAmendment.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update index amendment data
        public int UpdateIndexAmendment(IndexAmendment indexAmendment)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.IndexAmendmentUpdate(indexAmendment.IndexAmendmentId, indexAmendment.RegulationId, indexAmendment.NotificationIds, indexAmendment.IndexId, indexAmendment.SubIndexId, Utility.TrimString(indexAmendment.IndexAmendmentContent), indexAmendment.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get index amendment data
        public IEnumerable<IndexAmendment> GetIndexAmendment(IndexAmendment indexAmendment)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var indexAmendments = dataContext.IndexAmendmentGet(indexAmendment.IndexAmendmentId, indexAmendment.RegulationId, Utility.TrimString(indexAmendment.SearchText), indexAmendment.IsActive, indexAmendment.PageNumber, indexAmendment.PageSize, indexAmendment.IsPagingRequired, Utility.TrimString(indexAmendment.OrderBy), Utility.TrimString(indexAmendment.OrderByDirection), totalPageCount, totalRecord).ToList();

                var indexAmendmentList = new List<IndexAmendment>();
                foreach (var indexAmendmentDetail in indexAmendments)
                {
                    indexAmendmentList.Add(new IndexAmendment()
                    {
                        IndexAmendmentId = indexAmendmentDetail.IndexAmendmentId,
                        RegulationId = indexAmendmentDetail.RegulationId,
                        NotificationIds = indexAmendmentDetail.NotificationIds,
                        Notifications = indexAmendmentDetail.Notifications,
                        RegulationName = indexAmendmentDetail.Regulationname,
                        RegulationNumber = indexAmendmentDetail.Regulationnumber,
                        IndexId = indexAmendmentDetail.IndexId,
                        IndexNo = indexAmendmentDetail.IndexNo,
                        IndexName = indexAmendmentDetail.Indexname,
                        SubIndexId = indexAmendmentDetail.SubIndexId,
                        SubIndexNumber = indexAmendmentDetail.SubIndexNumber,
                        SubIndexName = indexAmendmentDetail.SubIndexName,
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
        public int DeleteIndexAmendment(IndexAmendment indexAmendment)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.IndexAmendmentDelete(indexAmendment.IndexAmendmentId, indexAmendment.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}