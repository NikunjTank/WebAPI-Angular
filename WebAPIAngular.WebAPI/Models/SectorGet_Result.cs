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
    
    public partial class SectorGet_Result
    {
        public int SID { get; set; }
        public string Name { get; set; }
        public Nullable<int> Year { get; set; }
        public string Subtopic { get; set; }
        public string Pressnote { get; set; }
        public string Notification { get; set; }
        public Nullable<bool> Isactive { get; set; }
        public Nullable<bool> Isdeleted { get; set; }
        public Nullable<System.DateTime> Entereddate { get; set; }
        public Nullable<int> PressNoteId { get; set; }
        public Nullable<int> NotificationId { get; set; }
        public Nullable<int> APDIRCircularId { get; set; }
    }
}
