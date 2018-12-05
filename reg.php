<?php

	/*function generateRandomString($length = 60) {
		$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$.';
		$charactersLength = strlen($characters);
		$randomString = '';
		for ($i = 0; $i < $length; $i++) {
			$randomString .= $characters[rand(0, $charactersLength - 1)];
		}
		return $randomString;
	}
	
	function alternative_encode($word, $key, $is_and = true){
		$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$.';
		for ($i=0;$i<strlen($word);$i++) {
			$w_pos = strpos($characters,substr($word, $i, 1));
			$k_pos = strpos($characters,substr($key, $i, 1));
			if ($is_and)
				$r_pos = $w_pos & $k_pos;
			else
				$r_pos = $w_pos | $k_pos;
			$res .= substr($characters, $r_pos, 1);
		}
		return $res;
	}*/
	require_once('D.php');
	require_once('db_settings.php');
	$d = new D($host, $db_login, $db_pass, $db_name);	
	
?>