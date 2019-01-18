using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IMasterDirectionFAQ
    {
        #region Add MasterDirectionFAQ data
        int AddMasterDirectionFAQ(MasterDirectionFAQ masterDirectionFAQ);
        #endregion

        #region Update MasterDirectionFAQ data
        int UpdateMasterDirectionFAQ(MasterDirectionFAQ masterDirectionFAQ);
        #endregion

        #region Get MasterDirectionFAQ data
        IEnumerable<MasterDirectionFAQ> GetMasterDirectionFAQ(MasterDirectionFAQ masterDirectionFAQ);
        #endregion

        #region Delete MasterDirectionFAQ
        int DeleteMasterDirectionFAQ(MasterDirectionFAQ masterDirectionFAQ);
        #endregion
    }
}
