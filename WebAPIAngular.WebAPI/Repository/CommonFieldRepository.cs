using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class CommonFieldRepository : ICommonField
    {
        #region Get commonFieldModule data
        public IEnumerable<CommonField> GetCommonField(CommonField commonField)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                var commonFields = dataContext.CommonFieldGet(commonField.FieldTypeName, commonField.SearchText).ToList();

                var commonFieldList = new List<CommonField>();
                foreach (var commonFieldDetail in commonFields)
                {
                    commonFieldList.Add(new CommonField()
                    {
                        FieldId = Convert.ToInt32(commonFieldDetail.FieldId),
                        FieldName = commonFieldDetail.FieldName,
                        Alias = commonFieldDetail.Alias
                    });
                }
                return commonFieldList;
            }
        }
        #endregion
    }
}