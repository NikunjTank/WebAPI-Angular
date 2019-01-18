using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IMasterDirection
    {
        #region Add MasterDirection data
        int AddMasterDirection(MasterDirection masterDirection);
        #endregion

        #region Update MasterDirection data
        int UpdateMasterDirection(MasterDirection masterDirection);
        #endregion

        #region Get MasterDirection data
        IEnumerable<MasterDirection> GetMasterDirection(MasterDirection masterDirection);
        #endregion

        #region Delete MasterDirection
        int DeleteMasterDirection(MasterDirection masterDirection);
        #endregion
    }
}
