using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class SupportTicketRepository : ISupportTicket
    {
        #region Add SupportTicket
        public int AddSupportTicket(SupportTicket supportTicket)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.SupportTicketAdd(supportTicket.UserId, supportTicket.TopicId, supportTicket.SubTopicId, Utility.TrimString(supportTicket.QueryTitle), supportTicket.DepartmentId, Utility.TrimString(supportTicket.Query), supportTicket.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get SupportTicket data
        public IEnumerable<SupportTicket> GetSupportTicket(SupportTicket supportTicket)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var supportTickets = dataContext.SupportTicketGet(supportTicket.SupportTicketId, supportTicket.UserId, supportTicket.IsForPostQuery, supportTicket.TopicId, supportTicket.SubTopicId, supportTicket.DepartmentId, Utility.TrimString(supportTicket.SearchText), supportTicket.IsActive, supportTicket.PageNumber, supportTicket.PageSize, supportTicket.IsPagingRequired, Utility.TrimString(supportTicket.OrderBy), Utility.TrimString(supportTicket.OrderByDirection), totalPageCount, totalRecord).ToList();

                var supportTicketList = new List<SupportTicket>();
                foreach (var supportTicketDetail in supportTickets)
                {
                    supportTicketList.Add(new SupportTicket()
                    {
                        SupportTicketId = supportTicketDetail.SupportTicketId,
                        UserId = supportTicketDetail.UserId,
                        DepartmentId = supportTicketDetail.DepartmentId,
                        DepartmentName = supportTicketDetail.DepartmentName,
                        TopicId = supportTicketDetail.TopicId,
                        SubTopicId = supportTicketDetail.SubTopicId,
                        TopicName = supportTicketDetail.TopicName,
                        SubTopicName = supportTicketDetail.SupportTicketSubTopicName,
                        QueryTitle = supportTicketDetail.QueryTitle,
                        Query = supportTicketDetail.Query,
                        IsActive = supportTicketDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return supportTicketList;
            }
        }
        #endregion

        #region Update SupportTicket MailSent
        public int UpdateSupportTicketMailSent(SupportTicket supportTicket)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.SupportTicketMailSentUpdate(supportTicket.SupportTicketId, supportTicket.IsMailSentToAdmin, supportTicket.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Delete SupportTicket
        public int DeleteSupportTicket(SupportTicket supportTicket)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.SupportTicketDelete(supportTicket.SupportTicketId, supportTicket.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}