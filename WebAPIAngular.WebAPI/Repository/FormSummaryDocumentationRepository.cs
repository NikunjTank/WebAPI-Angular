using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class FormSummaryDocumentationRepository : IFormSummaryDocumentation
    {
        #region Add FormSummaryDocumentation
        public int AddFormSummaryDocumentation(FormSummaryDocumentation formSummaryDocumentation)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FormSummaryDocumentationAdd(Utility.TrimString(formSummaryDocumentation.TopicName), Utility.TrimString(formSummaryDocumentation.SubMenuName), formSummaryDocumentation.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update FormSummaryDocumentation data
        public int UpdateFormSummaryDocumentation(FormSummaryDocumentation formSummaryDocumentation)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FormSummaryDocumentationUpdate(formSummaryDocumentation.FormSummaryDocumentationId, Utility.TrimString(formSummaryDocumentation.TopicName), Utility.TrimString(formSummaryDocumentation.SubMenuName), formSummaryDocumentation.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get FormSummaryDocumentation data
        public IEnumerable<FormSummaryDocumentation> GetFormSummaryDocumentation(FormSummaryDocumentation formSummaryDocumentation)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var formSummaryDocumentations = dataContext.FormSummaryDocumentationGet(formSummaryDocumentation.FormSummaryDocumentationId, Utility.TrimString(formSummaryDocumentation.SubMenuName), Utility.TrimString(formSummaryDocumentation.SearchText), formSummaryDocumentation.IsActive, formSummaryDocumentation.PageNumber, formSummaryDocumentation.PageSize, formSummaryDocumentation.IsPagingRequired, Utility.TrimString(formSummaryDocumentation.OrderBy), Utility.TrimString(formSummaryDocumentation.OrderByDirection), totalPageCount, totalRecord).ToList();

                var formSummaryDocumentationList = new List<FormSummaryDocumentation>();
                foreach (var formSummaryDocumentationDetail in formSummaryDocumentations)
                {
                    formSummaryDocumentationList.Add(new FormSummaryDocumentation()
                    {
                        FormSummaryDocumentationId = formSummaryDocumentationDetail.FormSummaryDocumentationId,
                        TopicName = formSummaryDocumentationDetail.TopicName,
                        IsActive = formSummaryDocumentationDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return formSummaryDocumentationList;
            }
        }
        #endregion

        #region Delete FormSummaryDocumentation
        public int DeleteFormSummaryDocumentation(FormSummaryDocumentation formSummaryDocumentation)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.FormSummaryDocumentationDelete(formSummaryDocumentation.FormSummaryDocumentationId, formSummaryDocumentation.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}