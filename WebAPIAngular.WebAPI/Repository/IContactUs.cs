using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IContactUs
    {
        #region Add ContactUs data
        int AddContactUs(ContactUs contactUs);
        #endregion
        
        #region Get ContactUs data
        IEnumerable<ContactUs> GetContactUs(ContactUs contactUs);
        #endregion

        #region Delete ContactUs
        int DeleteContactUs(ContactUs contactUs);
        #endregion
    }
}
