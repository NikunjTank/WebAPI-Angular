using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface ICalculatorAnswer
    {
        #region Get CalculatorAnswer data
        IEnumerable<CalculatorAnswer> GetCalculatorAnswer(CalculatorAnswer calculatorAnswer);
        #endregion
    }
}
