import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Constants } from '../utils/constants';
import { Format } from '../utils/string.format';
import { Observable } from 'rxjs';

@Injectable()
export class CityService {
    private url = Constants.URL;
    private city = Constants.city;
    private version = Constants.VERSION;
    private stringFormat = Format.stringFormat;
    
    constructor(private httpService: HttpService) {        
    }

    getPoliticalPartyVotes(param) : Observable<any>{
        return this.httpService.get(this.url + this.stringFormat(this.city.getPoliticalPartyVotes, param.anoEleicao, param.codigoCidade), {});
    }

    getDistricts(codigoCidade) : Observable<any> {
        return this.httpService.get(this.url + this.stringFormat(this.city.getDistricts, codigoCidade), {});
    }

}
