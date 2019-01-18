using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class FDIChapterRepository : IFDIChapter
    {
        #region Add FDIChapter
        public int AddFDIChapter(FDIChapter fDIChapter)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FDIChapterAdd(fDIChapter.FDICircularId, Utility.TrimString(fDIChapter.Chapter), fDIChapter.SaveAfterChapterId, fDIChapter.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update FDIChapter data
        public int UpdateFDIChapter(FDIChapter fDIChapter)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FDIChapterUpdate(fDIChapter.FDIChapterId, fDIChapter.FDICircularId, Utility.TrimString(fDIChapter.Chapter), fDIChapter.SaveAfterChapterId, fDIChapter.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get FDIChapter data
        public IEnumerable<FDIChapter> GetFDIChapter(FDIChapter fDIChapter)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var fDIChapters = dataContext.FDIChapterGet(fDIChapter.FDIChapterId, fDIChapter.FDICircularId, Utility.TrimString(fDIChapter.SearchText), fDIChapter.IsActive, fDIChapter.PageNumber, fDIChapter.PageSize, fDIChapter.IsPagingRequired, Utility.TrimString(fDIChapter.OrderBy), Utility.TrimString(fDIChapter.OrderByDirection), totalPageCount, totalRecord).ToList();

                var fDIChapterList = new List<FDIChapter>();
                foreach (var fDIChapterDetail in fDIChapters)
                {
                    fDIChapterList.Add(new FDIChapter()
                    {
                        FDICircularId = fDIChapterDetail.FDIID,
                        FDIChapterId = fDIChapterDetail.FDIchapterID,
                        Chapter = fDIChapterDetail.Chapter,
                        SortId = fDIChapterDetail.SortId,
                        IsActive = fDIChapterDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return fDIChapterList;
            }
        }
        #endregion

        #region Delete FDIChapter
        public int DeleteFDIChapter(FDIChapter fDIChapter)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FDIChapterDelete(fDIChapter.FDIChapterId, fDIChapter.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}