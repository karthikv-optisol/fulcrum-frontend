import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectBudgetComponent } from './project-budget.component';

const routes: Routes = [
  { path: '', component: ProjectBudgetComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectBudgetRoutingModule { }
