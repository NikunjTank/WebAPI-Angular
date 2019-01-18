using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class FormSummaryDocumentationDetailRepository : IFormSummaryDocumentationDetail
    {
        #region Add FormSummaryDocumentationDetail
        public int AddFormSummaryDocumentationDetail(FormSummaryDocumentationDetail formSummaryDocumentationDetail)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FormSummaryDocumentationDetailAdd(formSummaryDocumentationDetail.FormSummaryDocumentationId, Utility.TrimString(formSummaryDocumentationDetail.FormName), Utility.TrimString(formSummaryDocumentationDetail.WordFileName), Utility.TrimString(formSummaryDocumentationDetail.ExcelFileName), Utility.TrimString(formSummaryDocumentationDetail.PDFFileName), Utility.TrimString(formSummaryDocumentationDetail.SubMenuName), formSummaryDocumentationDetail.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update FormSummaryDocumentationDetail data
        public int UpdateFormSummaryDocumentationDetail(FormSummaryDocumentationDetail formSummaryDocumentationDetail)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FormSummaryDocumentationDetailUpdate(formSummaryDocumentationDetail.FormSummaryDocumentationDetailId, formSummaryDocumentationDetail.FormSummaryDocumentationId, Utility.TrimString(formSummaryDocumentationDetail.FormName), Utility.TrimString(formSummaryDocumentationDetail.WordFileName), Utility.TrimString(formSummaryDocumentationDetail.ExcelFileName), Utility.TrimString(formSummaryDocumentationDetail.PDFFileName), Utility.TrimString(formSummaryDocumentationDetail.SubMenuName), formSummaryDocumentationDetail.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get FormSummaryDocumentationDetail data
        public IEnumerable<FormSummaryDocumentationDetail> GetFormSummaryDocumentationDetail(FormSummaryDocumentationDetail formSummaryDocumentationDetail)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var formSummaryDocumentationDetails = dataContext.FormSummaryDocumentationDetailGet(formSummaryDocumentationDetail.FormSummaryDocumentationDetailId, formSummaryDocumentationDetail.FormSummaryDocumentationId, Utility.TrimString(formSummaryDocumentationDetail.SubMenuName), Utility.TrimString(formSummaryDocumentationDetail.SearchText), formSummaryDocumentationDetail.IsActive, formSummaryDocumentationDetail.PageNumber, formSummaryDocumentationDetail.PageSize, formSummaryDocumentationDetail.IsPagingRequired, Utility.TrimString(formSummaryDocumentationDetail.OrderBy), Utility.TrimString(formSummaryDocumentationDetail.OrderByDirection), totalPageCount, totalRecord).ToList();

                var formSummaryDocumentationDetailList = new List<FormSummaryDocumentationDetail>();
                foreach (var formSummaryDocumentationDetailDetail in formSummaryDocumentationDetails)
                {
                    formSummaryDocumentationDetailList.Add(new FormSummaryDocumentationDetail()
                    {
                        FormSummaryDocumentationDetailId = formSummaryDocumentationDetailDetail.FormSummaryDocumentationDetailId,
                        FormSummaryDocumentationId = formSummaryDocumentationDetailDetail.FormSummaryDocumentationId,
                        FormName = formSummaryDocumentationDetailDetail.FormName,
                        WordFileName = formSummaryDocumentationDetailDetail.WordFileName,
                        ExcelFileName = formSummaryDocumentationDetailDetail.ExcelFileName,
                        PDFFileName = formSummaryDocumentationDetailDetail.PDFFileName,
                        IsActive = formSummaryDocumentationDetailDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return formSummaryDocumentationDetailList;
            }
        }
        #endregion

        #region Delete FormSummaryDocumentationDetail
        public int DeleteFormSummaryDocumentationDetail(FormSummaryDocumentationDetail formSummaryDocumentationDetail)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FormSummaryDocumentationDetailDelete(formSummaryDocumentationDetail.FormSummaryDocumentationDetailId, formSummaryDocumentationDetail.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}