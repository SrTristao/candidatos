import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Constants } from '../utils/constants';
import { Format } from '../utils/string.format';
import { Observable } from 'rxjs';
import decode from 'jwt-decode';

@Injectable()
export class TemporaryService {
    
    constructor(private httpService: HttpService) {        
    }

    generateToken(param): Observable<any> {
        return this.httpService.post('http://ironpatriot-api.infinitydata.com.br/login', param);
    }
    
    getStates(token): Observable<any> {
        return this.httpService.get(`http://ironpatriot-api.infinitydata.com.br/api/country/getStates?token=${token}`, {});
    }

    getCities(param): Observable<any>{
        return this.httpService.get(`http://ironpatriot-api.infinitydata.com.br/api/country/getCities/${param.uf}/${param.year}?token=${param.token}`, {});
    }

}
