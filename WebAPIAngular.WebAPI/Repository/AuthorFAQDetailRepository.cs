using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class AuthorFAQDetailRepository : IAuthorFAQDetail
    {
        #region Add AuthorFAQDetail
        public int AddAuthorFAQDetail(AuthorFAQDetail authorFAQDetail)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.AuthorFAQDetailAdd(authorFAQDetail.AuthorFAQId, authorFAQDetail.SubTopicId, authorFAQDetail.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update AuthorFAQDetail data
        public int UpdateAuthorFAQDetail(AuthorFAQDetail authorFAQDetail)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.AuthorFAQDetailUpdate(authorFAQDetail.AuthorFAQDetailId, authorFAQDetail.AuthorFAQId, authorFAQDetail.SubTopicId, authorFAQDetail.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get AuthorFAQDetail data
        public IEnumerable<AuthorFAQDetail> GetAuthorFAQDetail(AuthorFAQDetail authorFAQDetail)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var authorFAQDetails = dataContext.AuthorFAQDetailGet(authorFAQDetail.AuthorFAQDetailId, authorFAQDetail.AuthorFAQId, Utility.TrimString(authorFAQDetail.SearchText), authorFAQDetail.IsActive, authorFAQDetail.PageNumber, authorFAQDetail.PageSize, authorFAQDetail.IsPagingRequired, Utility.TrimString(authorFAQDetail.OrderBy), Utility.TrimString(authorFAQDetail.OrderByDirection), totalPageCount, totalRecord).ToList();

                var authorFAQDetailList = new List<AuthorFAQDetail>();
                foreach (var authorFAQDetailDetail in authorFAQDetails)
                {
                    authorFAQDetailList.Add(new AuthorFAQDetail()
                    {
                        AuthorFAQDetailId = authorFAQDetailDetail.AuthorFAQDetailId,
                        AuthorFAQId = authorFAQDetailDetail.AuthorFAQId,
                        SubTopicId = authorFAQDetailDetail.SubTopicId,
                        SubTopicName = authorFAQDetailDetail.SubTopicName,
                        IsActive = authorFAQDetailDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return authorFAQDetailList;
            }
        }
        #endregion

        #region Delete AuthorFAQDetail
        public int DeleteAuthorFAQDetail(AuthorFAQDetail authorFAQDetail)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.AuthorFAQDetailDelete(authorFAQDetail.AuthorFAQDetailId, authorFAQDetail.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}