using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IAPDIRCircularBefore
    {
        #region Add APDIRCircularBefore data
        int AddAPDIRCircularBefore(APDIRCircularBefore aPDIRCircularBefore);
        #endregion

        #region Update APDIRCircularBefore data
        int UpdateAPDIRCircularBefore(APDIRCircularBefore aPDIRCircularBefore);
        #endregion

        #region Get APDIRCircularBefore data
        IEnumerable<APDIRCircularBefore> GetAPDIRCircularBefore(APDIRCircularBefore aPDIRCircularBefore);
        #endregion

        #region Delete APDIRCircularBefore
        int DeleteAPDIRCircularBefore(APDIRCircularBefore aPDIRCircularBefore);
        #endregion
    }
}
