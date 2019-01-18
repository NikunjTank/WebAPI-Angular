using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IFAQCategory
    {
        #region Add FAQCategory data
        int AddFAQCategory(FAQCategory fAQCategory);
        #endregion

        #region Update FAQCategory data
        int UpdateFAQCategory(FAQCategory fAQCategory);
        #endregion

        #region Get FAQCategory data
        IEnumerable<FAQCategory> GetFAQCategory(FAQCategory fAQCategory);
        #endregion

        #region Delete FAQCategory
        int DeleteFAQCategory(FAQCategory fAQCategory);
        #endregion
    }
}
