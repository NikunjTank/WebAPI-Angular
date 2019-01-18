using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class SearchRepository : ISearch
    {
        #region Get search data
        public IEnumerable<Search> GetSearchData(Search search)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var searches = dataContext.SearchGet(search.CategoryId, Utility.TrimString(search.SearchText), search.PageNumber, search.PageSize, search.IsPagingRequired, Utility.TrimString(search.OrderBy), Utility.TrimString(search.OrderByDirection), totalPageCount, totalRecord).ToList();

                var searchList = new List<Search>();
                foreach (var searchDetail in searches)
                {
                    searchList.Add(new Search()
                    {
                        CategoryId = searchDetail.CategoryId,
                        Number = searchDetail.Number,
                        Name = searchDetail.Name,
                        Content = searchDetail.Content,
                        PDF = searchDetail.PDF,
                        Excel = searchDetail.Excel,
                        Word = searchDetail.Word,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return searchList;
            }
        }
        #endregion

        #region Get search data
        public IEnumerable<Search> GetSearchAutoCompleteData(Search search)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                var searches = dataContext.SearchAutoCompleteGet(Utility.TrimString(search.SearchText)).ToList();

                var searchList = new List<Search>();
                foreach (var searchDetail in searches)
                {
                    searchList.Add(new Search()
                    {
                        SearchContent = searchDetail.SearchContent
                    });
                }
                return searchList;
            }
        }
        #endregion
    }
}