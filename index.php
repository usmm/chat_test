<html>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<head>
		<title>&#1044;&#1077;&#1084;&#1086;&#1085;&#1089;&#1090;&#1088;&#1072;&#1094;&#1080;&#1086;&#1085;&#1085;&#1099;&#1081; &#1095;&#1072;&#1090;</title>
		<script type="text/javascript" src="js/jquery.min.js"></script>
		<noscript>Ваш браузер не поддерживает Javascript</noscript>
		<script type="text/javascript" src="js/abilities.js"></script>
		<script type="text/javascript" src="js/js.js"></script>
		<link rel="stylesheet" type="text/css" href="style.css">
	</head>
	<body>
		<?require_once('D.php');
		require_once('db_settings.php');
		$d = new D($host, $db_login, $db_pass, $db_name);
		
		?>
		<input type="hidden" id="server_time">
		<ul class="dropdown">
			<li class="dropdown-top" id="m_m" onclick="_d.li_press('dropdown_mm')"> 
				Главное меню 
				<ul class="dropdown-inside" id="dropdown_mm">
					<li><a href="/">На главную</a></li> 
					<!--<li onclick="_d.about_project()">О проекте</li>-->
				</ul> 
			</li> 
			<li class="dropdown-top" id="pr" onclick="_d.li_press('dropdown_pr')"> 
				Профиль 
				<ul class="dropdown-inside" id="dropdown_pr">
					<?if ($d->is_user){?>
					<li id="menu_ent_exit" onclick="_d.exit()">Выход</li> 
					
					<?}else{?>
					<li id="menu_ent_exit" onclick="_d.reg_or_enter_click(0)">Вход</li> 
					<li id="regist" onclick="_d.reg_or_enter_click(1)">Регистрация</li>
					<?}?>
				</ul>
			</li>
		</ul>
		<br/>
		<br/>
		<div class="user_chat" id="regdiv">
			<?if ($d->is_user){?>
			Вы зашли как <?=$_COOKIE["e-mail"]?>
			<input type='button' class='refr_button' id='refr_button' value='Обновить' onclick='_d.refresh()'>
			<br>
			<input type='button' value='Написать сообщение' onclick='_d.open_send_msg()'>
			<?}?>
		</div>
	</body>
</html>	