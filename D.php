<?
class D {
	private $addr;
	private $user;
	private $password;
	private $db_name;
	
	public $is_user;
	
	function check_cookie() {
		$is_user = false;
		if ($db = mysqli_connect($this->addr, $this->user, $this->password, $this->db_name)) {
			$em = mysqli_real_escape_string($db, $_COOKIE["e-mail"]);
			$pw = mysqli_real_escape_string($db, $_COOKIE["password"]);
			$qry = "SELECT `e-mail` FROM `users_reg` WHERE `e-mail`=\"" . $em . "\" AND `password`=\"" . $pw . "\"";
			$res = mysqli_query($db, $qry);
			$pole = mysqli_fetch_array($res);
			//print_r($pole);
			$is_user = !!$pole;
			
			mysqli_free_result($res);
			$db->close;
		}
		$this->is_user = $is_user;
	}
	
	function reg_check() {
		if ($db = mysqli_connect($this->addr, $this->user, $this->password, $this->db_name)) {
			$em = mysqli_real_escape_string($db, $_POST["pole1"]);
			$pw = $_POST["pole2"];

			
			if ($_POST["hid_param"]==1) {	//зарегистрироваться
				$pw_hash = password_hash($pw, PASSWORD_DEFAULT);
				$qry = "INSERT INTO `users_reg` (`e-mail`, `password`) VALUES (\"" . $em . "\" , \"" . $pw_hash . "\")";
				$res = mysqli_query($db, $qry);
				
				print_r($res);
				
				if ($res) {
					setcookie ("e-mail", $_POST["pole1"], time()+30*86400);
					setcookie ("password", $pw_hash, time()+30*86400);
					header("Location: /");
				}
				else
					$this->return_to_hp(1);
					
					
				mysqli_free_result($res);
				
				
			}
			else {							//войти
				// $qry = "SELECT (`e-mail`, `password`) FROM `users_reg` WHERE (`e-mail`=\"" . $em . "\" AND `password`=\"" . password_hash($pw, PASSWORD_DEFAULT) . "\")";
				$qry = "SELECT `e-mail`, `password` FROM `users_reg` WHERE `e-mail`=\"" . $em . "\"";
				$res = mysqli_query($db, $qry);
				$pole = mysqli_fetch_array($res);
				mysqli_free_result($res);
				//print_r($pole);

				if (password_verify ($pw, $pole['password'])) {
					setcookie ("e-mail", $_POST["pole1"], time()+30*86400);
					setcookie ("password", $pole["password"], time()+30*86400);
					header("Location: /");
				}
				else {
					$this->return_to_hp(2);
				}
				
				
			}
			
			$db->close;
		}
		else {
			echo "&#1053;&#1077; &#1091;&#1076;&#1072;&#1083;&#1086;&#1089;&#1100; &#1091;&#1089;&#1090;&#1072;&#1085;&#1086;&#1074;&#1080;&#1090;&#1100; &#1087;&#1086;&#1076;&#1082;&#1083;&#1102;&#1095;&#1077;&#1085;&#1080;&#1077; &#1082; &#1073;&#1072;&#1079;&#1077; &#1076;&#1072;&#1085;&#1085;&#1099;&#1093;";
		}
	}
	
	function return_to_hp($id_login_reg) {
		$homepage = file_get_contents("index.php");
		$pos_insert = mb_strrpos($homepage, "<script type=\"text/javascript\" src=\"js/jquery.min.js");
		$homepage1 = mb_substr($homepage, 0, $pos_insert - 1);
		$homepage2 = mb_substr($homepage, $pos_insert);
		$homepage = $homepage1 . "<script type=\"text/javascript\" id=\"addit_scr\">var reg_status = " . $id_login_reg . "; var e_mail_reg = \"" . $_POST["pole1"] . "\";</script>" . $homepage2;
		echo $homepage;
	}
	
	function record() {
		$curr_time = time();
		if ($db = mysqli_connect($this->addr, $this->user, $this->password, $this->db_name)) {
			$em = mysqli_real_escape_string($db, $_COOKIE["e-mail"]);
			$pw = mysqli_real_escape_string($db, $_COOKIE["password"]);
			// $qry = "SELECT `e-mail` FROM `users` WHERE `e-mail`= \"" . $em . "\" AND `password`= \"" . $pw . "\"";
			$qry = "SELECT * FROM `users_reg` WHERE `e-mail`= \"" . $em . "\"";
			@$res = mysqli_query($db, $qry);
			@$pole = mysqli_fetch_array($res);
			mysqli_free_result($res);
			$db->close;
			if ($_COOKIE["password"]==$pole["password"]) {
				$send_date = "logs/" . date('Ymd', $curr_time) . ".json";
				$json_arr = array();
				@$json_str = file_get_contents($send_date, LOCK_SH);
				if (!($json_arr = json_decode($json_str)))
					$json_arr = (object) array();
				for ($i=1;;$i++) {
					if ($json_arr->{$i} == NULL){
						$json_arr->{$i} = array 
						('e-mail' => $em, 'time' => date('d.m.Y H:i:s', $curr_time), 'text' => htmlspecialchars($_POST["send_area"]));
						break;
					}
				}
				$json_str = json_encode($json_arr);
				file_put_contents($send_date, $json_str, LOCK_SH);
			}
			else {
				setcookie ("e-mail", "", 1);
				setcookie ("password", "", 1);
			}
		}
		header("Location: /");
	}
	
	function __construct($addr, $user, $password, $db_name, $action) {
		$this->addr = $addr;
		$this->user = $user;
		$this->password = $password;
		$this->db_name = $db_name;
		if ($action=="reg")
			$this->reg_check();
		elseif ($action=="rec")
			$this->record();
		else
			$this->check_cookie();
	}
}
?>