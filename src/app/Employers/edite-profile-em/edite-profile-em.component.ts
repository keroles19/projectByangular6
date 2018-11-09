import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { country } from 'src/app/Country_Fields';
import * as $ from 'jquery';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { UploadFilesService } from 'src/app/services/upload-files.service';
import { Employers } from '../Employer.interface';

@Component({
  selector: 'app-edite-profile-em',
  templateUrl: './edite-profile-em.component.html',
  styleUrls: ['./edite-profile-em.component.css']
})
export class EditeProfileEmComponent implements OnInit {

  country :object[];
  userInfo:Employers;
  length = 0 ;
  uId:string;
  checked: boolean = false;
  fileuploaded = null;
  imageUrl = null;
  status = false;

  /* country: object[];
  storage = firebase.storage();
  imageurl = '../../assets/images/spinner-4.gif';
  dataInfo: { [k: string]: any } = {};
  checked: boolean = false;
  fileuploaded: File = null;
  private basePath = 'userProfiles/';
  private storgaeRef = firebase.storage().ref();  */

  constructor(private fire:AngularFireAuth,private db:AngularFireDatabase,private fileService:UploadFilesService, private service:UsersService,private flashMessage:FlashMessagesService) { 
  
    this.fire.auth.signInWithEmailAndPassword('kerolesatef1@gmail.com','123456');


  } 
    /*
    // will be removed 
    firebase.auth().signInWithEmailAndPassword('kerolesatef200@gmail.com', '123456');

    //   get data from firebase
    let getDataFromFirebase = new Promise(() => {
      var dataUsers = firebase.database().ref('users/Employer/aho5Ek1IIudt30MhQO2AOkPRsN13'); //firebase.auth().currentUser.uid
      dataUsers.on('value', snapshot => {
        for (let item in snapshot.val()) {
          this.dataInfo[item] = snapshot.val()[item];
        }
      })

    }).then(()=>{
      
    });
         // get user profile from firebase storage
           this.storgaeRef.child(this.basePath + '404.png').getDownloadURL().then(function (url) {
           if(!url.error)
           {
          $('#image').attr('src', url);
           }
           else{
            let i='https://firebasestorage.googleapis.com/v0/b/final-57b26.appspot.com/o/profile.png?alt=media&token=4b0bf86e-3257-41d1-8d9e-67c7b54a9deb';
          $('#image').attr('src',i)}

    });
  
   */
   

    // jquery
    // $(document).ready(function () {
    //   $(".one").hover(function () {
    //     $(".two").show();
    //   });
    // });




    ngOnInit() {
      // show info 
    this.country = country;
    setTimeout(()=>{
      this.uId = this.fire.auth.currentUser.uid;
      this.service.getUserById(this.uId).subscribe(arg =>{this.userInfo = {...arg};
        this.length  =   Object.keys(this.userInfo).length;
        this.fileService.getImageProfile(arg.imageProfile).then((url)=>{
          this.imageUrl = url;
          this.status = true;
     })
      });
       
      
      

      // .catch((error)=>{
      //   // $('#image').attr('src','https://firebasestorage.googleapis.com/v0/b/final-57b26.appspot.com/o/userProfiles%2Fbusy-glassware-job-266141.jpg?alt=media&token=a2b9e6e0-bae0-49be-bf33-45fff719ba55');
      //  this.imageUrl = 'https://firebasestorage.googleapis.com/v0/b/final-57b26.appspot.com/o/userProfiles%2Fbusy-glassware-job-266141.jpg?alt=media&token=a2b9e6e0-bae0-49be-bf33-45fff719ba55';
      // });
     
    },8000)
   
    
  }



 // valid password in modal or not 
 checkpassword(oldPasswoed) {

  console.log(oldPasswoed);
  if (oldPasswoed !== this.userInfo.password) {
    alert();
    this.flashMessage.show("old password isn't correct :(  please enter old correct password  ", {  timeout: '3000' });
  }
  else {
    this.checked = true;
    oldPasswoed = '';
  }
}

   // reset password  ( in modal )
resetPassword(password) {
  if (this.checked === true) {
      
    this.service.resetPasssword(this.uId , password).then(()=>{
      this.flashMessage.show('changed password', {  timeout: '3000' });
      this.checked = false;
      $('.content').hide();
      $('.alert-success').show();
      $('.modal-body input').attr('value', '');
    }).catch(error=>{
      this.flashMessage.show(' please try again '+ error.message, {  timeout: '3000' });
    })
  }
  else {
    alert("old password isn't correct :(  please enter old  password firstly  ");
  }

}




