<table class="courseTable table">
<thead>
  <tr>
    <th>Coures Name</th>
    <th>Start Time</th>
    <th>Teacher</th>
    <th>upNum</th>
  </tr>
</thead>
{{#token}}
<tr data-courseid={{id}}>
  <!--<td>{{place}}</td>-->
  <td>{{courseName}}</td>
  <td>{{startTime}}</td>
  <td>{{teacher}}</td>
  <td>{{upNum}}</td>
</tr>
{{/token}}
</table>
