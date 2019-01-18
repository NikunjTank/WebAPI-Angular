using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IFDICircularIndex
    {
        #region Add all FDICircularIndex data
        int AddFDICircularIndex(FDICircularIndex fDICircularIndex);
        #endregion

        #region Update all FDICircularIndex data
        int UpdateFDICircularIndex(FDICircularIndex fDICircularIndex);
        #endregion

        #region Get all FDICircularIndex data
        IEnumerable<FDICircularIndex> GetFDICircularIndex(FDICircularIndex fDICircularIndex);
        #endregion

        #region Delete all FDICircularIndex
        int DeleteFDICircularIndex(FDICircularIndex fDICircularIndex);
        #endregion
    }
}
