using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IRBICompoundingOrder
    {
        #region Add RBICompoundingOrder data
        int AddRBICompoundingOrder(RBICompoundingOrder rBICompoundingOrder);
        #endregion

        #region Update RBICompoundingOrder data
        int UpdateRBICompoundingOrder(RBICompoundingOrder rBICompoundingOrder);
        #endregion

        #region Get RBICompoundingOrder data
        IEnumerable<RBICompoundingOrder> GetRBICompoundingOrder(RBICompoundingOrder rBICompoundingOrder);
        #endregion

        #region Delete RBICompoundingOrder
        int DeleteRBICompoundingOrder(RBICompoundingOrder rBICompoundingOrder);
        #endregion
    }
}
