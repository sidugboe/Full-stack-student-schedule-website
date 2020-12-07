import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styles: [
  ]
})
export class CommentsComponent implements OnInit {

  constructor() { }

  commentsarray = [];

  ngOnInit(): void {



  }

  createComment() {
    let subject: string = (document.getElementById("subject") as HTMLInputElement).value;
    let comment: string = (document.getElementById("comment") as HTMLInputElement).value;
this.commentsarray.push(subject+": "+comment)

    

  }


}
