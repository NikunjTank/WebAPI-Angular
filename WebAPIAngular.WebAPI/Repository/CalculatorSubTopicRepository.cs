using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class CalculatorSubTopicRepository : ICalculatorSubTopic
    {
        #region Get calculatorSubTopic data
        public IEnumerable<CalculatorSubTopic> GetCalculatorSubTopic(CalculatorSubTopic calculatorSubTopic)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var calculatorSubTopics = dataContext.CalculatorSubTopicGet(calculatorSubTopic.CalculatorSubTopicId, calculatorSubTopic.FEMAModuleId, Utility.TrimString(calculatorSubTopic.SearchText), calculatorSubTopic.IsActive, calculatorSubTopic.PageNumber, calculatorSubTopic.PageSize, calculatorSubTopic.IsPagingRequired, Utility.TrimString(calculatorSubTopic.OrderBy), Utility.TrimString(calculatorSubTopic.OrderByDirection), totalPageCount, totalRecord).ToList();

                var calculatorSubTopicList = new List<CalculatorSubTopic>();
                foreach (var calculatorSubTopicDetail in calculatorSubTopics)
                {
                    calculatorSubTopicList.Add(new CalculatorSubTopic()
                    {
                        CalculatorSubTopicId = calculatorSubTopicDetail.CalculatorSubTopicId,
                        FEMAModuleId = calculatorSubTopicDetail.FEMAModuleId,
                        CalculatorSubTopicName = calculatorSubTopicDetail.CalculatorSubTopicName,
                        IsAmountOfContraventionNeeded = calculatorSubTopicDetail.IsAmountOfContraventionNeeded,
                        IsTotalNoOfAPR_AAC_FCGPRNeeded = calculatorSubTopicDetail.IsTotalNoOfAPR_AAC_FCGPR_Needed,
                        IsActive = calculatorSubTopicDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return calculatorSubTopicList;
            }
        }
        #endregion
    }
}