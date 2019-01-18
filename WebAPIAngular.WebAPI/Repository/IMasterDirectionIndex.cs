using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IMasterDirectionIndex
    {
        #region Add all MasterDirectionIndex data
        int AddMasterDirectionIndex(MasterDirectionIndex masterDirectionIndex);
        #endregion

        #region Update all MasterDirectionIndex data
        int UpdateMasterDirectionIndex(MasterDirectionIndex masterDirectionIndex);
        #endregion

        #region Get all MasterDirectionIndex data
        IEnumerable<MasterDirectionIndex> GetMasterDirectionIndex(MasterDirectionIndex masterDirectionIndex);
        #endregion

        #region Delete all MasterDirectionIndex
        int DeleteMasterDirectionIndex(MasterDirectionIndex masterDirectionIndex);
        #endregion
    }
}
