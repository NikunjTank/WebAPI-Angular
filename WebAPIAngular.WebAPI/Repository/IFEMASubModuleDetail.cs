using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IFEMASubModuleDetail
    {
        #region Get RegulationOfFEMASubModuleDetail data
        IEnumerable<RegulationOfFEMASubModuleDetail> GetRegulationOfFEMASubModuleDetail(RegulationOfFEMASubModuleDetail regulationOfFEMASubModuleDetail);
        #endregion

        #region Get RulesOfFEMASubModuleDetail data
        IEnumerable<RulesOfFEMASubModuleDetail> GetRulesOfFEMASubModuleDetail(RulesOfFEMASubModuleDetail rulesOfFEMASubModuleDetail);
        #endregion

        #region Get MasterCircularOfFEMASubModuleDetail data
        IEnumerable<MasterCircularOfFEMASubModuleDetail> GetMasterCircularOfFEMASubModuleDetail(MasterCircularOfFEMASubModuleDetail masterCircularOfFEMASubModuleDetail);
        #endregion

        #region Get MasterDirectionOfFEMASubModuleDetail data
        IEnumerable<MasterDirectionOfFEMASubModuleDetail> GetMasterDirectionOfFEMASubModuleDetail(MasterDirectionOfFEMASubModuleDetail masterDirectionOfFEMASubModuleDetail);
        #endregion

        #region Get RBIFAQOfFEMASubModuleDetail data
        IEnumerable<RBIFAQOfFEMASubModuleDetail> GetRBIFAQOfFEMASubModuleDetail(RBIFAQOfFEMASubModuleDetail rBIFAQOfFEMASubModuleDetail);
        #endregion
    }
}
