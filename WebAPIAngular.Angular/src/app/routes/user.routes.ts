import { Routes, RouterModule } from '@angular/router';

import { HomeGuestComponent } from '../areas/guest/home/home.component';
import { AboutUsGuestComponent } from '../areas/guest/aboutus/aboutus.component';
import { ContactUsGuestComponent } from '../areas/guest/contactus/contactus.component';

import { DashboardUserComponent } from '../areas/user/dashboard/dashboard.component';
import { FEMAModulesUserComponent } from '../areas/user/fEMAModule/fEMAModules.component';
import { SupportTicketUserComponent } from '../areas/user/supportTicket/supportTicket.component';
import { SupportTicketReplyUserComponent } from '../areas/user/supportTicketReply/supportTicketReply.component';
import { SubscriptionUserComponent } from '../areas/user/subscription/subscription.component';
import { UserProfileUserComponent } from '../areas/user/userProfile/userProfile.component';

export const PUBLIC_USER_ROUTES: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeGuestComponent },
    { path: 'aboutus', component: AboutUsGuestComponent },
    { path: 'contactus', component: ContactUsGuestComponent },
];

export const USER_ROUTES: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardUserComponent },
    { path: 'femamodules', component: FEMAModulesUserComponent },
    { path: 'postquery', component: SupportTicketUserComponent },
    { path: 'postqueryreply/:supportTicketId', component: SupportTicketReplyUserComponent },
    { path: 'subscription', component: SubscriptionUserComponent },
    { path: 'userprofile', component: UserProfileUserComponent }
];