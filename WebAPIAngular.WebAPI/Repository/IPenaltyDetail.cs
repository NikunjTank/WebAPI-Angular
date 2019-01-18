using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IPenaltyDetail
    {        
        #region Get PenaltyDetail data
        IEnumerable<PenaltyDetail> GetPenaltyDetail(PenaltyDetail penaltyDetail);
        #endregion        
    }
}
