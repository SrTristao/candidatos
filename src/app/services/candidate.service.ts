import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Constants } from '../utils/constants';
import { Format } from '../utils/string.format';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class CandidateService {
    private url = Constants.URL;
    private candidate = Constants.candidate;
    private version = Constants.VERSION;
    private stringFormat = Format.stringFormat;
    
    constructor(private httpService: HttpService, private authService: AuthService) {        
    }

    getTopCandidates(param) : Observable<any>{
        return this.httpService.get(this.url + this.stringFormat(this.candidate.getTopCandidates, param.anoEleicao, param.codigoCidade, param.codigoCargo, param.numeroTurno, param.limite, this.authService.getToken()), {});
    }

    getCandidateDetails(param) : Observable<any> {
        return this.httpService.get(this.url + this.stringFormat(this.candidate.getCandidateDetails, param.anoEleicao, param.codigoCidade, param.numeroCandidato, this.authService.getToken()), {});
    }

    getVotesByLocal(param) : Observable<any> {
        return this.httpService.get(this.url + this.stringFormat(this.candidate.getVotesByLocal, param.anoEleicao, param.codigoCidade, param.numeroCandidato, this.authService.getToken()), {});
    }

    getVotesByDistrict(param) : Observable<any> {
        return this.httpService.get(this.url + this.stringFormat(this.candidate.getVotesByDistrict, param.anoEleicao, param.codigoCidade, param.numeroCandidato), {});
    }

}
