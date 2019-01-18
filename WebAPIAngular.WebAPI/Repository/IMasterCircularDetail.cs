using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IMasterCircularDetail
    {
        #region Add MasterCircularDetail data
        int AddMasterCircularDetail(MasterCircularDetail masterCircularDetail);
        #endregion

        #region Update MasterCircularDetail data
        int UpdateMasterCircularDetail(MasterCircularDetail masterCircularDetail);
        #endregion

        #region Get MasterCircularDetail data
        IEnumerable<MasterCircularDetail> GetMasterCircularDetail(MasterCircularDetail masterCircularDetail);
        #endregion

        #region Delete MasterCircularDetail
        int DeleteMasterCircularDetail(MasterCircularDetail masterCircularDetail);
        #endregion
    }
}
