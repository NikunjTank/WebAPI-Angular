using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IPressNoteNotification
    {
        #region Add PressNoteNotification data
        int AddPressNoteNotification(PressNoteNotification pressNoteNotification);
        #endregion

        #region Update PressNoteNotification data
        int UpdatePressNoteNotification(PressNoteNotification pressNoteNotification);
        #endregion

        #region Get PressNoteNotification data
        IEnumerable<PressNoteNotification> GetPressNoteNotification(PressNoteNotification pressNoteNotification);
        #endregion

        #region Delete PressNoteNotification
        int DeletePressNoteNotification(PressNoteNotification pressNoteNotification);
        #endregion
    }
}
