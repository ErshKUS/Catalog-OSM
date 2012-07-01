var cat={parent:{}, tags:{}, more:{}, form:{}};

$(function(){
  cat.catmenutree();

  $('#lang>select').change(cat.changelang);

  var a = $('<a href="#" class="add"></a>');
  a.click(cat.parent.choice);
  $("#fcParent").append(a);

  var a = $('<a href="#" class="add"></a>');
  a.click(cat.tags.add);
  $("#fcTags").append(a);

  var a = $('<a href="#" class="add"></a>');
  a.click(cat.more.choice);
  $("#fcMore").append(a);

  $("#fcButton>input").button();

  $("#contentform").submit(cat.form.submit);

});

cat.form.submit = function() {
  $("#fcError").addClass('hide');
  id=$("#fcId [name=id]").val();
  if (id=='') {
    cat.form.suberr("не указано '"+$("#fcId").text()+"'");
    return false;
  }

  $.getJSON('/api/data',
    {action: 'setcatalog',
      lang: $("#lang>[name=lang]").val(),
      name: id,
      langname: $("#contentform [name=langname]").val(),
      langdescription: $("#contentform [name=langdescription]").val(),
      langlink: $("#contentform [name=langlink]").val(),
      langkeywords: $("#contentform [name=langkeywords]").val(),
      poi: $("#contentform [name=poi]").val()
    },
    function(results){
      if (results.error) {
        cat.form.suberr('Ошибка: ' + results.error);
      }
      else {}
      })
  .error(function(jqXHR, textStatus, errorThrown){
    cat.form.suberr ('Ошибка: ' + textStatus + '<br />' + errorThrown.message);
  });
  return false;
}

cat.form.suberr = function(message) {
  $("#fcError").text(message);
  $("#fcError").removeClass('hide');
}

cat.changelang = function() {
  var lang = $("#lang>[name=lang]").val()
  cat.catmenutree();
  $("#more_grid").jqGrid('setGridParam', {
      datatype:'json',
      url:'http://ersh.homelinux.com:8091/api/data?action=getmore&lang='+$("#lang>[name=lang]").val()
    }).trigger('reloadGrid');
}

cat.catmenutree = function () {
  $("#leftcontent")
    .jstree({
      "plugins" : ["themes", "json_data", "ui"],
      "json_data" : {
        "ajax" : {
          "type": 'GET',
          "url": function (node) {
              var nodeId = "";
              var url = "http://ersh.homelinux.com:8091/api/data?action=gettree&lang="+$("#lang>[name=lang]").val()+"&name=";
              if (node != -1){
                  url = url + node.attr('id');
              }
              return url;
          },
          "success": function (new_data) {
            var data=[];
            for (i in new_data.data){
              var name = new_data.data[i].name || '('+new_data.data[i].id+')'
              data.push({data: name, attr:{id: new_data.data[i].id}, state: "closed"});
            }
            return data;
          }
        }
      }
    })
    .bind("select_node.jstree", function (event, data) {
      if (cat.parent.newID) {
        cat.parent.newID.text(data.rslt.e.currentTarget.text.trim());
        cat.parent.newID.val(data.rslt.e.currentTarget.id.substr(2));
      }
      else {
        $.getJSON('/api/data',
          {action: 'getcatalog',
            name: data.rslt.obj.attr("id"),
            lang: $("#lang>[name=lang]").val()},
          cat.getcatalog)
        .error(cat.getcatalog_err);
      }

    })
}

cat.getcatalog = function(results) {
  if (results.error) {
    alert('Ошибка: ' + results.error);
  }
  else {
    var form = $("#contentform")[0].elements;
    for (var i=0; i<$("#contentform")[0].elements.length; i++) {
      switch (form[i].type) {
        case "text":
          form[i].value=results.data[form[i].name];
          break;
        case "checkbox":
          form[i].checked=results.data[form[i].name];
          break;
      }
    }
    $("#fcParent>span").remove();
    for (el in results.data.parent[0]){
      cat.parent.add(results.data.parent[0][el], results.data.parent[1][el]);
    }
    $("#fcTags>table>*").remove();
    for (el in results.data.tags[0]){
      cat.tags.add({tkey:results.data.tags[0][el],tvalue:results.data.tags[1][el]});
    }
    $("#fcMore>table>*").remove();
    for (el in results.data.moretags){
      cat.more.add({tid:results.data.moretags[el]});
    }

  }
}

cat.getcatalog_err = function(jqXHR, textStatus, errorThrown) {
  alert('Ошибка: ' + textStatus + '<br />' + errorThrown.message);
}

