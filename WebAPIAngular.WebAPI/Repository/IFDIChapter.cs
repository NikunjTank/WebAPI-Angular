using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IFDIChapter
    {
        #region Add FDIChapter data
        int AddFDIChapter(FDIChapter fDIChapter);
        #endregion

        #region Update FDIChapter data
        int UpdateFDIChapter(FDIChapter fDIChapter);
        #endregion

        #region Get FDIChapter data
        IEnumerable<FDIChapter> GetFDIChapter(FDIChapter fDIChapter);
        #endregion

        #region Delete FDIChapter
        int DeleteFDIChapter(FDIChapter fDIChapter);
        #endregion
    }
}
