using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class MasterDirectionSubIndexRepository : IMasterDirectionSubIndex
    {
        #region Add all MasterDirectionSubIndex
        public int AddMasterDirectionSubIndex(MasterDirectionSubIndex masterDirectionSubIndex)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.MasterDirectionSubIndexAdd(masterDirectionSubIndex.MasterDirectionIndexId, Utility.TrimString(masterDirectionSubIndex.SubIndexNo), Utility.TrimString(masterDirectionSubIndex.SubIndexName), Utility.TrimString(masterDirectionSubIndex.SubIndexContent), masterDirectionSubIndex.SaveAfterSubIndexId, masterDirectionSubIndex.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update all MasterDirectionSubIndex data
        public int UpdateMasterDirectionSubIndex(MasterDirectionSubIndex masterDirectionSubIndex)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.MasterDirectionSubIndexUpdate(masterDirectionSubIndex.MasterDirectionSubIndexId, masterDirectionSubIndex.MasterDirectionIndexId, Utility.TrimString(masterDirectionSubIndex.SubIndexNo), Utility.TrimString(masterDirectionSubIndex.SubIndexName), Utility.TrimString(masterDirectionSubIndex.SubIndexContent), masterDirectionSubIndex.SaveAfterSubIndexId, masterDirectionSubIndex.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get all MasterDirectionSubIndex data
        public IEnumerable<MasterDirectionSubIndex> GetMasterDirectionSubIndex(MasterDirectionSubIndex masterDirectionSubIndex)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var masterDirectionSubIndexes = dataContext.MasterDirectionSubIndexGet(masterDirectionSubIndex.MasterDirectionSubIndexId,masterDirectionSubIndex.MasterDirectionId, masterDirectionSubIndex.MasterDirectionIndexId, Utility.TrimString(masterDirectionSubIndex.SearchText), masterDirectionSubIndex.IsActive, masterDirectionSubIndex.PageNumber, masterDirectionSubIndex.PageSize, masterDirectionSubIndex.IsPagingRequired, Utility.TrimString(masterDirectionSubIndex.OrderBy), Utility.TrimString(masterDirectionSubIndex.OrderByDirection), totalPageCount, totalRecord).ToList();

                var masterDirectionSubIndexList = new List<MasterDirectionSubIndex>();
                foreach (var masterDirectionSubIndexDetail in masterDirectionSubIndexes)
                {
                    masterDirectionSubIndexList.Add(new MasterDirectionSubIndex()
                    {
                        MasterDirectionSubIndexId = masterDirectionSubIndexDetail.MDSubIndex,
                        MasterDirectionIndexId = masterDirectionSubIndexDetail.MDPartIndexID,
                        SubIndexNo = masterDirectionSubIndexDetail.SubIndexNo,
                        SubIndexName = masterDirectionSubIndexDetail.SubIndexName,
                        SubIndexContent = masterDirectionSubIndexDetail.SubIndexContent,
                        SortId = masterDirectionSubIndexDetail.SortId,
                        IsActive = masterDirectionSubIndexDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return masterDirectionSubIndexList;
            }
        }
        #endregion

        #region Delete all MasterDirectionSubIndex
        public int DeleteMasterDirectionSubIndex(MasterDirectionSubIndex masterDirectionSubIndex)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.MasterDirectionSubIndexDelete(masterDirectionSubIndex.MasterDirectionSubIndexId, masterDirectionSubIndex.MasterDirectionIndexId, masterDirectionSubIndex.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}