import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class HttpService {

    constructor(private http: Http) { }

    getJson(file) {
        return this.http.get(file).map(res => {
            return res.json();
        });        
    }

    getManyJson(files) {
        let observableBatch = [];
        files.forEach(file => {
            observableBatch.push(this.getJson(file));
        });
        return Observable.forkJoin(observableBatch);
    }

}