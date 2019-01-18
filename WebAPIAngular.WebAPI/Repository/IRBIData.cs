using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IRBIData
    {
        #region Add RBIData data
        int AddRBIData(RBIData rBIData);
        #endregion

        #region Update RBIData data
        int UpdateRBIData(RBIData rBIData);
        #endregion

        #region Get RBIData data
        IEnumerable<RBIData> GetRBIData(RBIData rBIData);
        #endregion

        #region Delete RBIData
        int DeleteRBIData(RBIData rBIData);
        #endregion
    }
}
