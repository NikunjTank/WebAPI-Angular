using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IFetersCodeDetail
    {
        #region Add FetersCodeDetail data
        int AddFetersCodeDetail(FetersCodeDetail fetersCodeDetail);
        #endregion

        #region Update FetersCodeDetail data
        int UpdateFetersCodeDetail(FetersCodeDetail fetersCodeDetail);
        #endregion

        #region Get FetersCodeDetail data
        IEnumerable<FetersCodeDetail> GetFetersCodeDetail(FetersCodeDetail fetersCodeDetail);
        #endregion

        #region Delete FetersCodeDetail
        int DeleteFetersCodeDetail(FetersCodeDetail fetersCodeDetail);
        #endregion
    }
}
