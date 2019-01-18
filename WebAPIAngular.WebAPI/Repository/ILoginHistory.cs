using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface ILoginHistory
    {
        #region Add login history data when user is login
        int AddLoginHistory(LoginHistory loginHistory);
        #endregion

        #region Check access token is valid or invalid which is check when user call apis
        bool CheckAccessToken(LoginHistory loginHistory);
        #endregion
    }
}
