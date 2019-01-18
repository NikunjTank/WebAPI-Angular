using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IFIPBReview
    {
        #region Add FIPBReview data
        int AddFIPBReview(FIPBReview fIPBReview);
        #endregion

        #region Update FIPBReview data
        int UpdateFIPBReview(FIPBReview fIPBReview);
        #endregion

        #region Get FIPBReview data
        IEnumerable<FIPBReview> GetFIPBReview(FIPBReview fIPBReview);
        #endregion

        #region Delete FIPBReview
        int DeleteFIPBReview(FIPBReview fIPBReview);
        #endregion
    }
}
