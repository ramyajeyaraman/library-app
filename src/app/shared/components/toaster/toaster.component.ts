import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.scss']
})
export class ToasterComponent implements OnInit {

  constructor(public toaster: MatSnackBar) { }

  ngOnInit() {
  }
	openSnackBar(message: string, action: string) {

    this.toaster.open(message, action, {
     duration: 2000,
     verticalPosition: 'bottom',
     horizontalPosition: 'center',
   });
}
}
