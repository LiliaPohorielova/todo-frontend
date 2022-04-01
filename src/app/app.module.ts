import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CategoriesComponent} from './views/categories/categories.component';
import {TasksComponent} from './views/tasks/tasks/tasks.component';
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {EditTaskDialogComponent} from './dialog/edit-task-dialog/edit-task-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MAT_DATE_LOCALE, MatNativeDateModule, MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {ConfirmDialogComponent} from './dialog/confirm-dialog/confirm-dialog.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {TaskDatePipe} from './pipe/task-date.pipe';

import {registerLocaleData} from "@angular/common";
import localeRu from "@angular/common/locales/ru";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {EditCategoryDialogComponent} from './dialog/edit-category-dialog/edit-category-dialog.component';
import {FooterComponent} from './views/footer/footer.component';
import {AboutDialogComponent} from "./dialog/about-dialog/about-dialog.component";
import {HeaderComponent} from './views/header/header.component';
import {StatisticComponent} from './views/statistic/statistic.component';
import {StatisticCardComponent} from './views/statistic/statistic-card/statistic-card.component';
import {PrioritiesComponent} from './views/priorities/priorities.component';
import {ColorPickerModule} from "ngx-color-picker";
import {SettingsDialogComponent} from './dialog/settings-dialog/settings-dialog.component';
import {EditPriorityDialogComponent} from './dialog/edit-priority-dialog/edit-priority-dialog.component';
import {SidebarModule} from "ng-sidebar";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {CATEGORY_URL_TOKEN} from "./data/dao/impl/CategoryService";
import {TASK_URL_TOKEN} from "./data/dao/impl/TaskService";
import {PRIORITY_URL_TOKEN} from "./data/dao/impl/PriorityService";
import {STATISTIC_URL_TOKEN} from "./data/dao/impl/StatisticService";
import {CustomHttpInterceptor} from "./interceptor/http-interceptor";

registerLocaleData(localeRu);

@NgModule({
  declarations: [
    AppComponent,
    CategoriesComponent,
    TasksComponent,
    EditTaskDialogComponent,
    ConfirmDialogComponent,
    TaskDatePipe,
    TaskDatePipe,
    EditCategoryDialogComponent,
    FooterComponent,
    AboutDialogComponent,
    HeaderComponent,
    StatisticComponent,
    StatisticCardComponent,
    PrioritiesComponent,
    SettingsDialogComponent,
    EditPriorityDialogComponent
  ],
  imports: [
    BrowserModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    ColorPickerModule,
    SidebarModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomHttpInterceptor,
      multi: true
    },
    {
      provide: CATEGORY_URL_TOKEN,
      useValue: 'http://localhost:8080/category'
    },
    {
      provide: TASK_URL_TOKEN,
      useValue: 'http://localhost:8080/task'
    },
    {
      provide: PRIORITY_URL_TOKEN,
      useValue: 'http://localhost:8080/priority'
    },
    {
      provide: STATISTIC_URL_TOKEN,
      useValue: 'http://localhost:8080/statistic'
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'en-GB'
    }
  ],
  entryComponents: [
    EditTaskDialogComponent,
    EditCategoryDialogComponent,
    EditPriorityDialogComponent,
    ConfirmDialogComponent,
    AboutDialogComponent,
    SettingsDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
