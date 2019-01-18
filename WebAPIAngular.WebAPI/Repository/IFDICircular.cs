using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IFDICircular
    {
        #region Add FDICircular data
        int AddFDICircular(FDICircular fDICircular);
        #endregion

        #region Update FDICircular data
        int UpdateFDICircular(FDICircular fDICircular);
        #endregion

        #region Get FDICircular data
        IEnumerable<FDICircular> GetFDICircular(FDICircular fDICircular);
        #endregion

        #region Delete FDICircular
        int DeleteFDICircular(FDICircular fDICircular);
        #endregion
    }
}
