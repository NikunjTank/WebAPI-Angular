using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IAPDIRCircularAfter
    {
        #region Add APDIRCircularAfter data
        int AddAPDIRCircularAfter(APDIRCircularAfter aPDIRCircularAfter);
        #endregion

        #region Update APDIRCircularAfter data
        int UpdateAPDIRCircularAfter(APDIRCircularAfter aPDIRCircularAfter);
        #endregion

        #region Get APDIRCircularAfter data
        IEnumerable<APDIRCircularAfter> GetAPDIRCircularAfter(APDIRCircularAfter aPDIRCircularAfter);
        #endregion

        #region Delete APDIRCircularAfter
        int DeleteAPDIRCircularAfter(APDIRCircularAfter aPDIRCircularAfter);
        #endregion
    }
}
