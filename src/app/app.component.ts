import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import { } from '@types/googlemaps';
import { GoogleCharts } from 'google-charts';
import { AuthService } from './services/auth.service';
import { CountryService } from './services/country.service';
import { CityService } from './services/city.service';
import { State } from './class/State';
import { City } from './class/City';
import { PoliticalParty } from './class/PoliticalParty';

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

  //Variaveis para carregar informações.
  statesArr: State[] = [];
  citiesArr: City[] = [];
  districtsArr: any[] = [];
  politicalPartiesArr: PoliticalParty[] = [];
  totalElectorate = 0;
  totalCities = 0;
  totalDistricts = 0;
  totalSchools = 0;
  totalPoliticalParties = 0;
  stateSelected = 'BRASIL';
  votosNulosPartidos = 0;

  //Forms
  filteredOptionsState: Observable<State[]>;
  formState: FormControl = new FormControl();
  filteredOptionsCity: Observable<City[]>;
  formCity: FormControl = new FormControl();
  filteredOptionsDistrict: Observable<any[]>;
  formDistrict: FormControl = new FormControl();

  //Maps
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  geocoder = new google.maps.Geocoder();
  markers = [];

  //Charts
  votosPorPartidoChart = [];
  
  //Tables
  displayedColumnsPoliticalParties = ['_id', 'total', 'percent'];
  dataSourcePoliticalParties = new MatTableDataSource(this.politicalPartiesArr);

  constructor(private authService: AuthService,
     private countryService: CountryService, private cityService: CityService) {}

  ngOnInit() {

      var mapProp = {
        center: new google.maps.LatLng(-14.235004,-51.92528),
        zoom: 4,
        mapTypeControl: false,
        streetViewControl: false
      };

      this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

      this.mapMarker('Brasil');

      this.authService.login({"username": "dev.ironpatriot@infinitydata.com.br", "password": "Mudar123", "domain": "dev"}).subscribe(result => {
        localStorage.setItem('token', result.token);
      });

      this.carregarEstados();

  }

  private carregarEstados() {
    this.countryService.getStates().subscribe(result => {
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

  carregarCidades(state) {
    this.mapMarker(`Estado de ${state.name}`);
    this.stateSelected = state.name;
    this.countryService.getCities({uf: state.state, anoEleicao: 2016})
      .subscribe(result => {
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

  carregarDadosCidade(city) {
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

    this.cityService.getPoliticalPartyVotes({anoEleicao: 2016, codigoCidade: city.code}).subscribe(result => {
      this.totalPoliticalParties = result.politicalParties.length;
      this.politicalPartiesArr = result.politicalParties;
      this.makeVotesPoliticalPartiesChart(this.politicalPartiesArr);
      this.makeVotesPoliticalPartiesTable(this.politicalPartiesArr);
    })
  }

  private makeVotesPoliticalPartiesTable(politicalParties) {
    let count = 0;
    politicalParties.some(pp => { 
      count++;
      return pp._id === 'nulos_brancos'
    })
    politicalParties.splice(count-1,1);
    this.dataSourcePoliticalParties = new MatTableDataSource(politicalParties); 
  }

  private makeVotesPoliticalPartiesChart(obj) {
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

  mapMarker(address) {
    this.geocoder.geocode({
      componentRestrictions: {
        country: 'BR'
      },
      'address': address
    }, (results, status) => {
        this.clearMarkers();
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

  private clearMarkers() {
    if (this.markers) {
      for (var i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(map);
      }
    }
  }

  private drawChartPoliticalParties() {
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
