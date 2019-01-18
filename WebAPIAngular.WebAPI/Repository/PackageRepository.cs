using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace DemystifyFema.Service.Repository
{
    public class PackageRepository : IPackage
    {
        #region Get Package data
        public IEnumerable<Package> GetPackage(Package package)
        {
            using (DemsifyEntities dataContext = new DemsifyEntities())
            {
                ObjectParameter totalPageCount = new ObjectParameter("TotalPageCount", typeof(int));
                ObjectParameter totalRecord = new ObjectParameter("TotalRecord", typeof(int));

                var packages = dataContext.PackageGet(package.PackageId, Utility.TrimString(package.SearchText), package.IsActive, package.PageNumber, package.PageSize, package.IsPagingRequired, Utility.TrimString(package.OrderBy), Utility.TrimString(package.OrderByDirection), totalPageCount, totalRecord).ToList();

                var packageList = new List<Package>();
                foreach (var packageDetail in packages)
                {
                    packageList.Add(new Package()
                    {
                        PackageId = packageDetail.PackageId,
                        PackageName = packageDetail.PackageName,
                        PackageDuration = packageDetail.PackageDuration,
                        Amount = packageDetail.Amount,
                        PackageTypeId = packageDetail.PackageTypeId,
                        PackageTypeName = packageDetail.PackageTypeName,
                        IsActive = packageDetail.IsActive,
                        TotalPageCount = Convert.ToInt32(totalPageCount.Value),
                        TotalRecord = Convert.ToInt32(totalRecord.Value)
                    });
                }
                return packageList;
            }
        }
        #endregion
    }
}