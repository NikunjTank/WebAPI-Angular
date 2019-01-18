using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class PenaltyDetail
    {
        public int? PenaltyDetailId { get; set; }
        public int? CalculatorID { get; set; }
        public string CalculatorName { get; set; }
        public int? FEMAModuleId { get; set; }
        public int? CalculatorSubTopicID { get; set; }
        public string CalculatorSubTopicName { get; set; }
        public bool IsFixedPenalty { get; set; }
        public string Range { get; set; }
        public decimal Amount { get; set; }
        public string RangeAfter07November2017 { get; set; }
        public decimal? AmountAfter07November2017 { get; set; }
        public decimal? ExtraPenaltyRange { get; set; }
        public int CreatedBy { get; set; }
        public int ModifiedBy { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public bool IsPagingRequired { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

    public class GetPenaltyDetailRequest
    {
        public int? PenaltyDetailId { get; set; }
        public int? CalculatorID { get; set; }
        public int? CalculatorSubTopicID { get; set; }
        public string SearchText { get; set; }
        public bool? IsActive { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string OrderBy { get; set; }
        public string OrderByDirection { get; set; }
    }

    public class GetPenaltyDetailResponse
    {
        public int? PenaltyDetailId { get; set; }
        public int? CalculatorID { get; set; }
        public string CalculatorName { get; set; }
        public int? FEMAModuleId { get; set; }
        public int? CalculatorSubTopicID { get; set; }
        public string CalculatorSubTopicName { get; set; }
        public bool IsFixedPenalty { get; set; }
        public string Range { get; set; }
        public decimal Amount { get; set; }
        public string RangeAfter07November2017 { get; set; }
        public decimal? AmountAfter07November2017 { get; set; }
        public decimal? ExtraPenaltyRange { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalRecord { get; set; }
    }

}