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
    
    public partial class MasterDirectionOfFEMASubModuleDetailGet_Result
    {
        public int MDID { get; set; }
        public string MasterDIrectionName { get; set; }
        public string Year { get; set; }
        public string Topics { get; set; }
        public string ShortName { get; set; }
        public Nullable<int> Regulationid { get; set; }
        public Nullable<int> SortId { get; set; }
        public string Header { get; set; }
        public string Footer { get; set; }
        public string PDF { get; set; }
        public Nullable<bool> IsActive { get; set; }
        public Nullable<bool> IsDeleted { get; set; }
        public Nullable<System.DateTime> WhenEntered { get; set; }
    }
}
