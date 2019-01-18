using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class UserProfileRepository : IUserProfile
    {
        #region Add user data after register
        public int AddUserProfile(UserProfile userProfile)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.UserProfileAdd(userProfile.RoleId, Utility.TrimString(userProfile.UserName), Utility.TrimString(userProfile.Mobile), Utility.TrimString(userProfile.MobileOTP), Utility.TrimString(userProfile.EmailOTP), Utility.TrimString(userProfile.FirstName), Utility.TrimString(userProfile.LastName), Utility.TrimString(userProfile.CompanyName), userProfile.ProfessionalQualificationId, Utility.TrimString(userProfile.City), Utility.TrimString(userProfile.Gender), userProfile.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update user data
        public int UpdateUserProfile(UserProfile userProfile)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.UserProfileUpdate(userProfile.UserId, Utility.TrimString(userProfile.UserName), Utility.TrimString(userProfile.FirstName), Utility.TrimString(userProfile.LastName), Utility.TrimString(userProfile.Mobile), Utility.TrimString(userProfile.Gender), Utility.TrimString(userProfile.CompanyName), userProfile.ProfessionalQualificationId, Utility.TrimString(userProfile.City), Utility.TrimString(userProfile.MobileOTP), Utility.TrimString(userProfile.EmailOTP), userProfile.IsActive, userProfile.IsDeleted, userProfile.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        public int OTPUpdateForUserProfile(UserProfile userProfile)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.OTPUpdateForUserProfile(userProfile.UserId, Utility.TrimString(userProfile.Mobile), Utility.TrimString(userProfile.MobileOTP), Utility.TrimString(userProfile.EmailOTP), userProfile.IsVerified, result);

                return Convert.ToInt32(result.Value);
            }
        }

        #region Get UserProfile data
        public IEnumerable<UserProfile> GetUserProfile(UserProfile userProfile)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var userProfiles = dataContext.UserProfileGet(userProfile.UserId, Utility.TrimString(userProfile.SearchText), userProfile.IsActive, userProfile.PageNumber, userProfile.PageSize, userProfile.IsPagingRequired, Utility.TrimString(userProfile.OrderBy), Utility.TrimString(userProfile.OrderByDirection), totalPageCount, totalRecord).ToList();

                var userProfileList = new List<UserProfile>();
                foreach (var userProfileDetail in userProfiles)
                {
                    userProfileList.Add(new UserProfile()
                    {
                        UserId = userProfileDetail.UserId,
                        FirstName = userProfileDetail.FirstName,
                        LastName = userProfileDetail.LastName,
                        CompanyName = userProfileDetail.CompanyName,
                        ProfessionalQualificationId = userProfileDetail.ProfessionalQualificationId,
                        ProfessionalQualificationName = userProfileDetail.ProfessionalQualificationName,
                        SubscriptionStatus = userProfileDetail.SubscriptionStatus,
                        City = userProfileDetail.City,
                        Gender = userProfileDetail.Gender,
                        Mobile = userProfileDetail.Mobile,
                        UserName = userProfileDetail.UserName,
                        SubscriptionId = userProfileDetail.SubscriptionId,
                        IsActive = userProfileDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return userProfileList;
            }
        }
        #endregion
    }
}