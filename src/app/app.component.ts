import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map'; 
import { GoogleCharts } from 'google-charts';
import { AuthService } from './services/auth.service';
import { CountryService } from './services/country.service';
import { CityService } from './services/city.service';
import { CandidateService } from './services/candidate.service';
import { State } from './class/State';
import { City } from './class/City';
import { PoliticalParty } from './class/PoliticalParty';
import { Candidate } from './class/Candidate';
import { TemporaryService } from './services/temporary';

declare var MarkerClusterer:any;
declare var google:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  //Accordions
  accordionPartidos = false;
  accordionVereadores = false;
  accordionPrefeitos = false;
  accordionDeputadoEstadual = false;
  accordionDeputadoFederal = false;

  //Variaveis para carregar informações.
  statesArr: State[] = [];
  citiesArr: City[] = [];
  districtsArr: any[] = [];
  politicalPartiesArr: PoliticalParty[] = [];
  topCandidatesArr: Candidate[] = [];
  topMayorsArr: Candidate[] = [];
  depFederalArr: any[] = [];
  depEstadualArr: any[] = [];
  candidateDetail: Candidate = new Candidate();
  totalElectorate = 0;
  totalCities = 0;
  totalDistricts = 0;
  totalSchools = 0;
  totalPoliticalParties = 0;
  totalCandidates = 0;
  totalMayors = 0;
  totalDepFederais = 0;
  totalDepEstaduais = 0;
  localeSelected = 'BRASIL';
  stateSelected = 'BRASIL';
  citySelected = '';
  districtSelected = '';
  votosNulosPartidos = 0;
  objCity: any;
  district: any;
  objState: any;
  localeMapCurrent: any;
  yearGroup: any[];
  yearSelected: {year: 0, name: 'Eleições Municipais'};

  //Forms
  filteredOptionsState: Observable<State[]>;
  formState: FormControl = new FormControl();
  filteredOptionsCity: Observable<City[]>;
  formCity: FormControl = new FormControl();
  filteredOptionsDistrict: Observable<any[]>;
  formDistrict: FormControl = new FormControl();
  formsSchool: FormControl = new FormControl();
  formYear: FormControl = new FormControl();

  //Maps
  @ViewChild('gmap') gmapElement: any;
  map: any;
  geocoder: any;
  markers = [];
  locations = [];
  markerClusterer: any;
  heatmap: any;

  //Charts
  votosPorPartidoChart = [];
  votosPorCandidatoChart = [];
  votosPorDepFederalChart = [];
  votosPorDepEstadualChart = [];
  votosPorPrefeitoChart = [];
  votosPorEscolasChart = [];
  
  //Tables
  displayedColumnsPoliticalParties = ['index', '_id', 'total', 'percent'];
  dataSourcePoliticalParties = new MatTableDataSource(this.politicalPartiesArr);
  displayedColumnsCandidate = ['index', 'nameExibition', 'politicalParty', 'elected', 'totalVotes', 'perfil'];
  dataSourceCandidate = new MatTableDataSource(this.topCandidatesArr);
  displayedColumnsMayor = ['index', 'nameExibition', 'politicalParty', 'elected', 'totalVotes', 'perfil'];
  dataSourceMayor = new MatTableDataSource(this.topMayorsArr);
  displayedColumnsSchools = ['index', 'colegio', 'votos'];
  dataSourceSchools = new MatTableDataSource([]);
  displayedColumnsDepFederal = ['index', 'nameExibition', 'politicalParty', 'elected', 'totalVotes', 'perfil'];
  dataSourceDepFederal = new MatTableDataSource(this.depFederalArr);
  displayedColumnsDepEstadual = ['index', 'nameExibition', 'politicalParty', 'elected', 'totalVotes', 'perfil'];
  dataSourceDepEstadual = new MatTableDataSource(this.depEstadualArr);

  constructor(private authService: AuthService, private countryService: CountryService,
    private cityService: CityService, private candidateService: CandidateService,
    private temporaryService: TemporaryService) {}

  ngOnInit() {
    console.log(google);
    this.yearGroup = [{name: 'Eleições Municipais', year: [2016]},
                {name: 'Eleições Federais', year: [2014, 2018]}];

    this.geocoder = new google.maps.Geocoder();

    this.resetVariables();
    
    this.authService.login({"username": "dev@comunnica.com.br", "password": "9tR7Y8d5", "domain": "TI"}).subscribe(result => {
      localStorage.setItem('token', result.token);
      //this.carregarEstados();
    });

    this.temporaryService.generateToken({"username": "dev.ironpatriot@infinitydata.com.br", "password": "Mudar123","domain": "dev"}).subscribe(result => {
      localStorage.setItem('tokenTemporary', result.token);
      this.carregarEstados();
    })
  }

  enableState(name, year): void {
    this.resetVariables();
    this.formState.enable();
    this.yearSelected = {name, year};
  }

  resetVariables(): void {
    this.accordionPartidos = false;
    this.accordionVereadores = false;
    this.accordionPrefeitos = false;
    this.accordionDeputadoEstadual = false;
    this.accordionDeputadoFederal = false;
    this.formState.disable();
    this.formState.setValue('');
    this.formCity.disable();
    this.formCity.setValue('');
    this.formDistrict.disable();
    this.formDistrict.setValue('');
    this.formsSchool.disable();
    this.formsSchool.setValue('');
    this.citiesArr = [];
    this.districtsArr = [];
    this.politicalPartiesArr = [];
    this.topCandidatesArr = [];
    this.topMayorsArr = [];
    this.depEstadualArr = [];
    this.depFederalArr = [];
    this.candidateDetail = new Candidate();
    this.totalElectorate = 0;
    this.totalCities = 0;
    this.totalDistricts = 0;
    this.totalSchools = 0;
    this.totalPoliticalParties = 0;
    this.totalCandidates = 0;
    this.totalMayors = 0;
    this.totalDepEstaduais = 0;
    this.totalDepFederais = 0;
    this.localeSelected = 'BRASIL';
    this.stateSelected = 'BRASIL';
    this.citySelected = '';
    this.districtSelected = '';
    this.votosNulosPartidos = 0;
    this.objCity = {};
    this.district = '';
    this.objState = {};
    this.localeMapCurrent =  '';
    this.yearSelected = {name: 'Eleições Municipais', year: 0};
    let mapProp = {
      center: new google.maps.LatLng(-14.235004,-51.92528),
      zoom: 3,
      mapTypeControl: false,
      streetViewControl: false
    };

    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

    this.mapMarker('Brasil');
  }

  private carregarEstados(): void {
    this.temporaryService.getStates(localStorage.getItem('tokenTemporary')).subscribe(result => {
      result.states.forEach((state: State) => {
        if (state.state !== undefined)
          this.statesArr.push(state); 
      })
      this.totalElectorate = result.totalElectorate;

      this.filteredOptionsState = this.formState.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filterComboState(val))
      );

    })
  }

  private resetVariablesCities(): void {
    this.formCity.setValue('');
    this.citySelected = '';
    this.formDistrict.disable();
    this.resetDistrict();
  }

  carregarCidades(state): void {
    this.objState = state;
    this.resetVariablesCities();
    this.mapMarker(`Estado de ${state.name}`);
    this.stateSelected = state.name;
    this.localeSelected = state.name;
    if (this.yearSelected.name !== 'Eleições Municipais') {
      this.carregarCandidatosFederais();
    }
    this.temporaryService.getCities({uf: state.state, anoEleicao: this.yearSelected.year, token: localStorage.getItem('tokenTemporary')})
      .subscribe(result => {
        this.formCity.enable();
        this.citiesArr = result.cities;
        this.totalCities = result.cities.length;
        this.totalElectorate = result.electorate;

        this.filteredOptionsCity = this.formCity.valueChanges
        .pipe(
          startWith(''),
          map(val => this.filterComboCity(val))
        );
      })
  }

  private resetDistrict(): void {
    this.formDistrict.setValue(''); 
    this.districtSelected = '';
    this.districtsArr = [];
    this.totalDistricts = 0;
  }

  carregarDadosCidade(city): void {
    this.objCity = city;
    this.resetDistrict();
    this.formDistrict.enable();
    this.citySelected = city.name;
    this.localeSelected = city.name;
    this.mapMarker(`${city.name} ${this.objState.state}`);

    this.cityService.getDistricts(city.code).subscribe(result => {
      this.districtsArr = result.districts;
      this.totalDistricts = result.districts.length;
      this.totalElectorate = city.electorate;

      this.filteredOptionsDistrict = this.formDistrict.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filterComboDistrict(val))
      )
    });

    this.cityService.getPoliticalPartyVotes({anoEleicao: this.yearSelected.year, codigoCidade: city.code}).subscribe(result => {
      this.totalPoliticalParties = result.politicalParties.length;
      this.politicalPartiesArr = result.politicalParties;
      this.makeVotesPoliticalPartiesChart(this.politicalPartiesArr);
      this.makeVotesPoliticalPartiesTable(this.politicalPartiesArr);
    });

    if (this.yearSelected.name === 'Eleições Municipais') {
      this.carregarCandidatosMunicipais(city);
    }

  }

  private carregarCandidatosMunicipais(city): void {
    this.candidateService.getTopCandidates({anoEleicao: this.yearSelected.year, codigoCidade: city.code, codigoCargo: 13, numeroTurno: 1, limite: 50}).subscribe(result => {
      this.totalCandidates = result.length;
      this.makeVotesCandidatesTable(result.candidates);
      this.makeVotesCandidatesChart(result.candidates);
    })
    
    this.candidateService.getTopCandidates({anoEleicao: this.yearSelected.year, codigoCidade: city.code, codigoCargo: 11, numeroTurno: 1, limite: 50}).subscribe(result => {
      this.totalMayors = result.length;
      this.makeVotesMayorsTable(result.candidates);
      this.makeVotesMayorsChart(result.candidates);
    })
  }

  private carregarCandidatosFederais(): void{
    this.candidateService.getTopCandidates({anoEleicao: this.yearSelected.year, codigoCidade: this.objState.state, codigoCargo: 6, numeroTurno: 1, limite: 50}).subscribe(result => {
      this.totalDepFederais = result.length;
      this.makeVotesDepTable(result.candidates, 'Federal');
      this.makeVotesDepChart(result.candidates, 'Federal');
    })
    
    this.candidateService.getTopCandidates({anoEleicao: this.yearSelected.year, codigoCidade: this.objState.state, codigoCargo: 7, numeroTurno: 1, limite: 50}).subscribe(result => {
      this.totalDepEstaduais = result.length;
      this.makeVotesDepTable(result.candidates, 'Estadual');
      this.makeVotesDepChart(result.candidates, 'Estadual');
    })
  }

  carregarDadosBairro(bairro): void {
    this.district = bairro;
    this.formsSchool.enable();
    this.districtSelected = bairro;
    this.localeSelected = bairro;
    this.mapMarker(`${bairro} ${this.formCity.value}`);
  }

  carregarDadosPerfil(candidateNumber, eleicoes): void {
    if (eleicoes === 'Federais') {
      this.candidateService.getVotesByLocal({anoEleicao: this.yearSelected.year, codigoCidade: this.objState.state, numeroCandidato: candidateNumber})
      .subscribe(result => {
        console.log(result);
        this.makeVotesSchoolsChart(result);
        this.makeVotesSchoolsTable(result);
        this.candidateService.getCandidateDetails({anoEleicao: this.yearSelected.year, codigoCidade: this.objState.state, numeroCandidato: candidateNumber})
        .subscribe(details => {
          this.candidateDetail = details.candidate;
          if (Array.isArray(this.candidateDetail.electionInformation)) {
            this.candidateDetail.electionInformation = this.candidateDetail.electionInformation[0];
          }
          document.getElementsByClassName('detalhe')[0].classList.remove('fechado');
        })
      })
    }
    
    if (eleicoes === 'Municipais') {
      this.candidateService.getVotesByLocal({anoEleicao: this.yearSelected.year, codigoCidade: this.objCity.code, numeroCandidato: candidateNumber})
      .subscribe(result => {
        this.makeVotesSchoolsChart(result);
        this.makeVotesSchoolsTable(result);
        this.candidateService.getCandidateDetails({anoEleicao: this.yearSelected.year, codigoCidade: this.objCity.code, numeroCandidato: candidateNumber})
        .subscribe(details => {
          this.candidateDetail = details.candidate;
          document.getElementsByClassName('detalhe')[0].classList.remove('fechado');
        })
      })
    }
  }

  sairDetalhes() {
    document.getElementsByClassName('detalhe')[0].classList.add('fechado');
    this.mapMarker(this.localeMapCurrent);
    if (this.heatmap) {
      this.heatmap.setMap(null);
    }
  }

  private makeVotesMayorsTable(mayors): void {
    mayors = mayors.map((pp, index) => { 
      pp.index = index+1 
      return pp;
    });
    this.dataSourceMayor = new MatTableDataSource(mayors); 
  }

  private makeVotesSchoolsTable(votesSchools) : void {
    votesSchools = votesSchools.map((pp, index) => { 
      pp.index = index+1 
      return pp;
    });
    this.dataSourceSchools = new MatTableDataSource(votesSchools); 
  }

  private makeVotesSchoolsChart(obj): void {
    this.votosPorEscolasChart = [];
    this.locations = [];
    let labels = [];
    this.votosPorEscolasChart.push(['Colégio', 'Votos']);
    obj.forEach((value, key) => {
      this.votosPorEscolasChart.push([obj[key]._id.localName, obj[key].total]);
      this.locations.push({lat: obj[key]._id.geoLocalization.coordinates[0], lng: obj[key]._id.geoLocalization.coordinates[1]});
      labels.push(obj[key].total+"");
      if(key === obj.length-1) {
        localStorage.setItem('votosPorEscolasChart', JSON.stringify(this.votosPorEscolasChart));
        GoogleCharts.load(this.drawChartVotesSchool);
        this.mapMarkerClusterer(this.locations, labels);
        this.setHeatMap(this.locations);
      }
    })
  }

  private setHeatMap(locations): void {
    let locationsHeatMap = [];
    locations.forEach(location => {
      locationsHeatMap.push(new google.maps.LatLng(location.lat, location.lng));
    })
    this.heatmap = new google.maps.visualization.HeatmapLayer({
      map: this.map,
      data: locationsHeatMap
    });
    this.heatmap.set('radius', 23);
  }

  private makeVotesMayorsChart(obj): void {
    this.votosPorPrefeitoChart = [];
    this.votosPorPrefeitoChart.push(['Nome', 'Votos']);
    obj.forEach((value, key) => {
      this.votosPorPrefeitoChart.push([obj[key].electionInformation.nameExibition, obj[key].totalVotes || 0]);

      if(key === obj.length-1) {
        localStorage.setItem('votosPorPrefeitoChart', JSON.stringify(this.votosPorPrefeitoChart));
        GoogleCharts.load(this.drawChartTopMayors);
      }
    })
  }

  private makeVotesCandidatesTable(candidates): void {
    candidates = candidates.map((pp, index) => { 
      pp.index = index+1 
      return pp;
    });
    this.dataSourceCandidate = new MatTableDataSource(candidates); 
  }

  private makeVotesDepTable(candidates, dep): void {
    if (dep === 'Federal'){
      candidates = candidates.map((pp, index) => { 
        pp.index = index+1 
        return pp;
      });
      this.dataSourceDepFederal = new MatTableDataSource(candidates); 
    }

    if (dep === 'Estadual') {
      candidates = candidates.map((pp, index) => { 
        pp.index = index+1 
        return pp;
      });
      this.dataSourceDepEstadual = new MatTableDataSource(candidates); 
    }
  }

  private makeVotesCandidatesChart(obj): void {
    this.votosPorCandidatoChart = [];
    this.votosPorCandidatoChart.push(['Nome', 'Votos']);
    obj.forEach((value, key) => {
      this.votosPorCandidatoChart.push([obj[key].electionInformation.nameExibition, obj[key].totalVotes || 0]);

      if(key === obj.length-1) {
        localStorage.setItem('votosPorCandidatoChart', JSON.stringify(this.votosPorCandidatoChart));
        GoogleCharts.load(this.drawChartTopCandidates);
      }
    })
  }

  private makeVotesDepChart(obj, dep): void {
    if (dep === 'Federal') {
      this.votosPorDepFederalChart = [];
      this.votosPorDepFederalChart.push(['Nome', 'Votos']);
      obj.forEach((value, key) => {
        this.votosPorDepFederalChart.push([obj[key].electionInformation[0].nameExibition, obj[key].electionInformation[0].totalVotes || 0]);

        if(key === obj.length-1) {
          localStorage.setItem('votosPorDepFederalChart', JSON.stringify(this.votosPorDepFederalChart));
          GoogleCharts.load(this.drawChartDepFederal);
        }
      })
    }

    if (dep === 'Estadual') {
      this.votosPorDepEstadualChart = [];
      this.votosPorDepEstadualChart.push(['Nome', 'Votos']);
      obj.forEach((value, key) => {
        this.votosPorDepEstadualChart.push([obj[key].electionInformation[0].nameExibition, obj[key].electionInformation[0].totalVotes || 0]);

        if(key === obj.length-1) {
          localStorage.setItem('votosPorDepEstadualChart', JSON.stringify(this.votosPorDepEstadualChart));
          GoogleCharts.load(this.drawChartDepEstadual);
        }
      })    
    }
    
  }

  private makeVotesPoliticalPartiesTable(politicalParties): void {
    let count = 0;
    politicalParties.some(pp => { 
      count++;
      return pp._id === 'nulos_brancos'
    })
    politicalParties.splice(count-1,1);
    politicalParties = politicalParties.map((pp, index) => { 
      pp.index = index+1 
      return pp;
    });
    this.dataSourcePoliticalParties = new MatTableDataSource(politicalParties); 
  }

  private makeVotesPoliticalPartiesChart(obj): void {
    this.votosPorPartidoChart = [];
    this.votosPorPartidoChart.push(['Partidos', 'Votos']);
    obj.forEach((value, key) => {
      if (obj[key]._id !== "nulos_brancos") {
        this.votosPorPartidoChart.push([obj[key]._id, obj[key].total]);
      }else {
        this.votosNulosPartidos = obj[key].total;
      }

      if(key === obj.length-1) {
        localStorage.setItem('votosPorPartidoChart', JSON.stringify(this.votosPorPartidoChart));
        GoogleCharts.load(this.drawChartPoliticalParties);
      }
    })
  }

  filterComboState(val) : State[] {
    return this.statesArr.filter((state: State) => { 
      if (val.name !== undefined)
        return state.name.toLowerCase().indexOf(val.name.toLowerCase()) === 0
      return state.name.toLowerCase().indexOf(val.toLowerCase()) === 0
    });
  }

  filterComboCity(val) : City[] {
    return this.citiesArr.filter((city: City) => { 
      if (val.name !== undefined)
        return city.name.toLowerCase().indexOf(val.name.toLowerCase()) === 0
      return city.name.toLowerCase().indexOf(val.toLowerCase()) === 0
    });
  }

  filterComboDistrict(val) : any[] {
    return this.districtsArr.filter((district: any) => district.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  mapMarker(address): void {
    this.localeMapCurrent = address;
    this.geocoder.geocode({
      componentRestrictions: {
        country: 'BR'
      },
      'address': address
    }, (results, status) => {
        this.clearMarkers(null);
        let marker = new google.maps.Marker({
          position: results[0].geometry.location,
          map: this.map,
          animation: google.maps.Animation.DROP
          }); 
          this.map.panTo(results[0].geometry.location);
          this.map.fitBounds(results[0].geometry.viewport);
        this.markers.push(marker);
    })
  }

  mapMarkerClusterer(locations, labels) : void {
    this.clearMarkers(null);
    this.markers = locations.map((location, index) => {
      return new google.maps.Marker({
        position: location,
        label: labels[index % labels.length],
        animation: google.maps.Animation.DROP
      })
    })
    this.markerClusterer = new MarkerClusterer(this.map, this.markers, {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
    
  }

  private clearMarkers(map): void {
    if (this.markers) {
      for (var i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(map);
      }
    }
    if (this.markerClusterer)
      this.markerClusterer.clearMarkers();
  }

  private drawChartVotesSchool(): void {
    let votosPorEscolasChart = JSON.parse(localStorage.getItem('votosPorEscolasChart'));
    localStorage.removeItem('votosPorEscolasChart');
    const data = GoogleCharts.api.visualization.arrayToDataTable(votosPorEscolasChart);
    let materialOptionsCHART = {
      bars: 'vertical',
      chartArea: {
        width: '100%',
        height: '100%'
      },
      animation: {
        duration: 500,
        easing: 'out',
      },
      colors: ['#2b3e69']
    };
    const column = new GoogleCharts.api.visualization.ColumnChart(document.getElementById('votesSchoolChart'));
    column.draw(data, materialOptionsCHART);
  }

  private drawChartDepFederal(): void {
    let votosPorDepFederalChart = JSON.parse(localStorage.getItem('votosPorDepFederalChart'));
    localStorage.removeItem('votosPorDepFederalChart');
    const data = GoogleCharts.api.visualization.arrayToDataTable(votosPorDepFederalChart);
    let materialOptionsCHART = {
      bars: 'vertical',
      chartArea: {
        width: '100%',
        height: '100%'
      },
      animation: {
        duration: 500,
        easing: 'out',
      },
      colors: ['#2b3e69']
    };
    const column = new GoogleCharts.api.visualization.ColumnChart(document.getElementById('topDepFederal'));
    column.draw(data, materialOptionsCHART);
  }

  private drawChartDepEstadual(): void {
    let votosPorDepEstadualChart = JSON.parse(localStorage.getItem('votosPorDepEstadualChart'));
    localStorage.removeItem('votosPorDepEstadualChart');
    const data = GoogleCharts.api.visualization.arrayToDataTable(votosPorDepEstadualChart);
    let materialOptionsCHART = {
      bars: 'vertical',
      chartArea: {
        width: '100%',
        height: '100%'
      },
      animation: {
        duration: 500,
        easing: 'out',
      },
      colors: ['#2b3e69']
    };
    const column = new GoogleCharts.api.visualization.ColumnChart(document.getElementById('topDepEstadual'));
    column.draw(data, materialOptionsCHART);
  }

  private drawChartTopMayors(): void {
    let votosPorPrefeitoChart = JSON.parse(localStorage.getItem('votosPorPrefeitoChart'));
    localStorage.removeItem('votosPorPrefeitoChart');
    const data = GoogleCharts.api.visualization.arrayToDataTable(votosPorPrefeitoChart);
    let materialOptionsCHART = {
      bars: 'vertical',
      chartArea: {
        width: '100%',
        height: '100%'
      },
      animation: {
        duration: 500,
        easing: 'out',
      },
      colors: ['#2b3e69']
    };
    const column = new GoogleCharts.api.visualization.ColumnChart(document.getElementById('topMayor'));
    column.draw(data, materialOptionsCHART);
  }

  private drawChartTopCandidates(): void {
    let votosPorCandidatoChart = JSON.parse(localStorage.getItem('votosPorCandidatoChart'));
    localStorage.removeItem('votosPorCandidatoChart');
    const data = GoogleCharts.api.visualization.arrayToDataTable(votosPorCandidatoChart);
    let materialOptionsCHART = {
      bars: 'vertical',
      chartArea: {
        width: '100%',
        height: '100%'
      },
      animation: {
        duration: 500,
        easing: 'out',
      },
      colors: ['#2b3e69']
    };
    const column = new GoogleCharts.api.visualization.ColumnChart(document.getElementById('topCandidate'));
    column.draw(data, materialOptionsCHART);
  }

  private drawChartPoliticalParties(): void {
    let votosPorPartidoChart = JSON.parse(localStorage.getItem('votosPorPartidoChart'));
    localStorage.removeItem('votosPorPartidoChart');
    const data = GoogleCharts.api.visualization.arrayToDataTable(votosPorPartidoChart);
    let materialOptionsCHART = {
      bars: 'vertical',
      chartArea: {
        width: '100%',
        height: '100%'
      },
      animation: {
        duration: 500,
        easing: 'out',
      },
      colors: ['#2b3e69']
    };
    const column = new GoogleCharts.api.visualization.ColumnChart(document.getElementById('politicalParties'));
    column.draw(data, materialOptionsCHART);
  }
}