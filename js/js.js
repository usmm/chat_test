class D {
	
	constructor() {
		this.dt;
		this.dt0;
		this.curDayPostsCount;
		this.autent;
		this.status_day = document.createElement("div");
		this.status_day.setAttribute("class", "day_posts");
		this.load_time();
	}

	menus_non_pressed() {
		document.getElementById("dropdown_mm").setAttribute("class", "dropdown-inside");
		document.getElementById("dropdown_pr").setAttribute("class", "dropdown-inside");
		event.stopPropagation();
	}

	/*about_project(){
		$("#regdiv").html(about_me);
		this.menus_non_pressed();
	}*/

	longpolling(){
		var _t=this;
		var jqxhr_chat_count = $.ajax ({
			url: "longpolling.php",
			method: 'post',
			data: {'date': _t.dt0, 'count': _t.curDayPostsCount},
			dataType: "JSON",
		});
		var d0 = document.getElementById("regdiv");
		jqxhr_chat_count.done (function(data){
			_t.dt0 = data["new-info"]["date"];
			_t.curDayPostsCount = data["new-info"]["count"];
			$.each(data["content"],function(i,v){
				d0.insertBefore(_t.form_day_post(v,i), document.getElementsByClassName('day_posts')[0]);
			});
			_t.longpolling();
		});
		jqxhr_chat_count.fail (function(data){
			_t.longpolling();
		});
	}
	
	load_time() {
		var _t=this;
		var jqxhr_time = $.ajax ({
			url: "time.php",
			dataType: "text"
		});
		jqxhr_time.done (function(data){
			_t.dt = new Date(Number(data));
			_t.reg_check();
		});
	}

	li_press(dropdown) {
		var m=document.getElementById(dropdown);
		switch (dropdown) {
			case "dropdown_mm": 
				var n = document.getElementById("dropdown_pr");
				break;
			case "dropdown_pr": var n = document.getElementById("dropdown_mm");
		}
		n.setAttribute ("class", "dropdown-inside");
		switch (m.getAttribute("class")) {
			case "dropdown-inside": 
				m.setAttribute("class", "dropdown-inside pressed");
				break;
			case "dropdown-inside pressed" : m.setAttribute("class", "dropdown-inside");
		}
		
	}

	date_to_json(dt = this.dt){
		var mn = dt.getMonth() + 1; // Январь это 0
		var dte = dt.getDate();
		if (mn<10) mn = "0" + mn;
		if (dte<10) dte= "0" + dte;	//добавление нулей к дню и месяцу
		return + dt.getFullYear() + (mn + (dte + ""));	//запись в формате YYYYMMDD в виде строки
	}

	json_to_date(json_date){
		json_date +='';
		this.dt = new Date(json_date.substring(0,4) + ' ' + json_date.substring(4,6) + ' ' + json_date.substring(6,8));
	}

	fully_replace(str, substr1, substr2){		//замена ВСЕХ подстрок substr1 на substr2
		for (var j=0;;j++) {
			if (str == str.replace(substr1,substr2)){
				str = str.replace(substr1,substr2);
				break;
			}
			else str = str.replace(substr1,substr2);
		}
		return str;
	}

	add_post_day(day) {
		var _t = this;
		var d0 = document.getElementById("regdiv");
		_t.status_day.innerHTML='&#1079;&#1072;&#1075;&#1088;&#1091;&#1078;&#1072;&#1102;&#1090;&#1089;&#1103; &#1076;&#1072;&#1085;&#1085;&#1099;&#1077; &#1079;&#1072; ' + day;
		d0.appendChild(_t.status_day);
		var jqxhr = $.ajax ({
			url: "newest_post.php",
			method : "POST",
			data: {'time' : day},
			dataType: "JSON",
			global: false
		});
		jqxhr.done(function(data){
			if (data["content"]) {
				var d1 = _t.form_day_post(data["content"], data["date"]);						
				_t.json_to_date(data["date"]);
				bt = $('input#show_more');
				if (!_t.dt0) {
					_t.dt0 = data["date"];
					_t.curDayPostsCount = Object.keys(data["content"]).length;
					_t.longpolling();					
				}
				_t.change_prev_day();
				if (bt.length>0) {
					$(d1).insertBefore($(bt));
				}
				else {
					d0.appendChild(d1);
					var bt = document.createElement("input");
					bt.type = "button";
					bt.value = "Просмотреть еще...";
					bt.id = "show_more";
					bt.setAttribute("onclick","_d.add_post_day(_d.date_to_json())");
					d0.appendChild(bt);
				}
			}
			d0.removeChild(_t.status_day);		
			
		});
		jqxhr.fail(function(){
			d0.removeChild(_t.status_day);
			$('input#show_more').remove();
			
		});
	}
	
	form_day_post(data, date){
		var _t = this;
		var d1 = document.getElementById(date);
		if (!d1) {
			d1 = document.createElement("div");
			d1.className = "day_posts";
			d1.id = date;
		}
		for (var i=1;;i++){
			if (data[i]!==undefined) {
				var d2 = document.createElement("div");
				d2.className = "single_post";
				var em = document.createElement("h4");
				var tm = document.createElement("h6");
				em.innerHTML = data[i]["e-mail"];
				tm.innerHTML = data[i]["time"];
				d2.appendChild(em);
				d2.appendChild(tm);
				d1.insertBefore(d2, d1.firstChild); //вставить в начало род. эл-та
				d2.innerHTML += _t.fully_replace(_t.fully_replace(data[i]["text"],"\r\n","<br>")," ","&nbsp;");	//для отображения переноса и лишних пробелов
			} else break;
		}
		return d1;
	}

	change_prev_day() {
		this.dt=new Date(Math.floor(this.dt.getTime()-86400000));	//время на день раньше
	}

	reg_check(){
		if (navigator.cookieEnabled) {
			var cookies_arr2 = {};
			if (document.cookie!=""){
				var cookies_arr=document.cookie.split("; ");
				var cookies_info;
				for (var i=0, c=cookies_arr.length; i<c; i++) {
					cookies_info = cookies_arr[i].split("=");
					cookies_arr2[cookies_info[0]] = decodeURIComponent(cookies_info[1]); //чтобы отображалась @
				}
			}
			if (cookies_arr2['e-mail'] && cookies_arr2['password']) {
				var d = document.getElementById("regdiv");
				var t = document.createElement("textarea");
				var br = document.createElement("br");
				var bt = document.createElement("input");
				var f = document.createElement("form");
				t.id = "send_area";
				t.name = "send_area";
				t.setAttribute ("maxlength" , "500");
				t.setAttribute ("onkeyup" , "_d.send_n_null();");	
				t.setAttribute ("onkeypress" , "_d.send_n_null();");	//для отображения после нажатия и при длительном нажатии
				t.setAttribute ("rows", "6");	//высота в строках
				t.setAttribute ("onfocus", "_d.clear_err_ta()"); //очистка от "ошибочного" стиля
				bt.type="submit";
				bt.value = "Отправить";
				bt.id = "textarea_submit";
				f.id = "send_form";
				f.action = "record.php";
				f.method = "POST";
				f.enctype = "multipart/form-data";
				f.setAttribute ("class" , "invis");
				f.setAttribute("onsubmit", "return _d.send_msg();");
				f.innerHTML = "Осталось ввести символов: <div id='symb_count'>" + t.getAttribute("maxlength") + "<div>";
				f.appendChild(t);
				f.appendChild(br);
				f.appendChild(bt);
				d.appendChild(f);
				this.dt = new Date(Math.floor(this.dt.getTime()/86400000)*86400000);
				console.log('beggining of the current by GMT day', this.dt)                       
				this.add_post_day(this.date_to_json(this.dt));
				console.log('3', this.date_to_json(this.dt));

			}
			else {
				$("#menu_ent_exit").html("<a>Вход</a>");
				$("#menu_ent_exit").attr("onclick", "_d.reg_or_enter_click(0)");
				if (!$("#regist").length) {
					$("#menu_ent_exit").after(
						$('<li/>', {
							text: 'Регистрация',
							id: 'regist',
							onclick: '_d.reg_or_enter_click(1)'
						})
					);
				}
				$("#regist").css("display", "inline");
				$("#regdiv").html("");
				if (window.reg_status!==undefined) {
					this.reg_or_enter(reg_status);
					this.err_form(reg_status+1);
				}
				else this.reg_or_enter(0);
			}
		}
		else document.write("Работа данного сайта невозможна без cookies");
	}

	exit () {
		/*var d = new Date();
		d.setTime(1000); // Дата в прошлом
		var end_date = d.toGMTString();*/
		document.cookie="e-mail=; expires=0;";
		document.cookie="password=; expires=0;";
		this.reg_check();
		this.menus_non_pressed();
	}

	reg_or_enter(hid_param) {
		var str2='';
		switch (hid_param) {
			case 2:
				hid_param = 0;
			case 0:
				str2 = "<br><h3>Авторизация</h3>";
				break;
			case 1:
				str2 = "<br><h3>Регистрация</h3>";
				break;
						
		}
		str2+= "<br><form id='reg_form' action='reg.php' method='POST' enctype='multipart/form-data' onsubmit='return _d.f_submit();'>"
			 + "Введите e-mail<br><input type='text' id='pole1' name='pole1' onchange='_d.n_null()' onfocus='_d.clear_err()'><br>Введите пароль<br>"
			 + "<input type='password' id='pole2' name='pole2' value='' onchange='_d.n_null()'onfocus='_d.clear_err()'>"
			 + "<input type='hidden' name='hid_param' value=\"" + hid_param + "\">"
			 + "<br><input type='submit' id='reg_sub' value='Войти/Зарегистрироваться'><br></form>";
		$("#regdiv").html(str2);
		if (window.e_mail_reg!==undefined){
				$("#pole1").attr("value", e_mail_reg);
							
		}
		this.n_null();
	}

	reg_or_enter_click(click_param) {
		this.reg_or_enter(click_param);
		$("#pole1").attr("value", "");
		this.menus_non_pressed();
	}

	/*show_prev_day() {
		add_post_prev_day();
		var d0 = document.getElementById("regdiv");
		var bt = document.getElementById("show_more");
		d0.removeChild(bt);
	}*/

	send_msg() {
		var t = document.getElementById("send_area");
		var stat=(this.fully_replace(this.fully_replace(t.value,"\n",""), " ","").length!=0);	//отправить только ненулевые сообщения, не считая пробелов и переносов
		if (!stat) {
			$("#send_form").html($("#send_form").html() + "<div class='error_form'>Поле пустое</div>");
			$("textarea").attr("class", "error_form");
			document.getElementById("textarea_submit").disabled = true;
		}
		return stat;
	}

	refresh() {
		var dps = document.getElementsByClassName("day_posts");
		var d0 = document.getElementById("regdiv");
		var bt = document.getElementById("show_more");
		d0.removeChild(bt);
		document.getElementById("refr_button").disabled=true;
		while (dps.length>0) d0.removeChild(dps.item(0));
		//очистка окна сообщений
		this.load_time();
		document.getElementById("refr_button").disabled=false;
	}

	send_n_null(){
		var t = document.getElementById("send_area");
		document.getElementById("symb_count").innerHTML=(t.getAttribute("maxlength")-t.value.length);
	}

	open_send_msg() {
		var f = document.getElementById("send_form");
		if (f.getAttribute("class")=="invis") f.removeAttribute("class");
		else f.setAttribute ("class" , "invis");
	}
	f_submit() {
		this.clear_err();
		if (!this.autent) this.err_form(0);
		return this.autent;
	}

	err_form(err_num) {
		var err_msg = '';
		switch (err_num) {
			case 0:
				err_msg = "Неправильный формат ввода e-mail, либо слишком короткий пароль";
				break;
			case 1:
				err_msg = "Такого пользователя не существует";
				break;
			case 2:
				err_msg = "Такой пользователь уже зарегистрирован";
				break;
			case 3:
				err_msg = "Неправильно введен пароль";
				break;
		}
		$("form").html($("form").html() + "<div class='error_form'>" + err_msg + "</div>");
		$("#pole1").attr("class", "error_form");
		$("#pole2").attr("class", "error_form");
		document.getElementById("reg_sub").disabled = true;
	}

	clear_err() {
		$("#pole1").removeAttr("class");
		$("#pole2").removeAttr("class");
		$("div.error_form").remove();
		document.getElementById("reg_sub").disabled = false;
	}

	clear_err_ta() {
		$("textarea").removeAttr("class");
		$("div.error_form").remove();
		document.getElementById("textarea_submit").disabled = false;
	}

	n_null() {
		this.clear_err();
		var p = /^[a-z0-9_\.\-]+@([a-z0-9\-]+\.)+[a-z]{2,6}$/i;
		this.autent = (p.test($("#pole1").val())) && (($("#pole2").val()).length>5);
	}
}
_d = new D();	