import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'
import { HttpService } from './http.service';
import { CityService } from './city.service';
import { CountryService } from './country.service';
import { CandidateService } from './candidate.service';
import { AuthService } from './auth.service';

@NgModule({
  declarations: [],
  imports: [HttpClientModule],
    providers: [
        HttpService,
        CityService,
        CountryService,
        CandidateService,
        AuthService
    ],
  exports: [HttpClientModule]
})
export class ServicesModule {}
