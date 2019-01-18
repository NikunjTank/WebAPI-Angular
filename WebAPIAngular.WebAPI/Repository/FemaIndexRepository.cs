using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class FemaIndexRepository : IFemaIndex
    {
        #region Add all FemaIndex
        public int AddFemaIndex(FemaIndex femaIndex)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FemaindexAdd(femaIndex.RegulationId, Utility.TrimString(femaIndex.IndexNo), Utility.TrimString(femaIndex.IndexName), Utility.TrimString(femaIndex.IndexContent), femaIndex.SaveAfterIndexId, femaIndex.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update all FemaIndex data
        public int UpdateFemaIndex(FemaIndex femaIndex)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FemaindexUpdate(femaIndex.IndexId, femaIndex.RegulationId, Utility.TrimString(femaIndex.IndexNo), Utility.TrimString(femaIndex.IndexName), Utility.TrimString(femaIndex.IndexContent), femaIndex.SaveAfterIndexId, femaIndex.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get all FemaIndex data
        public IEnumerable<FemaIndex> GetFemaIndex(FemaIndex femaIndex)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var femaIndexes = dataContext.FemaindexGet(femaIndex.IndexId, femaIndex.RegulationId, Utility.TrimString(femaIndex.SearchText), femaIndex.IsActive, femaIndex.PageNumber, femaIndex.PageSize, femaIndex.IsPagingRequired, Utility.TrimString(femaIndex.OrderBy), Utility.TrimString(femaIndex.OrderByDirection), totalPageCount, totalRecord).ToList();

                var femaIndexList = new List<FemaIndex>();
                foreach (var femaIndexDetail in femaIndexes)
                {
                    femaIndexList.Add(new FemaIndex()
                    {
                        IndexId = femaIndexDetail.Indexid,
                        RegulationId = femaIndexDetail.Regulationid,
                        IndexNo = femaIndexDetail.IndexNo,
                        IndexName = femaIndexDetail.Indexname,
                        IndexContent = femaIndexDetail.IndexContent,
                        SortId = femaIndexDetail.SortId,
                        IsActive = femaIndexDetail.Isactive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return femaIndexList;
            }
        }
        #endregion

        #region Delete all FemaIndex
        public int DeleteFemaIndex(FemaIndex femaIndex)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FemaindexDelete(femaIndex.IndexId, femaIndex.RegulationId, femaIndex.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}