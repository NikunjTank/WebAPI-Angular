using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class SupportTicketSubTopicRepository : ISupportTicketSubTopic
    {
        #region Get supportTicketSubTopic data
        public IEnumerable<SupportTicketSubTopic> GetSupportTicketSubTopic(SupportTicketSubTopic supportTicketSubTopic)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var supportTicketSubTopics = dataContext.SupportTicketSubTopicGet(supportTicketSubTopic.SupportTicketSubTopicId, supportTicketSubTopic.FEMAModuleId, Utility.TrimString(supportTicketSubTopic.SearchText), supportTicketSubTopic.IsActive, supportTicketSubTopic.PageNumber, supportTicketSubTopic.PageSize, supportTicketSubTopic.IsPagingRequired, Utility.TrimString(supportTicketSubTopic.OrderBy), Utility.TrimString(supportTicketSubTopic.OrderByDirection), totalPageCount, totalRecord).ToList();

                var supportTicketSubTopicList = new List<SupportTicketSubTopic>();
                foreach (var supportTicketSubTopicDetail in supportTicketSubTopics)
                {
                    supportTicketSubTopicList.Add(new SupportTicketSubTopic()
                    {
                        SupportTicketSubTopicId = supportTicketSubTopicDetail.SupportTicketSubTopicId,
                        FEMAModuleId = supportTicketSubTopicDetail.FEMAModuleId,
                        SupportTicketSubTopicName = supportTicketSubTopicDetail.SupportTicketSubTopicName,
                        IsActive = supportTicketSubTopicDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return supportTicketSubTopicList;
            }
        }
        #endregion
    }
}