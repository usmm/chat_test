<?
while (true){
	$t_now_unix = time();
	if ($t_now_unix>$t_unix || !$t_unix) {	//повторять поиск "новинок" только раз в секунду
		$t_unix = $t_now_unix;
		$t_now = date('Ymd', time());
		$arFiles = scandir($_SERVER['DOCUMENT_ROOT'].'/logs');
		$arDates = array();
		$content='';
		$new_date = substr($arFiles[count($arFiles)-1],0,8);
		for ($i=count($arFiles)-1;$i>=0; $i--) {
			$t = substr($arFiles[$i],0,8);
			$arFileContent = array();
			if ($t>$_POST['date']) {	//открываем файл за новый день
				$fileContent = file_get_contents($_SERVER['DOCUMENT_ROOT'].'/logs/'.$arFiles[$i]);
				$content = "\"".$t."\":".$fileContent . $content;
				$arFileContent = json_decode($fileContent, true);
				// $content[$t] = json_decode(file_get_contents($_SERVER['DOCUMENT_ROOT'].'/logs/'.$arFiles[$i]));
			}
			elseif ($t==$_POST['date']) {	//открываем файл за текущий день 
				$subContent = "";
				$arFileContent = json_decode(file_get_contents($_SERVER['DOCUMENT_ROOT'].'/logs/'.$arFiles[$i]), true);
				for ($i=1;$i<=count($arFileContent)-$_POST['count'];$i++){
					$subContent .= "\"".$i."\":".json_encode($arFileContent[$_POST['count']+$i]).($subContent ? "," : NULL);
				}
				if (count($arFileContent)>$_POST['count'])
					$content = "\"".$t."\":{".$subContent."}" . $content;
			}
			if ($t==$new_date) {
				$new_count = count($arFileContent);
			}
		}
		if (!!$content) {
			echo '{"content":{'.$content.'},"new-info":{"date":"' . $new_date . '","count":"' . $new_count . '"}}';
			break;
		}
	}
}
?>