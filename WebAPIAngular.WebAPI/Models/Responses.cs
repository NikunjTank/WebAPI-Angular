using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class Responses
    {
        public string Status { get; set; }
        public string Description { get; set; }
        public object Response { get; set; }
    }
}