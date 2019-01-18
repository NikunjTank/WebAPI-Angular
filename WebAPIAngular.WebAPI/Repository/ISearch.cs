using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface ISearch
    {
        #region Get search data
        IEnumerable<Search> GetSearchData(Search search);
        #endregion

        #region Get search auto complete data
        IEnumerable<Search> GetSearchAutoCompleteData(Search search);
        #endregion
    }
}
