using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface INICCode
    {
        #region Add NICCode data
        int AddNICCode(NICCode nICCode);
        #endregion

        #region Update NICCode data
        int UpdateNICCode(NICCode nICCode);
        #endregion

        #region Get NICCode data
        IEnumerable<NICCode> GetNICCode(NICCode nICCode);
        #endregion

        #region Delete NICCode
        int DeleteNICCode(NICCode nICCode);
        #endregion
    }
}
