using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IRulesSubIndex
    {
        #region Add all RulesSubIndex data
        int AddRulesSubIndex(RulesSubIndex RulesSubIndex);
        #endregion

        #region Update all RulesSubIndex data
        int UpdateRulesSubIndex(RulesSubIndex RulesSubIndex);
        #endregion

        #region Get all RulesSubIndex data
        IEnumerable<RulesSubIndex> GetRulesSubIndex(RulesSubIndex RulesSubIndex);
        #endregion

        #region Delete all RulesSubIndex
        int DeleteRulesSubIndex(RulesSubIndex RulesSubIndex);
        #endregion
    }
}
