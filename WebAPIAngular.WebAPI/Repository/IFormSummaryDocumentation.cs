using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IFormSummaryDocumentation
    {
        #region Add FormSummaryDocumentation data
        int AddFormSummaryDocumentation(FormSummaryDocumentation formSummaryDocumentation);
        #endregion

        #region Update FormSummaryDocumentation data
        int UpdateFormSummaryDocumentation(FormSummaryDocumentation formSummaryDocumentation);
        #endregion

        #region Get FormSummaryDocumentation data
        IEnumerable<FormSummaryDocumentation> GetFormSummaryDocumentation(FormSummaryDocumentation formSummaryDocumentation);
        #endregion

        #region Delete FormSummaryDocumentation
        int DeleteFormSummaryDocumentation(FormSummaryDocumentation formSummaryDocumentation);
        #endregion
    }
}
