using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class FDICircularSubIndexRepository : IFDICircularSubIndex
    {
        #region Add all FDICircularSubIndex
        public int AddFDICircularSubIndex(FDICircularSubIndex fDICircularSubIndex)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FDICircularSubIndexAdd(fDICircularSubIndex.FDICircularIndexId, Utility.TrimString(fDICircularSubIndex.SubIndexNo), Utility.TrimString(fDICircularSubIndex.SubIndexName), Utility.TrimString(fDICircularSubIndex.SubIndexContent), fDICircularSubIndex.SaveAfterSubIndexId, fDICircularSubIndex.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update all FDICircularSubIndex data
        public int UpdateFDICircularSubIndex(FDICircularSubIndex fDICircularSubIndex)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FDICircularSubIndexUpdate(fDICircularSubIndex.FDICircularSubIndexId, fDICircularSubIndex.FDICircularIndexId, Utility.TrimString(fDICircularSubIndex.SubIndexNo), Utility.TrimString(fDICircularSubIndex.SubIndexName), Utility.TrimString(fDICircularSubIndex.SubIndexContent), fDICircularSubIndex.SaveAfterSubIndexId, fDICircularSubIndex.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get all FDICircularSubIndex data
        public IEnumerable<FDICircularSubIndex> GetFDICircularSubIndex(FDICircularSubIndex fDICircularSubIndex)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var fDICircularSubIndexes = dataContext.FDICircularSubIndexGet(fDICircularSubIndex.FDICircularSubIndexId,fDICircularSubIndex.FDICircularId, fDICircularSubIndex.FDICircularIndexId, Utility.TrimString(fDICircularSubIndex.SearchText), fDICircularSubIndex.IsActive, fDICircularSubIndex.PageNumber, fDICircularSubIndex.PageSize, fDICircularSubIndex.IsPagingRequired, Utility.TrimString(fDICircularSubIndex.OrderBy), Utility.TrimString(fDICircularSubIndex.OrderByDirection), totalPageCount, totalRecord).ToList();

                var fDICircularSubIndexList = new List<FDICircularSubIndex>();
                foreach (var fDICircularSubIndexDetail in fDICircularSubIndexes)
                {
                    fDICircularSubIndexList.Add(new FDICircularSubIndex()
                    {
                        FDICircularSubIndexId = fDICircularSubIndexDetail.FDICircularSubIndexId,
                        FDICircularIndexId = fDICircularSubIndexDetail.FDICircularIndexId,
                        SubIndexNo = fDICircularSubIndexDetail.SubIndexNo,
                        SubIndexName = fDICircularSubIndexDetail.SubIndexName,
                        SubIndexContent = fDICircularSubIndexDetail.SubIndexContent,
                        SortId = fDICircularSubIndexDetail.SortId,
                        IsActive = fDICircularSubIndexDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return fDICircularSubIndexList;
            }
        }
        #endregion

        #region Delete all FDICircularSubIndex
        public int DeleteFDICircularSubIndex(FDICircularSubIndex fDICircularSubIndex)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FDICircularSubIndexDelete(fDICircularSubIndex.FDICircularSubIndexId, fDICircularSubIndex.FDICircularIndexId, fDICircularSubIndex.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}