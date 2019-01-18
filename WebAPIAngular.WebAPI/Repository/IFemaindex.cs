using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IFemaIndex
    {
        #region Add all Femaindex data
        int AddFemaIndex(FemaIndex femaIndex);
        #endregion

        #region Update all Femaindex data
        int UpdateFemaIndex(FemaIndex femaIndex);
        #endregion

        #region Get all Femaindex data
        IEnumerable<FemaIndex> GetFemaIndex(FemaIndex femaIndex);
        #endregion

        #region Delete all Femaindex
        int DeleteFemaIndex(FemaIndex femaIndex);
        #endregion
    }
}
