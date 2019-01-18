using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IAuthorWriteUp
    {
        #region Add AuthorWriteUp data
        int AddAuthorWriteUp(AuthorWriteUp authorWriteUp);
        #endregion

        #region Update AuthorWriteUp data
        int UpdateAuthorWriteUp(AuthorWriteUp authorWriteUp);
        #endregion

        #region Get AuthorWriteUp data
        IEnumerable<AuthorWriteUp> GetAuthorWriteUp(AuthorWriteUp authorWriteUp);
        #endregion

        #region Delete AuthorWriteUp
        int DeleteAuthorWriteUp(AuthorWriteUp authorWriteUp);
        #endregion

        //#region Get Topic data
        //IEnumerable<Topic> GetTopic(Topic topic);
        //#endregion
    }
}
