using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemystifyFema.Service.Repository
{
    interface IRBILiaisonOffice
    {
        #region Add RBILiaisonOffice data using XML
        void AddRBILiaisonOfficeFromXML(RBILiaisonOffice rBILiaisonOffice);
        #endregion


        #region Get RBILiaisonOffice data
        IEnumerable<RBILiaisonOffice> GetRBILiaisonOffice(RBILiaisonOffice rBILiaisonOffice);
        #endregion
    }
}
