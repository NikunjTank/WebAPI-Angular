using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class FDICircularIndexRepository : IFDICircularIndex
    {
        #region Add all FDICircularIndex
        public int AddFDICircularIndex(FDICircularIndex fDICircularIndex)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FDICircularIndexAdd(fDICircularIndex.FDIChapterId, Utility.TrimString(fDICircularIndex.IndexNo), Utility.TrimString(fDICircularIndex.IndexName), Utility.TrimString(fDICircularIndex.IndexContent), fDICircularIndex.SaveAfterIndexId, fDICircularIndex.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update all FDICircularIndex data
        public int UpdateFDICircularIndex(FDICircularIndex fDICircularIndex)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FDICircularIndexUpdate(fDICircularIndex.FDICircularIndexId, fDICircularIndex.FDIChapterId, Utility.TrimString(fDICircularIndex.IndexNo), Utility.TrimString(fDICircularIndex.IndexName), Utility.TrimString(fDICircularIndex.IndexContent), fDICircularIndex.SaveAfterIndexId, fDICircularIndex.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get all FDICircularIndex data
        public IEnumerable<FDICircularIndex> GetFDICircularIndex(FDICircularIndex fDICircularIndex)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var fDICircularIndexes = dataContext.FDICircularIndexGet(fDICircularIndex.FDICircularIndexId,fDICircularIndex.FDICircularId, fDICircularIndex.FDIChapterId, Utility.TrimString(fDICircularIndex.SearchText), fDICircularIndex.IsActive, fDICircularIndex.PageNumber, fDICircularIndex.PageSize, fDICircularIndex.IsPagingRequired, Utility.TrimString(fDICircularIndex.OrderBy), Utility.TrimString(fDICircularIndex.OrderByDirection), totalPageCount, totalRecord).ToList();

                var fDICircularIndexList = new List<FDICircularIndex>();
                foreach (var fDICircularIndexDetail in fDICircularIndexes)
                {
                    fDICircularIndexList.Add(new FDICircularIndex()
                    {
                        FDICircularIndexId= fDICircularIndexDetail.FDICircularIndexId,
                        FDIChapterId = fDICircularIndexDetail.FDIChapterId,
                        IndexNo = fDICircularIndexDetail.IndexNo,
                        IndexName = fDICircularIndexDetail.IndexName,
                        IndexContent = fDICircularIndexDetail.IndexContent,
                        SortId = fDICircularIndexDetail.SortId,
                        IsActive = fDICircularIndexDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return fDICircularIndexList;
            }
        }
        #endregion

        #region Delete all FDICircularIndex
        public int DeleteFDICircularIndex(FDICircularIndex fDICircularIndex)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FDICircularIndexDelete(fDICircularIndex.FDICircularIndexId, fDICircularIndex.FDIChapterId, fDICircularIndex.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}