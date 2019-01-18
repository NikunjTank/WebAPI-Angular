using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class CalculatorAnswerRepository : ICalculatorAnswer
    {
        #region Get calculatorAnswer data
        public IEnumerable<CalculatorAnswer> GetCalculatorAnswer(CalculatorAnswer calculatorAnswer)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var calculatorAnswers = dataContext.CalculatorAnswerGet(calculatorAnswer.CalculatorAnswerId, calculatorAnswer.CalculatorQuestionId, calculatorAnswer.FEMAModuleId, Utility.TrimString(calculatorAnswer.SearchText), calculatorAnswer.IsActive, calculatorAnswer.PageNumber, calculatorAnswer.PageSize, calculatorAnswer.IsPagingRequired, Utility.TrimString(calculatorAnswer.OrderBy), Utility.TrimString(calculatorAnswer.OrderByDirection), totalPageCount, totalRecord).ToList();

                var calculatorAnswerList = new List<CalculatorAnswer>();
                foreach (var calculatorAnswerDetail in calculatorAnswers)
                {
                    calculatorAnswerList.Add(new CalculatorAnswer()
                    {
                        CalculatorQuestionId = calculatorAnswerDetail.CalculatorQuestionId,
                        CalculatorAnswerId = calculatorAnswerDetail.CalculatorAnswerId,
                        FEMAModuleId = calculatorAnswerDetail.FEMAModuleId,
                        QuestionText = calculatorAnswerDetail.QuestionText,
                        Answer = calculatorAnswerDetail.Answer,
                        OutcomeId = calculatorAnswerDetail.OutcomeId,
                        OutcomeName = calculatorAnswerDetail.OutcomeName,
                        IsActive = calculatorAnswerDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return calculatorAnswerList;
            }
        }
        #endregion
    }
}