import { Routes } from '@angular/router';
import { JwtGuard } from './app/guards/jwt-auth-guard';
import { AppLayout } from './app/layout/component/app.layout';

export const appRoutes: Routes = [

    // {

    //     path: '',
    //     component: AppLayout,
    //     children: [
    //         {
    //             path: 'pages', loadChildren: () => import('./app/pages/pages.routes'),
    //             canActivate: [JwtGuard],
    //         }
    //     ]
    // },
    // { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    // { path: '**', redirectTo: '/auth/login' }
    {
        path: '',
        component: AppLayout,
        canActivate: [JwtGuard],
        children: [
            { path: '', redirectTo: 'pages/tableau-bord', pathMatch: 'full' },  // ← this
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes'), canActivate: [JwtGuard] }
        ]
    },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/auth/login' }

];
