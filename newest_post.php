<?
	$t = time();
	//print_r($_COOKIE);
	$arFiles = scandir($_SERVER['DOCUMENT_ROOT'].'/logs');
	$arDates = array();
	$t = $_REQUEST['time'] ? $_REQUEST['time'] : date('Ymd', $t);
	for ($i=count($arFiles)-1;$i>=0; $i--)
		if (substr($arFiles[$i],0,8)<=$t) {
			$t = substr($arFiles[$i],0,8);
			$content = file_get_contents($_SERVER['DOCUMENT_ROOT'].'/logs/'.$arFiles[$i]);
			break;
		}
	echo "{\"date\":".$t.",\"content\":".$content."}";
			
?>