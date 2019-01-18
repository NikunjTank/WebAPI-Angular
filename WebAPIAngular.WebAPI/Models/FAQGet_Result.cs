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
    
    public partial class FAQGet_Result
    {
        public int FAQID { get; set; }
        public string FAQYear { get; set; }
        public string FAQCategoryName { get; set; }
        public string FAQTopicName { get; set; }
        public string PDF { get; set; }
        public string FAQQuNo { get; set; }
        public string FAQAnswer { get; set; }
        public Nullable<int> Regulationid { get; set; }
        public Nullable<int> Notificationid { get; set; }
        public Nullable<int> Indexid { get; set; }
        public Nullable<int> MCID { get; set; }
        public string MCYear { get; set; }
        public Nullable<int> MCPID { get; set; }
        public Nullable<int> MCSecID { get; set; }
        public Nullable<int> MCPartID { get; set; }
        public Nullable<int> MCSubIndex { get; set; }
        public Nullable<int> MDID { get; set; }
        public string MDYear { get; set; }
        public Nullable<int> MDPID { get; set; }
        public Nullable<int> MDSecID { get; set; }
        public Nullable<int> MDPartIndexID { get; set; }
        public Nullable<int> MDSubIndex { get; set; }
        public Nullable<int> FDIID { get; set; }
        public string FDIYear { get; set; }
        public Nullable<int> FDIchapterID { get; set; }
        public Nullable<int> FDIPartIndexID { get; set; }
        public Nullable<int> FDISubIndex { get; set; }
        public Nullable<int> RuleID { get; set; }
        public string GSRNo { get; set; }
        public Nullable<int> RulePartID { get; set; }
        public Nullable<int> RuleIndexId { get; set; }
        public Nullable<bool> IsDeleted { get; set; }
        public Nullable<bool> IsActive { get; set; }
        public Nullable<System.DateTime> WhenEntered { get; set; }
        public Nullable<int> CategoryId { get; set; }
        public string CategoryName { get; set; }
    }
}
