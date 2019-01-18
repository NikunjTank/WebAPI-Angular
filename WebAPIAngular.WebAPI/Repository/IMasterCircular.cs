using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IMasterCircular
    {
        #region Add MasterCircular data
        int AddMasterCircular(MasterCircular masterCircular);
        #endregion

        #region Update MasterCircular data
        int UpdateMasterCircular(MasterCircular masterCircular);
        #endregion

        #region Get MasterCircular data
        IEnumerable<MasterCircular> GetMasterCircular(MasterCircular masterCircular);
        #endregion

        #region Delete MasterCircular
        int DeleteMasterCircular(MasterCircular masterCircular);
        #endregion
    }
}
