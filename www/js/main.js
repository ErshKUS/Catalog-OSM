var cat={parent:{}, tags:{}, more:{}};

$(function(){
  cat.catmenutree();

  var a = $('<a href="#" class="add"></a>');
  a.click(cat.parent.choice);
  $("#fcParent").append(a);

  var a = $('<a href="#" class="add"></a>');
  a.click(cat.tags.add);
  $("#fcTags").append(a);

  var a = $('<a href="#" class="add"></a>');
  a.click(cat.more.choice);
  $("#fcMore").append(a);

});

cat.catmenutree = function () {
  $("#leftcontent")
    .jstree({ "plugins" : ["themes","html_data","ui"] })
    // 1) if using the UI plugin bind to select_node
    .bind("select_node.jstree", function (event, data) {
      // `data.rslt.obj` is the jquery extended node that was clicked
      if (cat.parent.newID) {
        cat.parent.newID.text(data.rslt.e.currentTarget.text.trim());
        cat.parent.newID.val(data.rslt.e.currentTarget.id.substr(2));
      }
      else {
        $.getJSON('/api/data',
          {action: 'getcatalog',
            name: data.rslt.e.currentTarget.id.substr(2),
            lang: $("#lang>[name=lang]").val()},
          cat.getcatalog)
        .error(cat.getcatalog_err);
      }

    })
    // 2) if not using the UI plugin - the Anchor tags work as expected
    //    so if the anchor has a HREF attirbute - the page will be changed
    //    you can actually prevent the default, etc (normal jquery usage)
    .delegate("a", "click", function (event, data) { event.preventDefault(); })
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
  span.text(text);
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
    //cat.more.newID.val('');
    delete cat.more.newID;
    $(e).dialog("close");
  }

  //var left=parseInt($("#leftpan").css("width"));
  $('#dialog-moretags').dialog({
    autoOpen: false,
    modal: true,
    //position: [left-20,80],
    //width: 600,
    zIndex: 1100,
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
	$('#dialog-moretags').dialog('open');
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