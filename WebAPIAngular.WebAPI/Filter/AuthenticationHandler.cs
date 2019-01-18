using DemystifyFema.Service.Common;
using DemystifyFema.Service.Models;
using DemystifyFema.Service.Repository;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Principal;
using System.Threading;
using System.Threading.Tasks;
using System.Web;

namespace DemystifyFema.Service.Filter
{
    public class AuthenticationHandler : DelegatingHandler
    {
        private ILoginHistory iLoginHistory;
        private IAccount iAccount;
        public AuthenticationHandler()
        {
            iLoginHistory = new LoginHistoryRepository();
            iAccount = new AccountRepository();
        }

        #region Check token is valid or invalid which is send through called APIs
        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            try
            {
                IEnumerable<string> authorization;
                if (request.Headers.TryGetValues(ConfigurationManager.AppSettings["TokenKey"], out authorization))
                {
                    var accessToken = authorization.First().Split(' ')[1];
                    if (accessToken != null)
                    {
                        string token = Utility.DecryptStringUsingKey(accessToken);
                        Utility.UserId = Convert.ToInt32(token.Split('|')[0]);

                        bool isValidToken = iLoginHistory.CheckAccessToken(new LoginHistory() { AccessToken = accessToken });
                        if (isValidToken || (request.RequestUri.PathAndQuery.Contains("logout")))
                        {
                            var user = iAccount.GetUser(new Account() { UserId = Utility.UserId });
                            if (user != null)
                            {
                                Utility.UserName = user.UserName;
                                Utility.RoleId = user.RoleId;
                                Utility.RoleName = user.RoleName;
                            }

                            IPrincipal principal = new GenericPrincipal(new GenericIdentity(Utility.UserName), new[] { Utility.RoleName });
                            Thread.CurrentPrincipal = principal;
                            HttpContext.Current.User = principal;
                        }
                        else
                        {
                            //The user is unauthorize and return 401 status  
                            var response = new HttpResponseMessage(HttpStatusCode.Unauthorized);
                            var tsc = new TaskCompletionSource<HttpResponseMessage>();
                            tsc.SetResult(response);
                            return tsc.Task;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Utility.WriteLog("SendAsync", request, "Error while send async token.", ex.ToString());
            }
            return base.SendAsync(request, cancellationToken);
        }
        #endregion
    }
}