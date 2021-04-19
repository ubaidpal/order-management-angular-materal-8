import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VexRoutes } from '../@vex/interfaces/vex-route.interface';
import { CustomLayoutComponent } from './custom-layout/custom-layout.component';


import { LoginComponent } from './custom-layout/components/login/login.component';

import { AuthGuard } from './custom-layout/_helpers/auth.guard';
const childrenRoutes: VexRoutes = [
  {
    path: '',
    redirectTo: 'dashboards/analytics',
    pathMatch: 'full',
  },
  {
    path: 'dashboards/analytics',
    loadChildren: () => import('./pages/dashboards/dashboard-analytics/dashboard-analytics.module').then(m => m.DashboardAnalyticsModule),
    
  },
  {
    path: 'customer',
    loadChildren: () => import('./custom-layout/components/customer-component/customer-table.module').then(m => m.CustomerTableModule),
  },
  {
    path: 'order-view',
    loadChildren: () => import('./custom-layout/components/order-components/order-grid/order-add-grid.module').then(m => m.OrdersAddGridModule),
  },
  {
    path: 'product-view',
    loadChildren: () => import('./custom-layout/components/product-order-commonents/product-order-grid/order-product-add-grid.module').then(m => m.OrdersProductAddGridModule),
  },
  {
    path: 'create-order',
    //loadChildren: () => import('./custom-layout/components/order-components/open-orders/open-order-create-update/open-order-create-update.module').then(m => m.OpenOrderCreateUpdateModule),
    loadChildren: () => import('./custom-layout/components/create-order-component/create-order.module').then(m => m.CreateOrderModule),
  },
  {
    path: 'edit-order',
    //loadChildren: () => import('./custom-layout/components/order-components/open-orders/open-order-create-update/open-order-create-update.module').then(m => m.OpenOrderCreateUpdateModule),
    loadChildren: () => import('./custom-layout/components/create-order-component/create-order.module').then(m => m.CreateOrderModule),
  },
  {
    path: 'order-details',
    loadChildren: () => import('./custom-layout/components/order-details-component/order-details.module').then(m => m.OrderDetailsModule),
  },
  {
    path: 'create-orders-invoice',
    loadChildren: () => import('./custom-layout/components/order-details-component/orders-create-invoice/orders-create-invoice.module').then(m => m.OrdersCreateInvoiceModule),
  },
  {
    path: 'product',
    loadChildren: () => import('./custom-layout/components/products/product-table.module').then(m => m.ProductTableModule),
  },
  {
    path: 'add-product',
    loadChildren: () => import('./custom-layout/components/products/add-products/add-product-wizard.module').then(m => m.AddProductWizardModule),
  },
  {
    path: 'update-product/:productId',
    loadChildren: () => import('./custom-layout/components/products/add-products/add-product-wizard.module').then(m => m.AddProductWizardModule),
  },
  {
    path: 'packing',
    loadChildren: () => import('./custom-layout/components/packing-activity/packing-activity.module').then(m => m.PackingActivityModule),
  },
  {
    path: 'products',
    loadChildren: () => import('./pages/pages/coming-soon/coming-soon.module').then(m => m.ComingSoonModule),
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/pages/coming-soon/coming-soon.module').then(m => m.ComingSoonModule),
  },
  {
    path: 'coming-soon',
    loadChildren: () => import('./pages/pages/coming-soon/coming-soon.module').then(m => m.ComingSoonModule),
  },
  {
    path: 'coming-soon',
    loadChildren: () => import('./pages/pages/coming-soon/coming-soon.module').then(m => m.ComingSoonModule),
  },
  {
    path: 'coming-soon',
    loadChildren: () => import('./pages/pages/coming-soon/coming-soon.module').then(m => m.ComingSoonModule),
  },
  {
    path: 'coming-soon',
    loadChildren: () => import('./pages/pages/coming-soon/coming-soon.module').then(m => m.ComingSoonModule),
  },
  
  {
      path: 'usermanagement',
      children: [
        {
          path: 'user-list',
          loadChildren: () => import('./custom-layout/components/users-table/users-table.module').then(m => m.UsersTableModule),
          data: {
            toolbarShadowEnabled: true
          }
        },
      ]
  },

  {
    path: 'customer-details',
    loadChildren: () => import('./custom-layout/components/customer-component/customer-details/customer-grid/customer-grid.module').then(m => m.CustomerGridModule),
  },
  {
    path: 'branches-details',
    //loadChildren: () => import('./custom-layout/components/customer-component/customer-details/branches/branches-details/branch-layout-large-header-tabbed.module').then(m => m.BranchLayoutLargeHeaderTabbedModule),
    loadChildren: () => import('./custom-layout/components/customer-component/customer-details/branches/branch-grid/branch-grid.module').then(m => m.BranchGridModule),
  },
  // {
  //   path: 'order-detail',
  //   loadChildren: () => import('./custom-layout/components/customer-component/customer-details/users-table/users-table.module').then(m => m.UsersTableModule),
  // },
  
  // {
  //   path: 'apps',
  //   children: [
  //     {
  //       path: 'chat',
  //       loadChildren: () => import('./pages/apps/chat/chat.module').then(m => m.ChatModule),
  //       data: {
  //         toolbarShadowEnabled: true
  //       }
  //     },
  //     {
  //       path: 'contacts',
  //       loadChildren: () => import('./pages/apps/contacts/contacts.module').then(m => m.ContactsModule)
  //     },
  //     {
  //       path: 'calendar',
  //       loadChildren: () => import('./pages/apps/calendar/calendar.module').then(m => m.CalendarModule),
  //       data: {
  //         toolbarShadowEnabled: true
  //       }
  //     },
  //     {
  //       path: 'aio-table',
  //       loadChildren: () => import('./pages/apps/aio-table/aio-table.module').then(m => m.AioTableModule),
  //     },
  //     {
  //       path: 'help-center',
  //       loadChildren: () => import('./pages/apps/help-center/help-center.module').then(m => m.HelpCenterModule),
  //     },
  //     {
  //       path: 'scrumboard',
  //       loadChildren: () => import('./pages/apps/scrumboard/scrumboard.module').then(m => m.ScrumboardModule),
  //     },
  //     {
  //       path: 'editor',
  //       loadChildren: () => import('./pages/apps/editor/editor.module').then(m => m.EditorModule),
  //     },
  //   ]
  // },
  // {
  //   path: 'pages',
  //   children: [
  //     {
  //       path: 'pricing',
  //       loadChildren: () => import('./pages/pages/pricing/pricing.module').then(m => m.PricingModule)
  //     },
  //     {
  //       path: 'faq',
  //       loadChildren: () => import('./pages/pages/faq/faq.module').then(m => m.FaqModule)
  //     },
  //     {
  //       path: 'guides',
  //       loadChildren: () => import('./pages/pages/guides/guides.module').then(m => m.GuidesModule)
  //     },
  //     {
  //       path: 'profile',
  //       loadChildren: () => import('./pages/pages/profile/profile.module').then(m => m.ProfileModule)
  //     },
  //     {
  //       path: 'invoice',
  //       loadChildren: () => import('./pages/pages/invoice/invoice.module').then(m => m.InvoiceModule)
  //     },
  //     {
  //       path: 'error-404',
  //       loadChildren: () => import('./pages/pages/errors/error-404/error-404.module').then(m => m.Error404Module)
  //     },
  //     {
  //       path: 'error-500',
  //       loadChildren: () => import('./pages/pages/errors/error-500/error-500.module').then(m => m.Error500Module)
  //     }
  //   ]
  // },
  // {
  //   path: 'ui',
  //   children: [
  //     {
  //       path: 'components',
  //       loadChildren: () => import('./pages/ui/components/components.module').then(m => m.ComponentsModule),
  //     },
  //     {
  //       path: 'forms/form-elements',
  //       loadChildren: () => import('./pages/ui/forms/form-elements/form-elements.module').then(m => m.FormElementsModule),
  //       data: {
  //         containerEnabled: true
  //       }
  //     },
  //     {
  //       path: 'forms/form-wizard',
  //       loadChildren: () => import('./pages/ui/forms/form-wizard/form-wizard.module').then(m => m.FormWizardModule),
  //       data: {
  //         containerEnabled: true
  //       }
  //     },
  //     {
  //       path: 'icons',
  //       loadChildren: () => import('./pages/ui/icons/icons.module').then(m => m.IconsModule)
  //     },
  //     {
  //       path: 'page-layouts',
  //       loadChildren: () => import('./pages/ui/page-layouts/page-layouts.module').then(m => m.PageLayoutsModule),
  //     },
  //   ]
  // },
  // {
  //   path: 'documentation',
  //   loadChildren: () => import('./pages/documentation/documentation.module').then(m => m.DocumentationModule),
  // },
  // {
  //   path: '**',
  //   loadChildren: () => import('./pages/pages/errors/error-404/error-404.module').then(m => m.Error404Module)
  // }
];

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    children: []
  },
  {
    path: '',
    component: CustomLayoutComponent,canActivate: [AuthGuard],
    children:  childrenRoutes
  },

  // otherwise redirect to home
  { path: '**', redirectTo: 'dashboard' },
  // {
  //   path: 'login',
  //   loadChildren: () => import('./pages/pages/auth/login/login.module').then(m => m.LoginModule),
  // },
  {
    path: 'register',
    loadChildren: () => import('./pages/pages/auth/register/register.module').then(m => m.RegisterModule),
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/pages/auth/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule),
  },
  {
    path: 'coming-soon',
    loadChildren: () => import('./pages/pages/coming-soon/coming-soon.module').then(m => m.ComingSoonModule),
  },
 
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled',
    relativeLinkResolution: 'corrected',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
