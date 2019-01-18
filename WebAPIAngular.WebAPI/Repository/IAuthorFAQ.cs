using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IAuthorFAQ
    {
        #region Add AuthorFAQ data
        int AddAuthorFAQ(AuthorFAQ authorFAQ);
        #endregion

        #region Update AuthorFAQ data
        int UpdateAuthorFAQ(AuthorFAQ authorFAQ);
        #endregion

        #region Get AuthorFAQ data
        IEnumerable<AuthorFAQ> GetAuthorFAQ(AuthorFAQ authorFAQ);
        #endregion

        #region Delete AuthorFAQ
        int DeleteAuthorFAQ(AuthorFAQ authorFAQ);
        #endregion
    }
}