cat.parent.choice = function(e) {
  cat.parent.newID=$('#dialog-parent>p>span');

  closethis = function(e){
    cat.parent.newID.text('');
    cat.parent.newID.val('');
    delete cat.parent.newID;
    $(e).dialog("close");
  }

  var left=parseInt($("#leftpan").css("width"));
  $('#dialog-parent').dialog({
    autoOpen: false,
    modal: true,
    position: [left-20,80],
    //width: 600,
    buttons: {
      "Ok": function() {
        if (cat.parent.newID.text()) {
          cat.parent.add(cat.parent.newID.val(), cat.parent.newID.text());
        }
        closethis(this);
      },
      "Cancel": function() {
        closethis(this);
      }
    }
  });
	$('#dialog-parent').dialog('open');
}

cat.parent.add = function(val, text) {
  var span = $('<span></span>');
  span.text(text || '('+val+')');
  span.val(val);
  var a = $('<a href="#" class="delcat"></a>');
  a.click(function(){ $(this.parentNode).remove(); });
  span.append(a);
  $("#fcParent>a").before(span);
}

cat.tags.add = function(tag) {
  var key = tag.tkey || '';
  var value = tag.tvalue || '';
  var ins = $('<tr><td><input class="tagkey"></td><td>&nbsp;=&nbsp;</td><td><input class="tagvalue"></td><td><a href="#" class="del"></a></td></tr>');
  $('.tagkey', ins).val(key);
  $('.tagvalue', ins).val(value);
  $('a', ins).click(function(){ $(this.parentNode.parentNode).remove(); });
  $('#fcTags>table').append(ins);
}

