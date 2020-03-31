import { Component, OnInit, Input } from '@angular/core'
import { LocationService } from '../services/location.service'
import { ForecastService } from '../services/forecast.service'
import { WeeklyForecast } from '../models/weekly-forecast.model'
import { DailyForecast } from '../models/daily-forecast.model'
import { Locations } from '../models/locations.model'
import { CurrentWeather } from '../models/current-weather.model'
import { FavoritesService } from '../services/favorites.service'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
  providers: [LocationService, ForecastService]
})
export class WeatherComponent implements OnInit {
  location: string = 'Tel Aviv, Israel'
  locationIsInFavorites: boolean = false
  locationKey: string = '215854'
  suggestedLocations: Locations[]
  weeklyForecast: WeeklyForecast = new WeeklyForecast([])
  displayedDayForecast: DailyForecast = null
  currentWeather: CurrentWeather = null
  currentWeatherDisplayed: boolean = true
  errorMessageDisplayed: boolean = false
  isLoadingCurrentWeather: boolean = true
  isLoadingWeeklyForecast: boolean = true
  units: string = 'fahrenheit';
  darkmode:boolean

  constructor (
    private locationService: LocationService,
    private forecastService: ForecastService,
    private favoritesService: FavoritesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit () {
    let id = this.route.snapshot.paramMap.get('id')
    let location = this.route.snapshot.paramMap.get('locationName')
    


    this.route.queryParams.subscribe(queryParams => {
      this.units = queryParams.units
      const mode = queryParams.mode
      this.darkmode = mode === 'dark-mode'? true:false; 

      this.loadForecast (
        this.locationKey,
        location,
        this.units      
      )
    })

    this.loadForecast(id, location, this.units)
  }

  async onUserInput ($event) {
    const input = $event.target.value
    if (input.length >= 2) {
      try {
        this.suggestedLocations = await this.locationService.getSuggestedLocations(
          input
        )
      } catch (e) {
        this.errorMessageDisplayed = true
      }
    }
  }
  async getWeeklyForecast (locationKey: string, unitsOfMeasurment:string) {
    try {
      this.weeklyForecast = await this.forecastService.getWeeklyForecast(
        locationKey, unitsOfMeasurment
      )
    } catch (e) {
      this.errorMessageDisplayed = true
    } finally {
      this.isLoadingWeeklyForecast = false
    }
  }

  async getCurrentWeather (locationKey: string) {
    try {
      this.currentWeather = await this.forecastService.getCurrentWeather(
        locationKey
      )
    } catch (e) {
      this.errorMessageDisplayed = true
    } finally {
      this.isLoadingCurrentWeather = false
    }
  }

  onUserSelection ($event) {
    this.currentWeatherDisplayed = true
    const location = $event.target.value
    const option = document.querySelector(
      "#locations option[value='" + location + "']"
    )
    const locationKey = option.getAttribute('data-value')
    this.loadForecast(locationKey, location, this.units)

    this.router.navigate(['/', this.location, this.locationKey])
  }

  displayForecast (idx: number) {
    this.currentWeatherDisplayed = false
    this.displayedDayForecast = this.weeklyForecast.dailyForecasts[idx]
  }

  addLocationToFavorites () {
    this.favoritesService.addLocationToFavorites({
      cityName: this.location.split(',')[0],
      countryName: this.location.split(',')[1],
      locationKey: this.locationKey
    })
    this.locationIsInFavorites = true
  }

  removeLocationFromFavorites () {
    this.favoritesService.removeLocationFromFavorites(this.locationKey)
    this.locationIsInFavorites = false
  }
  isLocationInFavorites (locationKey: string) {
    this.locationIsInFavorites = this.favoritesService.isLocationInFavorites(
      locationKey
    )
  }

  loadForecast (
    id: string = this.locationKey,
    location: string = this.location,
    unitsOfMeasurment:string
  ) {
    this.isLoadingWeeklyForecast = true
    this.isLoadingCurrentWeather = true

    if (id && location) {
      this.locationKey = id
      this.location = location
    }
    this.getCurrentWeather(this.locationKey)
    this.isLocationInFavorites(this.locationKey)
    this.getWeeklyForecast(this.locationKey, unitsOfMeasurment)
  }
}
