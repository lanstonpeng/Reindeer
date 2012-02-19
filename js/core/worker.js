/*
The webworker is trying to get the whole course Table from the server sliently
*/
self.addEventListener('message',function(){
    

    importScripts('Functionality.js')
    importScripts('pangTingController.js')


var xhr=new XMLHttpRequest(),damn

xhr.open("get","http://localhost:3000/courses/all/1",true);



xhr.onload=function(e){
    if(this.status=200){
        damn=this.response
        
    self.postMessage(damn);
        }
    
    }
xhr.send();


},false);
