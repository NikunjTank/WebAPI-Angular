using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IFDICircularSubIndex
    {
        #region Add all FDICircularSubIndex data
        int AddFDICircularSubIndex(FDICircularSubIndex fDICircularSubIndex);
        #endregion

        #region Update all FDICircularSubIndex data
        int UpdateFDICircularSubIndex(FDICircularSubIndex fDICircularSubIndex);
        #endregion

        #region Get all FDICircularSubIndex data
        IEnumerable<FDICircularSubIndex> GetFDICircularSubIndex(FDICircularSubIndex fDICircularSubIndex);
        #endregion

        #region Delete all FDICircularSubIndex
        int DeleteFDICircularSubIndex(FDICircularSubIndex fDICircularSubIndex);
        #endregion
    }
}
