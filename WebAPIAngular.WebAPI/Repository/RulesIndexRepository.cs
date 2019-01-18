using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class RulesIndexRepository : IRulesIndex
    {
        #region Add RulesIndex
        public int AddRulesIndex(RulesIndex rulesIndex)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.RulesIndexAdd(rulesIndex.RulesId, Utility.TrimString(rulesIndex.IndexNo), Utility.TrimString(rulesIndex.IndexName), Utility.TrimString(rulesIndex.IndexContent), rulesIndex.SaveAfterIndexId, rulesIndex.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update RulesIndex data
        public int UpdateRulesIndex(RulesIndex rulesIndex)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.RulesIndexUpdate(rulesIndex.IndexId, rulesIndex.RulesId, Utility.TrimString(rulesIndex.IndexNo), Utility.TrimString(rulesIndex.IndexName), Utility.TrimString(rulesIndex.IndexContent), rulesIndex.SaveAfterIndexId, rulesIndex.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get RulesIndex data
        public IEnumerable<RulesIndex> GetRulesIndex(RulesIndex rulesIndex)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var rulesIndexes = dataContext.RulesIndexGet(rulesIndex.IndexId, rulesIndex.RulesId, Utility.TrimString(rulesIndex.SearchText), rulesIndex.IsActive, rulesIndex.PageNumber, rulesIndex.PageSize, rulesIndex.IsPagingRequired, Utility.TrimString(rulesIndex.OrderBy), Utility.TrimString(rulesIndex.OrderByDirection), totalPageCount, totalRecord).ToList();

                var rulesIndexList = new List<RulesIndex>();
                foreach (var rulesIndexDetail in rulesIndexes)
                {
                    rulesIndexList.Add(new RulesIndex()
                    {
                        IndexId = rulesIndexDetail.Indexid,
                        RulesId = rulesIndexDetail.RuleID,
                        IndexNo = rulesIndexDetail.IndexNo,
                        IndexName = rulesIndexDetail.Indexname,
                        IndexContent = rulesIndexDetail.IndexContent,
                        SortId = rulesIndexDetail.SortId,
                        IsActive = rulesIndexDetail.Isactive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return rulesIndexList;
            }
        }
        #endregion

        #region Delete RulesIndex
        public int DeleteRulesIndex(RulesIndex rulesIndex)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.RulesIndexDelete(rulesIndex.IndexId, rulesIndex.RulesId, rulesIndex.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}