using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class CommonField
    {
        public string FieldTypeName { get; set; }
        public int FieldId { get; set; }
        public string FieldName { get; set; }
        public string SearchText { get; set; }
        public string Alias { get; set; }
    }

    public class GetCommonFieldRequest
    {
        [Required]
        public string FieldTypeName { get; set; }
        public string SearchText { get; set; }
    }

    public class GetCommonFieldResponse
    {
        public int FieldId { get; set; }
        public string FieldName { get; set; }
        public string Alias { get; set; }
    }
}