using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class FEMASubModuleOfModuleRepository : IFEMASubModuleOfModule
    {
        #region Get fEMASubModuleOfModule data
        public IEnumerable<FEMASubModuleOfModule> GetFEMASubModuleOfModule(FEMASubModuleOfModule fEMASubModuleOfModule)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var fEMASubModuleOfModules = dataContext.FEMASubModuleOfModuleGet(fEMASubModuleOfModule.FEMAModuleId, fEMASubModuleOfModule.FEMASubModuleOfModuleId, fEMASubModuleOfModule.PageNumber, fEMASubModuleOfModule.PageSize, fEMASubModuleOfModule.IsPagingRequired, totalPageCount, totalRecord).ToList();

                var fEMASubModuleOfModuleList = new List<FEMASubModuleOfModule>();
                foreach (var fEMASubModuleOfModuleDetail in fEMASubModuleOfModules)
                {
                    fEMASubModuleOfModuleList.Add(new FEMASubModuleOfModule()
                    {
                        FEMASubModuleOfModuleId = fEMASubModuleOfModuleDetail.FEMASubModuleOfModuleId,
                        FEMAModuleId = fEMASubModuleOfModuleDetail.FEMAModuleId,
                        FEMASubModuleId = fEMASubModuleOfModuleDetail.FEMASubModuleId,
                        FEMASubModuleName = fEMASubModuleOfModuleDetail.FEMASubModuleName,
                        FEMAKeyModuleId = fEMASubModuleOfModuleDetail.FEMAKeyModuleId,
                        FEMAKeyModuleName = fEMASubModuleOfModuleDetail.FEMAKeyModuleName,
                        FEMAKeyModuleDetail = fEMASubModuleOfModuleDetail.FEMAKeyModuleDetail,
                        FEMAKeyModuleDetailNames = fEMASubModuleOfModuleDetail.FEMAKeyModuleDetailNames,
                        IsActive = fEMASubModuleOfModuleDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return fEMASubModuleOfModuleList;
            }
        }
        #endregion

        #region Add fEMASubModuleOfModule
        public int AddFEMASubModuleOfModule(FEMASubModuleOfModule fEMASubModuleOfModule)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FEMASubModuleDetailAdd(fEMASubModuleOfModule.FEMAModuleId, fEMASubModuleOfModule.FEMASubModuleId, Utility.TrimString(fEMASubModuleOfModule.RegulationKeyModuleDetail), Utility.TrimString(fEMASubModuleOfModule.RulesKeyModuleDetail), Utility.TrimString(fEMASubModuleOfModule.MasterDirectionKeyModuleDetail), Utility.TrimString(fEMASubModuleOfModule.MasterCircularKeyModuleDetail), Utility.TrimString(fEMASubModuleOfModule.RBIFAQKeyModuleDetail), fEMASubModuleOfModule.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update fEMASubModuleOfModule data
        public int UpdateFEMASubModuleOfModule(FEMASubModuleOfModule fEMASubModuleOfModule)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FEMASubModuleDetailUpdate(fEMASubModuleOfModule.FEMASubModuleOfModuleId, fEMASubModuleOfModule.FEMAModuleId, fEMASubModuleOfModule.FEMASubModuleId, Utility.TrimString(fEMASubModuleOfModule.RegulationKeyModuleDetail), Utility.TrimString(fEMASubModuleOfModule.RulesKeyModuleDetail), Utility.TrimString(fEMASubModuleOfModule.MasterDirectionKeyModuleDetail), Utility.TrimString(fEMASubModuleOfModule.MasterCircularKeyModuleDetail), Utility.TrimString(fEMASubModuleOfModule.RBIFAQKeyModuleDetail), fEMASubModuleOfModule.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Delete FEMASubModuleOfModule
        public int DeleteFEMASubModuleOfModule(FEMASubModuleOfModule fEMASubModuleOfModule)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FEMASubModuleOfModuleDelete(fEMASubModuleOfModule.FEMASubModuleOfModuleId, fEMASubModuleOfModule.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}