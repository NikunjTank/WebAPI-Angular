using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class AuthorFAQQuestionReplyRepository : IAuthorFAQQuestionReply
    {
        #region Add AuthorFAQQuestionReply
        public int AddAuthorFAQQuestionReply(AuthorFAQQuestionReply authorFAQQuestionReply)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.AuthorFAQQuestionReplyAdd(authorFAQQuestionReply.AuthorFAQDetailId, Utility.TrimString(authorFAQQuestionReply.Question), Utility.TrimString(authorFAQQuestionReply.Reply), authorFAQQuestionReply.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update AuthorFAQQuestionReply data
        public int UpdateAuthorFAQQuestionReply(AuthorFAQQuestionReply authorFAQQuestionReply)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.AuthorFAQQuestionReplyUpdate(authorFAQQuestionReply.AuthorFAQQuestionReplyId, authorFAQQuestionReply.AuthorFAQDetailId, Utility.TrimString(authorFAQQuestionReply.Question), Utility.TrimString(authorFAQQuestionReply.Reply), authorFAQQuestionReply.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get AuthorFAQQuestionReply data
        public IEnumerable<AuthorFAQQuestionReply> GetAuthorFAQQuestionReply(AuthorFAQQuestionReply authorFAQQuestionReply)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var authorFAQQuestionReplys = dataContext.AuthorFAQQuestionReplyGet(authorFAQQuestionReply.AuthorFAQQuestionReplyId, authorFAQQuestionReply.AuthorFAQDetailId, Utility.TrimString(authorFAQQuestionReply.SearchText), authorFAQQuestionReply.IsActive, authorFAQQuestionReply.PageNumber, authorFAQQuestionReply.PageSize, authorFAQQuestionReply.IsPagingRequired, Utility.TrimString(authorFAQQuestionReply.OrderBy), Utility.TrimString(authorFAQQuestionReply.OrderByDirection), totalPageCount, totalRecord).ToList();

                var authorFAQQuestionReplyList = new List<AuthorFAQQuestionReply>();
                foreach (var authorFAQQuestionReplyDetail in authorFAQQuestionReplys)
                {
                    authorFAQQuestionReplyList.Add(new AuthorFAQQuestionReply()
                    {
                        AuthorFAQQuestionReplyId = authorFAQQuestionReplyDetail.AuthorFAQQuestionReplyId,
                        AuthorFAQDetailId = authorFAQQuestionReplyDetail.AuthorFAQDetailId,
                        Question = authorFAQQuestionReplyDetail.Question,
                        Reply = authorFAQQuestionReplyDetail.Reply,
                        IsActive = authorFAQQuestionReplyDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return authorFAQQuestionReplyList;
            }
        }
        #endregion

        #region Delete AuthorFAQQuestionReply
        public int DeleteAuthorFAQQuestionReply(AuthorFAQQuestionReply authorFAQQuestionReply)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.AuthorFAQQuestionReplyDelete(authorFAQQuestionReply.AuthorFAQQuestionReplyId, authorFAQQuestionReply.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}