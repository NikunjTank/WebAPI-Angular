using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IRules
    {
        #region Add Rules data
        int AddRules(Rules rules);
        #endregion

        #region Update Rules data
        int UpdateRules(Rules rules);
        #endregion

        #region Get Rules data
        IEnumerable<Rules> GetRules(Rules rules);
        #endregion

        #region Delete Rules
        int DeleteRules(Rules rules);
        #endregion
    }
}
