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
    
    public partial class FemaSubIndexGet_Result
    {
        public int FemaSubIndexId { get; set; }
        public int IndexId { get; set; }
        public string SubIndexNumber { get; set; }
        public string SubIndexName { get; set; }
        public string SubIndexContent { get; set; }
        public Nullable<int> SortId { get; set; }
        public Nullable<bool> Isactive { get; set; }
        public Nullable<bool> Isdeleted { get; set; }
        public Nullable<System.DateTime> Entereddate { get; set; }
    }
}
