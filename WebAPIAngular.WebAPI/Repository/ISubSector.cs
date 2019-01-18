using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface ISubSector
    {
        #region Add SubSector data
        int AddSubSector(SubSector subSector);
        #endregion

        #region Update SubSector data
        int UpdateSubSector(SubSector subSector);
        #endregion

        #region Get SubSector data
        IEnumerable<SubSector> GetSubSector(SubSector subSector);
        #endregion

        #region Delete SubSector
        int DeleteSubSector(SubSector subSector);
        #endregion
    }
}
