import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuardAdmin, AuthGuardUser } from './common/auth.guard';
import { PublicAdminComponent } from './areas/admin/layout/public_admin.component';
import { GuestComponent } from './areas/guest/layout/guest.component';
import { AdminComponent } from './areas/admin/layout/admin.component';
import { UserComponent } from './areas/user/layout/user.component';

import { PUBLIC_ADMIN_ROUTES, ADMIN_ROUTES } from './routes/admin.routes';
import { PUBLIC_USER_ROUTES, USER_ROUTES } from './routes/user.routes';

const appRoutes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '', component: GuestComponent, data: { title: 'Guest Views' }, children: PUBLIC_USER_ROUTES },
    { path: 'user/secure', component: UserComponent, canActivate: [AuthGuardUser], data: { title: 'User Views' }, children: USER_ROUTES },
    { path: 'admin', component: PublicAdminComponent, data: { title: 'Public Views For Admin' }, children: PUBLIC_ADMIN_ROUTES },
    { path: 'admin/secure', component: AdminComponent, canActivate: [AuthGuardAdmin], data: { title: 'Admin Views' }, children: ADMIN_ROUTES },
    { path: '**', redirectTo: 'home' }
];

export const AppRoutes = RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules });
