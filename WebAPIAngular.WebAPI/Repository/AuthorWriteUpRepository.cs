using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class AuthorWriteUpRepository : IAuthorWriteUp
    {
        #region Add authorwriteup
        public int AddAuthorWriteUp(AuthorWriteUp authorWriteUp)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.AuthorWriteUpAdd(authorWriteUp.TopicId, Utility.TrimString(authorWriteUp.PDF), authorWriteUp.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update authorwriteup data
        public int UpdateAuthorWriteUp(AuthorWriteUp authorWriteUp)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.AuthorWriteUpUpdate(authorWriteUp.AuthorWriteUpId, authorWriteUp.TopicId, Utility.TrimString(authorWriteUp.PDF), authorWriteUp.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get authorwriteup data
        public IEnumerable<AuthorWriteUp> GetAuthorWriteUp(AuthorWriteUp authorWriteUp)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var authorWriteUps = dataContext.AuthorWriteUpGet(authorWriteUp.AuthorWriteUpId,authorWriteUp.TopicId, Utility.TrimString(authorWriteUp.SearchText), authorWriteUp.IsActive, authorWriteUp.PageNumber, authorWriteUp.PageSize, authorWriteUp.IsPagingRequired, Utility.TrimString(authorWriteUp.OrderBy), Utility.TrimString(authorWriteUp.OrderByDirection), totalPageCount, totalRecord).ToList();

                var authorWriteUpList = new List<AuthorWriteUp>();
                foreach (var authorWriteUpDetail in authorWriteUps)
                {
                    authorWriteUpList.Add(new AuthorWriteUp()
                    {
                        AuthorWriteUpId = authorWriteUpDetail.AuthorWriteUpId,
                        TopicId= authorWriteUpDetail.TopicId,
                        TopicName = authorWriteUpDetail.TopicName,
                        PDF = authorWriteUpDetail.PDF,
                        IsActive = authorWriteUpDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return authorWriteUpList;
            }
        }
        #endregion

        #region Delete authorwriteup
        public int DeleteAuthorWriteUp(AuthorWriteUp authorWriteUp)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.AuthorWriteUpDelete(authorWriteUp.AuthorWriteUpId, authorWriteUp.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        //#region Get Topic data
        //public IEnumerable<Topic> GetTopic(Topic topic)
        //{
        //    using (DemsifyEntities dataContext = new DemsifyEntities())
        //    {
        //        var topics = dataContext.TopicGet(topic.TopicId).ToList();

        //        var topicList = new List<Topic>();
        //        foreach (var topicDetail in topics)
        //        {
        //            topicList.Add(new Topic()
        //            {
        //                TopicId = topicDetail.TopicId,
        //                TopicName = topicDetail.TopicName
        //            });
        //        }
        //        return topicList;
        //    }
        //}
        //#endregion
    }
}