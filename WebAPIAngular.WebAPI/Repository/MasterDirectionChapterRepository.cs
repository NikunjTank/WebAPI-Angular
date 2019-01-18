using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class MasterDirectionChapterRepository : IMasterDirectionChapter
    {
        #region Add MasterDirectionChapter
        public int AddMasterDirectionChapter(MasterDirectionChapter masterDirectionChapter)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.MasterDirectionChapterAdd(masterDirectionChapter.MasterDirectionId, Utility.TrimString(masterDirectionChapter.Chapter),masterDirectionChapter.SaveAfterChapterId, masterDirectionChapter.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update MasterDirectionChapter data
        public int UpdateMasterDirectionChapter(MasterDirectionChapter masterDirectionChapter)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.MasterDirectionChapterUpdate(masterDirectionChapter.MasterDirectionChapterId, masterDirectionChapter.MasterDirectionId, Utility.TrimString(masterDirectionChapter.Chapter),masterDirectionChapter.SaveAfterChapterId, masterDirectionChapter.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get MasterDirectionChapter data
        public IEnumerable<MasterDirectionChapter> GetMasterDirectionChapter(MasterDirectionChapter masterDirectionChapter)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var masterDirectionChapters = dataContext.MasterDirectionChapterGet(masterDirectionChapter.MasterDirectionChapterId, masterDirectionChapter.MasterDirectionId, Utility.TrimString(masterDirectionChapter.SearchText), masterDirectionChapter.IsActive, masterDirectionChapter.PageNumber, masterDirectionChapter.PageSize, masterDirectionChapter.IsPagingRequired, Utility.TrimString(masterDirectionChapter.OrderBy), Utility.TrimString(masterDirectionChapter.OrderByDirection), totalPageCount, totalRecord).ToList();

                var masterDirectionChapterList = new List<MasterDirectionChapter>();
                foreach (var masterDirectionChapterDetail in masterDirectionChapters)
                {
                    masterDirectionChapterList.Add(new MasterDirectionChapter()
                    {
                        MasterDirectionId = masterDirectionChapterDetail.MDID,
                        MasterDirectionChapterId = masterDirectionChapterDetail.MDPID,
                        Chapter = masterDirectionChapterDetail.PartData,
                        SortId = masterDirectionChapterDetail.SortId,
                        IsActive = masterDirectionChapterDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return masterDirectionChapterList;
            }
        }
        #endregion

        #region Delete MasterDirectionChapter
        public int DeleteMasterDirectionChapter(MasterDirectionChapter masterDirectionChapter)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.MasterDirectionChapterDelete(masterDirectionChapter.MasterDirectionChapterId, masterDirectionChapter.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}