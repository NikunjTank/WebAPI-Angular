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
    
    public partial class RulesGet_Result
    {
        public int Rulesid { get; set; }
        public string NameofRules { get; set; }
        public Nullable<int> Year { get; set; }
        public string RulesNo { get; set; }
        public Nullable<System.DateTime> PublicationDate { get; set; }
        public bool IsActive { get; set; }
        public bool IsDelete { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public Nullable<System.DateTime> WhenEntered { get; set; }
    }
}
