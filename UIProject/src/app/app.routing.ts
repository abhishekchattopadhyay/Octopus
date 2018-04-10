import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TestCaseComponent } from './test-case/test-case.component';


const routes: Routes =[
    { path: 'dashboard',      component: DashboardComponent },    
    { path: 'test-case',     component: TestCaseComponent },     
    { path: 'adminChild',     redirectTo: '#', pathMatch: 'full'  }, 
    { path: 'childdashboard',     redirectTo: 'dashboard'  }, 
    { path: '',               redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