       // update info
       updateInfo({value , valid} : {value:Employers , valid:boolean })
       {
     
         if(valid)
         {
           $('#btn-sub').attr('disabled','disabled');
           this.db.list('users/').update(this.uId,{
            companyName:this.userInfo.companyName,
            Country:this.userInfo.Country,
            webSite:this.userInfo.webSite,
            facbookGroub:this.userInfo.facbookGroub,
            Manager:this.userInfo.Manager,
            phone:this.userInfo.phone
         }
           ).then(()=>{
             window.scrollTo(0,0);
             this.flashMessage.show( 'updated successfuly' ,  {  timeout: '3000' });
           }).catch((error)=>{
             this.flashMessage.show( error + 'please try again' ,  {  timeout: '3000' });
             $('#btn-sub').removeAttr('disabled');
           })
          
       }
         else{
           this.flashMessage.show('please enter correct date  :( ' ,  {  timeout: '3000' });
     
         }
       }
       
     
       
       // change  profile 
       fileChanged(file: FileList) {
         this.fileuploaded = file.item(0);
         if (this.fileuploaded.size / 1048576 > 2) {
           console.log(file.item(0).type);
           this.flashMessage.show('image size larger than 1mgb or invalid type' , { cssClass: 'alert-warning', timeout: 2000 });
         }
         else {
           var reader = new FileReader();
           reader.onload = (event: any) => {
             $('#image').attr('src', event.target.result);
             // $(".two").hide();
             $(".btn-save-pic").show();
           }
           reader.readAsDataURL(this.fileuploaded);
         }
       }
     
       //uplaod prfile 
     
       uploadPic()
       {
         if(this.fileuploaded !== null)
         { 
           let imageName = Math.ceil(Math.random() * 10000).toString(2);
           $('save').attr('disabled','disabled');
           this.fileService.uploadFile1(this.fileuploaded,imageName).then(() => {
             this.db.list('users/').update(this.uId,{
               imageProfile:imageName
              
           });
           this.flashMessage.show('Done (: Image profile has set' , { cssClass: 'alert-warning', timeout: 2000 });
           })
             .catch(() => {
               this.flashMessage.show('image profile  not set please  try again' , { cssClass: 'alert-warning', timeout: 2000 });
               $('save').removeAttr('disabled')
             });
         }
         //  else
         // {
         //   console.log('2' , this.imageUrl);
         //   this.fileService.deletProfile(this.uId).then(()=>{
         //     this.fileService.uploadFile1(this.uId,this.fileuploaded);
         //     this.flashMessage.show('Done (: Image profile has set' , { cssClass: 'alert-warning', timeout: 2000 });
         //   }).catch(()=>{
         //     this.flashMessage.show('image profile  not set please  try again' , { cssClass: 'alert-warning', timeout: 2000 });
         //   })
         // }
       }





  /*
  // valid password in modal or not 
  checkpassword(oldPasswoed) {

    console.log(oldPasswoed);
    if (oldPasswoed !== this.dataInfo.password) {
      alert("old password isn't correct :(  please enter old correct password  ");
    }
    else {
      this.checked = true;
      oldPasswoed = '';
    }
  }
  // reset password  ( in modal )
  resetPassword(password) {
    if (this.checked === true) {
      firebase.auth().currentUser.updatePassword(password).then(sucess => {
        this.dataInfo.password = password;
        this.checked = false;
        $('.content').hide();
        $('.alert-success').show();
        $('.modal-body input').attr('value', '');
      }).catch(error => {
        alert("OPS!   please try again " + error.Message);
      })
    }
    else {
      alert("old password isn't correct :(  please enter old  password firstly  ");
    }

  }



  // change  profile 
  fileChanged(file: FileList) {
    this.fileuploaded = file.item(0);
    if (this.fileuploaded.size / 1048576 > 2) {
      alert("image size larger than 1mgb");
      // this.flashMessage.show('image size larger than 1mgb' , { cssClass: 'alert-warning', timeout: 2000 });
    }
    else {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        // $('image').attr('src', event.target.result);
        this.imageurl = event.target.result;
        $(".two").hide();
        $(".btn-save-pic").show();
      }
      reader.readAsDataURL(this.fileuploaded);
    }
  }

  // uplaod prfile 
  async uploadPic() {

    if (this.fileuploaded !== null) {
      await new Promise(() => { this.uploadFiles.updateFile(this.dataInfo.logo, this.fileuploaded, firebase.auth().currentUser.uid); });
      this.dataInfo.logo = this.fileuploaded.name;
    }
  }
  // update  all information for user
  onUpdate() {

    // this.usersServices.updateInfo('Employer', this.dataInfo,'aho5Ek1IIudt30MhQO2AOkPRsN13');//firebase.auth().currentUser.uid

    console.log(this.dataInfo);
  }



*/
}