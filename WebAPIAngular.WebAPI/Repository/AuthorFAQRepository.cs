using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class AuthorFAQRepository : IAuthorFAQ
    {
        #region Add authorfaq
        public int AddAuthorFAQ(AuthorFAQ authorFAQ)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.AuthorFAQAdd(authorFAQ.TopicId, authorFAQ.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update authorfaq data
        public int UpdateAuthorFAQ(AuthorFAQ authorFAQ)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.AuthorFAQUpdate(authorFAQ.AuthorFAQId, authorFAQ.TopicId, authorFAQ.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get authorfaq data
        public IEnumerable<AuthorFAQ> GetAuthorFAQ(AuthorFAQ authorFAQ)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var authorFAQs = dataContext.AuthorFAQGet(authorFAQ.AuthorFAQId, Utility.TrimString(authorFAQ.SearchText), authorFAQ.IsActive, authorFAQ.PageNumber, authorFAQ.PageSize, authorFAQ.IsPagingRequired, Utility.TrimString(authorFAQ.OrderBy), Utility.TrimString(authorFAQ.OrderByDirection), totalPageCount, totalRecord).ToList();

                var authorFAQList = new List<AuthorFAQ>();
                foreach (var authorFAQDetail in authorFAQs)
                {
                    authorFAQList.Add(new AuthorFAQ()
                    {
                        AuthorFAQId = authorFAQDetail.AuthorFAQId,
                        TopicId = authorFAQDetail.TopicId,
                        TopicName = authorFAQDetail.TopicName,
                        IsActive = authorFAQDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return authorFAQList;
            }
        }
        #endregion

        #region Delete authorfaq
        public int DeleteAuthorFAQ(AuthorFAQ authorFAQ)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.AuthorFAQDelete(authorFAQ.AuthorFAQId, authorFAQ.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}