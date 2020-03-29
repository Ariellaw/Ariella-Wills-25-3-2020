import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { WeatherComponent } from './weather/weather.component'
import { FavoritesComponent } from './favorites/favorites.component'
import { HeaderComponent } from './header/header.component'
import { SelectedWeatherComponent } from './weather/selected-forecast/selected-forecast.component'
import { CurrentWeatherComponent } from './weather/current-weather/current-weather.component'
import { TimeOfDayComponent } from './weather/current-weather/time-of-day/time-of-day.component'
import { FavoriteComponent } from './favorites/favorite/favorite.component'
import { RouterModule, Routes } from '@angular/router'

const appRoutes: Routes = [
  { path: 'favorites', component: FavoritesComponent },
  { path: ':locationName/:id', component: WeatherComponent },
  {
    path: '',
    component: WeatherComponent
  }
]
@NgModule({
  declarations: [
    AppComponent,
    WeatherComponent,
    FavoritesComponent,
    HeaderComponent,
    SelectedWeatherComponent,
    CurrentWeatherComponent,
    TimeOfDayComponent,
    FavoriteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
