import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [],
})
export class HeaderComponent implements OnInit {
  display:boolean = false;

  onSidenavClose(){
    //visibleSidebar1 = false;
  }

  ngOnInit(): void {
  }

}
