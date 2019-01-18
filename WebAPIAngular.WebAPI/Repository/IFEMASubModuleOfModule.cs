using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IFEMASubModuleOfModule
    {
        #region Get FEMASubModuleOfModule data
        IEnumerable<FEMASubModuleOfModule> GetFEMASubModuleOfModule(FEMASubModuleOfModule fEMASubModuleOfModule);
        #endregion

        #region Add FEMASubModuleOfModule data
        int AddFEMASubModuleOfModule(FEMASubModuleOfModule fEMASubModuleOfModule);
        #endregion

        #region Update FEMASubModuleOfModule data
        int UpdateFEMASubModuleOfModule(FEMASubModuleOfModule fEMASubModuleOfModule);
        #endregion

        #region Delete FEMASubModuleOfModule
        int DeleteFEMASubModuleOfModule(FEMASubModuleOfModule fEMASubModuleOfModule);
        #endregion
    }
}
