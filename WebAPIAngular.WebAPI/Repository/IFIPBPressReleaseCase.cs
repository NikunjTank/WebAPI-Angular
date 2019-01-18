using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IFIPBPressReleaseCase
    {
        #region Add FIPBPressReleaseCase data
        int AddFIPBPressReleaseCase(FIPBPressReleaseCase fIPBPressReleaseCase);
        #endregion

        #region Update FIPBPressReleaseCase data
        int UpdateFIPBPressReleaseCase(FIPBPressReleaseCase fIPBPressReleaseCase);
        #endregion

        #region Get FIPBPressReleaseCase data
        IEnumerable<FIPBPressReleaseCase> GetFIPBPressReleaseCase(FIPBPressReleaseCase fIPBPressReleaseCase);
        #endregion

        #region Delete FIPBPressReleaseCase
        int DeleteFIPBPressReleaseCase(FIPBPressReleaseCase fIPBPressReleaseCase);
        #endregion
    }
}
