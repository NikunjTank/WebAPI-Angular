using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IFetersCodeGroupDetail
    {
        #region Add FetersCodeGroupDetail data
        int AddFetersCodeGroupDetail(FetersCodeGroupDetail fetersCodeGroupDetail);
        #endregion

        #region Update FetersCodeGroupDetail data
        int UpdateFetersCodeGroupDetail(FetersCodeGroupDetail fetersCodeGroupDetail);
        #endregion

        #region Get FetersCodeGroupDetail data
        IEnumerable<FetersCodeGroupDetail> GetFetersCodeGroupDetail(FetersCodeGroupDetail fetersCodeGroupDetail);
        #endregion

        #region Delete FetersCodeGroupDetail
        int DeleteFetersCodeGroupDetail(FetersCodeGroupDetail fetersCodeGroupDetail);
        #endregion
    }
}
