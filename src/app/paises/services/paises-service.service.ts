import { Injectable } from '@angular/core';
import  {HttpClient} from '@angular/common/http'
import { PaisSmall, Pais } from '../interfaces/paises';
import { combineLatest, Observable, of } from 'rxjs';
import { Regiones } from '../interfaces/region';

@Injectable({
  providedIn: 'root'
})
export class PaisesServiceService {
  private _baseUrl = 'https://restcountries.com/v2';
  private _regiones: Regiones[] = [
    { name: 'European Union', code: 'EU' },
    { name: 'European Free Trade Association', code: 'EFTA' },
    { name: 'Caribbean Community', code: 'CARICOM' },
    { name: 'Pacific Alliance', code: 'PA' },
    { name: 'African Union', code: 'AU' },
    { name: 'Union of South American Nations', code: 'USAN' },
    { name: 'Eurasian Economic Union', code: 'EEU' },
    { name: 'Arab League', code: 'AL' },
    { name: 'Association of Southeast Asian Nations', code: 'ASEAN' },
    { name: 'Central American Integration System', code: 'CAIS' },
    { name: 'Central European Free Trade Agreement', code: 'CEFTA' },
    { name: 'North American Free Trade Agreement', code: 'NAFTA' },
    { name: 'South Asian Association for Regional Cooperation', code: 'SAARC' },
  ];

  get regiones():Regiones[]{
    return [...this._regiones];
  }

  constructor(private http: HttpClient) { }

  getPaisesByRegion(region:string): Observable<PaisSmall[]>{
    const url: string =   `${this._baseUrl}/regionalbloc/${region}?fields=name,alpha3Code`
    return this.http.get<PaisSmall[]>(url);
  }

  getPaisByCode(code: string): Observable<Pais | null>{
    if(!code){
      return of(null)
    }
    const url = `${this._baseUrl}/alpha/${code}`;
    return this.http.get<Pais>(url);
  }


  getPaisByCodeSmall(code: string): Observable<PaisSmall>{

    const url = `${this._baseUrl}/alpha/${code}?fields=name,alpha3Code`;
    return this.http.get<PaisSmall>(url);
  }

  getPaisesByCodes(borders: string[]):Observable<PaisSmall[]>{

    if(!borders){
      return of([])
    }

    const peticiones: Observable<PaisSmall>[] = [];

    borders.forEach(codigo => {
      const peticion = this.getPaisByCodeSmall(codigo);
      peticiones.push( peticion );
    });

    return combineLatest(peticiones);


  }

}
