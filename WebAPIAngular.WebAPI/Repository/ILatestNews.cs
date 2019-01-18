using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface ILatestNews
    {
        #region Get latest news data
        IEnumerable<LatestNews> GetLatestNews();
        #endregion
    }
}
