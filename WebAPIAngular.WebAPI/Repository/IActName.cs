using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IActName
    {
        #region Add actname data
        int AddActName(ActName actName);
        #endregion

        #region Update actname data
        int UpdateActName(ActName actName);
        #endregion

        #region Get actname data
        IEnumerable<ActName> GetActName(ActName actName);
        #endregion

        #region Delete actname
        int DeleteActName(ActName actName);
        #endregion
    }
}
