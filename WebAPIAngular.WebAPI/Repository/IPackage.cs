using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IPackage
    {
        #region Get Package data
        IEnumerable<Package> GetPackage(Package package);
        #endregion
    }
}
