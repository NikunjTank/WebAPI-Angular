using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IManual
    {
        #region Add Manual data
        int AddManual(Manual manual);
        #endregion

        #region Update Manual data
        int UpdateManual(Manual manual);
        #endregion

        #region Get Manual data
        IEnumerable<Manual> GetManual(Manual manual);
        #endregion

        #region Delete Manual
        int DeleteManual(Manual manual);
        #endregion
    }
}
