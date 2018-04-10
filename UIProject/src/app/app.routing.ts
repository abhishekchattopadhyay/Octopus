import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TestCaseComponent } from './test-case/test-case.component';
import { adddma } from './components/admin/adddma/adddma.component';
import { addrmx } from './components/admin/addrmx/addrmx.component';
import { dmatype } from './components/admin/dmatype/dmatype.component';
import { protocoltype } from './components/admin/protocoltype/protocoltype.component';
import { testtype } from './components/admin/testtype/testtype.component';
import { videotype } from './components/admin/videotype/videotype.component';
import { rmxtype } from './components/admin/rmxtype/rmxtype.component';


const routes: Routes =[
    { path: 'dashboard',                 component: DashboardComponent        },    
    { path: 'test-case',                 component: TestCaseComponent         },         
    { path: 'add-dma',                   component:adddma                     }, 
    { path: 'add-rmx',                   component:addrmx                     },
    { path: 'dma-type',                  component:dmatype                    },
    { path: 'protocol-type',             component:protocoltype               },
    { path: 'test-type',                 component:testtype                   },
    { path: 'video-type',                component:videotype                  }, 
    { path: 'rmx-type',                component:rmxtype                  },
    { path: '',                    redirectTo: 'dashboard', pathMatch: 'full' }
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
