using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface ISupportTicket
    {
        #region Add SupportTicket data
        int AddSupportTicket(SupportTicket supportTicket);
        #endregion
        
        #region Get SupportTicket data
        IEnumerable<SupportTicket> GetSupportTicket(SupportTicket supportTicket);
        #endregion

        #region Update SupportTicket MailSent
        int UpdateSupportTicketMailSent(SupportTicket supportTicket);
        #endregion

        #region Delete SupportTicket
        int DeleteSupportTicket(SupportTicket supportTicket);
        #endregion
    }
}
