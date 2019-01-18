using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IFDICircularIndexAmendment
    {
        #region Add FDICircularIndexAmendment data
        int AddFDICircularIndexAmendment(FDICircularIndexAmendment fDICircularIndexAmendmen);
        #endregion

        #region Update FDICircularFDICircularIndexAmendmen data
        int UpdateFDICircularIndexAmendment(FDICircularIndexAmendment fDICircularIndexAmendmen);
        #endregion

        #region Get FDICircularFDICircularIndexAmendment data
        IEnumerable<FDICircularIndexAmendment> GetFDICircularIndexAmendment(FDICircularIndexAmendment fDICircularIndexAmendmen);
        #endregion

        #region Delete FDICircularFDICircularIndexAmendmen
        int DeleteFDICircularIndexAmendment(FDICircularIndexAmendment fDICircularIndexAmendmen);
        #endregion
    }
}
