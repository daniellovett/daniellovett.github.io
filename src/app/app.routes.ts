import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ReshapeComponent } from './reshape/reshape.component';

export const routes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: 'reshape', component: ReshapeComponent},
    {path: '**', redirectTo: 'home', pathMatch: 'full'}
];
