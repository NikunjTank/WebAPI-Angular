using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class CalculatorSubTopic
    {
        public int? FEMAModuleId { get; set; }
        public int? CalculatorSubTopicId { get; set; }
        public string CalculatorSubTopicName { get; set; }
        public bool IsAmountOfContraventionNeeded { get; set; }
        public bool IsTotalNoOfAPR_AAC_FCGPRNeeded { get; set; }
        public int ModifiedBy { get; set; }
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

    public class GetCalculatorSubTopicRequest
    {
        public int? FEMAModuleId { get; set; }
        public int? CalculatorSubTopicId { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetCalculatorSubTopicResponse
    {
        public int? FEMAModuleId { get; set; }
        public int? CalculatorSubTopicId { get; set; }
        public string CalculatorSubTopicName { get; set; }
        public bool IsAmountOfContraventionNeeded { get; set; }
        public bool IsTotalNoOfAPR_AAC_FCGPRNeeded { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

}