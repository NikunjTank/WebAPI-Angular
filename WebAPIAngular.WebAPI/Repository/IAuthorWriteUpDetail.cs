using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IAuthorWriteUpDetail
    {
        #region Add AuthorWriteUpDetail data
        int AddAuthorWriteUpDetail(AuthorWriteUpDetail authorWriteUp);
        #endregion

        #region Update AuthorWriteUpDetail data
        int UpdateAuthorWriteUpDetail(AuthorWriteUpDetail authorWriteUp);
        #endregion

        #region Get AuthorWriteUpDetail data
        IEnumerable<AuthorWriteUpDetail> GetAuthorWriteUpDetail(AuthorWriteUpDetail authorWriteUp);
        #endregion

        #region Delete AuthorWriteUpDetail
        int DeleteAuthorWriteUpDetail(AuthorWriteUpDetail authorWriteUp);
        #endregion

        #region Get SubTopic data
        IEnumerable<SubTopic> GetSubTopic(SubTopic topic);
        #endregion
    }
}
