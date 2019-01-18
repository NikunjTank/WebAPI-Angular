using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IIndexAmendment
    {
        #region Add index amendment data
        int AddIndexAmendment(IndexAmendment indexAmendment);
        #endregion

        #region Update index amendment data
        int UpdateIndexAmendment(IndexAmendment indexAmendment);
        #endregion

        #region Get index amendment data
        IEnumerable<IndexAmendment> GetIndexAmendment(IndexAmendment indexAmendment);
        #endregion

        #region Delete index amendment
        int DeleteIndexAmendment(IndexAmendment indexAmendment);
        #endregion
    }
}
