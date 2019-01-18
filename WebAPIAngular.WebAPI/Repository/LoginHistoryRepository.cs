using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class LoginHistoryRepository : ILoginHistory
    {
        #region Add login history data when user is login
        public int AddLoginHistory(LoginHistory loginHistory)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.LoginHistoryAdd(Utility.TrimString(loginHistory.LoginFrom), loginHistory.UserId, Utility.TrimString(loginHistory.AccessToken), result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Check access token is valid or invalid which is check when user call apis
        public bool CheckAccessToken(LoginHistory loginHistory)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter isValid = new ObjectParameter("IsValid", typeof(int));

                dataContext.AccessTokenCheck(Utility.TrimString(loginHistory.AccessToken), isValid);

                return Convert.ToBoolean(isValid.Value);
            }
        }
        #endregion
    }
}