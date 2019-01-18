using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IPressNoteAPDIRCircular
    {
        #region Add PressNoteAPDIRCircular data
        int AddPressNoteAPDIRCircular(PressNoteAPDIRCircular pressNoteAPDIRCircular);
        #endregion

        #region Update PressNoteAPDIRCircular data
        int UpdatePressNoteAPDIRCircular(PressNoteAPDIRCircular pressNoteAPDIRCircular);
        #endregion

        #region Get PressNoteAPDIRCircular data
        IEnumerable<PressNoteAPDIRCircular> GetPressNoteAPDIRCircular(PressNoteAPDIRCircular pressNoteAPDIRCircular);
        #endregion

        #region Delete PressNoteAPDIRCircular
        int DeletePressNoteAPDIRCircular(PressNoteAPDIRCircular pressNoteAPDIRCircular);
        #endregion
    }
}
