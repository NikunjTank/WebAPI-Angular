using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class CalculatorAnswer
    {
        public int? CalculatorQuestionId { get; set; }
        public int FEMAModuleId { get; set; }
        public string QuestionText { get; set; }
        public int? CalculatorAnswerId { get; set; }
        public string Answer { get; set; }
        public int? OutcomeId { get; set; }
        public string OutcomeName { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
        public bool IsPagingRequired { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
        public int Result { get; set; }
    }

    public class GetCalculatorAnswerRequest
    {
        [Required]
        public int FEMAModuleId { get; set; }
        public int? CalculatorQuestionId { get; set; }
        public int? CalculatorAnswerId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetCalculatorAnswerResponse
    {
        public int? CalculatorQuestionId { get; set; }
        public int FEMAModuleId { get; set; }
        public string QuestionText { get; set; }
        public int? CalculatorAnswerId { get; set; }
        public string Answer { get; set; }
        public int? OutcomeId { get; set; }
        public string OutcomeName { get; set; }        
        public bool? IsActive { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }
}