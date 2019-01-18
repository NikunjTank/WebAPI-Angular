using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IAuthorFAQDetail
    {
        #region Add AuthorFAQDetail data
        int AddAuthorFAQDetail(AuthorFAQDetail authorFAQDetail);
        #endregion

        #region Update AuthorFAQDetail data
        int UpdateAuthorFAQDetail(AuthorFAQDetail authorFAQDetail);
        #endregion

        #region Get AuthorFAQDetail data
        IEnumerable<AuthorFAQDetail> GetAuthorFAQDetail(AuthorFAQDetail authorFAQDetail);
        #endregion

        #region Delete AuthorFAQDetail
        int DeleteAuthorFAQDetail(AuthorFAQDetail authorFAQDetail);
        #endregion
    }
}
