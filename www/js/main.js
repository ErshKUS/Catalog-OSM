var cat={parent:{}};

$(function(){
  cat.catmenutree();
  
  var a = $('<a href="#" class="newcat"></a>');
  a.click(cat.parent.choice);
  $("#fcParent").append(a);
});

cat.catmenutree = function () {
  $("#leftcontent")
    .jstree({ "plugins" : ["themes","html_data","ui"] })
    // 1) if using the UI plugin bind to select_node
    .bind("select_node.jstree", function (event, data) { 
      // `data.rslt.obj` is the jquery extended node that was clicked
      if (cat.rAddID) {
        cat.rAddID.text(data.rslt.e.currentTarget.id.substr(2));
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
    
  }
}

cat.getcatalog_err = function(jqXHR, textStatus, errorThrown) {
  alert('Ошибка: ' + textStatus + '<br />' + errorThrown.message);
}

cat.parent.choice = function(e) {
  $('#top').addClass('hiden');
  $('#content').addClass('hiden');
  var rDiv = $('<div id="rnewcat"></div>');
  
  removethis = function() {
    $('#top').removeClass('hiden');
    $('#content').removeClass('hiden');
    delete cat.rAddID;
    rDiv.remove();
  }
  
  rDiv.text('Выбран: ');
  cat.rAddID=$('<span></span>');
  rDiv.append(cat.rAddID);
  var aApply = $('<a href="#" class="buttonApply"></a>');
  aApply.click(function(){
    if (!cat.rAddID.text()) return;
    cat.parent.add(cat.rAddID.text());
    removethis();
  });
  rDiv.append(aApply);
  var aCancel = $('<a href="#" class="buttonCancel"></a>');
  aCancel.click(function(){ removethis(); });
  rDiv.append(aCancel);
  $("#center").append(rDiv);
}

cat.parent.add = function(text) {
  var span = $('<span></span>');
  span.text(text);
  var a = $('<a href="#" class="delcat"></a>');
  a.click(function(){ $(this.parentNode).remove(); });
  span.append(a);
  $("#fcParent>a").before(span);
}
