using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class FemaSubIndexRepository : IFemaSubIndex
    {
        #region Add all FemaSubIndex
        public int AddFemaSubIndex(FemaSubIndex femaSubIndex)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FemaSubIndexAdd(femaSubIndex.IndexId, Utility.TrimString(femaSubIndex.SubIndexNo), Utility.TrimString(femaSubIndex.SubIndexName), Utility.TrimString(femaSubIndex.SubIndexContent), femaSubIndex.SaveAfterSubIndexId, femaSubIndex.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update all FemaSubIndex data
        public int UpdateFemaSubIndex(FemaSubIndex femaSubIndex)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FemaSubIndexUpdate(femaSubIndex.SubIndexId, femaSubIndex.IndexId, Utility.TrimString(femaSubIndex.SubIndexNo), Utility.TrimString(femaSubIndex.SubIndexName), Utility.TrimString(femaSubIndex.SubIndexContent), femaSubIndex.SaveAfterSubIndexId, femaSubIndex.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get all FemaSubIndex data
        public IEnumerable<FemaSubIndex> GetFemaSubIndex(FemaSubIndex femaSubIndex)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var femaSubIndexes = dataContext.FemaSubIndexGet(femaSubIndex.SubIndexId, femaSubIndex.IndexId, femaSubIndex.RegulationId, Utility.TrimString(femaSubIndex.SearchText), femaSubIndex.IsActive, femaSubIndex.PageNumber, femaSubIndex.PageSize, femaSubIndex.IsPagingRequired, Utility.TrimString(femaSubIndex.OrderBy), Utility.TrimString(femaSubIndex.OrderByDirection), totalPageCount, totalRecord).ToList();

                var femaSubIndexList = new List<FemaSubIndex>();
                foreach (var femaSubIndexDetail in femaSubIndexes)
                {
                    femaSubIndexList.Add(new FemaSubIndex()
                    {
                        SubIndexId = femaSubIndexDetail.FemaSubIndexId,
                        IndexId = femaSubIndexDetail.IndexId,
                        SubIndexNo = femaSubIndexDetail.SubIndexNumber,
                        SubIndexName = femaSubIndexDetail.SubIndexName,
                        SubIndexContent = femaSubIndexDetail.SubIndexContent,
                        SortId = femaSubIndexDetail.SortId,
                        IsActive = femaSubIndexDetail.Isactive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return femaSubIndexList;
            }
        }
        #endregion

        #region Delete all FemaSubIndex
        public int DeleteFemaSubIndex(FemaSubIndex femaSubIndex)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FemaSubIndexDelete(femaSubIndex.SubIndexId, femaSubIndex.IndexId, femaSubIndex.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}