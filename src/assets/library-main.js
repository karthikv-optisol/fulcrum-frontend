/**
 * Framework standard header comments.
 *
 * “UTF-8” Encoding Check - Smart quotes instead of three bogus characters.
 * Smart quotes may show as a single bogus character if the font
 * does not support the smart quote character.
 *
 * Goal: efficient, debugger friendly code.
 *
 * Conservation of keystrokes is acheived by using tabs.
 * Tabs and indentation are rendered and inserted as 4 columns, not spaces.
 * Using actual tabs, not spaces in place of tabs. This conserves keystrokes.
 *
 * [vim]
 * VIM directives below to match the default setup for visual studio.
 * The directives are explained below followed by a vim modeline.
 * The modeline causes vim to render and manipulate the file as described.
 * noexpandtab - When the tab key is depressed, use actual tabs, not spaces.
 * tabstop=4 - Tabs are rendered as four columns.
 * shiftwidth=4 - Indentation is inserted and rendered as four columns.
 * softtabstop=4 - A typed tab in insert mode equates to four columns.
 *
 * vim: set noexpandtab tabstop=4 shiftwidth=4 softtabstop=4:
 *
 * [emacs]
 * Emacs directives below to match the default setup for visual studio.
 *
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * c-indent-level: 4
 * indent-tabs-mode: t
 * tab-stop-list: '(4 8 12 16 20 24 28 32 36 40 44 48 52 56 60)
 * End:
 */

window.requests = [];
window.savePending = false;
window.supressAjaxLoadingMessage = false;
window.allowAjaxLoadingMessageToHide = true;
window.debugMode = false;
window.showJSExceptions = false;
window.modalDialogUrlDebugMode = false;
window.ajaxUrlDebugMode = false;
window.consoleLoggingMode = false;
var unloading = false;

// Global variable for keeping track of screen state via ajax urls.
window.urlsForCurrentState = [];

// Prepend this to ajaxUrl values;
window.ajaxUrlPrefix = '/';
// Portable code for browsers that do not support the console
// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

function UserException(message) {
	this.message = message;
	this.name = 'UserException';
}

$(function() {
	if ($(".messageQueueErrorHeader").length) {
		var errorMessage = $(".messageQueueErrorHeader").html();
		messageAlert(errorMessage, 'errorMessage');
	}
	if ($(".messageQueueSuccessHeader").length) {
		var successMessage = $(".messageQueueSuccessHeader").html();
		messageAlert(successMessage, 'successMessage');
	}
});

$(window).bind('beforeunload', function () {
	//$(document).unbind('ajaxError');
	unloading = true;
	//stampTheTime("softwareModuleHeadline");
});

$(document).ready(function() {
	if (window.consoleLoggingMode) {
		Console.restore();
	}
	checkUserAgentForMacintosh();
	isarchived();
	JavaScriptRegistryClass = function() {
		this._memberArray = [];

		this.set = function (key, value) {
	        this._memberArray[key] = value;
	    };

	    this.unset = function (keyToUnset) {
	    	delete this._memberArray[keyToUnset];
	    	/*
			for (var key in this._memberArray) {
				if (key == keyToUnset) {
					this._memberArray.splice(key, 1);
				}
			}
			*/
	    };

	    this.get = function (key) {
	    	if (typeof (this._memberArray[key]) !== 'undefined') {
	    		var value = this._memberArray[key];
	        	return value;
	    	} else {
	    		return '';
	    	}
	    };
	}
	JavaScriptRegistry = new JavaScriptRegistryClass();

});

function stampTheTime(elementId)
{
	var currentTime = new Date();
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();
	var seconds = currentTime.getSeconds();
	var milliseconds = currentTime.getMilliseconds();

	$("#" + elementId).html(hours + ':' + minutes + ':' + seconds + ':' + milliseconds);
}

$(document).bind("ajaxStart", function() {
	stampTheTime("dStartAjax");
	//$('#messageDiv').show();
	//if (window.supressAjaxLoadingMessage == false) {
		$('#divAjaxLoading').show();
		//$('#divAjaxLoading').addClass("warningMessage");
	//}

	// Check to see if session has expired
	var cookie = getCookie("PHPSESSID");
	if (cookie == null || cookie == '') {
		 //alert('Redirect To Login');
		 window.location = '/login-form.php?sessionExpired=1';
		 return false;
	}
	//alert('ajaxStart');
});

$(document).bind("ajaxStop", function() {
	stampTheTime("dStopAjax");
	//$('#messageDiv').hide();
	if (window.allowAjaxLoadingMessageToHide) {
		$('#divAjaxLoading').hide();
		$('#divAjaxLoading').html('Loading . . .');
	}
	//$('#divAjaxLoading').removeClass("warningMessage");
	//alert('ajaxStop');

	checkUserAgentForMacintosh();
});

function activateHelpHints()
{

	if ($("#dialogHelp").length && $(".help-hint").length) {

		// Setup any "Help / Instruction" Divs
		// Create the help dialog object
		var helpHintVisible = false;
		var helpDialog = $("#dialogHelp").dialog({
			autoOpen: false,
			draggable: true,
			resizeable: true,
			resize: 'auto',
			open: function() {
				$("body").addClass('noscroll');
			},
			close: function() {
				$("body").removeClass('noscroll');
				helpHintVisible = false;
			}
		});

		$(".help-hint").on('click', function() {
			if (helpHintVisible) {
				helpHintVisible = false;
				helpDialog.dialog("close");
			} else {
				helpHintVisible = true;
				// Build and open the dialog
				var hint = $("#help-hint-" + this.id).html();
				var width = $("#help-hint-" + this.id).width();
				//var height = $("#help-hint-" + this.id).height();
				var title = $("#help-hint-" + this.id).attr('title');
				$("#dialogHelp").html(hint);
				helpDialog.dialog('option', 'title', title);
				helpDialog.dialog('option', 'width', width);
				//helpDialog.dialog('option', 'height', height);
				helpDialog.dialog('open');
				helpDialog.dialog('option', 'position', {
					my: 'left top',
					at: 'right bottom',
					of: this
					//of: event,
					//offset: '10 10'
				});
			}
			return false;
		});

		/*
		.mousemove(function(event) {
			helpDialog.dialog("option", "position", {
				my: "left top",
				at: "right bottom",
				of: event,
				offset: "10 10"
			});
		});
		.mouseout(function() {
			helpDialog.dialog("close");
		});
		*/
	}
}

function getCookie(cookieName)
{
	var i, x, y;
	var arrCookies = document.cookie.split(';');
	for (i = 0; i < arrCookies.length; i++) {
		x = arrCookies[i].substr(0, arrCookies[i].indexOf('='));
		y = arrCookies[i].substr(arrCookies[i].indexOf('=') + 1);
		x = x.replace(/^\s+|\s+$/g, '');
		if (x == cookieName) {
			return unescape(y);
		}
	}
}

