using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class FIPBReviewRepository : IFIPBReview
    {
        #region Add FIPBReview
        public int AddFIPBReview(FIPBReview fIPBReview)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FIPBReviewAdd(Utility.TrimString(fIPBReview.Name), Utility.TrimString(fIPBReview.PDF), fIPBReview.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update FIPBReview data
        public int UpdateFIPBReview(FIPBReview fIPBReview)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FIPBReviewUpdate(fIPBReview.FIPBReviewId, Utility.TrimString(fIPBReview.Name), Utility.TrimString(fIPBReview.PDF), fIPBReview.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get FIPBReview data
        public IEnumerable<FIPBReview> GetFIPBReview(FIPBReview fIPBReview)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var fIPBReviews = dataContext.FIPBReviewGet(fIPBReview.FIPBReviewId, Utility.TrimString(fIPBReview.SearchText), fIPBReview.IsActive, fIPBReview.PageNumber, fIPBReview.PageSize, fIPBReview.IsPagingRequired, Utility.TrimString(fIPBReview.OrderBy), Utility.TrimString(fIPBReview.OrderByDirection), totalPageCount, totalRecord).ToList();

                var fIPBReviewList = new List<FIPBReview>();
                foreach (var fIPBReviewDetail in fIPBReviews)
                {
                    fIPBReviewList.Add(new FIPBReview()
                    {
                        FIPBReviewId = fIPBReviewDetail.id,
                        Name = fIPBReviewDetail.Name,
                        PDF = fIPBReviewDetail.PDF,
                        IsActive = fIPBReviewDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return fIPBReviewList;
            }
        }
        #endregion

        #region Delete FIPBReview
        public int DeleteFIPBReview(FIPBReview fIPBReview)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FIPBReviewDelete(fIPBReview.FIPBReviewId, fIPBReview.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}