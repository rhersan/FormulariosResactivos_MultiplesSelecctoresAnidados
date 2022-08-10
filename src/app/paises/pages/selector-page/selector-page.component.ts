import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesServiceService } from '../../services/paises-service.service';
import { PaisSmall, Pais } from '../../interfaces/paises';
import { Regiones } from '../../interfaces/region';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region  : ['', Validators.required],
    pais    : ['', Validators.required],
    frontera: ['', Validators.required],
  });

  // llenar selectores
  regiones : Regiones[]  = [];
  paises   : PaisSmall[] = [];
  // fronteras: string[]    = [];
  fronteras: PaisSmall[]    = [];

  // UI
  cargando: boolean = false;

  constructor(private fb: FormBuilder,
              private paisesService: PaisesServiceService) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    // cuando cambie la region

    // this.miFormulario.get('region')?.valueChanges
    //   .subscribe( region => {
    //     console.log(region);

    //     this.paisesService.getPaisesByRegion(region)
    //         .subscribe( paises => {
    //           this.paises = paises;
    //           console.log(this.paises);
    //         })

    //   });

    // cuando cambie la region
    this.miFormulario.get('region')?.valueChanges
        .pipe(
          tap( ( _ ) => {
            this.miFormulario.get('pais')?.reset('');
            this.cargando = true;
          }),
          switchMap( region => this.paisesService.getPaisesByRegion(region))
        )
        .subscribe(paises =>  {
          this.paises = paises;
          this.cargando = false;
        });

   // Cuando cambia el pais
    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap( () => {
          this.fronteras = [];
          this.miFormulario.get('frontera')?.reset('');
          this.cargando = true;
        }),
        switchMap( code => this.paisesService.getPaisByCode(code)),
        switchMap( pais => this.paisesService.getPaisesByCodes(pais?.borders!))
      )
      .subscribe( paises => {
          this.fronteras = paises;
          console.log( this.fronteras);
          this.cargando = false;
        });




  }
  guardar(){
    console.log(this.miFormulario.value);
  }

  existeFronteras(){
    return this.fronteras.length == 0 ? false : true;
  }
}
