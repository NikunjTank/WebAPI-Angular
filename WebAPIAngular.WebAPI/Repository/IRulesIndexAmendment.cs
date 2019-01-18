using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IRulesIndexAmendment
    {
        #region Add index amendment data
        int AddRulesIndexAmendment(RulesIndexAmendment indexAmendment);
        #endregion

        #region Update index amendment data
        int UpdateRulesIndexAmendment(RulesIndexAmendment indexAmendment);
        #endregion

        #region Get index amendment data
        IEnumerable<RulesIndexAmendment> GetRulesIndexAmendment(RulesIndexAmendment indexAmendment);
        #endregion

        #region Delete index amendment
        int DeleteRulesIndexAmendment(RulesIndexAmendment indexAmendment);
        #endregion
    }
}