cat.more.choice = function(e) {
  cat.more.newID=$('#dialog-moretags>p>span');

  closethis = function(e){
    cat.more.newID.text('');
    delete cat.more.newID;
    $(e).dialog("close");
  }


  $("#more_grid").jqGrid({
      url:'http://ersh.homelinux.com:8091/api/data?action=getmore&lang='+$("#lang>[name=lang]").val(),
      datatype: "json",
      mtype: "POST",
      colNames:['','ID','Name','Type','Class','Description','Link (url)','Keywords'],
      colModel:[
        {name:'check', index:'check', width:15, editable:false, search:true, edittype:'checkbox', editoptions:{value:"True:False"}, formatter:"checkbox", formatoptions:{disabled:false}},
        {name:'id', index:'id', width:55, editable:true},
        {name:'name', index:'name asc', width:120, editable:true},
        {name:'type', index:'type', width:120, editable:true},
        {name:'class', index:'class', width:120, editable:true},
        {name:'description', index:'description', width:120, editable:true, edittype:"textarea", editoptions:{rows:"2", cols:"20"}},
        {name:'link', index:'link', width:120,editable:true},
        {name:'keywords', index:'keywords', width:120,editable:true}
     ],
      rowNum:10,
      width: 780,
      rowList:[10,50],
      pager: '#more_pager',
      sortname: 'id',
      ignoreCase: true,
      loadonce: true,
      height: 200,
      viewrecords: true,
      modal: false,
      jsonReader: { repeatitems: false },
      editurl:"http://ersh.homelinux.com:8091/api/data?action=editmore&lang="+$("#lang>[name=lang]").val(),
      sortorder: "desc",
      loadComplete: function(){
        $('#more_grid [aria-describedby=more_grid_check]>input').change(function(){
          $("#more_grid").jqGrid().setRowData(
            $(this).closest('tr').attr('id'),
            {check:this.checked}
          )
        })
      },
      beforeSelectRow: function(rowid) {
        $("#moreval_grid").jqGrid(
          'setGridParam',{
          url:'http://ersh.homelinux.com:8091/api/data?action=getmoreval&lang='+$("#lang>[name=lang]").val()+'&class='+$("#more_grid").jqGrid('getRowData',rowid).class,
          editurl:'http://ersh.homelinux.com:8091/api/data?action=setmoreval&lang='+$("#lang>[name=lang]").val()+'&class='+$("#more_grid").jqGrid('getRowData',rowid).class,
          datatype:'json'
        }).trigger("reloadGrid");
        $('#gbox_moreval_grid').removeClass('hide');
        return true;
      }
      //subGrid: true,
      //subGrid: {repeatitems: false},
      //subGridOptions: {repeatitems: false},
      //subGridUrl: 'http://ersh.homelinux.com:8091/api/data?action=getmoreval&lang='+$("#lang>[name=lang]").val(),
      //subGridModel: [{
      //  name:['value','name'],
      //  width:[80,80],
      //  params:['class']
      //}]
  });
  $("#more_grid").jqGrid('navGrid','#more_pager',
    {edit:true,add:true,del:false,search:false,refresh:false},
    { //edit
      closeAfterAdd : true, clearAfterAdd : false,
      afterSubmit: function (response, postdata) {
        $(this).jqGrid('setGridParam', {datatype:'json'});
        return [true,'']; // no error
      }
    },
    { //add
      closeAfterAdd : true, clearAfterAdd : false,
      afterSubmit: function (response, postdata) {
        var success = true;
        var message = ""
        var json = eval('(' + response.responseText + ')');
        if(json.errors) {
          success = false;
          for(i=0; i < json.errors.length; i++) {
            message += json.errors[i] + '<br/>';
          }
        }
        if(json.error) {
          success = false;
          message +=json.error;
        }
        var new_id = "1";
        $(this).jqGrid('setGridParam', {datatype:'json'});
        return [success,message,new_id];
      }
    }
  );
  $("#more_grid").jqGrid('filterToolbar',{searchOnEnter:false,defaultSearch:'cn'});


  $("#moreval_grid").jqGrid({
      //url:'http://ersh.homelinux.com:8091/api/data?action=getmoreval&class=second_hand&lang='+$("#lang>[name=lang]").val(),
      url:'http://ersh.homelinux.com:8091/api/data?action=getmoreval&lang='+$("#lang>[name=lang]").val(),
      datatype: "json",
      mtype: "POST",
      colNames:['Value', 'Name',''],
      colModel:[
        {name:'value', index:'value', width:100, editable:true, sortable:false},
        {name:'name', index:'name', width:100, editable:true, sortable:false},
        {name:'id_dict', index:'id_dict', hidden:true, key:true}
     ],
      //rowNum:10,
      width: 780,
      height: 100,
      pgbuttons: false,
      pginput: false,
      viewrecords: true,
      //rowList:[10,50],
      pager: '#moreval_pager',
      //sortable:false,
      //sortname: 'value',
      ignoreCase: true,
      //loadonce: true,
      viewrecords: true,
      modal: false,
      jsonReader: { repeatitems: false },
      editurl:"http://ersh.homelinux.com:8091/api/data?action=editmorevar&lang="+$("#lang>[name=lang]").val(),
      //sortorder: "desc",
  });
  $("#moreval_grid").jqGrid('navGrid','#moreval_pager',
    {edit:true,add:true,del:false,search:false,refresh:false},
    { //edit
      //closeAfterAdd : true, clearAfterAdd : false,
      afterSubmit: function (response, postdata) {
        var success = true;
        var message = ""
        var json = eval('(' + response.responseText + ')');
        if(json.errors) {
          success = false;
          for(i=0; i < json.errors.length; i++) {
            message += json.errors[i] + '<br/>';
          }
        }
        if(json.error) {
          success = false;
          message +=json.error;
        }
        return [success,message];
      }
    },
    { //add
      //closeAfterAdd : true, clearAfterAdd : false,
      afterSubmit: function (response, postdata) {
        var success = true;
        var message = ""
        var json = eval('(' + response.responseText + ')');
        if(json.errors) {
          success = false;
          for(i=0; i < json.errors.length; i++) {
            message += json.errors[i] + '<br/>';
          }
        }
        if(json.error) {
          success = false;
          message +=json.error;
        }
        var new_id = "1";
        return [success,message,new_id];
      }
    }
  );


  $('#dialog-moretags').dialog({
    autoOpen: false,
    modal: true,
    //position: [left-20,80],
    width: 800,
    zIndex: 1100,
    buttons: {
      "Ok": function() {
        var check = false;
        var pData = $("#more_grid").jqGrid('getRowData');
        for (i in pData) {
          if (pData[i].check=='True') {
            check = true;
            cat.more.add({tid:pData[i].id,tname:pData[i].name});
          }
        }
        if (check)
          closethis(this);
      },
      "Cancel": function() {
        closethis(this);
      }
    }
  });

	$('#dialog-moretags').dialog('open');
  $('#gbox_moreval_grid').addClass('hide');
}

cat.more.add = function(more) {
  var id = more.tid || '';
  var name = more.tname || '';
  var ins = $('<tr><td class="moreid"></td><td class="morename"></td><td><a href="#" class="del"></a></td></tr>');
  $('.moreid', ins).text(id);
  $('.morename', ins).text(name);
  $('a', ins).click(function(){ $(this.parentNode.parentNode).remove(); });
  $('#fcMore>table').append(ins);
}