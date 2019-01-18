using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IAPDIRCircular
    {
        #region Add APDIRCircular data
        int AddAPDIRCircular(APDIRCircular aPDIRCircular);
        #endregion

        #region Update APDIRCircular data
        int UpdateAPDIRCircular(APDIRCircular aPDIRCircular);
        #endregion

        #region Get APDIRCircular data
        IEnumerable<APDIRCircular> GetAPDIRCircular(APDIRCircular aPDIRCircular);
        #endregion

        #region Delete APDIRCircular
        int DeleteAPDIRCircular(APDIRCircular aPDIRCircular);
        #endregion
    }
}
