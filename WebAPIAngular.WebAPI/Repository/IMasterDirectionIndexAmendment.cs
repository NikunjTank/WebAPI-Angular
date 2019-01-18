using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IMasterDirectionIndexAmendment
    {
        #region Add MasterDirectionIndexAmendment data
        int AddMasterDirectionIndexAmendment(MasterDirectionIndexAmendment masterDirectionIndexAmendment);
        #endregion

        #region Update MasterDirectionIndexAmendment data
        int UpdateMasterDirectionIndexAmendment(MasterDirectionIndexAmendment masterDirectionIndexAmendment);
        #endregion

        #region Get MasterDirectionIndexAmendment data
        IEnumerable<MasterDirectionIndexAmendment> GetMasterDirectionIndexAmendment(MasterDirectionIndexAmendment masterDirectionIndexAmendment);
        #endregion

        #region Delete MasterDirectionIndexAmendment
        int DeleteMasterDirectionIndexAmendment(MasterDirectionIndexAmendment masterDirectionIndexAmendment);
        #endregion
    }
}
