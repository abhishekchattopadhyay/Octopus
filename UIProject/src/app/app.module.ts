import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { TestCaseComponent } from './test-case/test-case.component';
import { testcaseservice } from './services/testcase.service';
import { adddma } from './components/admin/adddma/adddma.component';
import { addrmx } from './components/admin/addrmx/addrmx.component';
import { dmatype } from './components/admin/dmatype/dmatype.component';
import { protocoltype } from './components/admin/protocoltype/protocoltype.component';
import { testtype } from './components/admin/testtype/testtype.component';
import { videotype } from './components/admin/videotype/videotype.component';
import { rmxtype } from './components/admin/rmxtype/rmxtype.component';
import { FieldErrorDisplayComponent } from './errorDisplay/field-error-display.component';
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,    
    TestCaseComponent,
    adddma,
    addrmx,
    dmatype,
    protocoltype,
    testtype,
    videotype,
    rmxtype,
    FieldErrorDisplayComponent
         
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    ReactiveFormsModule, 
  ],
  providers: [testcaseservice],
  bootstrap: [AppComponent]
})
export class AppModule { }
