import { AuthService } from '@auth0/auth0-angular';
import { Component, Inject, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { courses } from '../course';
import { DOCUMENT, Location } from '@angular/common';
import { Router } from '@angular/router';
import { schedules } from '../schedule'
import { scheduleResponse } from '../scheduleresponses';

@Injectable()
export class ConfigService {

  private linkstring: string = "/api/subjectss";
  private privateScheduleURL: string = "/api/user/update-data";
  private publicScheduleURL: string = "/api/public/update-data";
  private geturl: string = "/api/public/scheduleData";


  constructor(private http: HttpClient) { }

  postPrivateScheduleData(content): Observable <schedules[]> {

    return this.http.post<schedules[]>(this.privateScheduleURL, content);
  }

  postPublicScheduleData(content): Observable <schedules[]> {
    return this.http.post<schedules[]>(this.publicScheduleURL, content);
  }

   getcourses(): Observable<courses[]> {
     return this.http.get<courses[]>(this.linkstring);
   }

   getPublicScheduleData(): Observable<scheduleResponse[]> {  // observable type any?
    return this.http.get<any[]>(this.geturl);
  };

  getPrivateScheduleData(username): Observable<scheduleResponse[]> {  // observable type any?
    let GETPrivateScheduleDataString: string = "/api/" + username + "/scheduleData";
    return this.http.get<any[]>(GETPrivateScheduleDataString);
  };
   
}


@Component({
  selector: 'app-anauthenticated',
  templateUrl: './anauthenticated.component.html',
  styles: [
  ]
})
export class AnauthenticatedComponent implements OnInit {

  publicscheduleResponse = {};

  activeSch;

  renderedSchedule;
  
  enableTimeTableVisibility = false;

  public courses = [];
  public matchingcourses = [];

  public displayfullcourses = [];

  selectedCourses = [];

  createdSchedule: string;
  scheduleInfoObj = {};


  activeSchedule = []; 
  actvieScheduleName: string;

  timeBasedSchedule = {}
  scheduleDataInfo = {};
  scheduleData: any = {};



  constructor(public auth: AuthService, private _configservice:ConfigService,
  @Inject(DOCUMENT) private doc: Document) {}
  





courseSelected(course: object){ 

  let checked = course["checked"];

  if(checked){
    
      this.selectedCourses.push(course);
      console.log(this.selectedCourses);
  }
  else{
    for(let schedule in this.selectedCourses){
      if(this.selectedCourses[schedule] == course){
        
       
          const index = this.selectedCourses.indexOf(this.selectedCourses[schedule], 0);
          if (index > -1) {
            this.selectedCourses.splice(index, 1);
          }
      
        console.log("course removed from selected courses");
        console.log(this.selectedCourses);
      }
    }
  }
}



//added code

chooseSchedule(){


  this._configservice.getPublicScheduleData().subscribe(data => this.publicscheduleResponse = data);
  
  let name = this.activeSch;
  this.activeSchedule = this.scheduleData[name];
  this.actvieScheduleName = name;


}



timeArray = ["8:30 AM","9:30 AM","10:30 AM","11:30 AM","12:30 PM","1:30 PM","2:30 PM","3:30 PM","4:30 PM","5:30 PM","6:30 PM","7:30 PM","8:30 PM","9:30 PM"]; // used to be times; change in HTML
daysMapObject = {Monday: "M", Tuesday: "Tu", Wednesday: "W", Thursday: "Th", Friday: "F"}; // used to be "days" - change in HTML



generateWeeklySchedule(){
  console.log("inside func");

  if(this.activeSchedule.length == 0){
    console.log("schedule empty");
  }
  this.renderedSchedule = this.actvieScheduleName;

    let formattedTimeTableData = {};
    console.log(formattedTimeTableData);

    for(let time of this.timeArray){
        formattedTimeTableData[time] = {};
    }
    console.log(formattedTimeTableData);


  // add active schedule data to object to be rendered

  for(var courseObject of this.activeSchedule){

    let courseDays = courseObject.course_info[0].days; 
    let courseName = courseObject.className;
    let courseTime = courseObject.course_info[0].start_time;
    let courseInfo = courseObject.catalog_nbr + " " + courseName + " " + courseObject.course_info[0].ssr_component; 

    // add course data to object to be rendered
    for(let day in this.daysMapObject){
      if(courseDays.includes(this.daysMapObject[day])) {  
        // check for conflics
        if(formattedTimeTableData[courseTime][day] == undefined ||formattedTimeTableData[courseTime][courseDays] == "" ) {
          formattedTimeTableData[courseTime][day] = courseInfo;
        }
        else{
          formattedTimeTableData[courseTime][day] += "course conflict: " + courseObject.catalog_nbr;
        }
      }else{
       
        formattedTimeTableData[courseTime][day] = "";
      }        
    }
  }


  // populate rest of table with empty string
for(var timeSlot of Object.keys(formattedTimeTableData)){

    if(Object.keys(formattedTimeTableData[timeSlot]).length === 0){
    
        for(var daySlot in this.daysMapObject){
            formattedTimeTableData[timeSlot][daySlot] = "";
        }
    }
};

  this.timeBasedSchedule = formattedTimeTableData;  // to fix error set line 51 to:   timeBasedSchedule = {}; 
  this.enableTimeTableVisibility = true;
  console.log(this.timeBasedSchedule);
  return;
}


fixKeyvalueOrder(first, second){
  return first;

}


showFullCourseDetails() {

  this.displayfullcourses = [];

  for(var c of this.matchingcourses) {

    this.displayfullcourses.push(c)
    
  
  } 

  console.log(this.displayfullcourses)

  
  
}




ngOnInit() {

  this._configservice.getPublicScheduleData().subscribe( (data)  => {
    console.log(data);

    
    for(let key of Object.keys(data)){

        if(key == "scheduleDataInfo"){
          for(let i = 0; i< Object.keys(data[key]).length; i++){
            this.scheduleDataInfo[Object.keys(data[key])[i]] = data["scheduleDataInfo"][Object.keys(data["scheduleDataInfo"])[i]]; 
        
          }
        }

      // add scheduleData from returned data to our schedule data 
      
        else if(key == "scheduleData"){
          for(let i = 0; i< Object.keys(data[key]).length; i++){
            this.scheduleData[Object.keys(data[key])[i]] = data["scheduleData"][Object.keys(data["scheduleData"])[i]]; 
            // this.scheduleData[ SCHEDULE NAME ] = collectionItem["scheduleData"] VALUE
          }
        }

        else{
          console.log("something broked returned data has more than scheduleDataInfo and scheduleData properties");
        }
      }
    // setting all courses expanded to false
    for(let courseList of Object.keys(this.scheduleDataInfo)){
      this.scheduleDataInfo[courseList].expanded = false;
    }

  })











  //-------------------------------------------------------------------------------------------------
  this.displayfullcourses = [];
  this.matchingcourses = [];

  this._configservice.getcourses().subscribe(data => this.courses = data);

  
let subjectInput = (document.getElementById("Subject") as HTMLInputElement).value;
let courseID = (document.getElementById("numb") as HTMLInputElement).value;
let component = (document.getElementById("Component") as HTMLInputElement).value;
let keyWord = (document.getElementById("keyWord") as HTMLInputElement).value;

console.log(subjectInput)

//Search with keyword if subject input = all
if(subjectInput=="All")  {
  if(keyWord.length<4) {
    console.log("Please input a keyword with at least 4 characters") 
  } 
  else {
    for(var string of this.courses)  {
//let lowercasecat = string.catalog_nbr.toLowerCase();
let lowercaseclass = string.className.toLowerCase();
//let catwithoutwhitespaces = lowercasecat.replace(/\s/g, '');
let classNamewithoutspaces = lowercaseclass.replace(/\s/g, '');
let lowercasekeyWord = keyWord.toLowerCase();

      if(classNamewithoutspaces.includes(lowercasekeyWord)) {
        this.matchingcourses.push(string)
  
      }
  
    }
  }
 
  if(this.matchingcourses.length==0) {
console.log("Please input a specific subject or a valid keywoord")  
  }


}

if(!courseID)  {
  console.log("Please input a specific course id")
}



for(var c of this.courses) {

  if(component=="ALL") {

  if (subjectInput === c.subject && courseID == c.catalog_nbr) {
    this.matchingcourses.push(c)
  }

}

else {
  if (subjectInput === c.subject && courseID == c.catalog_nbr && component=== c.course_info[0].ssr_component) {
    this.matchingcourses.push(c)
  }
}
  
}

if (this.matchingcourses.length==0) {
  alert("Please input a valid subject and course id combination")
}
else {
  console.log(this.matchingcourses)
}


}







}
