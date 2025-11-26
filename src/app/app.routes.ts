import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Documents } from './documents/documents';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: 'login',
        component: Login,
    },
    {
        path: 'documents',
        component: Documents,
    },
    {
        path: '**',
        redirectTo: 'login',
    },
];
