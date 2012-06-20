<?php
include_once ('include/functions.php');



/*
function err404($code=0) {
  header("Status: 404 Not Found");
  include_once '404.php';
  exit();
}

function err500() {
  header("Status: 500 Internal Server Error");
  echo 'Ошибка на сервере.';
  exit();
}*/

?>


<html>
  <head>
    <title>Каталог объектов OSM</title>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type">  
    <link type="text/css" href="css/main.css" rel="stylesheet">
    <script type="text/javascript" src="js/jquery.js"></script>
    <script type="text/javascript" src="js/jquery.cookie.js"></script>
    <script type="text/javascript" src="js/jquery.jstree.js"></script>
    <script type="text/javascript" src="js/main.js"></script>
  </head>
  <body>
    <div id="leftpan">
      <div class="header"><h1>Каталог объектов:</h1></div>
      <div id="leftcontent"><?php ins_catalog($conn, $lang); ?></div>
    </div>
    <div id="center">
      <div id="top">
        <div id="lang">
          <?php ins_langselect($conn, $lang); ?>
        </div>
      </div>
      <div id="content">
        <form id="contentform">
          <div>Уникальное имя: <input name="id"></div>
          <div id="fcParent">Категории: </div>
          <div id="fcTags"><table></table></div>
          <div>Выводимое имя: <input name="langname"></div>
          <div>Описание: <input name="langdescription"></div>
          <div>Ссылка подробное описание: <input name="langlink"></div>
          <div>Ключевые слова: <input name="langkeywords"></div>
          <div>Является POI: <input name="poi" type="checkbox"></div>
        </form>
      </div>
    </div>
  </body>
</html>
