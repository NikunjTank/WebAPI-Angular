using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface ICalculatorSubTopic
    {
        #region Get CalculatorSubTopic data
        IEnumerable<CalculatorSubTopic> GetCalculatorSubTopic(CalculatorSubTopic calculatorSubTopic);
        #endregion
    }
}
