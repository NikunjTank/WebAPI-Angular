using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Models
{
    public class LoginHistory
    {
        public string LoginFrom { get; set; }
        public int UserId { get; set; }
        public string AccessToken { get; set; }
    }
}