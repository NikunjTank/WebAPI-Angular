using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IUserProfile
    {
        #region Add user data after register
        int AddUserProfile(UserProfile userProfile);
        #endregion

        #region Update user data
        int UpdateUserProfile(UserProfile userProfile);
        #endregion

        #region OTP update for user profile
        int OTPUpdateForUserProfile(UserProfile userProfile);
        #endregion

        #region Get UserProfile data
        IEnumerable<UserProfile> GetUserProfile(UserProfile userProfile);
        #endregion
    }
}
