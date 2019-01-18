using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface ICommonField
    {
        #region Get CommonField data
        IEnumerable<CommonField> GetCommonField(CommonField commonField);
        #endregion
    }
}
