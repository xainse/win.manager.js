/** 
 * @author @xainse
 * Скрипт для управления попапами и другими эффектами
 * 
 * Класс генерит собственные события
 */
var winManager = {
	
	name: 			'winManager',
	/**
	 * В массиве хранится список открытых попапов и окон, в порядке, в котором они открылись. 
	 * - окна запоминаются в порядке открытия
	 * - каждому дается соответствующий уникальный номер
	 * - можно выставлять окна в порядке их создания и показа  
	 */
	openedPopups: 	[],	
	helpInputText: 	'',
	canShowLog:	false,	// on live server must set to FALSE
	
	popup_loader_id: 	'#popup_loader',
	
	popup_wrapper_id: 	'#popupBox',
	
	popup_content_id: 	'#popup-content',
	
	innerLoaderID: 		'#inner-box-loader',

	freezen_background_id:	'#freezen_background',
	
	html_freez_bg: 			'<div class="bg-freeze-window" id="freezen_background" style="position:fixed; width:100%; height:100%; top:0; left:0; background-color:#000; z-index:1000; opacity:0.6;"></div>',
	
	html_load_popup: 		'<div class="popup_loader" id="popup_loader"></div>',
	
	html_popup_wrapper: 	'<div class="popup-container" id="popupBox" style="position:fixed; top:200px; left:45%; display:none; z-index:1001;"><a class="popup-close-btn" href="#!/close-btn" onclick="winManager.unfreezePage(); return false;">&times;</a><div id="popup-content"></div></div>',
	
	html_inner_loader: '',
	
	w_width: 0,
	w_height: 0,
	
	init: function (){
		
	},
	
	/**
	 * Убрать блокировку экрана
	 */
	unfreezePage: function (){
		$(winManager.popup_wrapper_id).hide();		// прячем окно попапа
		$(winManager.popup_content_id).html('');	// очищаем контент попапа
		$(winManager.openedPopups.join(", ")).hide();
		
		$(document).trigger('winManagerClosePopup');
	},
	
	/**
	 * Заморозить странцу с помощью наложения слоя поверх контента страницы.
	 */
	freezePage: function () {
		if (!$(winManager.freezen_background_id).length) {
			$("body").append(winManager.html_freez_bg);
			$(winManager.freezen_background_id).click(function(){
				winManager.unfreezePage();
			});
		}
		
		this.w_width 	= $(window).width();
		this.w_height	= $(document).height();
				
		$(this.freezen_background_id).height(this.w_height).width(this.w_width).show();
		
		winManager.openedPopups.push(this.freezen_background_id);
	},
	
	/**
	 * Show popup
	 * @returns
	 */
	showPopup: function(popupContentLink, callback) {		
		
		callback = (callback)?callback:function(){console.log('Empty callback');};

		$.get(popupContentLink, function(resp){
			winManager.showContentInPopup(resp, callback());
		});
	},
	
	/**
	 * Показать переданый контент в попапе
	 */
	showContentInPopup: function(content, callback) {
		
		this.freezePage();
		
		callback = (callback)?callback:function(){console.log('showContentInPopup: Empty callback');};
		
		if (!$(this.popup_wrapper_id).length) {
			$("body").append(winManager.html_popup_wrapper);
		}
		
		$(winManager.popup_content_id).html(content);   // вставляемо контент
		
		var pos_lft = (winManager.w_width - $(winManager.popup_wrapper_id).width())/2;
		var pos_top = ($(window).height() - $(winManager.popup_wrapper_id).height())/2;
        // Розрахувати процент відстані від верхнього краю
        pos_top = (pos_top*100)/$(window).height();
        pos_lft = (pos_lft*100)/$(window).width();

        $(winManager.popup_wrapper_id).css({top:pos_top+'%', left: pos_lft+'%', position:'fixed'}).show();

        // call callback function after show popup
		callback();
	},
	
	/**
	 * Показать блок контента, как попап
	 * @param BlockId
	 */
	showPopupById: function(BlockId, callback) {
		this.freezePage();
		console.log(BlockId);
		console.log(BlockId);
		callback = (callback)?callback:function(){console.log('Empty callback');};
		
		if (!$(this.popup_wrapper_id).length) {
			$("body").append(winManager.html_popup_wrapper);
		}
		
		$($(BlockId).html()).appendTo(winManager.popup_content_id);
        var cont = $(BlockId).children();
        var contentWidth = $(cont).css('padding-left').match("\\d+")*1 + $(cont).css('padding-right').match("\\d+")*1 + $(cont).width();
        console.log(contentWidth);
        $(winManager.popup_content_id).width(contentWidth);

        var pos_position = 'fixed';
		var pos_lft = (winManager.w_width - $(winManager.popup_wrapper_id).width())/2;
		var pos_top = ($(window).height() - $(winManager.popup_wrapper_id).height())/2;

        if (pos_top<0) {    // Якщо попап вищий ніж єкран - показуємо попап по іншому.
            pos_top = 10;
            pos_position = 'absolute';
        }


        $(winManager.popup_wrapper_id).css({top:pos_top, left: pos_lft, position:pos_position}).show();
		
		callback();
		//$(winManager.popup_content_id).html();
	},
	
	// Show popup with text 'Loadding...'
	showLoader: function (){
		var w_width 	= $(window).width();
		var w_height	= $(window).height();
		
		var lft_pos = (w_width-$(this.popup_loader_id).width())/2;
		var top_pos = (w_height-$(this.popup_loader_id).height())/2;
		
		$(this.popup_loader_id).css({top:top_pos+'px', left:lft_pos+'px'}).show();
		
		winManager.openedPopups.push(this.popup_loader_id);
	},
	
	
	/**
	 * Show Log of variable
	 * @param variable
	 */
	log: function ( variable, show_alert ) {
				 		
		if (this.canShowLog) {
			show_alert = (typeof(show_alert) != 'undefined' )?true:false;
			
			if (show_alert) {
				alert(variable);
			} else {
				console.log(variable);
			}
		}		
	},
	
	/**
	 * method to show system notifications, we can show custom popup window later;
	 * @param message
	 */
	notify: function (message) {
		message = (message)?message:false;		
		if (message) {
			alert(message);
		}
	},
	
	/**
	 * Reload retina javascript file
	 */
	callRetinaScript: function(){
		var head = document.getElementsByTagName('head').item(0);
		var script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
	    script.setAttribute('src', '/js/retina.js');
		head.appendChild(script);
	}
};

// Функція для парсингу темплейтів. Такий собі js-шаблонізатор
String.prototype.supplant = function(o) {
    return this.replace(/{([^{}]*)}/g,
        function(a, b) {
            var r = o[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        }
    );
};


window.we = function (variable) {	
	alert(variable);
};

window.wln = function(variable) {
    console.log(variable);
};