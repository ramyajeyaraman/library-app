import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse , HttpParams} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { CommonService } from '../services/common.service';
const endpoint = 'http://192.168.1.71:8095/library/';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http: HttpClient,private commonService: CommonService) { }

  getData(url: string,callback,serviceParams?:any){
    let additionalParams = {};
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    if(serviceParams && serviceParams!=='' && serviceParams!==undefined){
      let params = new HttpParams();
      serviceParams.forEach((param)=>{
        params = params.set(param.key, param.value);
      });
      additionalParams = {params,'headers':headers};
    }
    else{
      additionalParams = {'headers':headers};
    }
    return this.http.get<any>(endpoint + url,additionalParams).subscribe(
      (successResponse) => {
        callback(successResponse)
      },
      (errorResponse) => {
        if(errorResponse.status === 500 || errorResponse.status === 401){
          callback(errorResponse);
        }
      }
    )
  }

  getDataVideos(url: string,callback,serviceParams?:any){
    let additionalParams = {};
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    if(serviceParams && serviceParams!=='' && serviceParams!==undefined){
      let params = new HttpParams();
      serviceParams.forEach((param)=>{
        params = params.set(param.key, param.value);
      });
      additionalParams = {params,'headers':headers};
    }
    else{
      additionalParams = {'headers':headers};
    }
    return this.http.get<any>(url,additionalParams).subscribe(
      (successResponse) => {
        callback(successResponse)
      },
      (errorResponse) => {
        if(errorResponse.status === 500 || errorResponse.status === 401){
          callback(errorResponse);
        }
      }
    )
  }

  postData(url: string,reqObj:any, formUpload:any, callback?:any,searchValue?:any,serviceParams?:any){
    let additionalParams = {};
    let userDetails = this.commonService.getUserDetails();
    let headersVal:any;
    if(url === 'authenticator/logoff'){
      headersVal = new HttpHeaders().set('Content-Type', 'application/json').set('JSESSIONID',userDetails.uid);
    }
    else{
      headersVal = new HttpHeaders().set('Content-Type', 'application/json');
    }
    if(searchValue && searchValue!=='' && searchValue!==undefined && serviceParams && serviceParams!=='' && serviceParams!==undefined){
      const params = new HttpParams().set(serviceParams, searchValue);
      additionalParams = {params,'headers':headersVal};
    }
    else{
      additionalParams = {'headers':headersVal};
    }
    return this.http.post<any>(endpoint + url, reqObj, additionalParams).subscribe(
      (successResponse) => {
        callback(successResponse)
      },
      (errorResponse) => {
        if(errorResponse.status === 500 || errorResponse.status === 401){
          callback(errorResponse);
        }
      }
    )
  }
  postDataFile(url: string,reqObj:any, searchParamsObj:any, callback?:any){
    const params = new HttpParams().set('repo', searchParamsObj.key).set('filename',searchParamsObj.value);
    let additionalParams = {params};
    return this.http.post<any>(endpoint + url, reqObj,additionalParams).subscribe(
      (successResponse) => {
        callback(successResponse)
      },
      (errorResponse) => {
        if(errorResponse.status === 500 || errorResponse.status === 401){
          callback(errorResponse);
        }
      }
    )
  }
}