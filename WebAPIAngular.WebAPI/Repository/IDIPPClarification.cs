using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IDIPPClarification
    {
        #region Add DIPPClarification data
        int AddDIPPClarification(DIPPClarification dIPPClarification);
        #endregion

        #region Update DIPPClarification data
        int UpdateDIPPClarification(DIPPClarification dIPPClarification);
        #endregion

        #region Get DIPPClarification data
        IEnumerable<DIPPClarification> GetDIPPClarification(DIPPClarification dIPPClarification);
        #endregion

        #region Delete DIPPClarification
        int DeleteDIPPClarification(DIPPClarification dIPPClarification);
        #endregion
    }
}
