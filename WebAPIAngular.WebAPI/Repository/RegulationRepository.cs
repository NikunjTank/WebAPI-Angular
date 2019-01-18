using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class RegulationRepository : IRegulation
    {
        #region Add regulation
        public int AddRegulation(Regulation regulation)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.RegulationAdd(Utility.TrimString(regulation.RegulationName), Utility.TrimString(regulation.RegulationNumber), Utility.TrimString(regulation.Year), regulation.PublicationDate, regulation.CreatedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Update regulation data
        public int UpdateRegulation(Regulation regulation)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.RegulationUpdate(regulation.RegulationId, Utility.TrimString(regulation.RegulationName), Utility.TrimString(regulation.RegulationNumber), Utility.TrimString(regulation.Year), regulation.PublicationDate, regulation.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get regulation data
        public IEnumerable<Regulation> GetRegulation(Regulation regulation)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var regulations = dataContext.RegulationGet(regulation.RegulationId, Utility.TrimString(regulation.SearchText), regulation.IsActive, regulation.PageNumber, regulation.PageSize, regulation.IsPagingRequired, Utility.TrimString(regulation.OrderBy), Utility.TrimString(regulation.OrderByDirection), totalPageCount, totalRecord).ToList();

                var regulationList = new List<Regulation>();
                foreach (var regulationDetail in regulations)
                {
                    regulationList.Add(new Regulation()
                    {
                        RegulationId = regulationDetail.Regulationid,
                        RegulationName = regulationDetail.Regulationname,
                        RegulationNumber = regulationDetail.Regulationnumber,
                        Year = regulationDetail.Year,
                        PublicationDate = regulationDetail.PublicationDate,
                        IsActive = regulationDetail.Isactive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return regulationList;
            }
        }
        #endregion

        #region Delete regulation
        public int DeleteRegulation(Regulation regulation)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.RegulationDelete(regulation.RegulationId, regulation.ModifiedBy, result);

                return Convert.ToInt32(result.Value);
            }
        }
        #endregion
    }
}