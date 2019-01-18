using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface ISectorDetail
    {
        #region Add SectorDetail data
        int AddSectorDetail(SectorDetail sectorDetail);
        #endregion

        #region Update SectorDetail data
        int UpdateSectorDetail(SectorDetail sectorDetail);
        #endregion

        #region Get SectorDetail data
        IEnumerable<SectorDetail> GetSectorDetail(SectorDetail sectorDetail);
        #endregion

        #region Delete SectorDetail
        int DeleteSectorDetail(SectorDetail sectorDetail);
        #endregion
    }
}
