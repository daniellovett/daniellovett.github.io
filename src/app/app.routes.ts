import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ReshapeComponent } from './reshape/reshape.component';

export const routes: Routes = [
    {path: 'home', redirectTo: '/', pathMatch: 'full'},
    {path: 'reshape', component: ReshapeComponent},
    {path: '**', component: HomeComponent}
];
