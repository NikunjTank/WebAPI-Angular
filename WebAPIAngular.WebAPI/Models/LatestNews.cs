using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class LatestNews
    {
        public int CategoryId { get; set; }
        public string Number { get; set; }
        public string Name { get; set; }
        public string PDF { get; set; }
    }

    public class GetLatestNewsResponse
    {
        public int CategoryId { get; set; }
        public string Number { get; set; }
        public string Name { get; set; }
        public string PDF { get; set; }
    }
}