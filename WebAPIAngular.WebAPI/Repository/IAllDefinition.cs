using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IAllDefinition
    {
        #region Add all definition data
        int AddAllDefinition(AllDefinition allDefinition);
        #endregion

        #region Update all definition data
        int UpdateAllDefinition(AllDefinition allDefinition);
        #endregion

        #region Get all definition data
        IEnumerable<AllDefinition> GetAllDefinition(AllDefinition allDefinition);
        #endregion

        #region Delete all definition
        int DeleteAllDefinition(AllDefinition allDefinition);
        #endregion
    }
}
