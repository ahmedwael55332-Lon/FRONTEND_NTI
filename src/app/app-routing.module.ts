import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/public/home/home.component';
import { AboutComponent } from './features/public/about/about.component';
import { HowItWorksComponent } from './features/public/how-it-works/how-it-works.component';
import { ContactComponent } from './features/public/contact/contact.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { AdminDashboardComponent } from './features/admin/dashboard/admin-dashboard.component';
import { DonorDashboardComponent } from './features/donor/dashboard/donor-dashboard.component';
import { RequesterDashboardComponent } from './features/requester/dashboard/requester-dashboard.component';
import { UsersComponent } from './features/admin/users/users.component';
import { DonorsComponent } from './features/admin/donors/donors.component';
import { BloodUnitsComponent } from './features/admin/blood-units/blood-units.component';
import { BloodRequestsComponent } from './features/admin/blood-requests/blood-requests.component';
import { DonorProfileComponent } from './features/donor/profile/donor-profile.component';
import { MedicalCheckComponent } from './features/donor/medical-check/medical-check.component';
import { DonorNotificationsComponent } from './features/donor/notifications/donor-notifications.component';
import { RequesterBloodRequestsComponent } from './features/requester/blood-requests/requester-blood-requests.component';
import { CreateRequestComponent } from './features/requester/create-request/create-request.component';
import { CompatibleDonorsComponent } from './features/requester/matches/compatible-donors.component';
import { ProfileComponent } from './features/profile/profile.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

const routes: Routes = [

  // =========================
  // Public
  // =========================

  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'how-it-works', component: HowItWorksComponent },
  { path: 'contact', component: ContactComponent },

  // =========================
  // Authentication
  // =========================

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // =========================
  // Admin
  // =========================

  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      roles: ['admin']
    }
  },

  {
    path: 'admin/users',
    component: UsersComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      roles: ['admin']
    }
  },

  {
    path: 'admin/donors',
    component: DonorsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      roles: ['admin']
    }
  },

  {
    path: 'admin/blood-units',
    component: BloodUnitsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      roles: ['admin']
    }
  },

  {
    path: 'admin/blood-requests',
    component: BloodRequestsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      roles: ['admin']
    }
  },

  // =========================
  // Donor
  // =========================

  {
    path: 'donor',
    component: DonorDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      roles: ['donor']
    }
  },

  {
    path: 'donor/profile',
    component: DonorProfileComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      roles: ['donor']
    }
  },

  {
    path: 'donor/medical-check',
    component: MedicalCheckComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      roles: ['donor']
    }
  },

  {
    path: 'donor/notifications',
    component: DonorNotificationsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      roles: ['donor']
    }
  },

  // =========================
  // Requester
  // =========================

  {
    path: 'requester',
    component: RequesterDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      roles: ['requester']
    }
  },

  {
    path: 'requester/blood-requests',
    component: RequesterBloodRequestsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      roles: ['requester']
    }
  },

  {
    path: 'requester/blood-requests/create',
    component: CreateRequestComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      roles: ['requester']
    }
  },

  {
    path: 'requester/matches',
    component: CompatibleDonorsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      roles: ['requester']
    }
  },

  // =========================
  // Shared Profile
  // =========================

  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },

  // =========================
  // Fallback
  // =========================

  {
    path: '**',
    redirectTo: ''
  }

];

@NgModule({ imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })], exports: [RouterModule] })
export class AppRoutingModule {}
