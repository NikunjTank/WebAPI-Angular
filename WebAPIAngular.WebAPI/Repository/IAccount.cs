using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IAccount
    {
        Account LoginWithMobile(LoginWithMobileRequest loginWithMobileRequest);
        Account LoginWithUserName(LoginWithUserNameRequest loginWithUserNameRequest);
        int CheckUserExists(Account account);
        int VerifyAccountForMobile(VerifyAccountForMobileRequest verifyAccountForMobileRequest);
        int OTPUpdateForLogin(Account account);
        int Logout(LogoutRequest logoutRequest);
        Account GetUser(Account account);
    }
}
