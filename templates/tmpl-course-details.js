<div class="row part1">
 <span class="itemTitle span2"><i class="icon-book icon-white"></i>CourseName:</span><span class="itemEditable span10" data-courseid={{id}}>{{courseName}}</span>

 <span class="itemTitle span2"><i class="icon-user icon-white"></i>Teacher:</span><span class="itemEditable span3">{{teacher}}}</span>
 <span class="itemTitle span2"><i class="icon-map-marker icon-white"></i>Place:</span><span class="itemEditable span2">{{place}}</span>
 <span class="span2 iphone_switch iphone_switch_off"></span>
</div>
<div class="row part2" >
  <span class="span12 itemTitle"><i class="icon-heart icon-white"></i>Reason:</span>
  <div class="itemEditable  upReason span9" >
   {{reason}}
  </div>
  <div class="span3">
    <a class="btn edit" href="#"><i class="icon-pencil"></i> Edit</a>
    <a class="btn cancle" href="#"><i class="icon-remove"></i> Cancle</a>
   
  </div>
  {{#progress}}
    <div class="span12 progress progress-info
         progress-striped active">
      <div class="bar"
           style="width:{{width}}%;"></div>
    </div>
    
    <div class="span12 progressDetails">
      {{#progress_comments}}
      <i class="progressComments tooltip icon-chevron-up icon-white" style="left:{{timePoint}}%"  data-original-title="{{comment}}"></i>

      {{/progress_comments}}
    </div>
 
  {{/progress}}
</div>