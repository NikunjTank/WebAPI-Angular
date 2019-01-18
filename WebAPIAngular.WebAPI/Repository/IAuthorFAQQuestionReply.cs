using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IAuthorFAQQuestionReply
    {
        #region Add AuthorFAQQuestionReply data
        int AddAuthorFAQQuestionReply(AuthorFAQQuestionReply authorFAQQuestionReply);
        #endregion

        #region Update AuthorFAQQuestionReply data
        int UpdateAuthorFAQQuestionReply(AuthorFAQQuestionReply authorFAQQuestionReply);
        #endregion

        #region Get AuthorFAQQuestionReply data
        IEnumerable<AuthorFAQQuestionReply> GetAuthorFAQQuestionReply(AuthorFAQQuestionReply authorFAQQuestionReply);
        #endregion

        #region Delete AuthorFAQQuestionReply
        int DeleteAuthorFAQQuestionReply(AuthorFAQQuestionReply authorFAQQuestionReply);
        #endregion
    }
}
