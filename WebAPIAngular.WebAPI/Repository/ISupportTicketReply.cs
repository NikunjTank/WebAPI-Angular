using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface ISupportTicketReply
    {
        #region Add SupportTicketReply data
        SupportTicketReply AddSupportTicketReply(SupportTicketReply supportTicketReply);
        #endregion

        #region Get SupportTicketReply data
        IEnumerable<SupportTicketReply> GetSupportTicketReply(SupportTicketReply supportTicketReply);
        #endregion

        #region Update SupportTicketReply MailSent
        int UpdateSupportTicketReplyMailSent(SupportTicketReply supportTicketReply);
        #endregion

        #region Delete SupportTicketReply
        int DeleteSupportTicketReply(SupportTicketReply supportTicketReply);
        #endregion
    }
}
