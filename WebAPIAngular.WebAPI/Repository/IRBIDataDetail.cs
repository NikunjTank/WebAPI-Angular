using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IRBIDataDetail
    {
        #region Add RBIDataDetail data
        int AddRBIDataDetail(RBIDataDetail rBIDataDetail);
        #endregion

        #region Update RBIDataDetail data
        int UpdateRBIDataDetail(RBIDataDetail rBIDataDetail);
        #endregion

        #region Get RBIDataDetail data
        IEnumerable<RBIDataDetail> GetRBIDataDetail(RBIDataDetail rBIDataDetail);
        #endregion

        #region Delete RBIDataDetail
        int DeleteRBIDataDetail(RBIDataDetail rBIDataDetail);
        #endregion
    }
}
