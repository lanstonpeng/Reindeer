<div class="row part1">
 <span class="itemTitle span2"><i class="icon-book icon-white"></i>CourseName:</span><span class="span10">{{courseName}}</span>

 <span class="itemTitle span2"><i class="icon-user icon-white"></i>Teacher:</span><span class="span3">{{teacher}}}</span>
 <span class="itemTitle span2"><i class="icon-map-marker icon-white"></i>Place:</span><span class="span2">{{place}}</span>
 <span class="span2 iphone_switch iphone_switch_off"></span>
</div>
<div class="row part2" >
  <span class="span12 itemTitle"><i class="icon-heart icon-white"></i>Reason:</span>
  <div class="upReason span9" contenteditable>
   {{reason}}
  </div>
  <div class="span3">
    <a class="btn edit" href="#"><i class="icon-pencil"></i> Edit</a>
    <a class="btn cancle" href="#"><i class="icon-remove"></i> Cancle</a>
  </div>
  <div class="span12 progress progress-info
       progress-striped active">
    <div class="bar"
         style="width: 0%;"></div>
  </div>
  <div class="span12 progressDetails">
    <i id="tooltip" class="icon-chevron-up icon-white"></i>
  </div>
</div>