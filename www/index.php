<?php
include_once ('include/functions.php');
?>

<html>
  <head>
    <title>Каталог объектов OSM</title>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type">
    <link type="text/css" href="css/main.css" rel="stylesheet" />
    <link type="text/css" href="css/ui-lightness/jquery-ui-1.8.21.custom.css" rel="stylesheet" />
    <link type="text/css" href="css/ui.jqgrid.css" rel="stylesheet" />
    <script type="text/javascript" src="js/jquery.js"></script>
    <script type="text/javascript" src="js/jquery.cookie.js"></script>
    <script type="text/javascript" src="js/jquery.jstree.js"></script>
    <script type="text/javascript" src="js/jquery-ui-1.8.21.custom.min.js"></script>
    <script type="text/javascript" src="js/main.js"></script>
    <script type="text/javascript" src="js/i18n/grid.locale-ru.js"></script>
    <script type="text/javascript" src="js/jquery.jqgrid.min.js"></script>
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
          <div id="fcTags">Теги: <table></table></div>
          <div>Выводимое имя: <input name="langname"></div>
          <div>Описание: <input name="langdescription"></div>
          <div>Ссылка подробное описание: <input name="langlink"></div>
          <div>Ключевые слова: <input name="langkeywords"></div>
          <div>Является POI: <input name="poi" type="checkbox"></div>
          <div id="fcMore">Свойства: <table></table></div>
        </form>
      </div>
    </div>
    <div style="display: none;">
      <div id="dialog-parent" title="<- Выбор категории">
        <p>Выбран: <span></span></p>
      </div>
      <div id="dialog-moretags" title="Выбор информационных тегов">
        <p>Выбран: <span></span></p>
      </div>
    </div>
  </body>
</html>
