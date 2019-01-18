using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface ISector
    {
        #region Add Sector data
        int AddSector(Sector sector);
        #endregion

        #region Update Sector data
        int UpdateSector(Sector sector);
        #endregion

        #region Get Sector data
        IEnumerable<Sector> GetSector(Sector sector);
        #endregion

        #region Delete Sector
        int DeleteSector(Sector sector);
        #endregion
    }
}
