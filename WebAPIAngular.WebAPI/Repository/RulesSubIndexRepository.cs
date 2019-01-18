using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class RulesSubIndexRepository : IRulesSubIndex
    {
        #region Add all RulesSubIndex
        public int AddRulesSubIndex(RulesSubIndex RulesSubIndex)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.RulesSubIndexAdd(RulesSubIndex.IndexId, Utility.TrimString(RulesSubIndex.SubIndexNo), Utility.TrimString(RulesSubIndex.SubIndexName), Utility.TrimString(RulesSubIndex.SubIndexContent), RulesSubIndex.SaveAfterSubIndexId, RulesSubIndex.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update all RulesSubIndex data
        public int UpdateRulesSubIndex(RulesSubIndex RulesSubIndex)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.RulesSubIndexUpdate(RulesSubIndex.SubIndexId, RulesSubIndex.IndexId, Utility.TrimString(RulesSubIndex.SubIndexNo), Utility.TrimString(RulesSubIndex.SubIndexName), Utility.TrimString(RulesSubIndex.SubIndexContent), RulesSubIndex.SaveAfterSubIndexId, RulesSubIndex.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get all RulesSubIndex data
        public IEnumerable<RulesSubIndex> GetRulesSubIndex(RulesSubIndex RulesSubIndex)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var RulesSubIndexes = dataContext.RulesSubIndexGet(RulesSubIndex.SubIndexId, RulesSubIndex.IndexId,RulesSubIndex.RulesId, Utility.TrimString(RulesSubIndex.SearchText), RulesSubIndex.IsActive, RulesSubIndex.PageNumber, RulesSubIndex.PageSize, RulesSubIndex.IsPagingRequired, Utility.TrimString(RulesSubIndex.OrderBy), Utility.TrimString(RulesSubIndex.OrderByDirection), totalPageCount, totalRecord).ToList();

                var RulesSubIndexList = new List<RulesSubIndex>();
                foreach (var RulesSubIndexDetail in RulesSubIndexes)
                {
                    RulesSubIndexList.Add(new RulesSubIndex()
                    {
                        SubIndexId = RulesSubIndexDetail.RulesSubIndexId,
                        IndexId = RulesSubIndexDetail.IndexId,
                        SubIndexNo = RulesSubIndexDetail.RuleSubIndexNo,
                        SubIndexName = RulesSubIndexDetail.RuleSubIndexName,
                        SubIndexContent = RulesSubIndexDetail.SubIndexContent,
                        SortId = RulesSubIndexDetail.SortId,
                        IsActive = RulesSubIndexDetail.Isactive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return RulesSubIndexList;
            }
        }
        #endregion

        #region Delete all RulesSubIndex
        public int DeleteRulesSubIndex(RulesSubIndex RulesSubIndex)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.RulesSubIndexDelete(RulesSubIndex.SubIndexId, RulesSubIndex.IndexId, RulesSubIndex.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}