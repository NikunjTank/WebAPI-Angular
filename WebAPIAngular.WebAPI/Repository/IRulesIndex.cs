using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IRulesIndex
    {
        #region Add RulesIndex data
        int AddRulesIndex(RulesIndex rulesIndex);
        #endregion

        #region Update RulesIndex data
        int UpdateRulesIndex(RulesIndex rulesIndex);
        #endregion

        #region Get RulesIndex data
        IEnumerable<RulesIndex> GetRulesIndex(RulesIndex rulesIndex);
        #endregion

        #region Delete RulesIndex
        int DeleteRulesIndex(RulesIndex rulesIndex);
        #endregion
    }
}
