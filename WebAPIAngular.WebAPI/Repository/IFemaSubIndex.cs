using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IFemaSubIndex
    {
        #region Add all FemaSubindex data
        int AddFemaSubIndex(FemaSubIndex femaSubIndex);
        #endregion

        #region Update all FemaSubindex data
        int UpdateFemaSubIndex(FemaSubIndex femaSubIndex);
        #endregion

        #region Get all FemaSubindex data
        IEnumerable<FemaSubIndex> GetFemaSubIndex(FemaSubIndex femaSubIndex);
        #endregion

        #region Delete all FemaSubindex
        int DeleteFemaSubIndex(FemaSubIndex femaSubIndex);
        #endregion
    }
}
