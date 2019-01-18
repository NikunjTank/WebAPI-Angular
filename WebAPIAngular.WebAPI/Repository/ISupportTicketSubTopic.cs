using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface ISupportTicketSubTopic
    {
        #region Get SupportTicketSubTopic data
        IEnumerable<SupportTicketSubTopic> GetSupportTicketSubTopic(SupportTicketSubTopic supportTicketSubTopic);
        #endregion
    }
}
