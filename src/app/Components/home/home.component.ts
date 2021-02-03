import { HomeService } from './../../Services/home.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  restaurantSearchFrm = this.fb.group({ 
    restaurantName:['',Validators.required],
    selectedBranch:['']
  });
  branches: any[]=[];
  defaultVal: number = 1;

  constructor(private router:Router, 
              private fb:FormBuilder,
              private db: AngularFirestore,
              private homeService:HomeService) { 
              }
              
  ngOnInit(): void {
    this.homeService.getAllBranches()
    .subscribe(branches => {      
      this.branches = branches;                  
      // console.log(this.branches);
    })
    // console.log(this.restaurantName);
  }

  viewRestaurant(){
    // console.log(this.restaurantSearchFrm.value);
    console.log(this.restaurantSearchFrm.value.restaurantName);
    console.log(this.restaurantSearchFrm.value.selectedBranch);

    if(this.restaurantSearchFrm.value.selectedBranch)
        this.homeService.setData("", this.restaurantSearchFrm.value.selectedBranch);
        
    else if (this.restaurantSearchFrm.value.restaurantName&&
                  this.restaurantSearchFrm.value.selectedBranch){
              this.homeService.setData(this.restaurantSearchFrm.value.restaurantName,
              this.restaurantSearchFrm.value.selectedBranch);
    }   

    this.router.navigate(['/search']).then(()=>{
              console.log("navigated")
        })   
           
    }
  }