<?

$pg_host = "localhost";
$pg_user = "ershkus_work";
$pg_pass = "56PUHeCr";
$pg_base = "osmru_web";

// def
$lang="ru";

function err404($code=0) {
  header("Status: 404 Not Found");
  include_once '404.php';
  exit();
}

function err500() {
  header("Status: 500 Internal Server Error");
  echo 'Ошибка на сервере.';
  exit();
}


$conn=pg_connect("host='".$pg_host."' user='".$pg_user."' password='".$pg_pass."' dbname='".$pg_base."'") ;// or die(Err500());

function ins_catalog($conn, $lang) {
  function recurs ($conn, $lang, $name='') {
    //if ($end>30) exit();
    //$end=$end+1;
    if ($name=='') {
      $where = 'parent is null';
      $firstclass = ' id="catalog-list" class="sample-menu" ';
    }
    else {
      $where = "'$name'= any(parent)";
      $firstclass = '';
    }
    $result = pg_query($conn, "SELECT \"name\", \"name_$lang\" FROM poi_catalog WHERE $where ORDER BY \"name_$lang\"") ;// or die(Err500());
    //$arr = pg_fetch_all($result);
    //print $arr[0]['name'];
    if (pg_num_rows($result)) {
      print "<ul$firstclass>";
      while ($row = pg_fetch_row($result)) {
        echo "<li><a id=\"c_$row[0]\" href=\"#0\">$row[1]</a>";
        recurs ($conn, $lang, $row[0]);
        echo "</li>";
      }
      print "</ul>";
    }
  }
  recurs ($conn, $lang);
}

function ins_langselect($conn, $lang) {
  
  $result = pg_query($conn, 'SELECT "lang", "name" FROM "poi_lang";') ;// or die(Err500());
  print '<select name="lang" size="1">';
  while ($row = pg_fetch_row($result)) {
    $select="";
    if ($row[0]==$lang) $select="selected";
    print "<option value=\"$row[0]\" $select>$row[1]</option>";
  }
  print '</select>';
}
 ?>
