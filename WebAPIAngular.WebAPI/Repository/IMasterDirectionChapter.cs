using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IMasterDirectionChapter
    {
        #region Add MasterDirectionChapter data
        int AddMasterDirectionChapter(MasterDirectionChapter masterDirectionChapter);
        #endregion

        #region Update MasterDirectionChapter data
        int UpdateMasterDirectionChapter(MasterDirectionChapter masterDirectionChapter);
        #endregion

        #region Get MasterDirectionChapter data
        IEnumerable<MasterDirectionChapter> GetMasterDirectionChapter(MasterDirectionChapter masterDirectionChapter);
        #endregion

        #region Delete MasterDirectionChapter
        int DeleteMasterDirectionChapter(MasterDirectionChapter masterDirectionChapter);
        #endregion
    }
}
