import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Constants } from '../utils/constants';
import { Format } from '../utils/string.format';
import { Observable } from 'rxjs';
import decode from 'jwt-decode';

@Injectable()
export class AuthService {
    private url = Constants.URL;
    private auth = Constants.auth;
    private version = Constants.VERSION;
    private stringFormat = Format.stringFormat;
    
    constructor(private httpService: HttpService) {        
    }

    getToken() : string {
        return localStorage.getItem('token');
    }
    
    isAuthenticated(): boolean {
        const token = this.getToken();
        return decode.tokenNotExpired(null, token);
    }

    login(user) : Observable<any>{
        return this.httpService.post(this.url + this.stringFormat(this.auth.login), user);
    }

}
