{{#token}}
<div data-reviewid={{id}}  class="span3"  >
  <div class="userName"><i class="icon-user icon-white "></i>{{userName}} :</div>
  <div class="content"><i class="icon-comment icon-white"></i>:
        {{content}}
        <div class="reviewVote">
        <i class="icon-arrow-up icon-white" style="display:{{display}}"></i><span>{{upNum}}</span>
        <i class="icon-arrow-down icon-white" style="display:{{display}}"></i><span>{{downNum}}</span>
      </div>
  </div>
</div>
{{/token}}