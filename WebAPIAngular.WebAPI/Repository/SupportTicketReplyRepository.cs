using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class SupportTicketReplyRepository : ISupportTicketReply
    {
        #region Add SupportTicketReply
        public SupportTicketReply AddSupportTicketReply(SupportTicketReply supportTicketReply)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));
                ObjectParameter emailId = new ObjectParameter("EmailId", typeof(string));

                dataContext.SupportTicketReplyAdd(supportTicketReply.SupportTicketId, supportTicketReply.UserId, Utility.TrimString(supportTicketReply.QueryReply), supportTicketReply.CreatedBy, emailId, result);

                SupportTicketReply objSupportTicketReply = new SupportTicketReply()
                {
                    Result = Convert.ToInt32(result.Value),
                    EmailId = emailId.Value.ToString()
                };

                return objSupportTicketReply;
            }
        }
        #endregion

        #region Get SupportTicketReply data
        public IEnumerable<SupportTicketReply> GetSupportTicketReply(SupportTicketReply supportTicketReply)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var supportTicketReplys = dataContext.SupportTicketReplyGet(supportTicketReply.SupportTicketId, supportTicketReply.UserId, Utility.TrimString(supportTicketReply.SearchText), supportTicketReply.IsActive, supportTicketReply.PageNumber, supportTicketReply.PageSize, supportTicketReply.IsPagingRequired, Utility.TrimString(supportTicketReply.OrderBy), Utility.TrimString(supportTicketReply.OrderByDirection), totalPageCount, totalRecord).ToList();

                var supportTicketReplyList = new List<SupportTicketReply>();
                foreach (var supportTicketReplyDetail in supportTicketReplys)
                {
                    supportTicketReplyList.Add(new SupportTicketReply()
                    {
                        SupportTicketReplyId = supportTicketReplyDetail.SupportTicketReplyId,
                        UserId = supportTicketReplyDetail.UserId,
                        SupportTicketId = supportTicketReplyDetail.SupportTicketId,
                        QueryReply = supportTicketReplyDetail.QueryReply,
                        IsActive = supportTicketReplyDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return supportTicketReplyList;
            }
        }
        #endregion

        #region Update SupportTicketReply MailSent
        public int UpdateSupportTicketReplyMailSent(SupportTicketReply supportTicketReply)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.SupportTicketReplyMailSentUpdate(supportTicketReply.SupportTicketReplyId, supportTicketReply.IsMailSentToAdmin, supportTicketReply.IsMailSentToUser, supportTicketReply.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Delete SupportTicketReply
        public int DeleteSupportTicketReply(SupportTicketReply supportTicketReply)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.SupportTicketReplyDelete(supportTicketReply.SupportTicketReplyId, supportTicketReply.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}