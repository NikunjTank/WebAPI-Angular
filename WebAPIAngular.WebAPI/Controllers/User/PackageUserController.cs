using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using DemystifyFema.Service.Repository;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;

namespace DemystifyFema.Service.Controllers.User
{
    [Authorize(Roles = "User")]
    [RoutePrefix("user/api")]
    public class PackageUserController : ApiController
    {
        private IPackage iPackage;
        public PackageUserController()
        {
            try
            {
                iPackage = new PackageRepository();
            }
            catch (Exception ex)
            {
                Utility.WriteLog("PackageUserController (User)", null, "Error while initialize repository.", ex.ToString());
            }
        }

        [HttpGet]
        [Route("packages")]
        [ResponseType(typeof(List<GetPackageResponse>))]
        public IHttpActionResult GetPackage([FromUri]GetPackageRequest getPackageRequest)
        {
            var responses = new Responses();
            try
            {
                if (Utility.UserId < 0)
                    return BadRequest(Utility.INVALID_USER);

                if (getPackageRequest == null)
                    getPackageRequest = new GetPackageRequest();

                if (getPackageRequest.PageSize == null)
                    getPackageRequest.PageSize = Convert.ToInt32(ConfigurationManager.AppSettings["PageSize"]);

                var package = new Package()
                {
                    PackageId = getPackageRequest.PackageId,                    
                    SearchText = getPackageRequest.SearchText,
                    IsActive = getPackageRequest.IsActive,
                    PageNumber = getPackageRequest.PageNumber,
                    PageSize = Convert.ToInt32(getPackageRequest.PageSize),
                    IsPagingRequired = (getPackageRequest.PageNumber != null) ? true : false,
                    OrderBy = getPackageRequest.OrderBy,
                    OrderByDirection = getPackageRequest.OrderByDirection
                };
                var packages = iPackage.GetPackage(package);

                var packageList = new List<GetPackageResponse>();
                foreach (var packageDetail in packages)
                {
                    packageList.Add(new GetPackageResponse()
                    {
                        PackageId = Convert.ToInt32(packageDetail.PackageId),
                        PackageName = packageDetail.PackageName,
                        PackageDuration = packageDetail.PackageDuration,
                        Amount = packageDetail.Amount,
                        PackageTypeId = packageDetail.PackageTypeId,
                        PackageTypeName = packageDetail.PackageTypeName,
                        IsActive = Convert.ToBoolean(packageDetail.IsActive),
                        CreatedBy = packageDetail.CreatedBy,
                        TotalPageCount = packageDetail.TotalPageCount,
                        TotalRecord = packageDetail.TotalRecord
                    });
                }

                responses.Status = Utility.SUCCESS_STATUS_RESPONSE;
                responses.Description = "Package retrieved successfully";
                responses.Response = packageList;
            }
            catch (Exception ex)
            {
                responses.Status = Utility.ERROR_STATUS_RESPONSE;
                responses.Description = "Error while retrieving Package.";

                Utility.WriteLog("GetPackage", getPackageRequest, "Error while retrieving Package. (PackageUserController)", ex.ToString());
            }
            return Ok(responses);
        }
    }
}
