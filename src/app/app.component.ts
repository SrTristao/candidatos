import { Component, ViewChild } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import { } from '@types/googlemaps';
import {GoogleCharts} from 'google-charts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  myControl: FormControl = new FormControl();
  accordionPartidos = false;
  accordionVereadores = false;
  accordionPrefeitos = false;
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;

  options = [
    'One',
    'Two',
    'Three'
  ];

  filteredOptions: Observable<string[]>;

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filter(val))
      );
      var mapProp = {
        center: new google.maps.LatLng(-14.235004,-51.92528),
        zoom: 4,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(-14.235004,-51.92528),
        map: this.map
      }); 

      GoogleCharts.load(drawChart);
 
      function drawChart() {
      
          // Standard google charts functionality is available as GoogleCharts.api after load
          const data = GoogleCharts.api.visualization.arrayToDataTable([
              ['Chart thing', 'Votos'],
              ['Lorem ipsum', 100],
              ['Dolor sit', 22],
              ['Sit amet', 18],
              ['Lorem ipsum', 60],
              ['Dolor sit', 22],
              ['Sit amet', 18],
              ['Lorem ipsum', 60],
              ['Dolor sit', 22],
              ['Sit amet', 18],
              ['Lorem ipsum', 60],
              ['Dolor sit', 22],
              ['Sit amet', 18],
              ['Lorem ipsum', 60],
              ['Dolor sit', 22],
              ['Sit amet', 18],
              ['Lorem ipsum', 60],
              ['Dolor sit', 22],
              ['Sit amet', 18],
              ['Lorem ipsum', 60],
              ['Dolor sit', 22],
              ['Sit amet', 18],
              ['Lorem ipsum', 60],
              ['Dolor sit', 22],
              ['Sit amet', 18],
              ['Lorem ipsum', 60],
              ['Dolor sit', 22],
              ['Sit amet', 18]
          ]);
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
          const column = new GoogleCharts.api.visualization.ColumnChart(document.getElementById('chart1'));
          column.draw(data, materialOptionsCHART);
      }

  }

  filter(val: string): string[] {
    return this.options.filter(option =>
      option.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }
}
