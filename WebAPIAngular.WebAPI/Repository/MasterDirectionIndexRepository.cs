using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class MasterDirectionIndexRepository : IMasterDirectionIndex
    {
        #region Add all MasterDirectionIndex
        public int AddMasterDirectionIndex(MasterDirectionIndex masterDirectionIndex)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.MasterDirectionIndexAdd(masterDirectionIndex.MasterDirectionChapterId, Utility.TrimString(masterDirectionIndex.IndexNo), Utility.TrimString(masterDirectionIndex.IndexName), Utility.TrimString(masterDirectionIndex.IndexContent), masterDirectionIndex.SaveAfterIndexId, masterDirectionIndex.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update all MasterDirectionIndex data
        public int UpdateMasterDirectionIndex(MasterDirectionIndex masterDirectionIndex)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.MasterDirectionIndexUpdate(masterDirectionIndex.MasterDirectionIndexId, masterDirectionIndex.MasterDirectionChapterId, Utility.TrimString(masterDirectionIndex.IndexNo), Utility.TrimString(masterDirectionIndex.IndexName), Utility.TrimString(masterDirectionIndex.IndexContent), masterDirectionIndex.SaveAfterIndexId, masterDirectionIndex.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get all MasterDirectionIndex data
        public IEnumerable<MasterDirectionIndex> GetMasterDirectionIndex(MasterDirectionIndex masterDirectionIndex)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var masterDirectionIndexes = dataContext.MasterDirectionIndexGet(masterDirectionIndex.MasterDirectionIndexId,masterDirectionIndex.MasterDirectionId, masterDirectionIndex.MasterDirectionChapterId, Utility.TrimString(masterDirectionIndex.SearchText), masterDirectionIndex.IsActive, masterDirectionIndex.PageNumber, masterDirectionIndex.PageSize, masterDirectionIndex.IsPagingRequired, Utility.TrimString(masterDirectionIndex.OrderBy), Utility.TrimString(masterDirectionIndex.OrderByDirection), totalPageCount, totalRecord).ToList();

                var masterDirectionIndexList = new List<MasterDirectionIndex>();
                foreach (var masterDirectionIndexDetail in masterDirectionIndexes)
                {
                    masterDirectionIndexList.Add(new MasterDirectionIndex()
                    {
                        MasterDirectionIndexId = masterDirectionIndexDetail.MDPartIndexID,
                        MasterDirectionChapterId = masterDirectionIndexDetail.MDPID,
                        IndexNo = masterDirectionIndexDetail.ParaIndexNo,
                        IndexName = masterDirectionIndexDetail.IndexName,
                        IndexContent = masterDirectionIndexDetail.IndexContent,
                        SortId = masterDirectionIndexDetail.SortId,
                        IsActive = masterDirectionIndexDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return masterDirectionIndexList;
            }
        }
        #endregion

        #region Delete all MasterDirectionIndex
        public int DeleteMasterDirectionIndex(MasterDirectionIndex masterDirectionIndex)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.MasterDirectionIndexDelete(masterDirectionIndex.MasterDirectionIndexId, masterDirectionIndex.MasterDirectionChapterId, masterDirectionIndex.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}