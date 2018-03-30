import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { TestCaseComponent } from './test-case/test-case.component';
import { testcaseservice } from './services/testcase.service';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,    
    TestCaseComponent
         
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ComponentsModule,
RouterModule,
    AppRoutingModule
  ],
  providers: [testcaseservice],
  bootstrap: [AppComponent]
})
export class AppModule { }
