using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IFAQ
    {
        #region Add FAQ data
        int AddFAQ(FAQ fAQ);
        #endregion

        #region Update FAQ data
        int UpdateFAQ(FAQ fAQ);
        #endregion

        #region Get FAQ data
        IEnumerable<FAQ> GetFAQ(FAQ fAQ);
        #endregion

        #region Delete FAQ
        int DeleteFAQ(FAQ fAQ);
        #endregion
    }
}
