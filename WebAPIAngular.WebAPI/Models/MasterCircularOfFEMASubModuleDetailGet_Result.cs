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
    
    public partial class MasterCircularOfFEMASubModuleDetailGet_Result
    {
        public int MCID { get; set; }
        public string Name { get; set; }
        public string Year { get; set; }
        public Nullable<int> Regulationid { get; set; }
        public string Shorttitle { get; set; }
        public string Footnote { get; set; }
        public string PDF { get; set; }
        public Nullable<bool> Isactive { get; set; }
        public Nullable<bool> Isdeleted { get; set; }
        public Nullable<System.DateTime> Entereddate { get; set; }
    }
}
