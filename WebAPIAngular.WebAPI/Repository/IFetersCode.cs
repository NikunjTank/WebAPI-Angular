using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IFetersCode
    {
        #region Add FetersCode data
        int AddFetersCode(FetersCode fetersCode);
        #endregion

        #region Update FetersCode data
        int UpdateFetersCode(FetersCode fetersCode);
        #endregion

        #region Get FetersCode data
        IEnumerable<FetersCode> GetFetersCode(FetersCode fetersCode);
        #endregion

        #region Delete FetersCode
        int DeleteFetersCode(FetersCode fetersCode);
        #endregion
    }
}
