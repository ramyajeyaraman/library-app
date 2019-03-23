import { Component, OnInit, Input } from '@angular/core';
import { RestService } from '../../../shared/services/rest.service';
import { WS } from '../../../shared/constants/endpoint';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {
  title = '';
  chartData:any;
  chartLabels:any;
  pieChartType:string = 'pie';
  pieChartOptions:any = {'backgroundColor': ["#FF6384","#4BC0C0","#FFCE56","#E7E9ED","#36A2EB"]};
  isChartDataAvailable:boolean;
  constructor(private restService: RestService) { }

  ngOnInit() {
    this.loadAdminChartData();
  }
   // events on slice click
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  // event on pie chart slice hover
  public chartHovered(e:any):void {
    console.log(e);
  }
  loadAdminChartData(){
    this.isChartDataAvailable = false;
    this.restService.getData(WS.getBookGenreCountAdmin.endpoint,(data) => {
      if(data && data.length>0){
        this.chartLabels = [];
        this.chartData = [];
        data.forEach((val) => {
          this.chartLabels.push(val.key);
          this.chartData.push(parseInt(val.value));
          this.isChartDataAvailable = true;
        });
      }
      else{
        this.chartData = [];
        this.chartLabels = [];
      }
    });
  }

}
