using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IKeyDefinitionEvent
    {
        #region Add keyDefinitionEvent data
        int AddKeyDefinitionEvent(KeyDefinitionEvent keyDefinitionEvent);
        #endregion

        #region Update keyDefinitionEvent data
        int UpdateKeyDefinitionEvent(KeyDefinitionEvent keyDefinitionEvent);
        #endregion

        #region Get keyDefinitionEvent data
        IEnumerable<KeyDefinitionEvent> GetKeyDefinitionEvent(KeyDefinitionEvent keyDefinitionEvent);
        #endregion

        #region Delete keyDefinitionEvent
        int DeleteKeyDefinitionEvent(KeyDefinitionEvent keyDefinitionEvent);
        #endregion
    }
}
