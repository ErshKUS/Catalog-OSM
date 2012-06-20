<?php
include_once ('include/functions.php');

$action = $_REQUEST["action"];

if ($action == "getcatalog") {
  $ncatalog = @$_REQUEST["name"];
  $langfirst = @$_REQUEST["langfirst"];
  $langsecond = @$_REQUEST["langsecond"];
  if (!(isset($ncatalog) && isset($langfirst) && isset($langsecond))) {
    header("HTTP/1.0 406.1 Data incorrect. Variable is not defined.");
  }
  
  $sqlrequest = "
    SELECT poi_catalog.name, poi_catalog.parent, poi_catalog.tags, poi_catalog.moretags, poi_catalog.poi,
      poi_dict.name as name_f, poi_dict.description as description_f, poi_dict.link as link_f, poi_dict.keywords as keywords_f
    FROM
      poi_catalog,
      poi_dict
    WHERE
      poi_catalog.name='$ncatalog'
      AND poi_catalog.name=poi_dict.item
      AND poi_dict.lang = '$langfirst'
      ;";
  
  $result = pg_query($conn, $sqlrequest) ;// or die(Err500());
 // print_r ((pg_fetch_array($result,NULL,PGSQL_ASSOC)));
  print_r (pg_fetch_row($result,null));
}
/*
//$y='y';
$y2=isset($y)?$y:'y2';
print ($y2);
*/
// error_log("error #01");
/*
$p=array();
$d1=array("foo" => "bar", "test1" => 2);
$p[]=$d1;

print_r (json_decode(json_encode($p),TRUE));
echo "<br>\n";

print ($_REQUEST["action"]);
echo "<br>\n";*/




?>
