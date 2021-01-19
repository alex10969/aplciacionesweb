import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FirebaseServicesService } from './services/firebase-services.service';
import { isNullOrUndefined } from 'util';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  closeResult = '';

  productoForm: FormGroup;

  idfirebaseActualizar: string;
  actualizar: boolean;

  constructor(
    private modalService: NgbModal,
    public fb: FormBuilder,
    private firebaseServicesService: FirebaseServicesService
    ) {}

  config: any;
  collection = { count: 20, data: [] }
  
  ngOnInit(): void {
    this.actualizar = false;
    this.idfirebaseActualizar="";
    this.config = {
      itemsPerPage: 5,
      currentPage: 1,
      totalmems: this.collection.count
    };

this.productoForm = this.fb.group({

  id: ['', Validators.required],
  producto: ['', Validators.required],
  inventario: ['', Validators.required],
});

this,this.firebaseServicesService.goInventario().subscribe(resp=>{
  this.collection.data = resp.map((e:any)=>{
  return{
    id:  e.payload.doc.data().id,
    producto: e.payload.doc.data().producto,
    inventario: e.payload.doc.data().inventario,
    idfirebase: e.payload.doc.id
  }
})
},
error=>{
console.error(error);
}
);
  
  }

  pageChanged(eveny){
    this.config.currentPage = event;
  }

  eliminar (item:any):void{
    this.firebaseServicesService.delateInventario(item.idfirebase);
  }

  guardarInventario():void{
    this.firebaseServicesService.createInventario(this.productoForm.value).then(resp=>{
      this.productoForm.reset();
      this.modalService.dismissAll();
    }).catch(error =>{
      console.error(error)
    })
    
  }

  actulizarInventario(){

    if(!isNullOrUndefined(this.idfirebaseActualizar)){
      this.firebaseServicesService.updateInventario(this.idfirebaseActualizar, this.productoForm.value).then(resp=>{
        this.productoForm.reset();
        this.modalService.dismissAll();
      }).catch(error=>{
        console.error(error);
      });
    }
    
  }



  openEditar(content, item: any) {
    //llenar el form para editar
    this.productoForm.setValue({
      id:item.id, 
      producto: item.producto,
      inventario:item.inventario,
    });
    this.idfirebaseActualizar = item.idfirebase;
    this.actualizar = true;
    
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  open(content) {
    this.actualizar = false;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
