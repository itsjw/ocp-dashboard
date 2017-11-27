import { NgModule } from '@angular/core';
// import { AngularEchartsModule } from 'ngx-echarts'; //@disabled

import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';
import { StatusCardComponent } from './status-card/status-card.component';
import { ContactsComponent } from './contacts/contacts.component';
import { RoomsComponent } from './rooms/rooms.component';
import { RoomSelectorComponent } from './rooms/room-selector/room-selector.component';
import { TemperatureComponent } from './temperature/temperature.component';
import { TemperatureDraggerComponent } from './temperature/temperature-dragger/temperature-dragger.component';
import { TeamComponent } from './team/team.component';
import { KittenComponent } from './kitten/kitten.component';
import { SecurityCamerasComponent } from './security-cameras/security-cameras.component';
// import { ElectricityComponent } from './electricity/electricity.component'; //@disabled
// import { ElectricityChartComponent } from './electricity/electricity-chart/electricity-chart.component'; //@disabled
import { WeatherComponent } from './weather/weather.component';
// import { SolarComponent } from './solar/solar.component'; //@disabled
import { PlayerComponent } from './rooms/player/player.component';
// import { TrafficComponent } from './traffic/traffic.component'; //@disabled
// import { TrafficChartComponent } from './traffic/traffic-chart.component'; //@disabled

import { from } from 'rxjs/observable/from';

@NgModule({
  imports: [
    ThemeModule,
    // AngularEchartsModule, //@disabled
  ],
  declarations: [
    DashboardComponent,
    StatusCardComponent,
    TemperatureDraggerComponent,
    ContactsComponent,
    RoomSelectorComponent,
    TemperatureComponent,
    RoomsComponent,
    TeamComponent,
    KittenComponent,
    SecurityCamerasComponent,
    // ElectricityComponent, //@disabled
    // ElectricityChartComponent, //@disabled
    WeatherComponent,
    PlayerComponent,
    // SolarComponent, //@disabled
    // TrafficComponent, //@disabled
    // TrafficChartComponent, //@disabled
  ],
})
export class DashboardModule { }
