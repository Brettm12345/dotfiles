//META{"name":"ReturnScroll"}*//

var ReturnScroll = function () {};

ReturnScroll.prototype.getName = function() {
    return "ReturnScroll";
};
ReturnScroll.prototype.getDescription = function() {
    return "Button for returning to previous scroll position after posting a message";
};
ReturnScroll.prototype.getVersion = function() {
    return "1.4";
};
ReturnScroll.prototype.getAuthor = function() {
    return "Samogot";
};
ReturnScroll.prototype.start = function() {
	var lastTopMessage;
	var doNotFindFuther;
	var stopTO;

	var localeStr;
	switch(navigator.language) {
		case 'ru':
		case 'ru_RU':
			localeStr = {
				return: 'Вернутся к предыдущей позиции скролла',
				cancel: 'Отмена',
			};
			break;
		case 'uk':
		case 'uk_UA':
			localeStr = {
				return: 'Повернутся до попередньої позиції скролла',
				cancel: 'Відміна',
			};
			break;
		case 'nl':
		case 'nl_BE':
			localeStr = {
				return: 'Ga terug naar laatste positie',
				cancel: 'Annuleer',
			};
			break;
		default:
			localeStr = {
				return: 'Return to last scrolling position',
				cancel: 'Cancel',
			};
			break;
	}

	function recursiveFindMessageForReturn() {
		var messageForReturn;
		$('.comment h2').each(function() {
			if(lastTopMessage == $(this).text()) {
				messageForReturn = this;
				return false;
			}
			else if (doNotFindFuther && doNotFindFuther == $(this).text())
				return false;
		});
		if(messageForReturn) {
			$('.messages.scroller').scrollTop(messageForReturn.offsetTop);
			$('.return-scroll-bar').remove();
			stopTO = undefined;
		}
		else {
			doNotFindFuther = $('.comment h2:eq(0)').text()
			$('.has-more:first-child button').click();
			stopTO = setTimeout(recursiveFindMessageForReturn, 50);
		}
	}

	function onPostMessage() {
		var returnBtn = '<div class="new-messages-bar return-scroll-bar"><button type="button" class="return">'+localeStr.return+'</button><button type="button" class="cancel">'+localeStr.cancel+'</button></div>';
		$('.messages-wrapper').prepend(returnBtn);
		$('.return-scroll-bar .return').click(function() {
			doNotFindFuther = undefined;
			recursiveFindMessageForReturn();
		});
		$('.return-scroll-bar .cancel').click(function() {
			$('.return-scroll-bar').remove();
			if(stopTO) {
				clearTimeout(stopTO);
				stopTO = undefined;
			}
		});
	}

	$(document).on('keypress.ret-scrl', '.channel-textarea textarea', function(e){
		var $messages_scroller = $('.messages.scroller');
		if($messages_scroller.scrollTop() < $messages_scroller[0].scrollHeight - $messages_scroller.height()) {
			if(e.which == 13) {
				$('.comment h2').each(function() {
					if(this.offsetTop > $messages_scroller.scrollTop()) {
						lastTopMessage = $(this).text();
						return false;
					}
				});
				onPostMessage();
			}
		}
	});
};
ReturnScroll.prototype.load = function() {};
ReturnScroll.prototype.unload = function() {
	$(document).off("keypress.ret-scrl");
};
ReturnScroll.prototype.stop = function() {
	$(document).off("keypress.ret-scrl");
};
ReturnScroll.prototype.getSettingsPanel = function() {
	return null;
};
ReturnScroll.prototype.onMessage = function() {
};
ReturnScroll.prototype.onSwitch = function() {
};