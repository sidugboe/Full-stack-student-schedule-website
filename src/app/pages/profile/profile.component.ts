import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT, Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { courses } from 'src/app/course';
import { ConfigService } from 'src/app/anauthenticated/anauthenticated.component';
import { usersint } from 'src/app/user';


@Injectable()


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})


export class ProfileComponent implements OnInit {
  public profileJson = {};
  user;
  activeSch;
  test;

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


  constructor(public auth: AuthService, private _configservice:ConfigService, @Inject(DOCUMENT) private doc: Document) {}

  createSchedule(){
    let name: string = this.createdSchedule;
    if(!this.createdSchedule){
      console.log("Error: Please input something in the Schedule Name box");
    }
    else{
      console.log("schedule " + name + " created");
      this.scheduleInfoObj[name] = {};
      console.log(this.scheduleInfoObj);

    }
    
  }

  chooseSchedule(){

    let name = this.activeSch;
    this.activeSchedule = this.scheduleInfoObj[name];
    this.actvieScheduleName = name;
  
  }
  
  
  addToSchedule(){
    if(this.actvieScheduleName == null || this.actvieScheduleName == "" || this.actvieScheduleName == undefined){
      alert("Please select a schedule to add courses to it.")
      return;
    }
    let activeSchedule = this.activeSchedule;
    let name = this.actvieScheduleName;
  
    this.scheduleInfoObj[name] = this.selectedCourses;
    console.log(this.scheduleInfoObj);
  }
  


  ngOnInit(): void {
    this.auth.user$.subscribe(
      (profile) => (this.profileJson = JSON.stringify(profile, null, 2))
    );


   

    







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


  //search for course stuff

showFullCourseDetails() {

  this.displayfullcourses = [];

  for(var c of this.matchingcourses) {

    this.displayfullcourses.push(c)
    
  
  } 

  console.log(this.displayfullcourses)

  
  
}




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


updateObject() {


  let privateScheduleData = {};
  let publicScheduleData = {};

  for(let i = 0; i<Object.keys(this.scheduleInfoObj).length; i++) {
    if(this.scheduleInfoObj[i].visibility == "private") {
      console.log("appended to private")
      privateScheduleData[Object.keys(this.scheduleInfoObj)[i]] = this.scheduleInfoObj[i];

    }
    else if(this.scheduleInfoObj[i].visibility == "public") {
      console.log("appended to public")
      publicScheduleData[Object.keys(this.scheduleInfoObj)[i]] = this.scheduleInfoObj[i];
    }
    else {
      console.log("visibility is not set")
    }
  }

  this._configservice.postPublicScheduleData(publicScheduleData).subscribe(response => console.log("response"));




}






}