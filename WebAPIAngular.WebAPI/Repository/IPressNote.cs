using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IPressNote
    {
        #region Add PressNote data
        int AddPressNote(PressNote pressNote);
        #endregion

        #region Update PressNote data
        int UpdatePressNote(PressNote pressNote);
        #endregion

        #region Get PressNote data
        IEnumerable<PressNote> GetPressNote(PressNote pressNote);
        #endregion

        #region Delete PressNote
        int DeletePressNote(PressNote pressNote);
        #endregion
    }
}
