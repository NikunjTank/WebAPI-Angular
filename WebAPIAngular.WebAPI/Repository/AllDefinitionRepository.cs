using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class AllDefinitionRepository : IAllDefinition
    {
        #region Add all definition
        public int AddAllDefinition(AllDefinition allDefinition)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.AllDefinitionAdd(allDefinition.ActId, Utility.TrimString(allDefinition.DefinitionName), Utility.TrimString(allDefinition.FullDInsertion), Utility.TrimString(allDefinition.AuthorNote), allDefinition.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update all definition data
        public int UpdateAllDefinition(AllDefinition allDefinition)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.AllDefinitionUpdate(allDefinition.Id, allDefinition.ActId, Utility.TrimString(allDefinition.DefinitionName), Utility.TrimString(allDefinition.FullDInsertion), Utility.TrimString(allDefinition.AuthorNote), allDefinition.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get all definition data
        public IEnumerable<AllDefinition> GetAllDefinition(AllDefinition allDefinition)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var allDefinitions = dataContext.AllDefinitionGet(allDefinition.Id, allDefinition.ActId, Utility.TrimString(allDefinition.SearchText), allDefinition.IsActive, allDefinition.PageNumber, allDefinition.PageSize, allDefinition.IsPagingRequired, Utility.TrimString(allDefinition.OrderBy), Utility.TrimString(allDefinition.OrderByDirection), totalPageCount, totalRecord).ToList();

                var allDefinitionList = new List<AllDefinition>();
                foreach (var allDefinitionDetail in allDefinitions)
                {
                    allDefinitionList.Add(new AllDefinition()
                    {
                        Id = allDefinitionDetail.Id,
                        ActId = allDefinitionDetail.ActId,
                        DefinitionName = allDefinitionDetail.DefinitionName,
                        FullDInsertion = allDefinitionDetail.FullDInsertion,
                        AuthorNote = allDefinitionDetail.AuthorNote,
                        IsActive = allDefinitionDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return allDefinitionList;
            }
        }
        #endregion

        #region Delete all definition
        public int DeleteAllDefinition(AllDefinition allDefinition)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.AllDefinitionDelete(allDefinition.Id, allDefinition.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}