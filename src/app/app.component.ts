import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import{FormGroup,FormControl,Validators} from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  myform;
  constructor(private httpobj:HttpClient){}
  ngOnInit(){
    this.getdata();
    this.myform=new FormGroup({
      name:new FormControl("",Validators.required),
      email:new FormControl("",Validators.required),
      phone:new FormControl("",[Validators.required,Validators.pattern("[0-9]+")])
    });
  }

  totalcontacts:number;
  contactarray:any[];
  
  getdata(){
    this.httpobj.get("http://localhost:3000/contacts").subscribe(
      (data)=>{
        this.contactarray=data as any[];
        this.totalcontacts=this.contactarray.length;
      }
    );
  }
  postdata(){
    if(this.myform.invalid){
      return;
    }
    this.httpobj.post("http://localhost:3000/contacts",this.myform.value).subscribe(
    response=>{
      alert("New Contact Created");
      this.myform.reset();
      this.getdata();
    }
  );
  }
  url:string;
  currentid:number;
  name:string;
  email:string;
  phone:string;
  editfun(id,name,email,phone){
    this.currentid=id;
    this.name=name;
    this.email=email;
    this.phone=phone;
    this.myform=new FormGroup({
      name:new FormControl(this.name,Validators.required),
      email:new FormControl(this.email,Validators.required),
      phone:new FormControl(this.phone,[Validators.required,Validators.pattern("[0-9]+")])
    });
  }
  editdata(){
    if(this.myform.invalid){
      return;
    }
    this.url="http://localhost:3000/contacts/"+this.currentid;
    this.httpobj.patch(this.url,this.myform.value).subscribe(
    response=>{
      alert("Contact updated successfully");
      this.myform.reset();
      this.getdata();
    }
  );
  }



  confirm=false;
  purl:string;
  deletefn(proid){
    this.confirm=confirm("Are you sure you want to delete the contact?");
    this.purl="http://localhost:3000/contacts/"+proid;
    if(this.confirm){this.httpobj.delete(this.purl).subscribe();}
    
  }
}
