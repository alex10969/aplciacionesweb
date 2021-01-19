import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class FirebaseServicesService {

  constructor(
    private firestore: AngularFirestore
  ){}


goInventario(){
return this.firestore.collection("producto").snapshotChanges();
}

createInventario(producto: any){
return this.firestore.collection("producto").add(producto);
}

updateInventario(id: any, producto: any){
return this.firestore.collection("producto").doc(id).update(producto);
}

delateInventario(id: any){
return this.firestore.collection("producto").doc(id).delete();
}


}
