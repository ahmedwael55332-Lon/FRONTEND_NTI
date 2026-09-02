import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HomeComponent } from './features/public/home/home.component';
import { AboutComponent } from './features/public/about/about.component';
import { HowItWorksComponent } from './features/public/how-it-works/how-it-works.component';
import { ContactComponent } from './features/public/contact/contact.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardLayoutComponent } from './shared/dashboard-layout/dashboard-layout.component';
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
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';
import { ToastComponent } from './shared/toast/toast.component';
import { TranslatePipe } from './shared/translate.pipe';

@NgModule({
  declarations: [AppComponent, NavbarComponent, FooterComponent, HomeComponent, AboutComponent, HowItWorksComponent, ContactComponent, DashboardLayoutComponent, LoginComponent, RegisterComponent, AdminDashboardComponent, DonorDashboardComponent, RequesterDashboardComponent, UsersComponent, DonorsComponent, BloodUnitsComponent, BloodRequestsComponent, DonorProfileComponent, MedicalCheckComponent, DonorNotificationsComponent, RequesterBloodRequestsComponent, CreateRequestComponent, CompatibleDonorsComponent, ProfileComponent, ConfirmDialogComponent, ToastComponent, TranslatePipe],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule,HttpClientModule,FormsModule],
  providers: [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }
],
  bootstrap: [AppComponent]
})
export class AppModule {}
