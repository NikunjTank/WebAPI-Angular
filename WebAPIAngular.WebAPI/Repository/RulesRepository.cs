using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class RulesRepository : IRules
    {
        #region Add rules
        public int AddRules(Rules rules)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.RulesAdd(Utility.TrimString(rules.RulesName), Utility.TrimString(rules.RulesNo), rules.Year, rules.PublicationDate, rules.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update rules data
        public int UpdateRules(Rules rules)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.RulesUpdate(rules.RulesId, Utility.TrimString(rules.RulesName), Utility.TrimString(rules.RulesName), rules.Year, rules.PublicationDate, rules.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get rules data
        public IEnumerable<Rules> GetRules(Rules rules)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var ruless = dataContext.RulesGet(rules.RulesId, Utility.TrimString(rules.SearchText), rules.IsActive, rules.PageNumber, rules.PageSize, rules.IsPagingRequired, Utility.TrimString(rules.OrderBy), Utility.TrimString(rules.OrderByDirection), totalPageCount, totalRecord).ToList();

                var rulesList = new List<Rules>();
                foreach (var rulesDetail in ruless)
                {
                    rulesList.Add(new Rules()
                    {
                        RulesId = rulesDetail.Rulesid,
                        RulesName = rulesDetail.NameofRules,
                        RulesNo = rulesDetail.RulesNo,
                        Year = rulesDetail.Year,
                        PublicationDate = rulesDetail.PublicationDate,
                        IsActive = rulesDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return rulesList;
            }
        }
        #endregion

        #region Delete rules
        public int DeleteRules(Rules rules)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.RulesDelete(rules.RulesId, rules.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}