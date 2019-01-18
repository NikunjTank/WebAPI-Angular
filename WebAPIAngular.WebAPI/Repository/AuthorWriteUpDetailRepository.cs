using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class AuthorWriteUpDetailRepository : IAuthorWriteUpDetail
    {
        #region Add AuthorWriteUpDetail
        public int AddAuthorWriteUpDetail(AuthorWriteUpDetail authorWriteUpDetail)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.AuthorWriteUpDetailAdd(authorWriteUpDetail.AuthorWriteUpId, authorWriteUpDetail.SubTopicId, Utility.TrimString(authorWriteUpDetail.PDF), authorWriteUpDetail.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update AuthorWriteUpDetail data
        public int UpdateAuthorWriteUpDetail(AuthorWriteUpDetail authorWriteUpDetail)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.AuthorWriteUpDetailUpdate(authorWriteUpDetail.AuthorWriteUpDetailId, authorWriteUpDetail.AuthorWriteUpId, authorWriteUpDetail.SubTopicId, Utility.TrimString(authorWriteUpDetail.PDF), authorWriteUpDetail.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get AuthorWriteUpDetail data
        public IEnumerable<AuthorWriteUpDetail> GetAuthorWriteUpDetail(AuthorWriteUpDetail authorWriteUpDetail)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var authorWriteUpDetails = dataContext.AuthorWriteUpDetailGet(authorWriteUpDetail.AuthorWriteUpDetailId, authorWriteUpDetail.AuthorWriteUpId, Utility.TrimString(authorWriteUpDetail.SearchText), authorWriteUpDetail.IsActive, authorWriteUpDetail.PageNumber, authorWriteUpDetail.PageSize, authorWriteUpDetail.IsPagingRequired, Utility.TrimString(authorWriteUpDetail.OrderBy), Utility.TrimString(authorWriteUpDetail.OrderByDirection), totalPageCount, totalRecord).ToList();

                var authorWriteUpDetailList = new List<AuthorWriteUpDetail>();
                foreach (var authorWriteUpDetailDetail in authorWriteUpDetails)
                {
                    authorWriteUpDetailList.Add(new AuthorWriteUpDetail()
                    {
                        AuthorWriteUpDetailId = authorWriteUpDetailDetail.AuthorWriteUpDetailId,
                        AuthorWriteUpId = authorWriteUpDetailDetail.AuthorWriteUpId,
                        SubTopicId = authorWriteUpDetailDetail.SubTopicId,
                        SubTopicName = authorWriteUpDetailDetail.SubTopicName,
                        PDF = authorWriteUpDetailDetail.PDF,
                        IsActive = authorWriteUpDetailDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return authorWriteUpDetailList;
            }
        }
        #endregion

        #region Delete AuthorWriteUpDetail
        public int DeleteAuthorWriteUpDetail(AuthorWriteUpDetail authorWriteUpDetail)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.AuthorWriteUpDetailDelete(authorWriteUpDetail.AuthorWriteUpDetailId, authorWriteUpDetail.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get SubTopic data
        public IEnumerable<SubTopic> GetSubTopic(SubTopic subTopic)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                var subTopics = dataContext.SubTopicGet(subTopic.SubTopicId).ToList();

                var subTopicList = new List<SubTopic>();
                foreach (var subTopicDetail in subTopics)
                {
                    subTopicList.Add(new SubTopic()
                    {
                        SubTopicId = subTopicDetail.SubTopicId,
                        SubTopicName = subTopicDetail.SubTopicName
                    });
                }
                return subTopicList;
            }
        }
        #endregion
    }
}