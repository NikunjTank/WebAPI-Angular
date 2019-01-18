using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class FAQCategoryRepository : IFAQCategory
    {
        #region Add FAQCategory
        public int AddFAQCategory(FAQCategory fAQCategory)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FAQCategoryAdd(Utility.TrimString(fAQCategory.CategoryName), fAQCategory.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update FAQCategory data
        public int UpdateFAQCategory(FAQCategory fAQCategory)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FAQCategoryUpdate(fAQCategory.FAQCategoryId, Utility.TrimString(fAQCategory.CategoryName), fAQCategory.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get FAQCategory data
        public IEnumerable<FAQCategory> GetFAQCategory(FAQCategory fAQCategory)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var fAQCategories = dataContext.FAQCategoryGet(fAQCategory.FAQCategoryId, Utility.TrimString(fAQCategory.SearchText), fAQCategory.IsActive, fAQCategory.PageNumber, fAQCategory.PageSize, fAQCategory.IsPagingRequired, Utility.TrimString(fAQCategory.OrderBy), Utility.TrimString(fAQCategory.OrderByDirection), totalPageCount, totalRecord).ToList();

                var fAQCategoryList = new List<FAQCategory>();
                foreach (var fAQCategoryDetail in fAQCategories)
                {
                    fAQCategoryList.Add(new FAQCategory()
                    {
                        FAQCategoryId = fAQCategoryDetail.CategoryId,
                        CategoryName = fAQCategoryDetail.CategoryName,
                        IsActive = fAQCategoryDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return fAQCategoryList;
            }
        }
        #endregion

        #region Delete FAQCategory
        public int DeleteFAQCategory(FAQCategory fAQCategory)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FAQCategoryDelete(fAQCategory.FAQCategoryId, fAQCategory.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}