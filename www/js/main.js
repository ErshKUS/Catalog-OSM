var cat={parent:{}, tags:{}};

$(function(){
  cat.catmenutree();

  var a = $('<a href="#" class="add"></a>');
  a.click(cat.parent.choice);
  $("#fcParent").append(a);

  var a = $('<a href="#" class="add"></a>');
  a.click(cat.tags.add);
  $("#fcTags").append(a);
});

cat.catmenutree = function () {
  $("#leftcontent")
    .jstree({ "plugins" : ["themes","html_data","ui"] })
    // 1) if using the UI plugin bind to select_node
    .bind("select_node.jstree", function (event, data) {
      // `data.rslt.obj` is the jquery extended node that was clicked
      if (cat.parent.newID) {
        cat.parent.newID.text(data.rslt.e.currentTarget.id.substr(2));
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
    for (el in results.data.parent){
      cat.parent.add(results.data.parent[el]);
    }

    $("#fcTags>table>*").remove();
    for (el in results.data.tags[0]){
      cat.tags.add({tkey:results.data.tags[0][el],tvalue:results.data.tags[1][el]});
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
    delete cat.parent.newID;
    $(e).dialog("close");
  }

  $('#dialog-parent').dialog({
    autoOpen: false,
    //width: 600,
    buttons: {
      "Ok": function() {
        if (cat.parent.newID.text()) {
          cat.parent.add(cat.parent.newID.text());
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

cat.parent.add = function(text) {
  var span = $('<span></span>');
  span.text(text);
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