function setCookie(cname, cvalue, exdays)
{
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function deleteCookie(name)
{
	document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function trapJavaScriptEvent(javaScriptEvent)
{

	// Debug
	//alert(checkboxElement);

	try {

		// Normalize the event to a jQuery event.
		var jQueryEvent = jQuery.Event(javaScriptEvent);

		// Prevent the event from bubbling up the DOM tree.
		jQueryEvent.stopPropagation();

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}

}

//var dummyId = 'dummy_id';
function generateDummyElementId()
{
	var currentMilliseconds = new Date().getTime();
	var randomNumber = Math.floor((Math.random()*10000)+1);
	var dummyPrimaryKey = parseInt(parseInt(randomNumber) + parseInt(currentMilliseconds));
	var dummyElementId = 'dummy_id' + '-' + dummyPrimaryKey;

	return dummyElementId;
}

function rebuildAJAXRequestArray()
{
	var new_request_list = [];
	//new_request_list.push(xhr);
	$.each(window.requests, function(k,v) {
		if (v.readyState != 4) {
			new_request_list.push(v);
		}
	});
	window.requests = new_request_list;
}

function killAllActiveAJAXRequests()
{
	// Debug
	//alert(window.savePending);
	if (window.savePending == false) {
		// Debug
		//alert('Going To Delete');
		for(var i = 0; i < window.requests.length; i++) {
			// Debug
			//alert('Going To Delete Request');
			window.requests[i].abort();
		}
	}
}

function toggleDebugMode()
{
	try {

		var debugMode = $("#debugMode").val();
		//alert(debugMode);
		if (debugMode == '') {
			debugMode = 1;
			messageAlert('TOGGLING DEBUG MODE ON', 'successMessage');
			window.debugMode = true;
		} else {
			debugMode = '';
			messageAlert('TOGGLING DEBUG MODE OFF', 'successMessage');
			window.debugMode = false;
		}

		$("#debugMode").val(debugMode);

		var ajaxHandler = window.ajaxUrlPrefix + 'toggle-debug-mode-ajax.php';
		var ajaxQueryString =
			'debugMode=' + encodeURIComponent(debugMode);
		var ajaxUrl = ajaxHandler + '&' + ajaxQueryString;

		if (window.ajaxUrlDebugMode) {
			var continueDebug = window.confirm(ajaxUrl);
			if (continueDebug != true) {
				return;
			}
		}

		var returnedJqXHR = $.ajax({
			url: ajaxHandler,
			data: ajaxQueryString,
			success: toggleDebugModeSuccess,
			error: errorHandler
		});

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

function toggleDebugModeSuccess(response, textStatus, jqXHR)
{
	try {

		window.location.reload(true);

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

function toggleCssDebugMode()
{
	try {

		var cssDebugMode = $("#cssDebugMode").val();
		//alert(cssDebugMode);
		if (cssDebugMode == '') {
			cssDebugMode = 1;
			messageAlert('TOGGLING CSS DEBUG MODE ON', 'successMessage');
			window.cssDebugMode = true;
		} else {
			cssDebugMode = '';
			messageAlert('TOGGLING CSS DEBUG MODE OFF', 'successMessage');
			window.cssDebugMode = false;
		}

		$("#cssDebugMode").val(cssDebugMode);

		var ajaxHandler = window.ajaxUrlPrefix + 'toggle-debug-mode-ajax.php';
		var ajaxQueryString =
			'cssDebugMode=' + encodeURIComponent(cssDebugMode);
		var ajaxUrl = ajaxHandler + '&' + ajaxQueryString;

		if (window.ajaxUrlDebugMode) {
			var continueDebug = window.confirm(ajaxUrl);
			if (continueDebug != true) {
				return;
			}
		}

		var returnedJqXHR = $.ajax({
			url: ajaxHandler,
			data: ajaxQueryString,
			success: toggleCssDebugModeSuccess,
			error: errorHandler
		});

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

function toggleCssDebugModeSuccess(response, textStatus, jqXHR)
{
	try {

		window.location.reload(true);

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

function toggleJavaScriptDebugMode()
{
	try {

		var javaScriptDebugMode = $("#javaScriptDebugMode").val();
		//alert(javaScriptDebugMode);
		if (javaScriptDebugMode == '') {
			javaScriptDebugMode = 1;
			messageAlert('TOGGLING JAVASCRIPT DEBUG MODE ON', 'successMessage');
			window.javaScriptDebugMode = true;
		} else {
			javaScriptDebugMode = '';
			messageAlert('TOGGLING JAVASCRIPT DEBUG MODE OFF', 'successMessage');
			window.javaScriptDebugMode = false;
		}

		$("#javaScriptDebugMode").val(javaScriptDebugMode);

		var ajaxHandler = window.ajaxUrlPrefix + 'toggle-debug-mode-ajax.php';
		var ajaxQueryString =
			'javaScriptDebugMode=' + encodeURIComponent(javaScriptDebugMode);
		var ajaxUrl = ajaxHandler + '&' + ajaxQueryString;

		if (window.ajaxUrlDebugMode) {
			var continueDebug = window.confirm(ajaxUrl);
			if (continueDebug != true) {
				return;
			}
		}

		var returnedJqXHR = $.ajax({
			url: ajaxHandler,
			data: ajaxQueryString,
			success: toggleJavaScriptDebugModeSuccess,
			error: errorHandler
		});

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

function toggleJavaScriptDebugModeSuccess(response, textStatus, jqXHR)
{
	try {

		window.location.reload(true);

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

function toggleShowJSExceptions()
{
	try {

		var showJSExceptions = $("#showJSExceptions").val();
		//alert(showJSExceptions);
		if (showJSExceptions == '') {
			showJSExceptions = 1;
			messageAlert('TOGGLING SHOW JS EXCEPTIONS ON', 'successMessage');
			window.showJSExceptions = true;
		} else {
			showJSExceptions = '';
			messageAlert('TOGGLING SHOW JS EXCEPTIONS OFF', 'successMessage');
			window.showJSExceptions = false;
		}

		$("#showJSExceptions").val(showJSExceptions);

		var ajaxHandler = window.ajaxUrlPrefix + 'toggle-debug-mode-ajax.php';
		var ajaxQueryString =
			'showJSExceptions=' + encodeURIComponent(showJSExceptions);
		var ajaxUrl = ajaxHandler + '&' + ajaxQueryString;

		if (window.ajaxUrlDebugMode) {
			var continueDebug = window.confirm(ajaxUrl);
			if (continueDebug != true) {
				return;
			}
		}

		var returnedJqXHR = $.ajax({
			url: ajaxHandler,
			data: ajaxQueryString,
			success: toggleShowJSExceptionsSuccess,
			error: errorHandler
		});

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

function toggleShowJSExceptionsSuccess(response, textStatus, jqXHR)
{
	try {

		window.location.reload(true);

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

function toggleAjaxUrlDebugMode()
{
	try {

		var ajaxUrlDebugMode = $("#ajaxUrlDebugMode").val();
		//alert(ajaxUrlDebugMode);
		if (ajaxUrlDebugMode == '') {
			ajaxUrlDebugMode = 1;
			messageAlert('TOGGLING AJAX URL DEBUG MODE ON', 'successMessage');
			window.ajaxUrlDebugMode = true;
		} else {
			ajaxUrlDebugMode = '';
			messageAlert('TOGGLING AJAX URL DEBUG MODE OFF', 'successMessage');
			window.ajaxUrlDebugMode = false;
		}

		$("#ajaxUrlDebugMode").val(ajaxUrlDebugMode);

		var ajaxHandler = window.ajaxUrlPrefix + 'toggle-debug-mode-ajax.php';
		var ajaxQueryString =
			'ajaxUrlDebugMode=' + encodeURIComponent(ajaxUrlDebugMode);
		var ajaxUrl = ajaxHandler + '&' + ajaxQueryString;

		if (window.ajaxUrlDebugMode) {
			var continueDebug = window.confirm(ajaxUrl);
			if (continueDebug != true) {
				return;
			}
		}

		var returnedJqXHR = $.ajax({
			url: ajaxHandler,
			data: ajaxQueryString,
			success: toggleAjaxUrlDebugModeSuccess,
			error: errorHandler
		});

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

function toggleAjaxUrlDebugModeSuccess(response, textStatus, jqXHR)
{
	try {

		window.location.reload(true);

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

function toggleConsoleLoggingMode()
{
	try {

		var consoleLoggingMode = $("#consoleLoggingMode").val();
		//alert(ajaxUrlDebugMode);
		if (consoleLoggingMode == '') {
			consoleLoggingMode = 1;
			messageAlert('TOGGLING CONSOLE LOGGING MODE ON', 'successMessage');
			window.consoleLoggingMode = true;
		} else {
			consoleLoggingMode = '';
			messageAlert('TOGGLING CONSOLE LOGGING MODE OFF', 'successMessage');
			window.consoleLoggingMode = false;
		}

		$("#consoleLoggingMode").val(consoleLoggingMode);

		var ajaxHandler = window.ajaxUrlPrefix + 'toggle-debug-mode-ajax.php';
		var ajaxQueryString =
			'consoleLoggingMode=' + encodeURIComponent(consoleLoggingMode);
		var ajaxUrl = ajaxHandler + '&' + ajaxQueryString;

		if (window.ajaxUrlDebugMode) {
			var continueDebug = window.confirm(ajaxUrl);
			if (continueDebug != true) {
				return;
			}
		}

		var returnedJqXHR = $.ajax({
			url: ajaxHandler,
			data: ajaxQueryString,
			success: toggleConsoleLoggingModeSuccess,
			error: errorHandler
		});

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

function toggleConsoleLoggingModeSuccess(response, textStatus, jqXHR)
{
	try {

		window.location.reload(true);

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

function initializeAutoHintFields()
{
	$('INPUT.auto-hint, TEXTAREA.auto-hint').focus(function() {
		if ($(this).val() == $(this).attr('title')) {
			$(this).val('');
			$(this).removeClass('auto-hint');
		}
	});

	$('INPUT.auto-hint, TEXTAREA.auto-hint').blur(function() {
		if ($(this).val() == '' && $(this).attr('title') != '') {
			$(this).val($(this).attr('title'));
			$(this).addClass('auto-hint');
		}
	});

	$('INPUT.auto-hint, TEXTAREA.auto-hint').each(function() {
		if ($(this).attr('title') == '') {
			return;
		}
		if ($(this).val() == '') {
			$(this).val($(this).attr('title'));
		} else if ($(this).val() != $(this).attr('title')) {
			$(this).removeClass('auto-hint');
		}
	});
}

/**
 * This function, messageAlert, displays element ajax confirmations
 * @param text {String} The message to display
 * @param messageStyle {String} The style type to display for the message box (see style.css)
 * @param labelStyle {String} The style type to display for the label (see style.css)
 * @param elementId {String} The element that called the alert
 */
function messageAlert(text, messageStyle, labelStyle, elementId)
{
	clearTimeout(window['labelStyleTimeout_' + elementId]);
	clearTimeout(window['messageStyleTimeout_' + elementId]);
	if (window.debugMode) {
		//var messageTimeout = 45000;
		var messageTimeout = 7000;
	} else {
		var messageTimeout = 3000;
	}

	$("#messageDiv").removeClass();
	$("#messageDiv").html('');

	$("#messageDiv").addClass(messageStyle);
	$("#messageDiv").html(text);
	$("#messageDiv").fadeIn('slow');

	window['messageStyleTimeout_' + elementId] = setTimeout(function() {
		$("#messageDiv").fadeOut('slow', function() {
			$("#messageDiv").removeClass();
			$("#messageDiv").html('');
		});
	},messageTimeout);

	if (elementId != 'none') {
		var classesToRemove = 'infoMessageLabel successMessageLabel warningMessageLabel errorMessageLabel modalMessage';
		$("#" + elementId).removeClass(classesToRemove);
		$("#" + elementId).addClass(labelStyle);

		window['labelStyleTimeout_' + elementId] = setTimeout(function() {
			$("#" + elementId).removeClass(classesToRemove);
		},messageTimeout);
	}
}

/**
 * jQuery function to get the coordinates of the furthest space occupied by an element (or group of elements within the selector).
 * Could be useful if your setting the area of a container based on the absolute positioning of child elements that need to be
 * within the container (ie for drag and drop elements).
 *
 * http://www.jquery4u.com/snippets/jquery-function-max-xy-coordinates-element/
 */
jQuery.fn.getMaxOccupiedLocation = function()
{
	var maxX = 0, maxY = 0, tmpX, tmpY, elem;
	this.each( function(i,v)
	{
		elem = $(this),
		tmpX = elem .offset().left + elem.width(),
		maxX = (tmpX > maxX) ? tmpX : maxX,
		tmpY = elem .offset().top + elem.height(),
		maxY = (tmpY > maxY) ? tmpY : maxY;
	});
	// console.log(maxX+','+maxY);
	return { x:maxX, y:maxY }; //not the best implementation as it breaks the chain
};


/**
 * This function, errorHandler, is the ajax error handler.
 * @param jqXHR
 * @param textStatus
 * @param errorThrown
 */
function errorHandler(jqXHR, textStatus, errorThrown)
{
	try {

		//var proceed = true;
		//if (unloading) {
		//	proceed = confirm('Server requests are still pending. Are you sure to want to leave this page?');
		//}

		//if (proceed) {
		if (unloading == false) {
			var responseText = jqXHR['responseText'];
			var messageStyle = 'errorMessage';
			var labelStyle = 'errorMessageLabel';

			if (responseText.indexOf("|") != -1) {
				var arrResponseText = responseText.split('|');
				var elementId = arrResponseText[0];
				var messageText = arrResponseText[1];

				$("#" + elementId).addClass(labelStyle);
				$("#" + elementId).fadeIn('slow');
				//$("#" + elementId).val('');
				$("#" + elementId).focus();
			} else {
				var messageText = responseText;
			}

			if (window.debugMode) {
				//messageText = messageText + '\n\n' + jqXHR;
			}

			//$("#" + elementId).animate({backgroundColor: '#FFFFFF', color: 'black'}, 4000);

			messageAlert(messageText, messageStyle);
		}
		//} else {
		//	return false;
		//}

	} catch (error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

function getDummyResolvedPromise()
{
	var objDeferred = $.Deferred();
	objDeferred.resolve();
	var promise = objDeferred.promise();

	return promise;
}

function getDummyRejectedPromise()
{
	// Get jqXHR http status via $.Deferred()
	// $.Deferred() may be used for other statuses in addition to .ajax calls
	var objDeferred = $.Deferred();
	// Expressly invoke all "fail" callbacks defined by .then (second argument instance) or .fail on the deferred promise via objDeferred.reject(...)
	// @see http://api.jquery.com/category/deferred-object/
	// @see http://api.jquery.com/deferred.then/
	objDeferred.reject();
	var promise = objDeferred.promise();

	return promise;
}

function validateFilePath(element)
{
	var potentialFilePath = $(element).val();
	var elementId = $(element).prop('id');
	var regex = /[\\/:"*?<>|]/g;
	if (potentialFilePath.match(regex)) {
		potentialFilePath = potentialFilePath.replace(regex, '');
		$(element).val(potentialFilePath);
		var messageText = 'The Following Characters Are Not Permitted / \ : " * ? < > |';
		messageAlert(messageText, 'warningMessage', 'warningMessageLabel', elementId);
	}
}

function updateChildDropDown(formId, parentId, childId, ajaxHandler, ajaxFunction)
{
	try {

		var selectedValue = $("#" + formId + " select[id=" + parentId + "]").val();

		// Deviates from the ajaxUrl pattern seen elsewhere.
		//var ajaxUrl = "/" + ajaxHandler + "?method=" + ajaxFunction + "&selectedValue=" + selectedValue;

		var ajaxHandler = window.ajaxUrlPrefix + ajaxHandler + '?method=' + ajaxFunction;
		var ajaxQueryString =
			'selectedValue=' + encodeURIComponent(selectedValue);

		var ajaxUrl = ajaxHandler + '&' + ajaxQueryString;

		if (window.ajaxUrlDebugMode) {
			var continueDebug = window.confirm(ajaxUrl);
			if (continueDebug != true) {
				return;
			}
		}

		$("#" + formId + " select[id=" + childId + "]").load(ajaxUrl);

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

/* Used by page-componenet contact_search_by_user_company */
function searchContactSelected(element, javascriptHandler, contact_id, company, contactFirstName, contactLastName, email, is_archive)
{
	//var caller = $(event.target).parents().find('.contact-search-parent-container').first().attr('id');
	window["searchContactSelected_" + javascriptHandler](element, contact_id, company, contactFirstName, contactLastName, email, is_archive);
}

/* Used by page-componenet contact_search_by_user_company */
function executeSearchForContactsByCompanyOrContact(javascriptHandler, options)
{
	try {

		var options = options || {};

		var company = $.trim($('#searchCompany_' + javascriptHandler).val());
		var first_name = $.trim($('#searchContactFirstName_' + javascriptHandler).val());
		var last_name = $.trim($('#searchContactLastName_' + javascriptHandler).val());
		var email = $.trim($('#searchContactEmail_' + javascriptHandler).val());

		// @todo Production: Change 0 back to 1 to eliminate large data transfer through ajax.
		if (company.length > 0 || first_name.length > 0 || last_name.length > 0 || email.length > 0) {
			$('#divPossibleContacts_' + javascriptHandler).show();

			if (options.ajaxHandler) {
				var ajaxHandler = window.ajaxUrlPrefix + options.ajaxHandler;
			} else {
				var ajaxHandler = window.ajaxUrlPrefix + 'page-components-ajax.php?method=searchForUserCompanyContactsByCompanyTextOrContactText';
			}
			var ajaxQueryString =
				'company=' + encodeURIComponent(company) +
				'&first_name=' + encodeURIComponent(first_name) +
				'&last_name=' + encodeURIComponent(last_name) +
				'&email=' + encodeURIComponent(email) +
				'&jsHandler=' + encodeURIComponent(javascriptHandler);
			var ajaxUrl = ajaxHandler + '&' + ajaxQueryString;

			if (window.ajaxUrlDebugMode) {
				var continueDebug = window.confirm(ajaxUrl);
				if (continueDebug != true) {
					return;
				}
			}

			$('#divPossibleContacts_' + javascriptHandler).load(ajaxUrl, function() {
				if (options.successCallback) {
					options.successCallback();
				}
			});

		} else {
			$('#divPossibleContacts_' + javascriptHandler).hide();
		}

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

/* Used by page-componenet contact_search_by_user_company */
function clearSearchForContactsByCompanyOrContact(javascriptHandler) {
	$.trim($("#searchCompany_" + javascriptHandler).val(''));
	$.trim($("#searchContactFirstName_" + javascriptHandler).val(''));
	$.trim($("#searchContactLastName_" + javascriptHandler).val(''));
	$.trim($("#searchContactEmail_" + javascriptHandler).val(''));
	$("#divPossibleContacts_" + javascriptHandler).hide();
}

/* Used by page-componenet contact_search_by_user_company */
function executeSearchForContactsByCompanyTrades(javascriptHandler, options)
{
	try {

		var options = options || {};

		// New pattern. Before, this function got called via onkeyup with a string argument. Now, it gets
		// called via autocomplete's "source" option, which passes a request object. We only want a string.
		if (typeof javascriptHandler !== 'string') {
			javascriptHandler = 'purchasingAddBiddersToBudget';
		}

		var divisionNumber = $.trim($("#searchDivisionNumber_" + javascriptHandler).val());
		var division = $.trim($("#searchDivision_" + javascriptHandler).val());
		var costCode = $.trim($("#searchCostCode_" + javascriptHandler).val());
		var costCodeDescription = $.trim($("#searchCostCodeDescription_" + javascriptHandler).val());
		//TODO Production: Change 0 back to 1 to eliminate large data transfer through ajax.
		if (divisionNumber.length > 1 || division.length > 2 || costCode.length > 2 || costCodeDescription.length > 2) {

			if (options.ajaxHandler) {
				var ajaxHandler = window.ajaxUrlPrefix + options.ajaxHandler;
			} else {
				var ajaxHandler = window.ajaxUrlPrefix + 'page-components-ajax.php?method=searchForContactsByCostCodeData';
			}

			var ajaxQueryString =
				'divisionNumber=' + encodeURIComponent(divisionNumber) +
				'&division=' + encodeURIComponent(division) +
				'&costCode=' + encodeURIComponent(costCode) +
				'&costCodeDescription=' + encodeURIComponent(costCodeDescription) +
				'&jsHandler=' + encodeURIComponent(javascriptHandler);
			var ajaxUrl = ajaxHandler + '&' + ajaxQueryString;

			if (window.ajaxUrlDebugMode) {
				var continueDebug = window.confirm(ajaxUrl);
				if (continueDebug != true) {
					return;
				}
			}

			$("#divPossibleContactsByTrade_" + javascriptHandler).show();
			$("#divPossibleContactsByTrade_" + javascriptHandler).load(ajaxUrl, function() {
				if (options.successCallback) {
					options.successCallback();
				}
			});

		} else {
			$("#divPossibleContactsByTrade_" + javascriptHandler).hide();
		}

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

/* Used by page-componenet contact_search_by_user_company */
function clearSearchForContactsByCompanyTrades(javascriptHandler) {
	$.trim($("#searchDivision_" + javascriptHandler).val(''));
	$.trim($("#searchDivisionNumber_" + javascriptHandler).val(''));
	$.trim($("#searchCostCode_" + javascriptHandler).val(''));
	$.trim($("#searchCostCodeDescription_" + javascriptHandler).val(''));
	$("#divPossibleContactsByTrade_" + javascriptHandler).hide();
}

/* Breadcrumb functions */
function updateBreadcrumb(depth,name) {
	return true;

	var bc1 = document.getElementById('bc1');
	var bc2 = document.getElementById('bc2');
	var bc3 = document.getElementById('bc3');
	var bcP = document.getElementById('bcProject');
	switch(depth) {
	case 'navBoxProject':
		bc1.innerHTML = name;
		bc1.style.display = 'block';
		break;
	case 'selectedProject':
		bcP.innerHTML = name;
		bcP.style.display = 'block';
		break;
	case 'navBoxModuleGroup':
		bc2.innerHTML = name;
		bc2.style.display = 'block';
		bc3.innerHTML = "";
		bc3.style.display = 'none';
		break;
	case 'navBoxModuleItem':
		bc3.innerHTML = name;
		bc3.style.display = 'block';
		break;
	}
}

function showHideLeftNavImage(imgElemId, showHide) {
	var elem = document.getElementById(imgElemId);

	if (showHide == 'hide') {
		//$("#" + imgElemId).hide();

		elem.style.visibility = 'hidden';
	} else if (showHide == 'show') {
		//var vis = $("#" + imgElemId);
		//var vis = $(imgElemId);
		//alert(vis);
		//alert(vis.style.visibility);
		//$(imgElemId).show();
		//$("#" + imgElemId).show();

		elem.style.visibility = 'visible';
	}
}

function isarchived(){	
	// var userId = $("#logged_user_id ").val();
	// var ajaxHandler = '';
	// //window.ajaxUrlPrefix  + 'impersonate-users-ajax.php?method=checkArchivedUser';
    // var ajaxQueryString = 'userId=' + encodeURIComponent(parseInt(userId));
	// var ajaxUrl = ajaxHandler + '&' + ajaxQueryString;
	// $.get(ajaxUrl,  
	// function (data) { 
	// 	if (data=='true'){
	// 		location.assign(location.origin + "/logout.php")
	// 	}
	// });
}

$(document).on('contextmenu','.projectLinks',function(e){
	$('[name="selectedProjectDiv"]').hide();
	var groupIndex = $(this).data("groupindex");
	var encodedProjectName = $(this).data("encodedprojectname");
	var project_id = $(this).data("project_id");
	var selDiv = document.getElementById(groupIndex + '_selected');
	var updatedInnerHtmlContent = decodeURIComponent(encodedProjectName) + '<img alt="" src="/images/navigation/left-nav-arrow-green.gif">';
	var ajaxHandler = window.ajaxUrlPrefix + 'navigation-left-ajax.php?method=updateSessionCurrentlySelectedProjectId';
	var ajaxQueryString =
		'project_id=' + encodeURIComponent(project_id) +
		'&projectName=' + encodedProjectName;
	var ajaxUrl = ajaxHandler + '&' + ajaxQueryString;
	var pathname = window.location.pathname; 
	if(pathname && pathname =='/modules-jobsite-daily-logs-form.php'){
		$.get(ajaxUrl);	
	}
	$.ajax({
			url: ajaxHandler,
			data: ajaxQueryString,
			success: function(data){
				window.location.reload(); // To reload the current page with the selected project 
				var url = window.location.origin;

				var newurl = url+'/dashboard.php'; // To open a new tab with dashboardss
				window.open(newurl, '_blank');
				
			},
			error: errorHandler
	});
	return false;

});

/* Navigation functions to change menu based on project selection */
function navigationProjectSelected(groupIndex, project_id, encodedProjectName)
{
	try {
		$('[name="selectedProjectDiv"]').hide();
		var selDiv = document.getElementById(groupIndex + '_selected');
		var updatedInnerHtmlContent = decodeURIComponent(encodedProjectName) + '<img alt="" src="/images/navigation/left-nav-arrow-green.gif">';
		var ajaxHandler = window.ajaxUrlPrefix + 'navigation-left-ajax.php?method=updateSessionCurrentlySelectedProjectId';
		var ajaxQueryString =
			'project_id=' + encodeURIComponent(project_id) +
			'&projectName=' + encodedProjectName;
		var ajaxUrl = ajaxHandler + '&' + ajaxQueryString;

		if (window.ajaxUrlDebugMode) {
			var continueDebug = window.confirm(ajaxUrl);
			if (continueDebug != true) {
				return;
			}
		}
		var pathname = window.location.pathname; 
		if(pathname && pathname =='/modules-jobsite-daily-logs-form.php'){
			$.get(ajaxUrl);	
		}

		var returnedJqXHR = $.ajax({
			url: ajaxHandler,
			data: ajaxQueryString,
			success: function(data)
			{
				window.location.reload();
				window.location = "/dashboard.php";
				// updateSessionCurrentlySelectedProjectIdSuccess(project_id,encodedProjectName);
			},
			error: errorHandler
		});

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

function updateSessionCurrentlySelectedProjectIdSuccess(project_id,encodedProjectName)
{ // Default going to the dashboard page.
	try {
		var url = window.location.origin;
		var newurl = url+'/dashboard.php?project_id='+ btoa(project_id)+'&project_name='+btoa(encodedProjectName);
		window.location.replace(newurl);
	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}
	}
}

function goToDashboard(){ // Default function for the Active project to go to dashboard
	var url = window.location.origin;
	var newurl = url+'/dashboard.php';
	window.location.replace(newurl);
}
/* Active Menu Project Index Get*/
var resultIndex = '0c'; // Returns path only
var i = 0;
$('.categoryitems').each(function(menuitem){
	var menuStyle=$(this).attr('style');
	if(menuStyle == 'display: block;' || menuStyle == 'display:block;')
	{
		resultIndex = i;
	}
	i++;
});
// var projectActiveMenuIdex = $('#currentlySelectedProjectTypeIndex').val();


/* End Navigation function */

function redirectToProjectFiles(frm)
{
	var selectedValue = frm.project_id.options[frm.project_id.selectedIndex].value;
	//alert(selectedValue);
	var project_id = selectedValue;
	var finalUrl = url = 'modules-file-manager-form.php?project_id=' + project_id;
	document.location=finalUrl;
}

function userCompanyRedirect(frm, baseUrl)
{
	var elem = frm.elements["ddl_user_company_id"];
	var user_company_id = elem.options[elem.selectedIndex].value;
	var finalUrl = baseUrl + '?mode=update&managed_user_company_id=' + user_company_id;
	document.location=finalUrl;

	return true;
}

function userRedirect(frm, baseUrl)
{
	var elem = frm.elements["ddl_user_id"];
	var user_id = elem.options[elem.selectedIndex].value;
	var finalUrl = baseUrl + '?mode=update&user_id=' + user_id;
	document.location=finalUrl;

	return true;
}

var initialLocation;
var browserSupportFlag = new Boolean();
var map;
var myLatitude;
var myLongitude;
var myAccuracy = 'N/A';
var locationDetectionMethod;
var locationDetectionMessage;
var markersArray = [];

function imgOn(imgName)
{
	if (document.images) {
		document.images[imgName].src = eval(imgName+'On.src');
	}
}

function imgOff(imgName)
{
	if (document.images) {
		document.images[imgName].src = eval(imgName+'Off.src');
	}
}

function setFocus()
{
	var obj = document.getElementById("first_element");
	if (obj != null) {
		obj.focus();
		if (obj.select) {
			obj.select();
		}
	}
}

function detectGeoLocation()
{
	if (navigator.geolocation && 1) { // Try W3C Geolocation method (Preferred)
		browserSupportFlag = true;
		locationDetectionMethod = 'W3C';
		locationDetectionMessage = 'Browser location detection successful';
		var locOptions = {
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 100
		};
		navigator.geolocation.getCurrentPosition(
			function(position) {
				myLatitude = position.coords.latitude;
				myLongitude = position.coords.longitude;
				myAccuracy = position.coords.accuracy;
			},
			function(error) {
				handleNoGeolocation(browserSupportFlag, error);
			},
			locOptions
		);
	} else if (google.gears) { // Try Google Gears Geolocation
		browserSupportFlag = true;
		locationDetectionMethod = 'Gears';
		locationDetectionMessage = 'Browser location detection successful';
		var geo = google.gears.factory.create('beta.geolocation');
		geo.getCurrentPosition(
			function(position) {
				myLatitude = position.latitude;
				myLongitude = position.longitude;
			},
			function() {
				handleNoGeoLocation(browserSupportFlag);
			}
		);
	} else { // Browser doesn't support Geolocation
		browserSupportFlag = false;
		handleNoGeolocation(browserSupportFlag);
	}

	//alert('detectGeoLocation(): ' + myLatitude + ', ' + myLongitude);
}

function handleNoGeolocation(errorFlag, error)
{
	// User IP Address
	locationDetectionMethod = 'IP';
	myLatitude = ipLatitude;
	myLongitude = ipLongitude;

	if (errorFlag == true) {
		locationDetectionMessage = 'Browser location detection failed';
	} else {
		locationDetectionMessage = 'Browser does not support geolocation';
	}

	if (error) {
		switch(error.code) {
			case 0:
				locationDetectionMessage += ' because an unknown error occurred';
				break;
			case 1:
				locationDetectionMessage += ' because the user declined access';
				break;
			case 2:
				locationDetectionMessage += ' because the satellites failed';
				break;
			case 3:
				locationDetectionMessage += ' because the timeout value was exceeded';
				break;
		}
	}
}

function initializeMap()
{
	if ((myLatitude != undefined) || (myLongitude != undefined)) {
		//alert("initialize(): "+myLatitude+", "+myLongitude);
		window.clearInterval(mapInitialized);

		var myOptions = {
			zoom: 15,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

		/*
		google.maps.event.addListener(map, 'dragend',
			function() {
				alert('map dragged');
			}
		);
		*/

		initialLocation = new google.maps.LatLng(myLatitude, myLongitude);
		map.setCenter(initialLocation);

		if (myAccuracy != 'N/A') {
			myAccuracy += ' m';
		}
		var browserDetectionMessage = locationDetectionMessage+" (using "+locationDetectionMethod+"). Accuracy: "+myAccuracy+".";
		infowindow.setContent(browserDetectionMessage);
		infowindow.setPosition(initialLocation);
		infowindow.open(map);

		var image = new google.maps.MarkerImage(userImage);
		var marker = new google.maps.Marker({
			icon: image,
			position: initialLocation,
			title:"Your current location.",
			zIndex: 10000
		});
		// To add the marker to the map, call setMap();
		marker.setMap(map);

		google.maps.event.addListener(
			marker,
			'click',
			function() {
				window.location='/user-details.php?id='+userId+'&lat='+myLatitude+'&lon='+myLongitude;
			}
		);

		//setMarkers(map, proximityPeople);
		//alert(myLatitude+", "+myLongitude);

		if (someFlag && (myLatitude != undefined) && (myLongitude != undefined)) {
			plotSomethingOnAGoogleMap(userId, myLatitude, myLongitude);
		}
	}
}

function setMarkers(map, locations)
{
	// Add markers to the map

	// Marker sizes are expressed as a Size of X,Y
	// where the origin of the image (0,0) is located
	// in the top left of the image.

	// Origins, anchor positions and coordinates of the marker
	// increase in the X direction to the right and in
	// the Y direction down.
	//var image = new google.maps.MarkerImage('/images/map-icons/blue-dot.png',
	var image = new google.maps.MarkerImage('/images/photos/laura-head-shot-small.JPG',
	// This marker is 20 pixels wide by 32 pixels tall.
	//new google.maps.Size(32, 32),
	new google.maps.Size(40, 66),
	// The origin for this image is 0,0.
	new google.maps.Point(0,0),
	// The anchor for this image is the base of the flagpole at 0,32.
	//new google.maps.Point(0, 32));
	new google.maps.Point(0, 66));
	var shadow = new google.maps.MarkerImage('/images/map-icons/msmarker.shadow.png',
	// The shadow image is larger in the horizontal dimension
	// while the position and offset are the same as for the main image.
	new google.maps.Size(59, 32),
	new google.maps.Point(0,0),
	new google.maps.Point(0, 32));
	// Shapes define the clickable region of the icon.
	// The type defines an HTML <area> element 'poly' which
	// traces out a polygon as a series of X,Y points. The final
	// coordinate closes the poly by connecting to the first
	// coordinate.
	var shape = {
		//coord: [1, 1, 1, 20, 18, 20, 18 , 1],
		coord: [1, 1, 1, 66, 40, 66, 40 , 1],
		type: 'poly'
	};

	var arrImages = new Array();
	/*
	arrImages[0] = '/images/photos/thumb-070cf6787aa56fbdaa1b2fd98708c34c.png';
	arrImages[1] = '/images/photos/thumb-6fb2a38dc107eacb41cf1656e899cf70.png';
	arrImages[2] = '/images/photos/thumb-1bc5b77f3e50b7fbe12c792ee438da45.png';
	arrImages[3] = '/images/photos/thumb-b44a59383b3123a747d139bd0e71d2df.png';
	*/
	arrImages[0] = '/images/photos/thumb-d53d983c0c0781099416494a77804df7.png';
	arrImages[1] = '/images/photos/thumb-90a9266652fd1df3d61d7aeed1a50e2f.png';
	arrImages[2] = '/images/photos/thumb-c49d85a04db331159fe0b4b0f93a715a.png';
	arrImages[3] = '/images/photos/thumb-aede078bf7331d6689a186127bb56ca2.png';
	arrImages[4] = '/images/photos/thumb-2fbe5383a8571c3ef79c4b0ec9df8d6b.png';
	arrImages[5] = '/images/photos/thumb-cf0a6afb18622474652aaf1d02fbf4a6.png';
	arrImages[6] = '/images/photos/thumb-0d7179bf324935c4cfde6b161f15a099.png';
	arrImages[7] = '/images/photos/thumb-611f80242917bf72fd7310267a315849.png';
	arrImages[8] = '/images/photos/thumb-978aad1cc0fc800033364fd9565a8492.png';
	arrImages[9] = '/images/photos/thumb-f30b0a0b9f5f3024c23400c7d18f06ff.png';

	for (var i = 0; i < locations.length; i++) {
		var imageQM = new google.maps.MarkerImage(arrImages[i]);
		var person = locations[i];
		var myLatLng = new google.maps.LatLng(person[1], person[2]);
		var marker = new google.maps.Marker({
			position: myLatLng,
			shadow: shadow,
			icon: imageQM,
			map: map,
			title: person[0],
			zIndex: person[3]
		});
	}
}

function addMarker(user_id, latitude, longitude, image, userLocation, screen_name, distance, greeting, i)
{
	var marker = new google.maps.Marker({
		icon: image,
		position: userLocation,
		title: screen_name+": "+distance+" ft, "+greeting,
		zIndex: i
	});

	google.maps.event.addListener(
		marker,
		'click',
		function() {
			window.location='/user-details.php?id='+user_id+'&lat='+latitude+'&lon='+longitude;
		}
	);
	marker.setMap(map);
	markersArray.push(marker);
}

// Removes the overlays from the map, but keeps them in the array
function clearOverlays()
{
	if (markersArray) {
		for (i in markersArray) {
			markersArray[i].setMap(null);
		}
	}
}

// Shows any overlays currently in the array
function showOverlays()
{
	if (markersArray) {
		for (i in markersArray) {
			markersArray[i].setMap(map);
		}
	}
}

// Deletes all markers in the array by removing references to them
function deleteOverlays()
{
	if (markersArray) {
		for (i in markersArray) {
			markersArray[i].setMap(null);
		}
		markersArray.length = 0;
	}
}

function urldecode(url)
{
	var url1 = url.replace(/\+/g, ' ');
	var url2 = decodeURIComponent(url1);

	return url2;
}

var spinner;
function showSpinner()
{
	// Disable screen, show spinner.
	var divSpinner = $('#divSpinner');
	var divOverlay = $('#divOverlay');
    if (divSpinner.length) {
    	divSpinner.removeClass('hidden');
    } else {
    	divSpinner = $('<div id="divSpinner"></div>');
    	$(document.body).append(divSpinner);
    }
    if (divOverlay.length) {
    	divOverlay.removeClass('hidden');
    } else {
    	divOverlay = $('<div id="divOverlay"></div>');
    	$(document.body).append(divOverlay);
    }

    if (!spinner) {
    	spinner = new Spinner();
    }
    spinner.spin();
    divSpinner.append(spinner.el);
}

function hideSpinner() {
	spinner.stop();
	var divSpinner = $('#divSpinner');
	var divOverlay = $('#divOverlay');
	divSpinner.addClass('hidden');
	divOverlay.addClass('hidden');
}
function newspinner()
{
	// Disable screen, show spinner.
	var divSpinner = $('#signSpinner');
	var divOverlay = $('#signOverlay');
    if (divSpinner.length) {
    	divSpinner.removeClass('hidden');
    } else {
    	divSpinner = $('<div id="signSpinner"></div>');
    	$(document.body).append(divSpinner);
    }
    if (divOverlay.length) {
    	divOverlay.removeClass('hidden');
    } else {
    	divOverlay = $('<div id="signOverlay"></div>');
    	$(document.body).append(divOverlay);
    }

    if (!spinner) {
    	spinner = new Spinner();
    }
    spinner.spin();
    divSpinner.append(spinner.el);
}
function hidenewspinner() {
	spinner.stop();
	var divSpinner = $('#signSpinner');
	var divOverlay = $('#signOverlay');
	divSpinner.addClass('hidden');
	divOverlay.addClass('hidden');
}
// spin.js
/**
 * Copyright (c) 2011-2014 Felix Gnass
 * Licensed under the MIT license
 */
(function(root, factory) {

  /* CommonJS */
  if (typeof exports == 'object')  module.exports = factory()

  /* AMD module */
  else if (typeof define == 'function' && define.amd) define(factory)

  /* Browser global */
  else root.Spinner = factory()
}
(this, function() {
  "use strict";

  var prefixes = ['webkit', 'Moz', 'ms', 'O'] /* Vendor prefixes */
    , animations = {} /* Animation rules keyed by their name */
    , useCssAnimations /* Whether to use CSS animations or setTimeout */

  /**
   * Utility function to create elements. If no tag name is given,
   * a DIV is created. Optionally properties can be passed.
   */
  function createEl(tag, prop) {
    var el = document.createElement(tag || 'div')
      , n

    for(n in prop) el[n] = prop[n]
    return el
  }

  /**
   * Appends children and returns the parent.
   */
  function ins(parent /* child1, child2, ...*/) {
    for (var i=1, n=arguments.length; i<n; i++)
      parent.appendChild(arguments[i])

    return parent
  }

  /**
   * Insert a new stylesheet to hold the @keyframe or VML rules.
   */
  var sheet = (function() {
    var el = createEl('style', {type : 'text/css'})
    ins(document.getElementsByTagName('head')[0], el)
    return el.sheet || el.styleSheet
  }())

  /**
   * Creates an opacity keyframe animation rule and returns its name.
   * Since most mobile Webkits have timing issues with animation-delay,
   * we create separate rules for each line/segment.
   */
  function addAnimation(alpha, trail, i, lines) {
    var name = ['opacity', trail, ~~(alpha*100), i, lines].join('-')
      , start = 0.01 + i/lines * 100
      , z = Math.max(1 - (1-alpha) / trail * (100-start), alpha)
      , prefix = useCssAnimations.substring(0, useCssAnimations.indexOf('Animation')).toLowerCase()
      , pre = prefix && '-' + prefix + '-' || ''

    if (!animations[name]) {
      sheet.insertRule(
        '@' + pre + 'keyframes ' + name + '{' +
        '0%{opacity:' + z + '}' +
        start + '%{opacity:' + alpha + '}' +
        (start+0.01) + '%{opacity:1}' +
        (start+trail) % 100 + '%{opacity:' + alpha + '}' +
        '100%{opacity:' + z + '}' +
        '}', sheet.cssRules.length)

      animations[name] = 1
    }

    return name
  }

  /**
   * Tries various vendor prefixes and returns the first supported property.
   */
  function vendor(el, prop) {
    var s = el.style
      , pp
      , i

    prop = prop.charAt(0).toUpperCase() + prop.slice(1)
    for(i=0; i<prefixes.length; i++) {
      pp = prefixes[i]+prop
      if (s[pp] !== undefined) return pp
    }
    if (s[prop] !== undefined) return prop
  }

  /**
   * Sets multiple style properties at once.
   */
  function css(el, prop) {
    for (var n in prop)
      el.style[vendor(el, n)||n] = prop[n]

    return el
  }

  /**
   * Fills in default values.
   */
  function merge(obj) {
    for (var i=1; i < arguments.length; i++) {
      var def = arguments[i]
      for (var n in def)
        if (obj[n] === undefined) obj[n] = def[n]
    }
    return obj
  }

  /**
   * Returns the absolute page-offset of the given element.
   */
  function pos(el) {
    var o = { x:el.offsetLeft, y:el.offsetTop }
    while((el = el.offsetParent))
      o.x+=el.offsetLeft, o.y+=el.offsetTop

    return o
  }

  /**
   * Returns the line color from the given string or array.
   */
  function getColor(color, idx) {
    return typeof color == 'string' ? color : color[idx % color.length]
  }

  // Built-in defaults

  var defaults = {
    lines: 12,            // The number of lines to draw
    length: 7,            // The length of each line
    width: 5,             // The line thickness
    radius: 10,           // The radius of the inner circle
    rotate: 0,            // Rotation offset
    corners: 1,           // Roundness (0..1)
    color: '#000',        // #rgb or #rrggbb
    direction: 1,         // 1: clockwise, -1: counterclockwise
    speed: 1,             // Rounds per second
    trail: 100,           // Afterglow percentage
    opacity: 1/4,         // Opacity of the lines
    fps: 20,              // Frames per second when using setTimeout()
    zIndex: 2e9,          // Use a high z-index by default
    className: 'spinner', // CSS class to assign to the element
    top: '50%',           // center vertically
    left: '50%',          // center horizontally
    position: 'absolute'  // element position
  }

  /** The constructor */
  function Spinner(o) {
    this.opts = merge(o || {}, Spinner.defaults, defaults)
  }

  // Global defaults that override the built-ins:
  Spinner.defaults = {}

  merge(Spinner.prototype, {

    /**
     * Adds the spinner to the given target element. If this instance is already
     * spinning, it is automatically removed from its previous target b calling
     * stop() internally.
     */
    spin: function(target) {
      this.stop()

      var self = this
        , o = self.opts
        , el = self.el = css(createEl(0, {className: o.className}), {position: o.position, width: 0, zIndex: o.zIndex})
        , mid = o.radius+o.length+o.width

      if (target) {
        target.insertBefore(el, target.firstChild||null)
        css(el, {
          left: o.left,
          top: o.top
        })
      }

      el.setAttribute('role', 'progressbar')
      self.lines(el, self.opts)

      if (!useCssAnimations) {
        // No CSS animation support, use setTimeout() instead
        var i = 0
          , start = (o.lines - 1) * (1 - o.direction) / 2
          , alpha
          , fps = o.fps
          , f = fps/o.speed
          , ostep = (1-o.opacity) / (f*o.trail / 100)
          , astep = f/o.lines

        ;(function anim() {
          i++;
          for (var j = 0; j < o.lines; j++) {
            alpha = Math.max(1 - (i + (o.lines - j) * astep) % f * ostep, o.opacity)

            self.opacity(el, j * o.direction + start, alpha, o)
          }
          self.timeout = self.el && setTimeout(anim, ~~(1000/fps))
        })()
      }
      return self
    },

    /**
     * Stops and removes the Spinner.
     */
    stop: function() {
      var el = this.el
      if (el) {
        clearTimeout(this.timeout)
        if (el.parentNode) el.parentNode.removeChild(el)
        this.el = undefined
      }
      return this
    },

    /**
     * Internal method that draws the individual lines. Will be overwritten
     * in VML fallback mode below.
     */
    lines: function(el, o) {
      var i = 0
        , start = (o.lines - 1) * (1 - o.direction) / 2
        , seg

      function fill(color, shadow) {
        return css(createEl(), {
          position: 'absolute',
          width: (o.length+o.width) + 'px',
          height: o.width + 'px',
          background: color,
          boxShadow: shadow,
          transformOrigin: 'left',
          transform: 'rotate(' + ~~(360/o.lines*i+o.rotate) + 'deg) translate(' + o.radius+'px' +',0)',
          borderRadius: (o.corners * o.width>>1) + 'px'
        })
      }

      for (; i < o.lines; i++) {
        seg = css(createEl(), {
          position: 'absolute',
          top: 1+~(o.width/2) + 'px',
          transform: o.hwaccel ? 'translate3d(0,0,0)' : '',
          opacity: o.opacity,
          animation: useCssAnimations && addAnimation(o.opacity, o.trail, start + i * o.direction, o.lines) + ' ' + 1/o.speed + 's linear infinite'
        })

        if (o.shadow) ins(seg, css(fill('#000', '0 0 4px ' + '#000'), {top: 2+'px'}))
        ins(el, ins(seg, fill(getColor(o.color, i), '0 0 1px rgba(0,0,0,.1)')))
      }
      return el
    },

    /**
     * Internal method that adjusts the opacity of a single line.
     * Will be overwritten in VML fallback mode below.
     */
    opacity: function(el, i, val) {
      if (i < el.childNodes.length) el.childNodes[i].style.opacity = val
    }

  })


  function initVML() {

    /* Utility function to create a VML tag */
    function vml(tag, attr) {
      return createEl('<' + tag + ' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">', attr)
    }

    // No CSS transforms but VML support, add a CSS rule for VML elements:
    sheet.addRule('.spin-vml', 'behavior:url(#default#VML)')

    Spinner.prototype.lines = function(el, o) {
      var r = o.length+o.width
        , s = 2*r

      function grp() {
        return css(
          vml('group', {
            coordsize: s + ' ' + s,
            coordorigin: -r + ' ' + -r
          }),
          { width: s, height: s }
        )
      }

      var margin = -(o.width+o.length)*2 + 'px'
        , g = css(grp(), {position: 'absolute', top: margin, left: margin})
        , i

      function seg(i, dx, filter) {
        ins(g,
          ins(css(grp(), {rotation: 360 / o.lines * i + 'deg', left: ~~dx}),
            ins(css(vml('roundrect', {arcsize: o.corners}), {
                width: r,
                height: o.width,
                left: o.radius,
                top: -o.width>>1,
                filter: filter
              }),
              vml('fill', {color: getColor(o.color, i), opacity: o.opacity}),
              vml('stroke', {opacity: 0}) // transparent stroke to fix color bleeding upon opacity change
            )
          )
        )
      }

      if (o.shadow)
        for (i = 1; i <= o.lines; i++)
          seg(i, -2, 'progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)')

      for (i = 1; i <= o.lines; i++) seg(i)
      return ins(el, g)
    }

    Spinner.prototype.opacity = function(el, i, val, o) {
      var c = el.firstChild
      o = o.shadow && o.lines || 0
      if (c && i+o < c.childNodes.length) {
        c = c.childNodes[i+o]; c = c && c.firstChild; c = c && c.firstChild
        if (c) c.opacity = val
      }
    }
  }

  var probe = css(createEl('group'), {behavior: 'url(#default#VML)'})

  if (!vendor(probe, 'transform') && probe.adj) initVML()
  else useCssAnimations = vendor(probe, 'animation')

  return Spinner

}));

function sortHelper(e, tr) {
	var $originals = tr.children();
	var $helper = tr.clone();
	$helper.children().each(function(index) {
		// Set helper cell sizes to match the original sizes
		$(this).width($originals.eq(index).width());
	});
	return $helper;
}

function validateForm(attributeGroupName, uniqueId)
{
	try {

		//var container = $("#container--" + attributeGroupName + '--' + uniqueId);
		var container = $("#record_creation_form_container--" + attributeGroupName + '--' + uniqueId);
		var requiredElements = container.find('.required');
		var valid = true;
		requiredElements.each(function(i) {
			var val = $(this).val();
			val = $.trim(val);
			if (val == '') {
				highlightInvalidFormElement(this);
				valid = false;
			}
		});

		return valid;

	} catch (error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}
		return false;
	}
}

function validateFormElement(element)
{
	try {

		var valid = true;
		var required = $(element).hasClass('required');
		var empty = $(element).val().trim() == '';

		if (required && empty) {
			highlightInvalidFormElement(element);
			valid = false;
		}

		return valid;

	} catch (error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}
		return false;
	}
}

function highlightFormElement(element, borderWidth)
{
	var borderWidth = +borderWidth;
	if (borderWidth <= 1) {
		borderClass = 'redBorder';
	} else {
		borderClass = 'redBorderThick';
	}

	$(element).addClass(borderClass);
	$(element).on('blur', function(event) {
		var val = $(element).val();
		val = $.trim(val);
		if (val != '') {
			$(element).removeClass(borderClass);
		}
	});
}

function highlightInvalidFormElement(element)
{
	var borderWidth = $(element).css('border-left-width');
	if (borderWidth <= 1) {
		borderClass = 'redBorder';
	} else {
		borderClass = 'redBorderThick';
	}

	$(element).addClass(borderClass);
	$(element).on('blur', function(event) {
		var val = $(element).val();
		val = $.trim(val);
		if (val != '') {
			$(element).removeClass(borderClass);
		}
	});
	messageAlert('Please fill in the highlighted areas.', 'errorMessage');
}

function highlightCreationFormElementOnError(elementId, errorMessageContainerElementId, errorMessageElementId, errorMessage)
{
	//var elementBorderColor = $("#" + elementId).css("border-color");
	//var elementBorderWidth = $("#" + elementId).css("border-width");
	//var elementBorderStyle = $("#" + elementId).css("border-style");

	$("#" + errorMessageElementId).text(errorMessage);
	$("#" + errorMessageContainerElementId).show();
	$("#" + elementId).addClass('redBorder');

	$("#" + elementId).on('blur', function(event) {
		var val = $("#" + elementId).val();
		val = $.trim(val);
		if (val != '') {
			$("#" + errorMessageContainerElementId).hide();
			$("#" + errorMessageElementId).text('');
			$("#" + elementId).removeClass('redBorder');
			//$("#" + elementId).css({"border-color": elementBorderColor, "border-width": elementBorderWidth, "border-style": elementBorderStyle});
		}
	});
}

function checkAddressPostalCode(attributeGroupName, uniqueId)
{
	try {

		var address_postal_code = $("#" + attributeGroupName + "--contact_company_offices--address_postal_code--" + uniqueId).val();
		address_postal_code = address_postal_code.replace(/[^0-9]+/g, '');
		var address_postal_codeCharLength = address_postal_code.length;

		if (address_postal_codeCharLength > 4) {

			// Set value of zip after stripping out non-numeric characters
			$("#" + attributeGroupName + "--contact_company_offices--address_postal_code--" + uniqueId).val(address_postal_code);

			var ajaxHandler = window.ajaxUrlPrefix + 'modules-contacts-manager-ajax.php?method=checkAddressPostalCode';
			var ajaxQueryString =
				'attributeGroupName=' + encodeURIComponent(attributeGroupName) +
				'&uniqueId=' + encodeURIComponent(uniqueId) +
				'&address_postal_code=' + encodeURIComponent(address_postal_code);
			var ajaxUrl = ajaxHandler + '&' + ajaxQueryString;

			if (window.ajaxUrlDebugMode) {
				var continueDebug = window.confirm(ajaxUrl);
				if (continueDebug != true) {
					return;
				}
			}

			var returnedJqXHR = $.ajax({
				url: ajaxHandler,
				data: ajaxQueryString,
				success: checkAddressPostalCodeSuccess,
				error: errorHandler
			});
		} else {
			$("#" + attributeGroupName + "--contact_company_offices--address_postal_code--" + uniqueId).val('');
			$("#" + attributeGroupName + "--contact_company_offices--address_city--" + uniqueId).val('');
			$("#" + attributeGroupName + "--contact_company_offices--address_state_or_region--" + uniqueId).val('');

			// @todo Finalize address_country
			//$('#address_country').val('');
		}

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

function checkAddressPostalCodeSuccess(data, textStatus, jqXHR)
{
	try {

		var json = data;

		var attributeGroupName = json.attributeGroupName;
		var uniqueId = json.uniqueId;
		var arrCities = json.arrCities;

		var ary = arrCities[0].split(',');
		var city = $.trim(ary[0]);
		var state = $.trim(ary[1]);
		$("#" + attributeGroupName + "--contact_company_offices--address_city--" + uniqueId).val(city);
		$("#" + attributeGroupName + "--contact_company_offices--address_state_or_region--" + uniqueId).val(state);
		$("#" + attributeGroupName + "--contact_company_offices--address_city--" + uniqueId).focus();

		var options = {
			attributeGroupName: attributeGroupName,
			uniqueId: uniqueId
		};
		$("#" + attributeGroupName + "--contact_company_offices--address_city--" + uniqueId).autocomplete({
	        source: arrCities,
	        autoFocus: false,
	        focus: function(event, ui) {
	        	return updateCityState(event, ui, options);
	        },
	        select: function(event, ui) {
	        	return updateCityState(event, ui, options);
	        }
		});
		if (arrCities.length > 1) {
			$("#" + attributeGroupName + "--contact_company_offices--address_city--" + uniqueId).trigger('keydown');
		}

	} catch (error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

function updateCityState(event, ui, options)
{
	var attributeGroupName = options.attributeGroupName;
	var uniqueId = options.uniqueId;

	var selectedItem = ui.item.label;
	var ary = selectedItem.split(',');
	var city = $.trim(ary[0]);
	var state = $.trim(ary[1]);
	$("#" + attributeGroupName + "--contact_company_offices--address_city--" + uniqueId).val(city);
	$("#" + attributeGroupName + "--contact_company_offices--address_state_or_region--" + uniqueId).val(state);
	return false;
}

// Converts things like &amp; to &.
function decode(html)
{
	if (typeof html === 'string' && html.length > 0) {
	    var div = document.createElement('div');
	    div.innerHTML = html;
	    var decodedHtml = div.childNodes[0].nodeValue;
	    return decodedHtml;
	}
}

function getArrCompaniesFromDropdown(ddlElement)
{
	var arrCompanies = [];
	var options = ddlElement.options;
	for (var i = 1; i < options.length; i++) {
		var id = decode(options[i].getAttribute('value'));
		var name = decode(options[i].innerHTML);
		var company = {
			id: id,     // Fill arrCompanies with 'company' objects.
			name: name, // We use the id and name properties.
			value: name // jQuery uses the value property for autocomplete.
		};
		arrCompanies.push(company);
	}

	return arrCompanies;
}

/**
 * Performs 'cut & paste' of contentElementId's html. Copy & paste would be less
 * code but would cause duplicate ids of form elements, which would be bad.
 *
 * Also, when the user closes the popover, the content is moved back over to
 * contentElementId, ready to be used again next time.
 */
function getPopoverContent(popoverSelector, contentElementId) {
	var content = $("#" + contentElementId).html();
	$("#" + contentElementId).html('');
	$(popoverSelector).on('hide.bs.popover', function() {
		$("#" + contentElementId).html(content);
	});
	return content;
}

/**
 * Performs 'cut & paste' of contentElementId's html. Copy & paste would be less
 * code but would cause duplicate ids of form elements, which would be bad.
 *
 * Also, when the user closes the popover, the content is moved back over to
 * contentElementId, ready to be used again next time.
 */
function getPopoverContentEditDynamic(popoverSelector, contentElementId, subcontract_id) {
	var content = $("#" + contentElementId + '-' + subcontract_id).html();
	$("#" + contentElementId + '-' + subcontract_id).html('');
	$(popoverSelector).on('hide.bs.popover', function() {
		$("#" + contentElementId + '-' + subcontract_id).html(content);
	});
	return content;
}


/**
 * Dropdowns need a little help with styles when using a Mac.
 * However, Firefox doesn't like this trick so we exclude it.
 */
function checkUserAgentForMacintosh()
{
	var isMac = navigator.userAgent.indexOf('Macintosh') > -1;
	var isFirefox = navigator.userAgent.indexOf('Firefox') > -1;
	if (isMac && !isFirefox) {
		$('select:not("[multiple]")').addClass('macOsSelect');
	}
	return isMac;
}

if (typeof HTMLFormElement != 'undefined') {
	HTMLFormElement.prototype.manualReset = function() {
		$("#" + this.id + " textarea, #" + this.id + " input[type=text]").each(function(i) {
			$(this).val('');
		});
		$("#" + this.id + " select").each(function(i) {
			var select = $(this)[0];
			select.selectedIndex = 0;
		});
		return this;
	}
}

if (typeof Date.prototype != 'undefined') {
	Date.prototype.monthNames = [
	    'January', 'February', 'March',
	    'April', 'May', 'June',
	    'July', 'August', 'September',
	    'October', 'November', 'December'
	];

	Date.prototype.shortMonthNames = [
	    'Jan', 'Feb', 'Mar',
	    'Apr', 'May', 'Jun',
	    'Jul', 'Aug', 'Sep',
	    'Oct', 'Nov', 'Dec'
	];

	Date.prototype.getMonthName = function() {
	    return this.monthNames[this.getMonth()];
	};

	Date.prototype.getShortMonthName = function() {
	    return this.shortMonthNames[this.getMonth()];
	};
}

function toUrlString(obj) {
	var arr = [];
	for (var prop in obj) {
		if (typeof obj[prop] == 'number' || typeof obj[prop] == 'string' || typeof obj[prop] == 'boolean') {
			var str = prop + '=' + encodeURIComponent(obj[prop]);
			arr.push(str);
		}
	}
	var urlString = arr.join('&');
	return urlString;
}

function generateUrlStringFromAttributesOfElement(uploaderElement)
{
	try {
		var arrAttributes = uploaderElement.attributes;
		var urlObj = {};
		for (var i = 0; i < arrAttributes.length; i++) {
			var attribute = arrAttributes[i];
			var key = attribute.name;
			var value = attribute.value;
			urlObj[key] = value;
		}

		var urlString = toUrlString(urlObj);
		return urlString;

	} catch (error) {
		return '';
	}
}

/**
 * Constructor function (class definition) for TimedAjaxCall objects.
 * Used by the TimedAjaxCalls module.
 */
function TimedAjaxCall(url) {

	var startTime = Date.now();
	this.url = url;
	this.tag = null;
	this.getElapsedTime = function() {
		var endTime = Date.now();
		var elapsedTime = (endTime - startTime ) / 1000;
		return elapsedTime;
	};
}

/**
 * This module contains operations for benchmarking ajax calls. It does
 * so by timing ajax calls in a queue-like data structure.
 */
var TimedAjaxCalls = (function() {

	var arrTimedAjaxCalls = [];

	function enqueue(timedAjaxCall) {
		arrTimedAjaxCalls.push(timedAjaxCall);
	}

	/**
	 * In a typical scenario this is an actual dequeue operation. However,
	 * there is no guarantee that ajax calls will come back in the same order
	 * they were sent, so "findByUrl" is more accurate than "FIFO" for making
	 * sure we get the expected TimedAjaxCall object from the collection.
	 */
	function dequeue(url) {
		for (var i = 0; i < arrTimedAjaxCalls.length; i++) {
			var timedAjaxCall = arrTimedAjaxCalls[i];
			if (timedAjaxCall.url == url) {
				arrTimedAjaxCalls.splice(i, 1);
				return timedAjaxCall;
			}
		}
		return null;
	}

	function logElapsedTime(url) {
		var timedAjaxCall = dequeue(url);
		var elapsedTime = timedAjaxCall.getElapsedTime();
		var tag = timedAjaxCall.tag;
		if (tag) {
			Console.log(tag + ' ajax elapsed time: ' + elapsedTime + ' seconds');
		} else {
			Console.log('Ajax elapsed time: ' + elapsedTime + ' seconds');
		}
	}

	return {
		enqueue: enqueue,
		dequeue: dequeue,
		logElapsedTime: logElapsedTime
	};

}());

/**
 * This module maintains an array of all ajax calls made by the currently
 * loaded page. It interfaces with the TimedAjaxCalls and Console modules
 * for benchmarking and logging.
 */
var AjaxUrls = (function() {

	var arrAjaxUrls = [];

	// Listen for outgoing ajax calls.
	$(document).bind('ajaxSend', function(event, jqXHR, settings) {
		try {
			var tag = settings.tag;
			var ajaxUrl = settings.url;
			push(ajaxUrl, tag);
		} catch (error) {
			Console.log('AjaxUrls.bind.ajaxSend error: ' + error.message);
		}
	});

	// Listen for incoming ajax call responses, invoke logging and benchmarking methods.
	$(document).bind('ajaxSuccess', function(event, jqXHR, settings) {
		var ajaxUrl = settings.url;
		var data = jqXHR.responseText;
		ajaxComplete(ajaxUrl, data);
	});

	var entityMap = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#39;',
		'/': '&#x2F;'
	};

	function escapeHtml(string) {
		return String(string).replace(/[&<>\"'\/]/g, function(s) {
			return entityMap[s];
		});
	}

	function push(ajaxUrl, tag) {
		var timedAjaxCall = new TimedAjaxCall(ajaxUrl);
		if (tag) {
			var obj = {};
			obj[tag] = ajaxUrl;
			arrAjaxUrls.push(obj);
			timedAjaxCall.tag = tag;
			Console.log(tag + ': ' + ajaxUrl);
		} else {
			arrAjaxUrls.push(ajaxUrl);
			Console.log(ajaxUrl);
		}

		TimedAjaxCalls.enqueue(timedAjaxCall);
	}

	function getLast() {
		if (arrAjaxUrls.length) {
			return arrAjaxUrls[arrAjaxUrls.length-1];
		}
		return null;
	}

	function getAll() {
		return arrAjaxUrls;
	}

	function logLast() {
		if (arrAjaxUrls.length) {
			var ajaxUrl = arrAjaxUrls[arrAjaxUrls.length-1];
			console.log(ajaxUrl);
		} else {
			console.log('none');
		}
	}

	function logAll() {
		for (var i = 0; i < arrAjaxUrls.length; i++) {
			var ajaxUrl = arrAjaxUrls[i];
			if (typeof ajaxUrl == 'object') {
				for (var prop in ajaxUrl) console.log(prop + ': ' + ajaxUrl[prop]);
			} else {
				console.log(ajaxUrl);
			}
		}
	}

	function ajaxComplete(ajaxUrl, data) {
		try {
			data = data.replace(/[\n\t]/, '');
			if (!data) {
				TimedAjaxCalls.logElapsedTime(ajaxUrl);
				return;
			}
			var truncatedData = data;
			var ellipses = '';
			if (data.length > 200) {
				truncatedData = data.substring(0, 200);
				ellipses = '...';
			}
			var escapedData = escapeHtml(truncatedData);
			var escapedTruncatedData = escapeHtml('--> ' + truncatedData) + ellipses;
			Console.log(escapedTruncatedData);
			TimedAjaxCalls.logElapsedTime(ajaxUrl);
		} catch (error) {
			Console.log('AjaxUrls.bind.ajaxSuccess error: ' + error.message);
		}
	}

	return {
		push: push,
		getLast: getLast,
		getAll: getAll,
		logLast: logLast,
		logAll: logAll,
		ajaxComplete: ajaxComplete
	};

}());

/**
 * Get/set/remove querystring variables using pushState. Uses the
 * popular History.js library that has a fallback for non HTML5 browsers.
 */
var UrlVars = (function() {

	function getQueryStringVariablesAsObject()
	{
		try {

			var querystring = window.location.search;
			if (querystring.charAt(0) == '?') {
				querystring = querystring.substring(1);
			}
			var args = querystring.split('&');
			var obj = {};
			for (var i = 0; i < args.length; i++) {
				var pair = args[i].split('=');
				if (pair.length != 2) {
					continue;
				}
				var key = pair[0];
				var value = pair[1];
				obj[key] = value;
			}

			return obj;

		} catch(error) {
			return {};
		}
	}

	function writeQueryStringVariablesWithObject(obj)
	{
		try {

			var querystring = '?';
			var first = true;
			for (var prop in obj) {
				var pair = prop + '=' + obj[prop];
				if (first) {
					first = false;
				} else {
					querystring += '&';
				}
				querystring += pair;
			}

			History.pushState({}, '', querystring);

		} catch(error) {
			Console.log('History.pushState error: ' + error)
		}
	}

	function get(key)
	{
		var obj = getQueryStringVariablesAsObject();
		var value = obj[key];
		return value;
	}

	function set(key, value)
	{
		var obj = getQueryStringVariablesAsObject();
		obj[key] = value;
		writeQueryStringVariablesWithObject(obj);
	}

	function remove(key)
	{
		var obj = getQueryStringVariablesAsObject();
		delete obj[key];
		writeQueryStringVariablesWithObject(obj);
	}

	return {
		get: get,
		set: set,
		remove: remove
	};

}());

/**
 * This module contains operations for performing client side storage. Tries first
 * to store using HTML5 storage. If that's not available, uses cookies instead.
 */
var ClientVars = (function() {

	function get(key) {
		if (window.localStorage) {
			var value = window.localStorage.getItem(key);
		} else {
			var value = getCookie(key);
		}
		if (value == 'true') {
			return true;
		} else if (value == 'false') {
			return false;
		}
		return value;
	}

	function set(key, value) {
		if (window.localStorage) {
			window.localStorage.setItem(key, value);
		} else {
			setCookie(key, value, 365);
		}
	}

	function remove(key) {
		if (window.localStorage) {
			window.localStorage.removeItem(key);
		} else {
			deleteCookie(key);
		}
	}

	return {
		get: get,
		set: set,
		remove: remove
	};

}());

/**
 * This module contains the behaviour for our custom Javascript
 * console.
 */
var Console = (function() {

	var consoleContainer = $("#containerConsoleWindow");
	var consoleUl = $("#ulConsoleWindow");
	var consolePrompt = $("#containerConsoleWindow input");

	function toggle() {
		consoleContainer.toggleClass('hidden');
		var consoleHidden = consoleContainer.hasClass('hidden');
		ClientVars.set('consoleHidden', consoleHidden);
	}

	function restore() {
		var consoleHidden = ClientVars.get('consoleHidden');
		if (consoleHidden) {
			consoleContainer.addClass('hidden');
		} else {
			consoleContainer.removeClass('hidden');
		}
		var consoleItems = ClientVars.get('consoleItems');
		if (consoleItems) {
			consoleUl.html(consoleItems);
			scroll('fast');
		}
	}

	function log(text) {
		if (window.consoleLoggingMode) {
			var li = '<li>' + text + '</li>';
			consoleUl.append(li);
			scroll('slow');
			var consoleItems = consoleUl.html();
			ClientVars.set('consoleItems', consoleItems);
		}
	}

	function logPrompt() {
		var text = consolePrompt.val();
		log(text);
		consolePrompt.val('');
	}

	function scroll(speed) {
		if (speed != 'slow') {
			speed = 'fast';
		}
		var scrollHeight = consoleUl.prop('scrollHeight') + 50;
		consoleUl.animate({ scrollTop: scrollHeight }, speed);
	}

	function clear() {
		consoleUl.html('');
		ClientVars.remove('consoleItems');
	}

	return {
		toggle: toggle,
		restore: restore,
		log: log,
		logPrompt: logPrompt,
		scroll: scroll,
		clear: clear
	};

}());

function toggleConfirmRemoveElement(domControlElementId)
{
	if ($("#" + domControlElementId).hasClass("entypo-plus-squared")) {

		$("#" + domControlElementId).removeClass("entypo-plus-squared");
		$("#" + domControlElementId).addClass("entypo-minus");

	} else {

		$("#" + domControlElementId).removeClass("entypo-minus");
		$("#" + domControlElementId).addClass("entypo-plus-squared");

	}
}

function expandCollapseContent_Arrow(contentElementId, iconElementId)
{

	$("#" + contentElementId).toggle();

	if ($("#" + iconElementId).hasClass("ui-icon ui-icon-triangle-1-e")) {

		$("#" + iconElementId).removeClass("ui-icon ui-icon-triangle-1-e");
		$("#" + iconElementId).addClass("ui-icon ui-icon-triangle-1-s");

	} else {

		$("#" + iconElementId).removeClass("ui-icon ui-icon-triangle-1-s");
		$("#" + iconElementId).addClass("ui-icon ui-icon-triangle-1-e");

	}

}

function expandCollapseContent_Entypo(contentElementId, iconElementId)
{

	$("#" + contentElementId).toggle();

	if ($("#" + iconElementId).hasClass("entypo-plus-squared")) {

		$("#" + iconElementId).removeClass("entypo-plus-squared");
		$("#" + iconElementId).addClass("entypo-minus");

	} else {

		$("#" + iconElementId).removeClass("entypo-minus");
		$("#" + iconElementId).addClass("entypo-plus-squared");

	}

}

/**
 * Remove a DOM element directly by id.
 */
function removeDomElement(domElementId)
{
	$("#" + domElementId).remove();
}

/**
 * Remove a list of DOM elements directly by id.
 */
function removeDomElementList(arrDomElementIds)
{

	$.each(arrDomElementIds, function( tmpIndex, tmpElementId ) {
		$("#" + tmpElementId).remove();
	});

}

/**
 * Remove a DOM element by removing it parent element.
 * 1) Get the closest parent element tag to the given child element.
 * 2) Remove the parent element and all of its children.
 */
function removeParentElement(sourceElement, parentElementTag)
{
	var removeElement = $(sourceElement).closest(parentElementTag);
	$(removeElement).remove();
}

function clearInputValue(DomElementId)
{
	var element = $("#" + DomElementId);
	if (typeof element !== "undefined") {
		$(element).val('');
	}
}

function clearElementValue(element)
{
	if (typeof element !== "undefined") {
		$(element).val('');
	}
}

function showHideDomElement(domElementId)
{
	$("#" + domElementId).toggle();
}

function showHideDomElementList(cssClassSelector)
{
	$("." + cssClassSelector).toggle();
}

/**
 * Toggle all checkboxes with a given css class to either checked or unchecked.
 *
 * @param {object} element - "Select All" checkbox.
 * @param {string} checkboxClass - CSS class that is on the set of checkboxes to manipulate.
 * @param {array} arrCheckboxIdsToUncheck - Array of checkbox element ids to uncheck.
 * @param {array} arrCheckboxClassesToUncheck - Array of CSS classes that is on a set of checkboxes to uncheck.
 * @param {array} arrCheckboxIdsToCheck - Array of CSS classes that is on a set of checkboxes to check.
 * @param {array} arrCheckboxClassesToCheck - Array of checkbox element ids to check.
 * @param {object} options - Configuration directives.
 */
function toggleCheckboxes(element, checkboxClass, arrCheckboxIdsToUncheck, arrCheckboxClassesToUncheck, arrCheckboxIdsToCheck, arrCheckboxClassesToCheck, options)
{
	try {

		// If the options object was not passed as an argument, create it here.
		var options = options || {};
		var promiseChain = options.promiseChain;

		// Debug
		//alert(element);
		//alert(checkboxClass);
		//alert(arrCheckboxIdsToUncheck);
		//alert(arrCheckboxClassesToUncheck);
		//alert(arrCheckboxIdsToCheck);
		//alert(arrCheckboxClassesToCheck);
		//alert(options);

		// Debug
		// E.g.    id = "attributeGroupName--attributeSubgroupName--attributeName--uniqueId"
		// E.g. class = "attributeGroupName--attributeSubgroupName--attributeName"
		/*
		var arrParts = checkboxClass.split('--');
		var attributeGroupName = arrParts[0];
		var attributeSubgroupName = arrParts[1];
		var attributeName = arrParts[2];
		alert('attributeGroupName: ' + attributeGroupName + ' attributeSubgroupName: ' + attributeSubgroupName + ' attributeName: ' + attributeName);
		*/

		if (typeof arrCheckboxIdsToUncheck != 'undefined') {
			$.each(arrCheckboxIdsToUncheck, function( tmpIndex, tmpCheckboxId ) {
				$("#" + tmpCheckboxId).prop('checked', false);
			});
		}

		if (typeof arrCheckboxClassesToUncheck != 'undefined') {
			$.each(arrCheckboxClassesToUncheck, function( tmpIndex, tmpCheckboxClass ) {
				$("." + tmpCheckboxClass).prop('checked', false);
			});
		}

		if (typeof arrCheckboxIdsToCheck != 'undefined') {
			$.each(arrCheckboxIdsToCheck, function( tmpIndex, tmpCheckboxId ) {
				$("#" + tmpCheckboxId).prop('checked', true);
			});
		}

		if (typeof arrCheckboxClassesToCheck != 'undefined') {
			$.each(arrCheckboxClassesToCheck, function( tmpIndex, tmpCheckboxClass ) {
				$("." + tmpCheckboxClass).prop('checked', true);
			});
		}

		//var checked = element.checked;
		var checked = $(element).is(':checked') || false;
		$("." + checkboxClass).prop('checked', checked);

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}
	}
}

/**
 * Set all checkboxes with a given css class selector pattern (prefix) to be either checked or unchecked.
 *
 * @param {string} cssClassSelectorPrefix - css class prefix.
 * @param {bool} checkedState - true (checked) or false (unchecked).
 */
function assignCheckboxStatesByCssClassSelectorPrefix(cssClassSelectorPrefix, checkedState)
{

	try {

		$("[class^=" + cssClassSelectorPrefix + "]").prop('checked', checkedState);

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

/**
 * Set all checkboxes with a given css id selector pattern (prefix) to be either checked or unchecked.
 *
 * @param {string} cssIdSelectorPrefix - css id prefix.
 * @param {bool} checkedState - true (checked) or false (unchecked).
 */
function assignCheckboxStatesByCssIdSelectorPrefix(cssIdSelectorPrefix, checkedState)
{

	try {

		$("[id^=" + cssIdSelectorPrefix + "]").prop('checked', checkedState);

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}

}

/**
 * Click a checkbox by passing in the element id of that checkbox.
 *
 * Will trigger the onclick handler set inline on the checkbox itself.
 */
function clickCheckboxByElementId(element, javaScriptEvent, checkboxElementId)
{
	// Debug
	//alert(checkboxElementId);

	try {

		// Trap the event to prevent double click problems
		trapJavaScriptEvent(javaScriptEvent);

		$("#" + checkboxElementId).click();

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}

}

function updateIndenticalOriginDataOnPage(data, textStatus, jqXHR, updateType)
{
	try {

		var json = data;
		var errorNumber = json.errorNumber;

		if (errorNumber == 0) {

			var attributeGroupName = json.attributeGroupName;
			var attributeSubgroupName = json.attributeSubgroupName;
			var attributeName = json.attributeName;
			var uniqueId = json.uniqueId;
			var newValue = json.newValue;

			// Identical Origin Data Grouping
			var originDataId = attributeSubgroupName + '--' + attributeName + '--' + uniqueId;

			if (typeof updateType == 'undefined') {
				updateType = 'val';
			}

			if ((updateType == 'val') || (updateType == 'both')) {

				$("[data-origin-id='"+ originDataId + "']").val(newValue);

			}

			if ((updateType == 'html') || (updateType == 'both')) {

				$("[data-origin-id='"+ originDataId + "']").html(newValue);
			}

		}

	} catch (error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

function clickPreviousHiddenFileInput(element)
{
	$(element).prev().click();
}

function ddlOnChange_UpdateHiddenInputValue(selectElement, hiddenElementId)
{
	try {

		// Get the <select> element value
		var ddlValue = $(selectElement).val();

		if (typeof hiddenElementId == 'undefined') {

			// Derive the hiddenElementId value

			// Get the <select> element id
			var selectElementId = $(selectElement).attr('id');

			// Test for ddl-- prepended to the element id
			// Get the first five characters of the element id string
			var selectElementIdSubstring = selectElementId.substring(0, 5);
			if (selectElementIdSubstring == 'ddl--') {
				var originalElementId = selectElementId;
				// Strip off "ddl--" from the element id
				hiddenElementId = selectElementId.substring(5);
			}

		}

		// Assign the hidden element the value of <select>
		$("#" + hiddenElementId).val(ddlValue);

		// Debug
		//alert(ddlValue);
		//alert(hiddenElementId);

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

function appendQueryStringToURL(url, queryString)
{
	var url = url + '';

	if (url.indexOf('?') >= 0) {
		var separator = '&';
	} else {
		var separator = '?';
	}

	var finalUrl = url + separator + queryString;

	return finalUrl
}

function addURLParameter(url, key, value)
{
	var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
	var separator = url.indexOf('?') !== -1 ? "&" : "?";
	if (url.match(re)) {
		var returnValue = url.replace(re, '$1' + key + "=" + value + '$2');
	} else {
		var returnValue = url + separator + key + "=" + value;
	}

	return returnValue
}

function removeURLParameter(url, parameter)
{
    //prefer to use l.search if you have a location/link object
    var urlparts= url.split('?');
    if (urlparts.length>=2) {

        var prefix= encodeURIComponent(parameter)+'=';
        var pars= urlparts[1].split(/[&;]/g);

        //reverse iteration as may be destructive
        for (var i= pars.length; i-- > 0;) {
            //idiom for string.startsWith
            if (pars[i].lastIndexOf(prefix, 0) !== -1) {
                pars.splice(i, 1);
            }
        }

        url= urlparts[0]+'?'+pars.join('&');
        return url;
    } else {
        return url;
    }
}

function searchSelectDropDownList(searchTextElement, selectElementId, options)
{
	var searchToken = $(searchTextElement).val();
	searchToken = searchToken.toLowerCase();

	var searchTokenLength = searchToken.length;
	if (searchTokenLength < 2) {
		return;
	}

	$("#" + selectElementId + " option").each( function() {

		//var optionText = this.text;
		//var optionValue = this.value;

		var optionText = $(this).text();
		optionText = optionText.toLowerCase();

		var optionValue = $(this).val();

		var matchedIndex = optionText.indexOf(searchToken);
		if (matchedIndex > -1 ) {
			$("#" + selectElementId).val(optionValue);
			//return;
		}

	});

	/*
	if (searchToken == '') {
		arrOptions[0].selected = true;
	}
	*/
}

function resetFormElements(formElementId)
{
	$("#" + formElementId).find('input:text, input:password, input:file, select, textarea').val('');
	$("#" + formElementId).find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected');
}

function htmlEncode(unencodedValue)
{
	var htmlEncodedString = $('<div/>').text(unencodedValue).html();
	return htmlEncodedString;
}

function htmlDecode(encodedValue)
{
	var htmlUnencodedString = $('<div/>').html(encodedValue).text();
	return htmlUnencodedString;
}

function confirmationDialog(options)
{
	var deferredObject = $.Deferred();

	var options = options || {};
	var confirmationDialogMessage = options.confirmationDialogMessage || 'Please Confirm';
	var confirmationDialogTitle = options.confirmationDialogTitle || 'Please Confirm';
	var confirmButtonText = options.confirmButtonText || 'Okay';
	var cancelButtonText = options.cancelButtonText || 'Cancel';
	var confirmationDialogWidth = options.confirmationDialogWidth || 400;
	var confirmationDialogHeight = options.confirmationDialogHeight || 200;
	var confirmationDialogNoButtonFocus = options.confirmationDialogNoButtonFocus || true;

	//var windowWidth = $(window).width();
	//var windowHeight = $(window).height();
	//var confirmationDialogWidth = windowWidth * 0.60;
	//var confirmationDialogHeight = windowHeight * 0.60;

	// <input type="hidden" autofocus>

	if (confirmationDialogNoButtonFocus) {
		//confirmationDialogMessage = '<div  autofocus>' + confirmationDialogMessage + '</div>';
	}

	$("#modalDialogContainer").removeClass('hidden');
	$("#modalDialogContainer").html(confirmationDialogMessage);
	$("#modalDialogContainer").removeClass('hidden');
	$("#modalDialogContainer").dialog({
		resizable: true,
		closeOnEscape: true,
		width: confirmationDialogWidth,
		height: confirmationDialogHeight,
		modal: true,
		title: confirmationDialogTitle,
		open: function(event, ui) {
			$("body").addClass('noscroll');
		},
		close: function(event, ui) {
			$("body").removeClass('noscroll');
			$("#modalDialogContainer").addClass('hidden');
			$("#modalDialogContainer").dialog('destroy');
			$("#modalDialogContainer").html('');
		},
		buttons: [
			{
				text: confirmButtonText,
				click: function() {
					$(this).dialog('close');
					deferredObject.resolve();
				}
			},
			{
				text: cancelButtonText,
				click: function() {
					$(this).dialog('close');
					deferredObject.reject();
				}
			}
		]
	});

	//$("#modalDialogContainer").focus();
	//$(".ui-dialog-titlebar-close").css('border', 0);
	//$("#ui-id-1").focus();
	//$(".ui-icon-closethick").focus();
	//$(".ui-button-text").css('border', '0');
	//$("#modalDialogContainer").click();

	$(".ui-dialog-titlebar-close").focus();

	return deferredObject.promise();
}

// email popup js start
// To open a popup for cc and bcc
function openProjectContactsMailing(moduleName,moduleid)
{
	var ajaxHandler = window.ajaxUrlPrefix + 'modules-service-ajax.php?method=loadContactForMail';
		var ajaxQueryString =
			'moduleName=' + moduleName +
			'&moduleid=' + moduleid;
		var ajaxUrl = ajaxHandler + '&' + ajaxQueryString;

		if (window.ajaxUrlDebugMode) {
			var continueDebug = window.confirm(ajaxUrl);
			if (continueDebug != true) {
				return;
			}
		}

		var arrSuccessCallbacks = [ openProjectContactsMailingsuccess ];
		var returnedJqXHR = $.ajax({
			url: ajaxHandler,
			data: ajaxQueryString,
			success: arrSuccessCallbacks,
			error: errorHandler
		});

}
function openProjectContactsMailingsuccess(data, textStatus, jqXHR){
		var json = data;
		var errorNumber = json.errorNumber;


			var htmlContent = json.htmlContent;
	try{
			var windowWidth = $(window).width();
			var windowHeight = $(window).height();

			var dialogWidth = windowWidth * 0.99;
			var dialogHeight = windowHeight * 0.98;

			$("#divContactMail").html(htmlContent);
			$("#divContactMail").removeClass('hidden');
			$("#divContactMail").dialog({
				modal: true,
				title: 'Contact for email — '+$("#currentlySelectedProjectName").val(),
				width: dialogWidth,
				height: dialogHeight,
				open: function() {
					$("body").addClass('noscroll');
					loademailcurrentlist();
				},
				close: function() {
					$("body").removeClass('noscroll');
					$("#divContactMail").addClass('hidden');
					$("#divContactMail").dialog('destroy');
				},
				buttons: {
					'Add Email': function() {
						$("#divContactMail").dialog('close');
						AddEmailtoRespectArea();
					},
					'Close': function() {
						$("#divContactMail").dialog('close');
					}
					
				}
			});
			$('.mul-sel').fSelect({
			showSelectAll: true
		});
	}catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}
// to filter against the role
function filteragainstRole(filrole,search)
{
	if(filrole !="")
	{
		var role_ids = $('#project_roles').val();
	}else{
		var role_ids ="";
	}
	if(role_ids ==null){
		role_ids ="";
	}
	if(filrole==0)
	{
		$('.fs-search').empty();
		$('.fs-label').empty().append('Select some option');
		$('.fs-search').empty();
			$.each($(".fs-option"), function(){ 
			$('.fs-option').removeClass('selected');
		});

	}
	var search_text = $('#searchemail').val();
	var moduleName =$('#moduleName').val();
	var moduleid =$('#moduleid').val();
	var emailTo = $("#emailTo").val();
	var emailCc= $("#emailCc").val();
	var emailBcc = $("#emailBcc").val();
	// to remove the comma
	emailTo = emailTo.replace(/^,/, '');	
	emailCc = emailCc.replace(/^,/, '');
	emailBcc = emailBcc.replace(/^,/, '');

	var ajaxHandler = window.ajaxUrlPrefix + 'modules-service-ajax.php?method=filterRolesforcontactmail';
		var ajaxQueryString ='role_ids=' + role_ids +
		'&search=' + search_text +	
		'&emailTo=' + emailTo +
		'&emailCc=' + emailCc +
		'&emailBcc=' + emailBcc +
		'&moduleName=' + moduleName +
		'&moduleid=' + moduleid;
		var ajaxUrl = ajaxHandler + '&' + ajaxQueryString;
		var returnedJqXHR = $.ajax({
			url: ajaxHandler,
			data: ajaxQueryString,
			success: function(res)
			{
				$("#divemaildata").empty().append(res);
			},
		});
}
// To load the previously selected email list
function loadpreviouslyemailList(moduleName)
{
	var ajaxHandler = window.ajaxUrlPrefix + 'modules-service-ajax.php?method=loadpreviouslyemailList';
		var ajaxQueryString ='moduleName=' + moduleName +
		'&headerType=To'+
		'&responseDataType=json';
		var ajaxUrl = ajaxHandler + '&' + ajaxQueryString;
		var returnedJqXHR = $.ajax({
			url: ajaxHandler,
			data: ajaxQueryString,
			datatype:"JSON",
			success: function(res)
			{
				var arr=res.split(',');
				for (i = 0; i < arr.length; i++) {
					$("#toindiv_"+arr[i]).prop('checked',true);
					$("#emailCon_"+arr[i]).addClass("purStyle");
				}
			},
		});

		var ajaxQueryString ='moduleName=' + moduleName +
		'&headerType=Cc'+
		'&responseDataType=json';
		var ajaxUrl = ajaxHandler + '&' + ajaxQueryString;
		var returnedJqXHR = $.ajax({
			url: ajaxHandler,
			data: ajaxQueryString,
			datatype:"JSON",
			success: function(res)
			{
				var arr=res.split(',');
				for (i = 0; i < arr.length; i++) {
					$("#ccindiv_"+arr[i]).prop('checked',true);
					$("#emailCon_"+arr[i]).addClass("purStyle");
				}

			},
		});

		var ajaxQueryString ='moduleName=' + moduleName +
		'&headerType=Bcc'+
		'&responseDataType=json';
		var ajaxUrl = ajaxHandler + '&' + ajaxQueryString;
		var returnedJqXHR = $.ajax({
			url: ajaxHandler,
			data: ajaxQueryString,
			datatype:"JSON",
			success: function(res)
			{
				var arr=res.split(',');
				for (i = 0; i < arr.length; i++) {
					$("#bccindiv_"+arr[i]).prop('checked',true);
					$("#emailCon_"+arr[i]).addClass("purStyle");
				}

			},
		});
}
function emailhighlight(curid,value,conid,type)
{
		// checkbox behave link radio button
		var checken =$("#"+curid).prop('checked');

		$(".chb_"+conid).prop('checked', false);
		// to remove the id in all list
		var toarr1 =$("#emailTo").val();
		toarr1 = toarr1.replace(','+conid, "");		
		var ccarr1 =$("#emailCc").val();
		ccarr1 = ccarr1.replace(','+conid, "");		
		var bccarr1 =$("#emailBcc").val();
		bccarr1 = bccarr1.replace(','+conid, "");
		$("#emailTo").val(toarr1);
		$("#emailCc").val(ccarr1);
		$("#emailBcc").val(bccarr1);
		//End of  remove the id in all list


    // to enable currretly select one if it is selected
    if(checken)
    {
    	$("#"+curid).prop('checked', true);
    }
    // End of checkbox behave link radio button

	var tocheck =$("#toindiv_"+conid).prop('checked');
	var cccheck =$("#ccindiv_"+conid).prop('checked');
	var bcccheck =$("#bccindiv_"+conid).prop('checked');
	// To get the prev val in array
	var toarr =[$("#emailTo").val()];
	var ccarr =[$("#emailCc").val()];
	var bccarr =[$("#emailBcc").val()];
	if(tocheck)
	{
		$("#emailCon_"+conid).addClass("purStyle");
		toarr.push(conid);
		
	}else if(cccheck)
	{
		$("#emailCon_"+conid).addClass("purStyle");
		ccarr.push(conid);
	}else if(bcccheck)
	{
		$("#emailCon_"+conid).addClass("purStyle");
		bccarr.push(conid);
	}
	else{
		$("#emailCon_"+conid).removeClass("purStyle");

		// to remove the email id from the list header
		if(type=='To')
		{
			var toarr =$("#emailTo").val();
			toarr = toarr.replace(','+conid, "");
		}else if(type=='Cc')
		{
			var ccarr =$("#emailCc").val();
			 ccarr = ccarr.replace(','+conid, "");
		}else{
			var bccarr =$("#emailBcc").val();
			 bccarr = bccarr.replace(','+conid, "");
		}
		
		
	}
	$("#emailTo").val(toarr);
	$("#emailCc").val(ccarr);
	$("#emailBcc").val(bccarr);

}

//End of  email popup js 
