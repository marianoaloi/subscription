import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { MsalBroadcastService, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import exportFromJSON from 'export-from-json';
import { map, merge, mergeMap, Observable } from 'rxjs';
import { Cost, subsciptionDesc } from '../entity/cost';
import { PivotUiOptions } from '../entity/pivottable';
import { ManagementService } from '../management.service';

declare var jQuery: any;


@Component({
  selector: 'app-resource-group',
  templateUrl: './resource-group.component.html',
  styleUrls: ['./resource-group.component.less']
})
export class ResourceGroupComponent implements OnInit {
exportCosts() {
  // const blob = new Blob([JSON.stringify(this.costs, null, 2)], {type: 'application/json'});
  // const dialogConfig = new MatDialogConfig();
  // dialogConfig.autoFocus = true;
  // dialogConfig.data = {
  //   blobUrl: window.URL.createObjectURL(blob),
  //   backupType: 'snippets'
  // };

  exportFromJSON({ data:this.costs, fileName:"download", exportType:"json"})
}
  costs: Cost[] = [];
  screenTable: any[] = []
  loading: boolean = false;
  @ViewChild("table") table: any;
  msgloading:string=""
  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private http: HttpClient,
    private manage:ManagementService
  ){

  }

  subscriptions:subsciptionDesc[] = [
    {name:"Product Incubation",id: "054e0c75-3092-4dfb-931d-74375cd6a9d4",processed:false},
    {name:"ValeWorkforceMobility",id:"82ec3d92-3081-4b98-bc1a-e2acdcd6f983",processed:false},
    {name:"ValeStartupApps-Dev",id:"3be961e9-80eb-4ea7-b161-610b939d0070",processed:false}, 
    {name:"ValeStartupApps-Prod",id:"b36d7d79-ecde-430c-8163-8267f394ca8c",processed:false}
  ]



  getUsername(){
    this.authService.instance.getActiveAccount()?.name
  
  }
  ngOnInit(): void {
    this.getRGs();
  
  }
  getRGs() {
    // this.costs=merge(
    // this.subscriptions.map((sb: subsciptionDesc)=>this.getSubscription(sb))
    // ,1)
    this.costs = []
    this.screenTable = []
    
      this.subscriptions.forEach(
        (sb: subsciptionDesc)=>{
          
          this.loading=true
          this.getSubscription(sb).subscribe(
          costAz=>{
            this.costs = this.costs.concat(costAz)
            this.screenTable = this.screenTable.concat(costAz.map(x=>{
        
              return Object.assign(
                {value:x.value,cobranca:x.cobranca,rg:x.rg,componente:x.componente},
                {subscription:x.subscription.name},x.tags)
            }))
            if(!this.loading){
              // PivotTable.JQuery("#pivot").pivotui(this.screenTable);
              // var tpl = jQuery().pivotUtilities.aggregatorTemplates
              jQuery("#pivot").pivotUI(this.screenTable,{
                rows:["subscription","componente"],
                cols:["cobranca"],
                // aggregators:{"Soma de Valores":(usFmt: any)=>tpl.sum(usFmt)(["value"])},
                vals:["value"]}as PivotUiOptions);
              // this.table.pivotui(this.screenTable);
            }
          }
        )
        }
      )
      

  }

  getSubscription(sb: subsciptionDesc)  : Observable<Cost[]>{
    sb.processed = false
    let costs = this.manage.getCost(sb.id);
    let rgs = this.manage.getRGs(sb.id)
    this.msgloading=`costs of ${sb.name}`
    return this.getCosts(sb,costs,rgs)
  }

  getCosts(sb: subsciptionDesc, costs: Observable<import("../entity/cost").Cost[]>, rgs: Observable<any>) : Observable<Cost[]> {
    return costs.pipe(
      mergeMap(
        allSubCosts=>{
          this.msgloading=`RGs of ${sb.name}`
          allSubCosts.forEach(cost=>cost.subscription=sb)
          return rgs.pipe(
            map(
              allRgs=>{
              allRgs.forEach((rg: { name: string; tags: any[]; })=>{
                allSubCosts.filter(_cost=>_cost.rg.toLowerCase == rg.name.toLowerCase).forEach(cost=>cost.tags=rg.tags)
                
              })
              sb.processed=true
              if(this.subscriptions.length == this.subscriptions.filter(x=>x.processed).length){
                this.loading=false;
              }
              return allSubCosts;
              
            }
            )
          )
        }
      )
    );
  }
}



