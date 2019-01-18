using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class FAQRepository : IFAQ
    {
        #region Add FAQ
        public int AddFAQ(FAQ fAQ)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FAQAdd(fAQ.CategoryId, Utility.TrimString(fAQ.TopicName), Utility.TrimString(fAQ.PDF), fAQ.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update FAQ data
        public int UpdateFAQ(FAQ fAQ)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FAQUpdate(fAQ.FAQId, fAQ.CategoryId, Utility.TrimString(fAQ.TopicName), Utility.TrimString(fAQ.PDF), fAQ.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get FAQ data
        public IEnumerable<FAQ> GetFAQ(FAQ fAQ)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var fAQs = dataContext.FAQGet(fAQ.FAQId, Utility.TrimString(fAQ.SearchText), fAQ.IsActive, fAQ.PageNumber, fAQ.PageSize, fAQ.IsPagingRequired, Utility.TrimString(fAQ.OrderBy), Utility.TrimString(fAQ.OrderByDirection), totalPageCount, totalRecord).ToList();

                var fAQList = new List<FAQ>();
                foreach (var fAQDetail in fAQs)
                {
                    fAQList.Add(new FAQ()
                    {
                        FAQId = fAQDetail.FAQID,
                        CategoryId = Convert.ToInt32(fAQDetail.CategoryId),
                        CategoryName = fAQDetail.CategoryName,
                        TopicName = fAQDetail.FAQTopicName,
                        PDF = fAQDetail.PDF,
                        IsActive = fAQDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return fAQList;
            }
        }
        #endregion

        #region Delete FAQ
        public int DeleteFAQ(FAQ fAQ)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FAQDelete(fAQ.FAQId, fAQ.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}