using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DemystifyFema.Service.Models;
using DemystifyFema.Service.Common;
using System.Data.Entity.Core.Objects;

namespace DemystifyFema.Service.Repository
{
    public class AccountRepository : IAccount
    {
        public Account LoginWithMobile(LoginWithMobileRequest loginWithMobileRequest)
        {
            var userDetail = new Account();
            using (DemsifyEntities dbContext = new DemsifyEntities())
            {
                var user = dbContext.LoginWithMobile(Utility.TrimString(loginWithMobileRequest.Mobile), Utility.TrimString(loginWithMobileRequest.MobileOTP)).FirstOrDefault();
                if (user != null)
                {
                    userDetail.UserId = user.UserId;
                    userDetail.RoleId = user.RoleId;
                    userDetail.RoleName = user.RoleName;
                    userDetail.UserName = user.UserName;
                    userDetail.Mobile = user.Mobile;
                }
                else
                {
                    userDetail = null;
                }
            }
            return userDetail;
        }

        public Account LoginWithUserName(LoginWithUserNameRequest loginWithUserNameRequest)
        {
            var userDetail = new Account();
            using (DemsifyEntities dbContext = new DemsifyEntities())
            {
                var user = dbContext.LoginWithUserName(Utility.TrimString(loginWithUserNameRequest.UserName), Utility.TrimString(loginWithUserNameRequest.Password)).FirstOrDefault();
                if (user != null)
                {
                    userDetail.UserId = user.UserId;
                    userDetail.RoleId = user.RoleId;
                    userDetail.RoleName = user.RoleName;
                    userDetail.UserName = user.UserName;
                    userDetail.Mobile = user.Mobile;
                }
                else
                {
                    userDetail = null;
                }
            }
            return userDetail;
        }

        public int CheckUserExists(Account account)
        {
            using (DemsifyEntities dbContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dbContext.CheckUserExists(Utility.TrimString(account.UserName), Utility.TrimString(account.Mobile), result);

                return Convert.ToInt32(result.Value);
            }
        }

        public int VerifyAccountForMobile(VerifyAccountForMobileRequest verifyAccountForMobileRequest)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.VerifyAccountForMobile(Utility.TrimString(verifyAccountForMobileRequest.UserName), Utility.TrimString(verifyAccountForMobileRequest.Mobile), Utility.TrimString(verifyAccountForMobileRequest.MobileOTP), Utility.TrimString(verifyAccountForMobileRequest.EmailOTP), result);

                return Convert.ToInt32(result.Value);
            }
        }

        public int OTPUpdateForLogin(Account account)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.OTPUpdateForLogin(Utility.TrimString(account.Mobile), Utility.TrimString(account.MobileOTP), result);

                return Convert.ToInt32(result.Value);
            }
        }

        public int Logout(LogoutRequest logoutRequest)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.Logout(Utility.TrimString(logoutRequest.AccessToken), result);

                return Convert.ToInt32(result.Value);
            }
        }

        public Account GetUser(Account account)
        {
            var userDetail = new Account();
            using (DemsifyEntities dbContext = new DemsifyEntities())
            {
                var user = dbContext.UserGet(account.UserId, account.IsActive).FirstOrDefault();
                if (user != null)
                {
                    userDetail.UserId = user.UserId;
                    userDetail.RoleId = user.RoleId;
                    userDetail.RoleName = user.RoleName;
                    userDetail.UserName = user.UserName;
                    userDetail.Mobile = user.Mobile;
                }
                else
                {
                    userDetail = null;
                }
            }
            return userDetail;
        }
    }
}