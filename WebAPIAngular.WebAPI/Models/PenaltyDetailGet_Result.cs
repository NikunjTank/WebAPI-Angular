//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace DemystifyFema.Service.Models
{
    using System;
    
    public partial class PenaltyDetailGet_Result
    {
        public int PenaltyDetailID { get; set; }
        public Nullable<int> CalculatorID { get; set; }
        public bool IsFixedPenalty { get; set; }
        public string Range { get; set; }
        public decimal Amount { get; set; }
        public string RangeAfter07November2017 { get; set; }
        public decimal AmountAfter07November2017 { get; set; }
        public Nullable<decimal> ExtraPenaltyRange { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public int CreatedBy { get; set; }
        public System.DateTime CreatedDate { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public string CalculatorName { get; set; }
        public Nullable<int> FEMAModuleId { get; set; }
        public Nullable<int> CalculatorSubTopicId { get; set; }
        public string CalculatorSubTopicName { get; set; }
    }
}