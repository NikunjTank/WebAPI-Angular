using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;
using System.Xml.Linq;

namespace DemystifyFema.Service.Repository
{
    public class RBILiaisonOfficeRepository : IRBILiaisonOffice
    {
        #region Add RBILiaisonOffice data using XML
        public void AddRBILiaisonOfficeFromXML(RBILiaisonOffice rBILiaisonOffice)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter rBILiaisonOfficesResult = new ObjectParameter("RBILiaisonOfficesResult", typeof(string));
                ObjectParameter result = new ObjectParameter("Result", typeof(int));

                dataContext.RBILiaisonOfficeAddFromXML(rBILiaisonOffice.RBILiaisonOffices.ToString().Replace("'", "''"), rBILiaisonOffice.CreatedBy, rBILiaisonOfficesResult, result);

                rBILiaisonOffice.RBILiaisonOffices = (rBILiaisonOfficesResult.Value != null) ? XElement.Parse(rBILiaisonOfficesResult.Value.ToString()) : rBILiaisonOffice.RBILiaisonOffices;
                rBILiaisonOffice.Result = Convert.ToInt32(result.Value);
            }
        }
        #endregion

        #region Get PressNote data
        public IEnumerable<RBILiaisonOffice> GetRBILiaisonOffice(RBILiaisonOffice rBILiaisonOffice)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var rBILiaisonOffices = dataContext.RBILiaisonOfficeGet(rBILiaisonOffice.RBILiaisonOfficeId, Utility.TrimString(rBILiaisonOffice.SearchText), rBILiaisonOffice.IsActive, rBILiaisonOffice.PageNumber, rBILiaisonOffice.PageSize, rBILiaisonOffice.IsPagingRequired, Utility.TrimString(rBILiaisonOffice.OrderBy), Utility.TrimString(rBILiaisonOffice.OrderByDirection), totalPageCount, totalRecord).ToList();

                var rBILiaisonOfficeList = new List<RBILiaisonOffice>();
                foreach (var rBILiaisonOfficeDetail in rBILiaisonOffices)
                {
                    rBILiaisonOfficeList.Add(new RBILiaisonOffice()
                    {
                        RBILiaisonOfficeId = rBILiaisonOfficeDetail.RBILiaisonOfficeId,
                        SerialNo = rBILiaisonOfficeDetail.SerialNo,
                        NameAndAddressOfTheCompany = rBILiaisonOfficeDetail.NameAndAddressOfTheCompany,
                        PlaceOfTheLiaisonOffice = rBILiaisonOfficeDetail.PlaceOfTheLiaisonOffice,
                        DateOfApprovalGrantedOrUINAlloted = Convert.ToDateTime(rBILiaisonOfficeDetail.DateOfApprovalGrantedOrUINAlloted),
                        UIN = rBILiaisonOfficeDetail.UIN,
                        IsActive = rBILiaisonOfficeDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return rBILiaisonOfficeList;
            }
        }
        #endregion
    }
}