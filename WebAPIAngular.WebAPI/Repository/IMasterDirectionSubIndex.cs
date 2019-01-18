using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IMasterDirectionSubIndex
    {
        #region Add all MasterDirectionSubIndex data
        int AddMasterDirectionSubIndex(MasterDirectionSubIndex masterDirectionSubIndex);
        #endregion

        #region Update all MasterDirectionSubIndex data
        int UpdateMasterDirectionSubIndex(MasterDirectionSubIndex masterDirectionSubIndex);
        #endregion

        #region Get all MasterDirectionSubIndex data
        IEnumerable<MasterDirectionSubIndex> GetMasterDirectionSubIndex(MasterDirectionSubIndex masterDirectionSubIndex);
        #endregion

        #region Delete all MasterDirectionSubIndex
        int DeleteMasterDirectionSubIndex(MasterDirectionSubIndex masterDirectionSubIndex);
        #endregion
    }
}
