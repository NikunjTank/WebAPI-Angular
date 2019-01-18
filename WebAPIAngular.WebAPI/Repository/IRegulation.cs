using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IRegulation
    {
        #region Add regulation data
        int AddRegulation(Regulation regulation);
        #endregion

        #region Update regulation data
        int UpdateRegulation(Regulation regulation);
        #endregion

        #region Get regulation data
        IEnumerable<Regulation> GetRegulation(Regulation regulation);
        #endregion

        #region Delete regulation
        int DeleteRegulation(Regulation regulation);
        #endregion
    }
}
