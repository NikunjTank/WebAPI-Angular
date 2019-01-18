using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class ContactUsRepository : IContactUs
    {
        #region Add ContactUs
        public int AddContactUs(ContactUs contactUs)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.ContactUsAdd(Utility.TrimString(contactUs.Name), Utility.TrimString(contactUs.Email), Utility.TrimString(contactUs.Mobile), Utility.TrimString(contactUs.Comment), contactUs.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
        
        #region Get ContactUs data
        public IEnumerable<ContactUs> GetContactUs(ContactUs contactUs)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var contactUss = dataContext.ContactUsGet(contactUs.ContactUsId, Utility.TrimString(contactUs.SearchText), contactUs.IsActive, contactUs.PageNumber, contactUs.PageSize, contactUs.IsPagingRequired, Utility.TrimString(contactUs.OrderBy), Utility.TrimString(contactUs.OrderByDirection), totalPageCount, totalRecord).ToList();

                var contactUsList = new List<ContactUs>();
                foreach (var contactUsDetail in contactUss)
                {
                    contactUsList.Add(new ContactUs()
                    {
                        ContactUsId = contactUsDetail.ContactUsId,
                        Name = contactUsDetail.Name,
                        Email = contactUsDetail.Email,
                        Mobile = contactUsDetail.Mobile,
                        Comment = contactUsDetail.Comment,
                        IsActive = contactUsDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return contactUsList;
            }
        }
        #endregion

        #region Delete ContactUs
        public int DeleteContactUs(ContactUs contactUs)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.ContactUsDelete(contactUs.ContactUsId, contactUs.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}