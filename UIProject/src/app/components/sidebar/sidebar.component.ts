import { Component, OnInit } from '@angular/core';

declare const $: any;
declare interface rootChildren {
    path: string;
    title: string;
    icon: string;
    class: string;
}
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    hasChild: boolean;
    childs?: rootChildren[];
    divId?: string;
}
let adminChild: rootChildren[] = [{ path: 'protocol-type', title: 'Protocol', icon: 'class', class: '' },
                                  { path: 'rmx-type', title: 'RMX Type', icon: 'storage', class: '' },
                                  { path: 'add-rmx', title: 'Add RMX', icon: 'event available', class: '' },
                                  { path: 'test-type', title: 'Test Type', icon: 'assignment', class: '' },
                                  { path: 'video-type', title: 'Video Type', icon: 'slideshow', class: '' },
                                  { path: 'add-dma', title: 'Add DMA', icon: 'event available', class: '' }];
export const ROUTES: RouteInfo[] = [
    { path: 'dashboard', title: 'Dashboard', icon: 'dashboard', class: '', hasChild: false },
    { path: '#', title: 'Admin', icon: 'apps', class: '', hasChild: true, childs:adminChild, divId: "adminChild" },
    { path: 'test-case', title: 'Add New Test', icon: 'content_paste', class: '', hasChild: false }
];

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
    menuItems: any[];

    constructor() { }

    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }
    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    };
}
