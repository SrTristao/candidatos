import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Constants } from '../utils/constants';
import { Format } from '../utils/string.format';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class CountryService {
    private url = Constants.URL;
    private country = Constants.country;
    private version = Constants.VERSION;
    private stringFormat = Format.stringFormat;
    
    constructor(private httpService: HttpService, private authService: AuthService) {        
    }

    getStates() : Observable<any>{
        return this.httpService.get(this.url + this.stringFormat(this.country.getStates, this.authService.getToken()), {});
    }

    getCities(param) : Observable<any> {
        return this.httpService.get(this.url + this.stringFormat(this.country.getCities, param.uf, param.anoEleicao, this.authService.getToken()), {});
    }

}
