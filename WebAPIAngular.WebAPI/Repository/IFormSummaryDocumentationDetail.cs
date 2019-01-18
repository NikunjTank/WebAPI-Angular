using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IFormSummaryDocumentationDetail
    {
        #region Add FormSummaryDocumentationDetail data
        int AddFormSummaryDocumentationDetail(FormSummaryDocumentationDetail formSummaryDocumentationDetail);
        #endregion

        #region Update FormSummaryDocumentationDetail data
        int UpdateFormSummaryDocumentationDetail(FormSummaryDocumentationDetail formSummaryDocumentationDetail);
        #endregion

        #region Get FormSummaryDocumentationDetail data
        IEnumerable<FormSummaryDocumentationDetail> GetFormSummaryDocumentationDetail(FormSummaryDocumentationDetail formSummaryDocumentationDetail);
        #endregion

        #region Delete FormSummaryDocumentationDetail
        int DeleteFormSummaryDocumentationDetail(FormSummaryDocumentationDetail formSummaryDocumentationDetail);
        #endregion
    }
}
