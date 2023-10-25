//
// Documentation: http://www.abeautifulsite.net/blog/2008/03/jquery-file-tree/
//
// jQuery File Tree Plugin
//
// Version 1.01
//
// Cory S.N. LaViska
// A Beautiful Site (http://abeautifulsite.net/)
// 24 March 2008
//
// Visit http://abeautifulsite.net/notebook.php?article=58 for more information
//
// Usage: $(".fileTreeDemo").fileTree( options, callback )
//
// Options:  root           - root folder to display; default = /
//           script         - location of the serverside AJAX file to use; default = jqueryFileTree.php
//           folderEvent    - event to trigger expand/collapse; default = click
//           expandSpeed    - default = 500 (ms); use -1 for no animation
//           collapseSpeed  - default = 500 (ms); use -1 for no animation
//           expandEasing   - easing function to use on expand (optional)
//           collapseEasing - easing function to use on collapse (optional)
//           multiFolder    - whether or not to limit the browser to one subfolder at a time
//           loadMessage    - Message to display while initial tree loads (can be HTML)
//
// History:
//
// 1.01 - updated to work with foreign characters in directory/file names (12 April 2008)
// 1.00 - released (24 March 2008)
//
// TERMS OF USE
//
// This plugin is dual-licensed under the GNU General Public License and the MIT License and
// is copyright 2008 A Beautiful Site, LLC. 
//

var lastATagClicked;
var downloadInProgress;

// File Tree Default Parameters
var fileTreeParams = {};
if ( !fileTreeParams ) var fileTreeParams = {};
if ( fileTreeParams.root == undefined ) fileTreeParams.root = '';
if ( fileTreeParams.script == undefined ) fileTreeParams.script = '/modules-file-manager-file-browser-ajax.php?method=loadFiles';
if ( fileTreeParams.folderEvent == undefined ) fileTreeParams.folderEvent = 'click';
if ( fileTreeParams.expandSpeed == undefined ) fileTreeParams.expandSpeed= 50;
if ( fileTreeParams.collapseSpeed == undefined ) fileTreeParams.collapseSpeed= 50;
if ( fileTreeParams.expandEasing == undefined ) fileTreeParams.expandEasing = null;
if ( fileTreeParams.collapseEasing == undefined ) fileTreeParams.collapseEasing = null;
if ( fileTreeParams.multiFolder == undefined ) fileTreeParams.multiFolder = true;
if ( fileTreeParams.loadMessage == undefined ) fileTreeParams.loadMessage = 'Loading...';

function showTree(c, t)
{
	// Debug
	//alert(c);
	//alert(t);

	$(c).addClass('wait');
	$(".jqueryFileTree.start").remove();
	var cAttributeId = $(c).attr('id');
	loadDetails(cAttributeId, 'folder');
	configureUserInterface();

	var isTrash = 'no';
	var trashRel = $("#" + cAttributeId).attr('rel');
	var isFolderTrash = 1;
	if(trashRel != '/Trash/'){
		 isFolderTrash = trashRel.indexOf('/Trash/');
	}
	if (isFolderTrash == 0) {
		isTrash = 'yes';
	}

	var ajaxHandler = fileTreeParams.script;
	var ajaxQueryString =
	'dir=' + encodeURIComponent(t) +
	'isTrash=' + isTrash;
	var ajaxUrl = ajaxHandler + '&' + ajaxQueryString;
	if (window.ajaxUrlDebugMode) {
		var continueDebug = window.confirm(ajaxUrl);
		if (continueDebug != true) {
			return;
		}
	}

	$.postq('ajaxqueue', fileTreeParams.script, {
		dir : t,
		isTrash : isTrash
	}, function(data) {
		//alert($(c).attr('id'));
		$(c).find('.start').html('');
		$(c).removeClass('wait');
		$(c).children('ul').empty();
		//alert(data);
		$(c).append(data);
		if (fileTreeParams.root == t) {
			$(c).find('ul:hidden').show();
		} else {
			$(c).find('ul:hidden').slideDown({
				duration : fileTreeParams.expandSpeed,
				easing : fileTreeParams.expandEasing
			});
		}
		bindTree(c);
	});
}

function bindTree(t)
{

	$(t).find('li a').bind(fileTreeParams.folderEvent, function(e) {				// bind is executed when clicking or selecting and <a> tag

		$(".rightClickMenu").hide();													// Hide the Right Click Menu

		

		if (e.ctrlKey || e.metaKey) {												// Keyboard control key is depressed

			lastATagClicked = $(this);												// Set the lastATagClicked

			if ($(this).hasClass('ui-selected')) {									// Is clicked/selected item currently selected
				$(this).removeClass('ui-selected');									// Unselect the item
				if ($(this).parent().hasClass('directory')) {						// If it's a folder with children then unselect them too
				$(this).parent().find('a').removeClass('ui-selected');
			}
		} else {																// Item is NOT currently selected
			$(this).addClass('ui-selected');									// Make item selected
			if ($(this).parent().hasClass('directory')) {
				$(this).parent().find('a').addClass('ui-selected');				// If it's a folder with children then select them too
			}
		}
		configureUserInterface();															// Manipulate what is viewable on the page.
		return false;															// Execution Stops Here for bind method
	}

	if (e.shiftKey) {
		//e.preventDefault();														// Prevent normal execution of event
		e.preventDefault ? e.preventDefault() : e.returnValue = false;

		var thisIndex = $(".jqueryFileTree li a").index( $(this) );
		var lastIndex = $(".jqueryFileTree li a").index( $(lastATagClicked) );
		var startLoop, endLoop;
		if (thisIndex < lastIndex) {
			startLoop = thisIndex;
			endLoop = lastIndex;
		} else {
			startLoop = lastIndex;
			endLoop = thisIndex;
		}
		var itemToSelect;
		for(var i = startLoop; i <= endLoop; i++) {
			itemToSelect = $(".jqueryFileTree li a").get(i);
			lastATagClicked = $(itemToSelect);
			$(".rightClickMenu").hide();
			$(itemToSelect).addClass('ui-selected');
			if ($(itemToSelect).parent().hasClass('directory')) {
				$(itemToSelect).parent().find('a').addClass('ui-selected');
			}

		}
		configureUserInterface();
		return false;
	}

	lastATagClicked = this;
	$(".rightClickMenu").hide();

	if ( $(this).parent().hasClass('directory') ) {
		if ( $(this).parent().hasClass('collapsed') ) {
			// Expand
			if ( !fileTreeParams.multiFolder ) {
				$(this).parent().parent().find('ul').slideUp({ duration: fileTreeParams.collapseSpeed, easing: fileTreeParams.collapseEasing });
				$(this).parent().parent().find('li.directory').removeClass('expanded').addClass('collapsed');
			}
			$(this).parent().find('ul').remove(); // cleanup
			//showTree( $(this).parent(), escape($(this).attr('rel').match( /.*\// )) );
			showTree( $(this).parent(), escape($(this).attr('rel') ) );
			$(this).parent().removeClass('collapsed').addClass('expanded');
		} else {
			// Collapse
			$(this).parent().find('ul').slideUp({ duration: fileTreeParams.collapseSpeed, easing: fileTreeParams.collapseEasing });
			$(this).parent().removeClass('expanded').addClass('collapsed');
			$(this).parent().find('ul').empty();
			loadDetails($(this).parent().attr('id'), 'folder');
		}
	} else {
		loadPreview($(this).attr('rel'), $(this).parent().attr('class'));
	}
	return false;
});
$(".pod_loader_img").hide();
$('[data-toggle="tooltip"]').tooltip();
// Prevent A from triggering the # on non-click events
if ( fileTreeParams.folderEvent.toLowerCase != 'click' ) $(t).find('li a').bind('click', function() { return false; });
}

// Based on:
//
// jQuery Context Menu Plugin
//
// Version 1.01
//
// Cory S.N. LaViska
// A Beautiful Site (http://abeautifulsite.net/)
//
// More info: http://abeautifulsite.net/2008/09/jquery-context-menu-plugin/
//
// Terms of Use
//
// This plugin is dual-licensed under the GNU General Public License
//   and the MIT License and is copyright A Beautiful Site, LLC.
//
if (jQuery) (function($) {

	$.extend($.fn, {
		fileTree: function() {

			$(this).each( function() {
				// Loading message
				$(this).html('<ul class="jqueryFileTree start"><li class="wait">' + fileTreeParams.loadMessage + '</li></ul>');
				// Get the initial file list
				showTree( $(this), escape(fileTreeParams.root) );
			});
		}
	});

	$.extend($.fn, {
		contextMenu: function(o, callback) {
			// Defaults
			if ( o.menu == undefined ) return false;
			if ( o.inSpeed == undefined ) o.inSpeed = 75;
			if ( o.outSpeed == undefined ) o.outSpeed = 75;
			// 0 needs to be -1 for expected results (no fade)
			if ( o.inSpeed == 0 ) o.inSpeed = -1;
			if ( o.outSpeed == 0 ) o.outSpeed = -1;

			// Loop each context menu
			$(this).each( function() {
				var el = $(this);
				var offset = $(el).offset();

				// Add rightClickMenu class
				$("#" + o.menu).addClass('rightClickMenu');

				/*
				// Simulate a true right click
				$(this).mousedown( function(e) {
				var evt = e;
				evt.stopPropagation();
				$(this).mouseup( function(e) {
				e.stopPropagation();
				var srcElement = $(this);
				$(this).unbind('mouseup');
				if ( evt.button == 2 ) {
				*/


				$(this).bind('contextmenu', function(e) {

					var srcElement = $(this);

					// Hide context menus that may be showing
					$(".rightClickMenu").hide();
					// Get this context menu
					var menu = $("#" + o.menu);

					if ( $(el).hasClass('disabled') ) return false;

					// Detect mouse position
					var d = {}, x, y;
					if ( self.innerHeight ) {
						d.pageYOffset = self.pageYOffset;
						d.pageXOffset = self.pageXOffset;
						d.innerHeight = self.innerHeight;
						d.innerWidth = self.innerWidth;
					} else if ( document.documentElement &&
						document.documentElement.clientHeight ) {
							d.pageYOffset = document.documentElement.scrollTop;
							d.pageXOffset = document.documentElement.scrollLeft;
							d.innerHeight = document.documentElement.clientHeight;
							d.innerWidth = document.documentElement.clientWidth;
						} else if ( document.body ) {
							d.pageYOffset = document.body.scrollTop;
							d.pageXOffset = document.body.scrollLeft;
							d.innerHeight = document.body.clientHeight;
							d.innerWidth = document.body.clientWidth;
						}
						(e.pageX) ? x = e.pageX : x = e.clientX + d.scrollLeft;
						(e.pageY) ? y = e.pageY : y = e.clientY + d.scrollTop;

						// Show the menu
						$(document).unbind('click');
						$(menu).css({ top: y, left: x }).fadeIn(o.inSpeed);
						// Hover events
						$(menu).find('a').mouseover( function() {
							$(menu).find('li.hover').removeClass('hover');
							$(this).parent().addClass('hover');
						}).mouseout( function() {
							$(menu).find('li.hover').removeClass('hover');
						});

						// Disable Right Click Items As Desired
						if ($(this).parent().hasClass('trash')) {
							alert("eeee")

							if ( $(this).hasClass('ui-selected') == false) {
								$(".jqueryFileTree li a").removeClass('ui-selected');
								lastATagClicked = $(this);
								$(this).addClass('ui-selected');
							}

							$(menu).enableContextMenuItems('#deletePermanent,#restore,#cancel');
							$(menu).disableContextMenuItems('#newFolder,#rename,#delete,#upload,#loadDetails,#extract,#emptyTrash');

							if ( $(this).parent().attr("rel") == "~/Trash/") {
								$(menu).disableContextMenuItems('#deletePermanent,#loadDetails');
								$(menu).enableContextMenuItems('#emptyTrash');
							}

						} else {

							if ($(this).hasClass('ui-selected')) {
								// If right clicked item was selected then find out if there are multiple selections
								if ($(".ui-selected").length > 1) {
									// More than one item selected show modified menu
									$(menu).disableContextMenuItems('#newFolder,#deletePermanent,#upload,#restore,#rename,#cancel,#emptyTrash');
									$(menu).enableContextMenuItems('#delete,#download,#downloadCompressedArchive,#cancel');
									//alert('modified menu');
								} else {
									// One item is selected show normal menu
									//alert('normal menu');
									$(menu).disableContextMenuItems('#deletePermanent,#restore,#emptyTrash');
									$(menu).enableContextMenuItems('#newFolder,#rename,#delete,#upload,#loadDetails,#extract,#cancel');
								}

							} else {
								// If item right clicked was not selected then make it selected
								$(".jqueryFileTree li a").removeClass('ui-selected');
								lastATagClicked = $(this);
								$(this).addClass('ui-selected');

								$(menu).disableContextMenuItems('#deletePermanent,#restore,#emptyTrash');
								$(menu).enableContextMenuItems('#newFolder,#rename,#delete,#upload,#loadDetails,#extract,#cancel');
							}

							if ($(this).parent().hasClass('projectRoot') || $(this).parent().hasClass('companyRoot')) {
								//$(menu).disableContextMenuItems('#rename,#upload,#delete,#loadDetails');
								$(menu).disableContextMenuItems('#rename,#delete,#emptyTrash');
							}

							if ($(this).parent().hasClass("file")) {
								$(menu).disableContextMenuItems('#upload,#newFolder,#emptyTrash');
							}

							if ($(this).parent().attr("class").indexOf('zip') > 0) {
								$(menu).enableContextMenuItems('#extract');
							} else {
								$(menu).disableContextMenuItems('#extract');
							}

						}

						configureUserInterface();

						// Keyboard
						$(document).keypress( function(e) {
							//alert(e.keyCode);
							switch( e.keyCode ) {
								case 38: // up
								if ( $(menu).find('li.hover').size() == 0 ) {
									$(menu).find('li:last').addClass('hover');
								} else {
									$(menu).find('li.hover').removeClass('hover').prevAll('li:not(.disabled)').eq(0).addClass('hover');
									if ( $(menu).find('li.hover').size() == 0 ) $(menu).find('li:last').addClass('hover');
								}
								break;
								case 40: // down
								if ( $(menu).find('li.hover').size() == 0 ) {
									$(menu).find('li:first').addClass('hover');
								} else {
									$(menu).find('li.hover').removeClass('hover').nextAll('li:not(.disabled)').eq(0).addClass('hover');
									if ( $(menu).find('li.hover').size() == 0 ) $(menu).find('li:first').addClass('hover');
								}
								break;
								case 13: // enter
								$(menu).find('li.hover a').trigger('click');
								break;
								case 27: // esc
								$(document).trigger('click');
								break;
							}
						});

						// When items are selected
						$("#" + o.menu).find('a').unbind('click');
						$("#" + o.menu).find('li:not(.disabled) A').click( function() {
							$(document).unbind('click').unbind('keypress');
							$(".rightClickMenu").hide();
							// Callback
							if ( callback ) callback( $(this).attr('href').substr(1), $(srcElement), {x: x - offset.left, y: y - offset.top, docX: x, docY: y} );
							return false;
						});

						// Hide bindings
						setTimeout( function() { // Delay for Mozilla
							$(document).click( function() {
								$(document).unbind('click').unbind('keypress');
								$(menu).fadeOut(o.outSpeed);
								return false;
							});
						}, 0);


						return false;
					});

					/*
				}
			});
		});
		*/
		// Disable text selection
		if ( $.browser.mozilla ) {
			$("#" + o.menu).each( function() { $(this).css({ 'MozUserSelect' : 'none' }); });
		} else if ( $.browser.msie ) {
			$("#" + o.menu).each( function() { $(this).bind('selectstart.disableTextSelect', function() { return false; }); });
		} else {
			$("#" + o.menu).each(function() { $(this).bind('mousedown.disableTextSelect', function() { return false; }); });
		}
		// Disable browser context menu (requires both selectors to work in IE/Safari + FF/Chrome)
		$(el).add($('ul.rightClickMenu')).bind('contextmenu', function() { return false; });
	});

	return $(this);
},

// Disable context menu items on the fly
disableContextMenuItems: function(o) {
	if ( o == undefined ) {
		// Disable all
		$(this).find('li').addClass('disabled');
		return( $(this) );
	}
	$(this).each( function() {
		if ( o != undefined ) {
			var d = o.split(',');
			for( var i = 0; i < d.length; i++ ) {
				//$(this).find('A[href="' + d[i] + '"]').parent().addClass('disabled');
				$(this).find('a[href="' + d[i] + '"]').parent().addClass('hidden');
			}
		}
	});
	return( $(this) );
},

// Enable context menu items on the fly
enableContextMenuItems: function(o) {
	if ( o == undefined ) {
		// Enable all
		$(this).find('li.disabled').removeClass('disabled');
		return( $(this) );
	}
	$(this).each( function() {
		if ( o != undefined ) {
			var d = o.split(',');
			for( var i = 0; i < d.length; i++ ) {
				//$(this).find('A[href="' + d[i] + '"]').parent().removeClass('disabled');
				$(this).find('a[href="' + d[i] + '"]').parent().removeClass('hidden');
			}
		}
	});
	return( $(this) );
},

// Disable context menu(s)
disableContextMenu: function() {
	$(this).each( function() {
		$(this).addClass('disabled');
	});
	return( $(this) );
},

// Enable context menu(s)
enableContextMenu: function() {
	$(this).each( function() {
		$(this).removeClass('disabled');
	});
	return( $(this) );
},

// Destroy context menu(s)
destroyContextMenu: function() {
	// Destroy specified context menus
	$(this).each( function() {
		// Disable action
		$(this).unbind('mousedown').unbind('mouseup');
	});
	return( $(this) );
}

});

})(jQuery);

function configureUserInterface()
{
	$(".elementItemName").bind('keyup', function(e) {
		if (e.keyCode == 13) {
			// TODO allow enter key to trigger blur once and save any changes.
			//  This didn't work.  It was getting repeated.  $(this).parent().focus();
		}

	});

	// If any item selected is a trash item then we need to select all trash items
	var allAreRestorable = false;
	if ( $(".trash.delete").length > 0 && ( $(".trash.delete").length == $(".trashChild").length )) {
		allAreRestorable = true;
	} else {
		if ( $(".trashChild").children().hasClass('ui-selected')) {
			var messageText = 'You can only restore items from trash if you have access to restore all items in the trash';
			messageAlert(messageText, 'infoMessage');
		}
	}

	// if ( $(".trash:not(.trashRoot)").children().hasClass('ui-selected')) {
	// 	$(".ui-selected").removeClass('ui-selected');
	// 	if ( $(".trash.delete").length > 0) {
	// 		$(".trash.delete").find('a').addClass('ui-selected');
	// 	}
	// }


	// Start other selected item checking
	if ( $(".ui-selected").length > 1) {

		$("#btnToggleDetails").addClass('disabled');
		$("#filePreview").html('');
		$("#fileDetails").html('');
		$("#btnFolder").addClass('disabled');
		$("#btnRename").addClass('disabled');
		$("#btnUpload").addClass('disabled');
		$("#btnToggleDetails").addClass('disabled');

		var canDeleteAll = true;
		// Loop through all selected to check permissions for all
		$(".ui-selected").parent().each(function(index) {
			//var thisParentId = $(this).attr("id");
			//alert('outerLoop: ' + thisParentId);

			if ( $(this).hasClass("delete") == false) {
				canDeleteAll = false;
			}

			if (canDeleteAll == false) {
				return false;
			}
		});

		if (canDeleteAll == false) {
			$("#btnDelete").addClass('disabled');
		} else {
			$("#btnDelete").removeClass('disabled');
		}

	} else if ($(".ui-selected").length == 1) {

		$("#btnToggleDetails").removeClass('disabled');

		// Configure New Folder permission and Some Upload
		// NOTE: New Folder is tied to the "upload" permission
		if ( $(".ui-selected").parent().hasClass('upload')) {
			$("#btnFolder").removeClass('disabled');
			$("#btnUpload").removeClass('disabled');
			$("#btnToggleDetails").removeClass('disabled');
			// #btnUpload is controled below - Not dependent on how many items selected


		} else {
			// Hide New Folder options button
			$("#btnFolder").addClass('disabled');
			$("#btnUpload").addClass('disabled');
			$("#btnToggleDetails").addClass('disabled');

			// Hide New Folder options right click menu
			if ( $("#rightClickMenu .new").length) {
				$("#rightClickMenu .new").addClass('hidden');
			}

			// Hide Upload options right click menu
			if ( $("#rightClickMenu .upload").length) {
				$("#rightClickMenu .upload").addClass('hidden');
			}
		}

		// Configure Rename permission
		if ( $(".ui-selected").parent().hasClass('rename')) {
			$("#btnRename").removeClass('disabled');
		} else {
			$("#btnRename").addClass('disabled');

			// Hide Rename options right click menu
			if ( $("#rightClickMenu .edit").length) {
				$("#rightClickMenu .edit").addClass('hidden');
			}
		}

		// Configure Delete permission
		if ( $(".ui-selected").parent().hasClass('delete')) {
			$("#btnDelete").removeClass('disabled');
		} else {
			// Hide Delete function options
			$("#btnDelete").addClass('disabled');
			if ( $("#rightClickMenu .delete").length) {
				$("#rightClickMenu .delete").addClass('hidden');
			}
		}

	}


	// Disable Upload if none of the visible folders have upload capability
	// if ($(".treeViewUploader.upload").length == 0) {
	// 	$("#btnUpload").addClass('disabled');
	// } else {
	// 	$("#btnUpload").removeClass('disabled');
	// }

	// Change upload button back to default
	//$("#btnUpload").val('Upload');
	//$(".treeViewUploader.upload").hide();

	// Show the restore button only if trash items are selected.
	var canRestoreAll = true;
	// Loop through all selected to check permissions for all
	$(".ui-selected").parent().each(function(index) {

		if ( $(this).hasClass('delete') == false || $(this).hasClass('trash') == false) {
			canRestoreAll = false;
		}

		if (canRestoreAll == false) {
			return false;
		}
	});


	if (canRestoreAll == true && allAreRestorable == true) {
		$("#btnRestore").show();
		if ( $("#rightClickMenu .restore").length) {
			$("#rightClickMenu .restore").removeClass('hidden');
		}
	} else {
		$("#btnRestore").hide();
		if ( $("#rightClickMenu .restore").length) {
			$("#rightClickMenu .restore").addClass('hidden');
		}
	}
}
var isDownloadInProgress = 0;
//Document Ready
$(document).ready( function() {
	$(".pod_loader_img").show();
	loadTree();
//	newFolderWindowSetup();
	//searchBoxSetup();

	//$("#infoContainer").jScroll({speed: "fast"});

	$(document).bind('keydown', 'up', upKeyDownKeyEvent);
	$(document).bind('keydown', 'down', upKeyDownKeyEvent);
	$(document).bind('keydown', 'left', leftKeyRightKeyEvent);
	$(document).bind('keydown', 'right', leftKeyRightKeyEvent);
	$(document).bind('keyup', 'Shift+up', multiKeyEvent);
	$(document).bind('keyup', 'Shift+down', multiKeyEvent);

	/*
	$(document).bind('keydown', 'return', enterKeyDownF2KeyDownEvent);
	$(document).bind('keydown', 'f2', enterKeyDownF2KeyDownEvent);
	*/

	$(".rightClickMenu li").on('click', function(event) {
		var a = $(this).find('a');
		if (event.target != a) {
			a.click();
		}
	});
});

function searchBoxSetup()
{
	$("#filenameSearch").autocomplete({
		minLength: 2,
		autoFocus: false,
		select: searchPreviewFile,
		focus: listItemFocus,
		position: { my : 'right top', at: 'right bottom' },
		source: 'modules-file-manager-file-browser-ajax.php?method=searchByFilename'
	});

	// When <enter> is depressed, hide the auto-complete results.
	/*
	.keypress(function(event) {
	if (event.keyCode == 13) {
	$(".ui-autocomplete").hide();
	return false;
}
})
*/

// Create the sub title in the list.
$("#filenameSearch").data("ui-autocomplete")._renderItem = function(ul, item) {
	itemTitleDesc = split(item.label);
	var desc = '';
	var isArray = is_array(itemTitleDesc);
	if (isArray) {
		itemTitle = itemTitleDesc[1];
		if (itemTitleDesc.length > 1) {
			itemDesc = itemTitleDesc[0];
			itemDesc = itemDesc.replace(')', '');
			desc = '<br><span><small>' + itemDesc + '</small></span>';
		}
		var itemContent = '<span><strong>' + itemTitle + '</strong></span>' + desc;
		var html = $('<li></li>')
		.data('item.autocomplete', item)
		.append($('<a></a>').html(itemContent))
		.appendTo(ul);
		return html;
	} else {
		var html = $('<li></li>')
		.data('item.autocomplete', item)
		.append($('<a></a>').html(item.label))
		.appendTo(ul);
		return html;
	}
};
}

function filenameSearchClicked()
{
	if ($(".ui-autocomplete").length) {
		$(".ui-autocomplete").show();
	}
}

/*
*Google gave me this. How lazy I am ;)
*/
function is_array(input)
{
	var ret = typeof (input) == 'object' && (input instanceof Array);
	return ret;
}

function split(val)
{
	return val.split('|');
}

function listItemFocus(event, ui)
{
	var itemTitleDesc = split(ui.item.label);
	var isArray = is_array(itemTitleDesc);
	if (isArray) {
		itemTitle = itemTitleDesc[1];
		//$("#filenameSearch").val(itemTitle);
	} else {
		//$("#filenameSearch").val(ui.item.label);
	}
	return false;
}

function searchPreviewFile(event, ui)
{

	var fileId = ui.item.value;
	var fileName = ui.item.label;
	loadPreview(fileId, fileName);

	itemTitleDesc = split(ui.item.label);
	var isArray = is_array(itemTitleDesc);
	if (isArray) {
		itemTitle = itemTitleDesc[1];
		if (itemTitleDesc.length > 1) {
			itemDesc = itemTitleDesc[0];
		}
		//ui.item.value = itemTitle;
		//ui.item.value = $("#filenameSearch").val();
	}
	event.preventDefault();
}

$(document).bind('ajaxStop', function() {

	createUploaders();

	$(".draggable").not('.move').draggable({
		start: function() {
			var i = 1;
			//e.preventDefault();
			return false;
			//alert('here');

		},
		revert: 'invalid',
		distance: 10
	})

	$(".draggable.move").find('a:first').draggable({
		cursor: 'crosshair',
		cursorAt: { top: 8, left: -5 },
		revert: 'invalid',
		start: showDroppables,
		distance: 10,
		helper: function() {

			var selected = $(".ui-selected").parent();
			var arrItemsToDelete = [];

			// If there are no items that have been selected, or if the current item they are dragging was not a selected item.
			var selectedIndex = selected.index($(this).parent());
			if (selected.length == 0 || selectedIndex == -1) {
				$(".ui-selected").removeClass('ui-selected');
				selected = $(this).parent();
			} else {
				var arrNotMovable = [];

				$(".ui-selected").parent().each(function(index) {

					if (!$(this).hasClass('move')) {
						// Create array of selected items that they do not have permission to move
						var html = $(this).find('a:first').html();
						arrNotMovable.push(html);
						var theListItemId = $(this).attr('id');
						arrItemsToDelete.push(theListItemId);
					} else {

						var thisParentId = $(this).attr('id');
						$(this).find('a.ui-selected').each(function(index) {
							// Create an array of list items to whose parent folder is selected as a move item.
							var theId = $(this).parent().attr('id');
							if (thisParentId != theId) {
								arrItemsToDelete.push(theId);
							}

						});

					}

				});

				if (arrNotMovable.length > 0) {
					// Tell user they tried to move files they didn't have permission to move.
					var messageText = 'You do not have permission to move the following items:<br>' + arrNotMovable.join('<br>');
					messageAlert(messageText, 'errorMessage');
				}
			}

			if (arrItemsToDelete.length > 0) {
				// Remove items whose parent folder is selected to move as well.
				for(thisId in arrItemsToDelete) {
					selected = selected.not("#" + arrItemsToDelete[thisId]);
				}
			}

			var container = $("<div>").attr('id', 'draggingContainer');
			container.append(selected.clone());
			container.find('ul').hide();
			return container;
		}
	});

	if ($(".companyRoot").length && $(".companyRoot").hasClass('collapsed') && ($(".ui-selected").length == 0)) {
		$(".companyRoot > a").addClass('ui-selected');
		lastATagClicked = $(".companyRoot > a");
		$(".rightClickMenu").hide();
	}

	// Show menu when a list item is clicked   
	$(".jqueryFileTree li a").contextMenu({	menu: 'rightClickMenu' }, rightClickMenuItemSelected);

	/*
	if ($("#iframeFilePreview").complete || $("#iframeFilePreview").readyState === 4) {
	// do on load complete
	//alert('loaded');
	//$("#iframeFilePreview").show();
	//window.scrollBy(1);
	//setTimeout("window.scrollBy(10); alert('fun');",3000);
} else {
$($("#iframeFilePreview")).bind('load', function() {
// do on load complete
//alert('loaded');
//$("#iframeFilePreview").show();
//window.scrollBy(1);
//setTimeout("window.scrollBy(10); alert('fun');",3000);
});
}
*/
// var checktrash = $(".ui-selected").closest('li').attr('rel');
// if (checktrash.includes("/Trash/")){ //called only if items in trash is clicked
// 	// configureUserInterface();
// }

});

function upKeyDownKeyEvent(evt)
{
	//alert('enteredUpDown');
	if ($(".ui-selected").length) {
		var currentListItem = $(".ui-selected").parent();
		var goToListItem;
		//evt.preventDefault();
		evt.preventDefault ? evt.preventDefault() : evt.returnValue = false;

		// If current item is a file
		if ($(currentListItem).hasClass('file')) {
			if (evt.data == 'up') {
				goToListItem = $(currentListItem).prev();
			} else {
				goToListItem = $(currentListItem).next();
			}
			// File List Item has a sibling in the direction we clicked
			if ($(goToListItem).length) {
				// File item - trigger click which will show preview and set with 'ui-selected'
				$(goToListItem).find('a').trigger('click');
			} else {
				// Go Up To Parent Folder In Directory and try to go to it's self if 'up' or next sibling if 'down' (ul is immediate parent)
				if (evt.data == 'up') {
					goToListItem = $(currentListItem).parent().parent();
				} else {
					goToListItem = $(currentListItem).parent().parent().next();
				}
				// goToListItem Should Now Be A Directory
				if ($(goToListItem).length && ( $(goToListItem).hasClass('file') || $(goToListItem).hasClass('directory') ) ) {
					// Should be a Directory item - Just show details
					loadDetails($(goToListItem).attr('id'), 'folder');
				} else {
					// CurrentListItem might be deeply nested, lets see if there is another list item below it.
					var currentListItemIndex = $(".jqueryFileTree li").index( $(currentListItem) );
					var nextListItemIndex = currentListItemIndex + 1;
					var goToListItem = $(".jqueryFileTree li").get(nextListItemIndex);
					if ($(goToListItem).length && ( $(goToListItem).hasClass('file') || $(goToListItem).hasClass('directory') ) ) {
						// Should be a directory item show it
						loadDetails($(goToListItem).attr('id'), 'folder');
					} else {
						//alert('Add Check to See If We Can Move Down To The "Project Files" folder');
					}
				}
			}
			// Current Item is a directory
		} else {
			// Keystroke was 'up'
			if (evt.data == 'up') {
				var goToListItem = $(currentListItem).prev();
				// If folder has an older sibling
				if ($(goToListItem).length) {
					// If older sibling is expanded
					if ($(goToListItem).hasClass('expanded')) {
						var youngestGoToListItem = $(goToListItem).find('a').last().parent();
						if ($(youngestGoToListItem).hasClass('directory')) {
							// youngest child is a folder so just show details it will set selected class.
							loadDetails($(youngestGoToListItem).attr('id'), 'folder');
						} else {
							// youngest child is a file so trigger the click
							lastATagClicked = $(youngestGoToListItem).find('a');
							$(".rightClickMenu").hide();
							$(youngestGoToListItem).find('a').addClass('ui-selected').trigger('click');
						}
						// Older sibling is closed
					} else {
						// Closed Directory item - Just show it
						loadDetails($(goToListItem).attr('id'), 'folder');
					}
					// Folder does not have an older sibling
				} else {
					// Go Up To Parent In Directory and try to go to it's self (ul is immediate parent)
					goToListItem = $(currentListItem).parent().parent();
					// Folder has a parent directory
					if ($(goToListItem).length && ( $(goToListItem).hasClass('file') || $(goToListItem).hasClass('directory') ) ) {
						// Should be a directory item show it
						loadDetails($(goToListItem).attr('id'), 'folder');
					} else {
						// CurrentListItem might be deeply nested, lets see if there is another list item below it.
						var currentListItemIndex = $(".jqueryFileTree li").index( $(currentListItem) );
						var prevListItemIndex = currentListItemIndex -1;
						var goToListItem = $(".jqueryFileTree li").get(prevListItemIndex);
						if ($(goToListItem).length && ( $(goToListItem).hasClass('file') || $(goToListItem).hasClass('directory') ) ) {
							// Should be a file item so preview it
							if ( $(goToListItem).hasClass('file')) {
								loadPreview($(goToListItem).children(':first').attr('rel'), $(goToListItem).attr('class'));
							} else {
								// Should be a directory item show it
								loadDetails($(goToListItem).attr('id'), 'folder');
							}
						} else {
							$('>a', currentListItem).trigger('click');
							//alert('Add Check to See If We Can Move Down To The 'Project Files' folder');
						}
						//alert('Add Check to See If We Can Move Up To The 'Company Files' folder');
					}
				}
				// Keystroke was 'down'
			} else {
				// if selected folder is expanded and it has children highlight its first child
				if ( $(currentListItem).hasClass('expanded') && $(currentListItem).find('a').length > 1 ) {
					var oldestGoToListItem = $('> ul', currentListItem).find('a').first().parent();
					if ($(oldestGoToListItem).hasClass('directory')) {
						// oldest child is a folder so just show details it will set selected class.
						loadDetails($(oldestGoToListItem).attr('id'), 'folder');
					} else {
						// oldest child is a file so trigger the click
						lastATagClicked = $(oldestGoToListItem).find('a');
						$(".rightClickMenu").hide();
						$(oldestGoToListItem).find('a').addClass('ui-selected').trigger('click');
					}
					// Folder is not expanded so go to next folder or file
				} else {
					var goToListItem = $(currentListItem).next();
					// If folder has a younger sibling
					if ($(goToListItem).length) {
						if ( $(goToListItem).hasClass('directory') ) {
							// Younger sibling is a folder so just show details it will set selected class.
							loadDetails($(goToListItem).attr('id'), 'folder');
						} else {
							// Younger sibling is a file so trigger the click
							lastATagClicked = $(goToListItem).find('a');
							$(".rightClickMenu").hide();
							$(goToListItem).find('a').addClass('ui-selected').trigger('click');
						}
						// Folder does not have an younger sibling
					} else {
						// Go Up To Parent In Directory and try to go to it's younger sibling (ul is immediate parent)
						var goToListItem = $(currentListItem).parent().parent().next();
						// Folder has a parent directory
						if ($(goToListItem).length && ( $(goToListItem).hasClass('file') || $(goToListItem).hasClass('directory') ) ) {
							// Should be a directory item show it
							loadDetails($(goToListItem).attr('id'), 'folder');
						} else {
							// CurrentListItem might be deeply nested, lets see if there is another list item below it.
							var currentListItemIndex = $(".jqueryFileTree li").index( $(currentListItem) );
							var nextListItemIndex = currentListItemIndex + 1;
							var goToListItem = $(".jqueryFileTree li").get(nextListItemIndex);
							if ($(goToListItem).length && ( $(goToListItem).hasClass('file') || $(goToListItem).hasClass('directory') ) ) {
								// Should be a directory item show it
								loadDetails($(goToListItem).attr('id'), 'folder');
							} else {
								$(">a", currentListItem).trigger('click');
								//alert('Add Check to See If We Can Move Down To The "Project Files" folder');
							}
						}
					}
				}
			}
		}
		return false;
	}
}

function leftKeyRightKeyEvent(evt)
{
	if ($(".ui-selected").length) {
		var currentListItem = $(".ui-selected").parent();

		// If current item is a file
		if ($(currentListItem).hasClass('file')) {
			// Keystroke was 'left'
			if (evt.data == 'left') {
				//evt.preventDefault();
				evt.preventDefault ? evt.preventDefault() : evt.returnValue = false;
				// Go Up To Parent In Directory (ul is immediate parent)
				var goToListItem = $(currentListItem).parent().parent();
				loadDetails($(goToListItem).attr('id'), 'folder');
			}
			// Current item is a folder
		} else {
			//evt.preventDefault();
			evt.preventDefault ? evt.preventDefault() : evt.returnValue = false;
			// Keystroke was 'left'
			if (evt.data == 'left') {
				// Collapse
				$(currentListItem).find('ul').slideUp({ duration: fileTreeParams.collapseSpeed, easing: fileTreeParams.collapseEasing });
				$(currentListItem).removeClass('expanded').addClass('collapsed');
				$(currentListItem).find('ul').empty();
				// Keystroke was "right"
			} else {
				$(">a", currentListItem).trigger('click');
			}

		}
	}
}

function multiKeyEvent(evt)
{
	if ($(".ui-selected").length) {
		//evt.preventDefault();
		evt.preventDefault ? evt.preventDefault() : evt.returnValue = false;
		var selectedATag, currentATagIndex, nextATagIndex, goToATag;
		if (evt.data == 'Shift+down') {
			selectedATag = $(".ui-selected").last();
			currentATagIndex = $(".jqueryFileTree li a").index( $(selectedATag) );
			nextATagIndex = currentATagIndex + 1;
		} else {
			selectedATag = $(".ui-selected").first();
			currentATagIndex = $(".jqueryFileTree li a").index( $(selectedATag) );
			nextATagIndex = currentATagIndex - 1;
		}
		goToATag = $(".jqueryFileTree li a").get(nextATagIndex);
		if ($(goToATag).length) {
			lastATagClicked = $(goToATag);
			$(".rightClickMenu").hide();
			$(goToATag).addClass('ui-selected');
		}
	}
	if ( $(".ui-selected").length > 1) {
		$("#filePreview").html('');
		$("#fileDetails").html('');
	}
}
/*
function enterKeyDownF2KeyDownEvent(evt)
{
if (event.which == 13 || event.which == 113 ) {
if ($(".ui-selected").length == 1) {
var li_id = $(".ui-selected").attr("id").replace('a_','');
var inputBox = document.getElementById(li_id + '_input');
var currentStyle = inputBox.style.display;
//alert('z' + currentStyle + 'z');
if (currentStyle != 'block') {
//alert(inputBox.style.display);
inputBox.style.display = 'block !important';
inputBox.select();
} else {
//alert(inputBox.style.display);
$(inputBox).blur();
}
//evt.preventDefault();
evt.preventDefault ? evt.preventDefault() : evt.returnValue = false;
return false;
}
}
}
*/
function rightClickMenuItemSelected(action, element, pos)
{

	var li_id = $(element).parent().attr('id');
	var li_path = $(element).parent().attr('rel');

	switch(action) {
		case 'newFolder':
		newFolderRightClickSelected(element);
		break;
		case 'rename':
		renameItemRightClickSelected(element);
		break;
		case 'delete':
		moveItemsToRecycleBin();
		break;
		case 'extract':
		extractZipFile(element);
		break;
		case 'download':
		downloadRightClickSelected();
		break;
		case 'downloadCompressedArchive':
		downloadRightClickSelectedCompressed(element);
		break;
		case 'upload':
		uploadRightClickSelected(element);
		break;
		case 'restore':
		restoreItemsFromRecycleBin();
		break;
		case 'deletePermanent':
		permanentlyDeleteItemsFromRecycleBin();
		break;
		case 'cancel':
		cancelRightClickSelected(element);
		break;
		case 'loadDetails':
		toggleFileSystemDetails();
		var nodeType = 'file';
		if ($(element).parent().hasClass('directory')) {
			nodeType = 'folder';
			loadDetails(li_id, nodeType);
		} else {
			loadPreview($(element).attr('rel'), $(element).parent().attr('class'));
		}
		break;
		case 'emptyTrash':
		emptyTrash();
		break;
		default:
		alert(
			'Set up handler for: ' + action + '\n\n' +
			'Action: ' + action + '\n\n' +
			'Element text: ' + $(element).text() + '\n\n' +
			'X: ' + pos.x + '  Y: ' + pos.y + ' (relative to element)\n\n' +
			'X: ' + pos.docX + '  Y: ' + pos.docY+ ' (relative to document)' +
			'\n\nli_id: ' + li_id + '\n\nli_path: ' + li_path
		);
		break;
	}
}

function newFolderWindowSetup()
{
	$("#windowNewFolder").dialog({
		autoOpen: false,
		height: 300,
		width: 650,
		modal: true,
		open: function() {
			$("body").addClass('noscroll');
		},
		close: function() {
			$("body").removeClass('noscroll');
		},
		buttons: {
			'Create New Folder': function() {
				createNewFolder();
			},
			Cancel: function() {
				$(this).dialog('close');
			}
		}
	});
}

function newFolderRightClickSelected(element)
{
	var li_id = $(element).parent().attr('id');
	var li_path = $(element).parent().attr('rel');

	if (li_id.indexOf('li_') == 0) {
		// If file was clicked we need to go up from a to li to ul to li
		li_id = $(el).parent().parent().parent().attr('id');
		li_path = $(el).parent().parent().parent().attr('rel');
	}
	$("#parent_file_manager_folder_id").val(li_id);
	$("#parentFolderName").text(li_path);
	$("#newFolderName").val('');
	$("#windowNewFolder").dialog('open');
}

function newFolderNameKeyDown(e)
{
	var keyCode = (e.keyCode) ? e.keyCode : e.which;
	if ( keyCode == 13 ) {
		e.preventDefault ? e.preventDefault() : e.returnValue = false;
		createNewFolder();
	}
}

function createNewFolder()
{
	try {

		var valid = true;
		var parent_file_manager_folder_id = $("#parent_file_manager_folder_id").val();
		var newFolderName = $("#newFolderName").val();
		//TODO: Throw in some folder name validation

		var ajaxHandler = window.ajaxUrlPrefix + 'modules-file-manager-file-browser-ajax.php?method=createNewFolder';
		var ajaxQueryString =
		'parent_file_manager_folder_id=' + encodeURIComponent(parent_file_manager_folder_id) +
		'&folderName=' + encodeURIComponent(newFolderName);
		var ajaxUrl = ajaxHandler + '&' + ajaxQueryString;

		if (window.ajaxUrlDebugMode) {
			var continueDebug = window.confirm(ajaxUrl);
			if (continueDebug != true) {
				return;
			}
		}

		if (valid) {
			var returnedJqXHR = $.ajax({
				url: ajaxHandler,
				data: ajaxQueryString,
				success: createNewFolderSuccess,
				error: errorHandler
			});
			$("#windowNewFolder").dialog('close');
		}

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

function createNewFolderSuccess(data, textStatus, jqXHR)
{
	try {

		var file_manager_folder_id = data.replace('liFolder_', '');
		var element = document.getElementById(data);
		showTree(element, file_manager_folder_id);

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

function moveItemsToRecycleBin()
{
	try {

		if ( $(".ui-selected").length > 0) {
			var arrMovedFolderListItems = [];
			var arrMovedFileListItems = [];

			// Get the folders that were selected
			$(".ui-selected").each(function(index) {
				if ( $(this).parent().hasClass('directory') && !$(this).parent().hasClass('trash') ) {
					var movedFolderListItem = $(this).parent().attr('id').replace('liFolder_', '');
					arrMovedFolderListItems.push(movedFolderListItem);
				}
			});

			// Loop through the files that were selected and check if their parent folder is already in the folder list.
			var parent_file_manager_folder_id;
			$(".ui-selected").each(function(index) {
				if ( $(this).parent().hasClass('file') && !$(this).parent().hasClass('trash') ) {
					if ($(this).parents().find('[id^="draggingContainer"]').length == 0) {
						parent_file_manager_folder_id = $(this).parent().parent().parent().attr('id').replace('liFolder_', '');
						if ( $.inArray(parent_file_manager_folder_id, arrMovedFolderListItems) < 0 ) {
							var movedFileListItem = $(this).parent().attr('id').replace('li_', '');
							arrMovedFileListItems.push(movedFileListItem);
						}
					}
				}
			});

			var csvMovedFolderListItems = arrMovedFolderListItems.join(',');
			var csvMovedFileListItems = arrMovedFileListItems.join(',');
			var parent_file_manager_folder_id = $(".ui-selected").first().parents().eq(2).attr('id').replace('liFolder_', '');

			var ajaxHandler = window.ajaxUrlPrefix + 'modules-file-manager-file-browser-ajax.php?method=moveItemsToRecycleBin';
			var ajaxQueryString =
			'folders=' + encodeURIComponent(csvMovedFolderListItems) +
			'&files=' + encodeURIComponent(csvMovedFileListItems) +
			'&parent_file_manager_folder_id=' + encodeURIComponent(parent_file_manager_folder_id);
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
				success: moveItemsToRecycleBinSuccess,
				error: errorHandler
			});
		}

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

function moveItemsToRecycleBinSuccess(data, textStatus, jqXHR)
{
	try {

		var file_manager_folder_id = data;
		var element = document.getElementById('liFolder_' + file_manager_folder_id);
		showTree(element, file_manager_folder_id);

		$("#liFolder_-1").show();
		var file_manager_folder_id = -1;
		var element = document.getElementById('liFolder_' + file_manager_folder_id);
		showTree(element, file_manager_folder_id);

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

function permanentlyDeleteItemsFromRecycleBin()
{
	try {

		if ( $(".ui-selected").length > 0) {
			var arrMovedFolderListItems = [];
			var arrMovedFileListItems = [];

			// Get the folders that were selected
			$(".ui-selected").each(function(index) {
				if ($(this).parent().hasClass('directory') && $(this).parent().hasClass('trash')) {
					var movedFolderListItem = $(this).parent().attr('id').replace('liFolder_', '');
					arrMovedFolderListItems.push(movedFolderListItem);
				}
			});

			// Loop through the files that were selected and check if their parent folder is already in the folder list.
			var parent_file_manager_folder_id;
			$(".ui-selected").each(function(index) {
				if ( $(this).parent().hasClass('file') && $(this).parent().hasClass('trash') ) {
					parent_file_manager_folder_id = $(this).parent().parent().parent().attr('id').replace('liFolder_', '');
					if ($.inArray(parent_file_manager_folder_id, arrMovedFolderListItems) < 0) {
						var movedFileListItem = $(this).parent().attr('id').replace('li_', '');
						arrMovedFileListItems.push(movedFileListItem);
					}
				}
			});

			var csvMovedFolderListItems = arrMovedFolderListItems.join(',');
			var csvMovedFileListItems = arrMovedFileListItems.join(',');
			var affectedElementParentFolderId = $(".ui-selected").first().parents().eq(2).attr('id').replace('liFolder_', '');

			var ajaxHandler = window.ajaxUrlPrefix + 'modules-file-manager-file-browser-ajax.php?method=permanentlyDeleteItemsFromRecycleBin';
			// var ajaxQueryString =
			// 	'folders=' + encodeURIComponent(csvMovedFolderListItems) +
			// 	'&files=' + encodeURIComponent(csvMovedFileListItems) +
			// 	'&parent_file_manager_folder_id=' + encodeURIComponent(affectedElementParentFolderId);
			// var ajaxUrl = ajaxHandler + '&' + ajaxQueryString;
			var ajaxUrl = ajaxHandler;

			if (window.ajaxUrlDebugMode) {
				var continueDebug = window.confirm(ajaxUrl);
				if (continueDebug != true) {
					return;
				}
			}

			// var returnedJqXHR = $.ajax({
			// 	url: ajaxHandler,
			// 	data: ajaxQueryString,
			// 	success: permanentlyDeleteItemsFromRecycleBinSuccess,
			// 	error: errorHandler
			// });
			var returnedJqXHR = $.ajax({
				type:'POST',
				url: ajaxHandler,
				data: {folders:encodeURIComponent(csvMovedFolderListItems),files:encodeURIComponent(csvMovedFileListItems),parent_file_manager_folder_id:encodeURIComponent(affectedElementParentFolderId)},
				success: permanentlyDeleteItemsFromRecycleBinSuccess,
				error: errorHandler
			});
		}

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

function permanentlyDeleteItemsFromRecycleBinSuccess(data, textStatus, jqXHR)
{
	try {

		/*
		alert(data);
		var file_manager_folder_id = data;
		var element = document.getElementById("liFolder_" + file_manager_folder_id);
		showTree(element, file_manager_folder_id);
		*/

		var file_manager_folder_id = -1;
		var element = document.getElementById('liFolder_' + file_manager_folder_id);
		showTree(element, file_manager_folder_id);

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

function restoreItemsFromRecycleBin()
{
	try {

		if ( $(".ui-selected").length > 0) {
			var arrMovedFolderListItems = [];
			var arrMovedFileListItems = [];

			// Get the folders that were selected
			$(".ui-selected").each(function(index) {
				if ( $(this).parent().hasClass('directory') && $(this).parent().hasClass('trash') ) {
					var movedFolderListItem = $(this).parent().attr('id').replace('liFolder_', '');
					arrMovedFolderListItems.push(movedFolderListItem);
				}
			});

			// Loop through the files that were selected and check if their parent folder is already in the folder list.
			var parent_file_manager_folder_id;
			$(".ui-selected").each(function(index) {
				if ( $(this).parent().hasClass('file') && $(this).parent().hasClass('trash') ) {
					parent_file_manager_folder_id = $(this).parent().parent().parent().attr('id').replace('liFolder_', '');
					if ( $.inArray(parent_file_manager_folder_id, arrMovedFolderListItems) < 0 ) {
						var movedFileListItem = $(this).parent().attr('id').replace('li_', '');
						arrMovedFileListItems.push(movedFileListItem);
					}
				}
			});

			var csvMovedFolderListItems = arrMovedFolderListItems.join(',');
			var csvMovedFileListItems = arrMovedFileListItems.join(',');
			var restoredElementParentFolderId = $(".ui-selected").first().parents().eq(2).attr('id').replace('liFolder_', '');

			var ajaxHandler = window.ajaxUrlPrefix + 'modules-file-manager-file-browser-ajax.php?method=restoreItemsFromRecycleBin';
			var ajaxQueryString =
			'folders=' + encodeURIComponent(csvMovedFolderListItems) +
			'&files=' + encodeURIComponent(csvMovedFileListItems) +
			'&parent_file_manager_folder_id=' + encodeURIComponent(restoredElementParentFolderId);
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
				success: restoreItemsFromRecycleBinSuccess,
				error: errorHandler
			});
		}

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

function restoreItemsFromRecycleBinSuccess(data, textStatus, jqXHR)
{
	try {

		var json = data;
		var csvParentFolderIds = json.csvParentFolderIds;

		//alert(data);
		var selectedItemsToRestoreCount = $("#liFolder_-1 .ui-selected").length;
		var itemsInTrashCount = $("#liFolder_-1").find('li').length;
		var aryFolders = csvParentFolderIds.split(',');
		// Refresh folders
		for(var i = 0; i < aryFolders.length; i++) {
			if (document.getElementById('liFolder_' + aryFolders[i])) {
				var file_manager_folder_id = aryFolders[i];
				var element = document.getElementById('liFolder_' + aryFolders[i]);
				showTree(element, file_manager_folder_id);
			}
		}
		if (selectedItemsToRestoreCount >= itemsInTrashCount) {
			$("#liFolder_-1").hide();
		}
		messageAlert('Folder / File Restore Succeeded.', 'successMessage');

		/*
		var file_manager_folder_id = data;
		var element = document.getElementById("liFolder_" + file_manager_folder_id);
		showTree(element, file_manager_folder_id);

		var file_manager_folder_id = -1;
		var element = document.getElementById("liFolder_" + file_manager_folder_id);
		showTree(element, file_manager_folder_id);
		*/

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

function extractZipFile(element)
{
	try {

		var li_id = $(element).parent().attr('id');
		var li_path = $(element).parent().attr('rel');
		var extractElementParentFolderId = $("#" + li_id).parents().eq(1).attr('id').replace('liFolder_', '');

		var ajaxHandler = window.ajaxUrlPrefix + 'modules-file-manager-file-browser-ajax.php?method=extractZipFile';
		var ajaxQueryString =
		'li_id=' + encodeURIComponent(li_id) +
		'&li_path=' + encodeURIComponent(li_path) +
		'&parent_file_manager_folder_id=' + encodeURIComponent(extractElementParentFolderId);
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
			success: extractZipFileSuccess,
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

function extractZipFileSuccess(data, textStatus, jqXHR)
{
	try {

		var file_manager_folder_id = data;
		var element = document.getElementById('liFolder_' + file_manager_folder_id);
		showTree(element, file_manager_folder_id);

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

function downloadRightClickSelected()
{
	if ( $(".ui-selected").length > 0) {
		isDownloadInProgress = 1;
		$("#rightClickMenu").find(".download").css('cursor','not-allowed');
		$('#rightClickMenu').find("a[href='#download']").attr("disabled","disabled");
		$('#rightClickMenu').find("a[href='#download']").removeAttr('href');
		createDownloadWorkflowProgressIndicator();
	}
}

function createDownloadWorkflowProgressIndicator()
{
	try {

		var ajaxHandler = window.ajaxUrlPrefix + 'workflow-progress-indicator-ajax.php?method=createDownloadWorkflowProgressIndicator';
		var ajaxQueryString = '';
		var ajaxUrl = ajaxHandler;

		if (window.ajaxUrlDebugMode) {
			var continueDebug = window.confirm(ajaxUrl);
			if (continueDebug != true) {
				return;
			}
		}

		var returnedJqXHR = $.ajax({
			url: ajaxHandler,
			success: createDownloadWorkflowProgressIndicatorSuccess,
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

function createDownloadWorkflowProgressIndicatorSuccess(data, textStatus, jqXHR)
{
	try {

		var wfid = data;

		if ( $(".ui-selected").length > 0) {

			var arrMovedFolderListItems = [];
			var arrMovedFileListItems = [];
			var isTrash = 'no';
			var trashRel = '';
			var isFolderTrash = 1;
			// Get the folders that were selected
			$(".ui-selected").each(function(index) {
				// && !$(this).parent().hasClass('trash')
				if ($(this).parent().hasClass('directory')) {
					isTrash = 'no';
					trashRel = $(this).parent().attr('rel');
					isFolderTrash = 1;
					if(trashRel != '/Trash/'){
						 isFolderTrash = trashRel.indexOf('/Trash/');
					}
					if (isFolderTrash == 0) {
						isTrash = 'yes';
					}
					var movedFolderListItem = $(this).parent().attr('id').replace('liFolder_', '');
					arrMovedFolderListItems.push(movedFolderListItem);
				}
			});

			// Loop through the files that were selected and check if their parent folder is already in the folder list.
			var parent_file_manager_folder_id;
			$(".ui-selected").each(function(index) {
				// && !$(this).parent().hasClass('trash')
				if ( $(this).parent().hasClass('file')) {
					isTrash = 'no';
					trashRel =$(this).parent().attr('rel');
					isFolderTrash = 1;
					if(trashRel != '/Trash/'){
						 isFolderTrash = trashRel.indexOf('/Trash/');
					}
					if (isFolderTrash == 0) {
						isTrash = 'yes';
					}
					parent_file_manager_folder_id = $(this).parent().parent().parent().attr('id').replace('liFolder_', '');
					if ( $.inArray(parent_file_manager_folder_id, arrMovedFolderListItems) < 0 ) {
						var movedFileListItem = $(this).parent().attr('id').replace('li_', '');
						arrMovedFileListItems.push(movedFileListItem);
					}
				}
			});

			//var parent_file_manager_folder_id = $(".ui-selected").first().parent().parent().parent().attr('id').replace('liFolder_', '');

			var csvMovedFolderListItems = arrMovedFolderListItems.join(',');
			var csvMovedFileListItems = arrMovedFileListItems.join(',');

			downloadInProgress = true;
			var ajaxHandler = window.ajaxUrlPrefix + 'modules-file-manager-file-browser-ajax.php?method=download';
			var ajaxQueryString =
			'folders=' + encodeURIComponent(csvMovedFolderListItems) +
			'&files=' + encodeURIComponent(csvMovedFileListItems) +
			'&wfid=' + encodeURIComponent(wfid)+
			'&isTrash=' + encodeURIComponent(isTrash);
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
				success: downloadItemSuccess,
				error: errorHandler
			});

			// Show progress info to user if there is more than 1 file or a folder to download.
			if (arrMovedFolderListItems.length > 0 || arrMovedFileListItems.length > 1) {
				$("#progressbarContainer").dialog({
					title: 'Download Progress',
					width: 500,
					modal: true,
					open: function() {
						$("body").addClass('noscroll');
					},
					close: function() {
						$("body").removeClass('noscroll');
					}
				});
				var updateMessage = 'Please wait while your files are prepared for download';
				$("#divAjaxLoading").html(updateMessage);
				$("#progressbarMessage").html(updateMessage);

				checkDownloadWorkflowProgress(wfid);
			}
		}

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

function downloadItemSuccess(data, textStatus, jqXHR)
{
	var updateMessage = 'Processing completed.  A zip file should download to your browser momentarily.';
	$("#divAjaxLoading").html(updateMessage);
	$("#progressbarMessage").html(updateMessage);
	try {

		var ary = data.split('|');
		var url = ary[0];
		var wfid = ary[1];

		// ADDED 4/18/2013
		downloadInProgress = false;
		isDownloadInProgress = 0;
		$("#rightClickMenu").find(".download").css('cursor','');
		$('#rightClickMenu li.download').find("a").removeAttr("disabled");
		$('#rightClickMenu li.download').find("a").attr('href','#download');
		deleteWorkflowProgress(wfid, url);

		$("#progressbarContainer").dialog('close');

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

function checkDownloadWorkflowProgress(workflow_progress_indicator_id)
{
	try {

		if (downloadInProgress) {
			var ajaxHandler = window.ajaxUrlPrefix + 'workflow-progress-indicator-ajax.php?method=checkDownloadWorkflowProgress';
			var ajaxQueryString =
			'wfid=' + encodeURIComponent(workflow_progress_indicator_id);
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
				success: checkDownloadWorkflowProgressSuccess,
				error: errorHandler
			});
		}

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

function checkDownloadWorkflowProgressSuccess(data, textStatus, jqXHR)
{
	try {

		var json = data;
		var errorNumber = json.errorNumber;

		if (errorNumber == 0) {

			var workflow_progress_indicator_id = json.workflow_progress_indicator_id;
			var progress = json.progress;
			var total = json.total;

			progress = parseInt(progress);
			total = parseInt(total);
			var percentValue = Math.round((progress / total) * 100);

			if (progress > 0) {
				var updateMessage = 'Processing ' + progress + ' of ' + total + ' (' + percentValue + '%)';
				$('#divAjaxLoading').html(updateMessage);
				$('#progressbarMessage').html(updateMessage);
				$("#progressbar").progressbar({ value: percentValue });
			}
			if(progress == total)
			{
				var updateMessage = 'Processing completed.  A zip file should download to your browser momentarily.';
				$("#divAjaxLoading").html(updateMessage);
				$("#progressbarMessage").html(updateMessage);
			} else if (progress < total) {
				setTimeout('checkDownloadWorkflowProgress('+workflow_progress_indicator_id+')', 1000);
			} else {
				//deleteWorkflowProgress(workflow_progress_indicator_id);
				/*
				var updateMessage = 'Processing completed.  A zip file should download to your browser momentarily.';
				$('#divAjaxLoading').html(updateMessage);
				$('#progressbarMessage').html(updateMessage);

				var ajaxHandler = window.ajaxUrlPrefix + 'workflow-progress-indicator-ajax.php?method=delete-workflow';
				var ajaxQueryString = "wfid=" + encodeURIComponent(workflow_progress_indicator_id);
				//var ajaxUrl = ajaxHandler + '&' + ajaxQueryString;
				//alert(ajaxUrl);
				//return;
				var returnedJqXHR = $.ajax({
				url: ajaxHandler,
				data: ajaxQueryString,
				error: errorHandler
			});
			*/
		}
	}

} catch(error) {

	if (window.showJSExceptions) {
		var errorMessage = error.message;
		alert('Exception Thrown: ' + errorMessage);
		return;
	}

}
}

function deleteWorkflowProgress(workflow_progress_indicator_id, passThroughParameter)
{
	try {

		// var updateMessage = 'Processing completed.  A zip file should download to your browser momentarily.';
		// $("#divAjaxLoading").html(updateMessage);
		// $("#progressbarMessage").html(updateMessage);

		var ajaxHandler = window.ajaxUrlPrefix + 'workflow-progress-indicator-ajax.php?method=deleteWorkflowProgress';
		var ajaxQueryString =
		'wfid=' + encodeURIComponent(workflow_progress_indicator_id) +
		'&passthrough=' + encodeURIComponent(passThroughParameter);
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
			success: deleteWorkflowProgressSuccess,
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

function deleteWorkflowProgressSuccess(data, textStatus, jqXHR)
{
	if (data != '-1') {
		var url = data;
		url = url.replace(/\+/g, ' ');
		//document.location = url;
	}
}

function downloadRightClickSelectedCompressed(element)
{
	try {

		var li_id = $(element).parent().attr('id');
		var li_path = $(element).parent().attr('rel');

		alert(li_id);
		return false;

		var parent_file_manager_folder_id = $("#" + li_id).parent().parent().attr('id').replace('liFolder_', '');

		var ajaxHandler = window.ajaxUrlPrefix + 'modules-file-manager-file-browser-ajax.php?method=download';
		var ajaxQueryString =
		'li_id=' + encodeURIComponent(li_id) +
		'&li_path=' + encodeURIComponent(li_path) +
		'&parent_file_manager_folder_id=' + encodeURIComponent(parent_file_manager_folder_id);
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
			success: downloadRightClickSelectedCompressedSuccess,
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

function downloadRightClickSelectedCompressedSuccess(data, textStatus, jqXHR)
{
	try {

		alert(data);
		document.location = 'http://cdn1.axisitonline.com/73/_3.zip';
		return true;

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

function uploadRightClickSelected(element)
{
	var li_id = $(element).parent().attr('id');
	if (document.all && document.querySelector && !document.addEventListener) {
		uploadButtonClicked(0);
	} else {
		$("#" + li_id).find('.treeViewUploader').first().show();
		$("#" + li_id).find('.qq-upload-button > input').first().focus().click();
	}
}

function cancelRightClickSelected(element)
{
	/*
	var extractElementParentFolderId = $("#" + li_id).parent().parent().attr('id').replace('liFolder_', '');

	$.ajax({
	url: '/modules-file-manager-file-browser-ajax.php?method=extractZipFile',
	data: 'li_id=' + encodeURIComponent(li_id) + '&li_path=' + encodeURIComponent(li_path) + '&parent_file_manager_folder_id=' + encodeURIComponent(extractElementParentFolderId),
	success: extractZipFileSuccess,
	error: errorHandler
});
*/
}

function cancelItemSuccess(data, textStatus, jqXHR)
{

}

function loadTree()
{
	$("#fileTreeMenu").fileTree();
}

function showDroppables(event, ui)
{
	//alert($("#draggingContainer").size());
	$(".directory:not(.trashChild) > a").addClass('droppable');

	$(".directory:not(.trashChild) > a.ui-selected").parent().find('a').removeClass('droppable');

	//$(".ui-selected").children().removeClass("droppable");
	//$("#draggingContainer .directory > a").removeClass("droppable");

	//$(".droppable").parent().find(".upload").find("a:first").droppable({
	$(".directory.upload > a.droppable").droppable({
		activeClass: 'droppableActive',
		hoverClass: 'droppableHover',
		tolerance: 'pointer',
		drop: moveFileOrFolderToNewLocation
	});
}

function moveFileOrFolderToNewLocation(event, ui)
{
	try {

		var continueOperation = window.confirm('Confirm Move Operation');
		if (continueOperation != true) {
			return;
		}

		var movedElementsParents = '';
		var movedElements = ui.helper.children().map(function() {
			var parent_file_manager_folder_id = $("#" + this.id).parent().parent().attr('id').replace('liFolder_', '');
			if (movedElementsParents.indexOf(parent_file_manager_folder_id) < 0) {
				if (movedElementsParents.length == 0) {
					movedElementsParents = parent_file_manager_folder_id.toString();
				} else {
					movedElementsParents = movedElementsParents + ',' + parent_file_manager_folder_id.toString();
				}
			}
			return this.id;
		}).get().join(',');

		//alert(ids);
		//ui.helper.children().each(function() {
		//	alert($(this).attr("id"));
		//});

		var new_file_manager_folder_id = $(this).attr('rel');
		if (new_file_manager_folder_id == '-1') {
			moveItemsToRecycleBin();
		} else {
			//var movedElementId = ui.draggable.attr('id');
			//var movedElementParentFolderId = $("#" + movedElementId).parent().parent().attr('id').replace('liFolder_', '');
			//alert('newFolder: ' + new_file_manager_folder_id + ' movedElement: ' + movedElementId + ' movedParent: ' + movedElementParentId);
			$(".directory").removeClass('droppable');

			var ajaxHandler = window.ajaxUrlPrefix + 'modules-file-manager-file-browser-ajax.php?method=moveFileOrFolderToNewLocation';
			var ajaxQueryString =
			'new_file_manager_folder_id=' + encodeURIComponent(new_file_manager_folder_id) +
			'&movedElementsParents=' + encodeURIComponent(movedElementsParents) +
			'&movedElements=' + encodeURIComponent(movedElements);
			var ajaxUrl = ajaxHandler + '&' + ajaxQueryString;

			if (window.ajaxUrlDebugMode) {
				var continueDebug = window.confirm(ajaxUrl);
				if (continueDebug != true) {
					return;
				}
			}

			$.ajaxq('ajaxqueue', {
				url: ajaxHandler,
				data: ajaxQueryString,
				success: moveFileOrFolderToNewLocationSuccess,
				error: errorHandler
			});
		}

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

function moveFileOrFolderToNewLocationSuccess(data, textStatus, jqXHR)
{
	try {

		var ary = data.split('|');
		// 0 - new_file_manager_folder_id
		// 1 - movedElementsParents ","
		// 2 - movedElements ","

		// Remove from DOM all the moved elements
		var arrMovedElements = ary[2].split(',');
		for(var i = 0; i < arrMovedElements.length; i++) {
			$("#" + arrMovedElements[i]).remove();
		}

		//Refresh the new folder location
		if (document.getElementById('liFolder_' + ary[0])) {
			var file_manager_folder_id = ary[0];
			var element = document.getElementById('liFolder_' + ary[0]);
			//alert(file_manager_folder_id);
			//messageAlert('Move operation succeeded.', 'successMessage', 'successMessageLabel', file_manager_folder_id);
			messageAlert('Move operation succeeded.', 'successMessage');
			showTree(element, file_manager_folder_id);
		}
		/*
		// Refresh folders
		for(var i = 0; i < ary.length; i++) {
		if (document.getElementById("liFolder_" + ary[i])) {
		var file_manager_folder_id = ary[i];
		var element = document.getElementById("liFolder_" + ary[i]);
		//alert(file_manager_folder_id);
		messageAlert('Move operation succeeded.', 'successMessage', 'successMessageLabel', file_manager_folder_id);
		showTree(element, file_manager_folder_id);
	}
}
*/

} catch(error) {

	if (window.showJSExceptions) {
		var errorMessage = error.message;
		alert('Exception Thrown: ' + errorMessage);
		return;
	}

}
}

function loadPreview(file, theClass)
{
	try {

		//$("#fileDetails").hide();

		var isImage = 0;
		if (theClass.indexOf('jpg') >= 0 || theClass.indexOf('png') >= 0 || theClass.indexOf('gif') >= 0 || theClass.indexOf('tif') >= 0 || theClass.indexOf('jpeg') >= 0 ) {
			isImage = 1;
		}

		//var tblHeight = $(window).height() - $("#filePreview").offset().top;
		//$("#tblFileModule").height($(window).height() - $("#tblFileModule").offset().top);

		//$("#filePreview").load('/modules-file-manager-file-browser-ajax.php?method=loadPreview&file=' + encodeURIComponent(file) + '&height=' + tblHeight + '&isImage=' + isImage);		

		if ( /android|avantgo|blackberry|bolt|boost|cricket|docomo|fone|hiptop|mini|mobi|palm|phone|pie|iPad|IEMobile|Opera Mini|iPod|iPhone|tablet|up\.browser|up\.link|webos|wos/i.test(navigator.userAgent)) {

			var ajaxHandler = window.ajaxUrlPrefix + 'modules-file-manager-file-browser-ajax.php?method=loadMobilePreview';
			var ajaxQueryString =
			'file=' + encodeURIComponent(file) +
			'&isImage=' + encodeURIComponent(isImage);
			var ajaxUrl = ajaxHandler + '&' + ajaxQueryString;

			$.ajaxq ('ajaxqueue', {
				url: ajaxHandler,
				data: ajaxQueryString,
				cache: false,
				success: loadMobileDetailsSuccess
			});

		}else{		
			
			var ajaxHandler = window.ajaxUrlPrefix + 'modules-file-manager-file-browser-ajax.php?method=loadPreview';
			var ajaxQueryString =
			'file=' + encodeURIComponent(file) +
			'&isImage=' + encodeURIComponent(isImage);
			var ajaxUrl = ajaxHandler + '&' + ajaxQueryString;

			if (window.ajaxUrlDebugMode) {
				var continueDebug = window.confirm(ajaxUrl);
				if (continueDebug != true) {
					return;
				}
			}

			$('#filePreview').load(ajaxUrl, filePreviewLoaded);
			loadDetails('li_' + file, 'file');
		}		

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

function loadMobileDetailsSuccess(data, textStatus, jqXHR)
{	
	window.open('/pdfview.php?url='+data, '_blank');
}

function filePreviewLoaded() {
	$("#filePreview").show();
	var minHeight = $(window).height() - $("#filePreview").offset().top;
	// $("#filePreview").height(minHeight - 20);
	$("#filePreview").height('900px'); //To make the file preview space larger
	$("#filePreview").width('1000px');
	if ($("#filePreview img").length) {
		$("#filePreview").height('100%');
		$("#filePreview").width('100%');
	}
	/*code hide for origin size view*/
	/*var minHeight = $(window).height() - $("#filePreview").offset().top;
	$("#filePreview").height(minHeight - 20);
	if ($("#filePreview img").length) {
	$("#filePreview img").height(minHeight - 20);
}*/
}

function loadDetails(id, nodeType)
{
	try {

		//var minHeight = $(window).height() - $("#filePreview").offset().top;
		//if ($("#filePreview").height() < minHeight) {
		//$("#filePreview").height(minHeight - 20);
		//}
		//document.getElementById('tblFileModule').style.minHeight = minHeight + "px";

		var isTrash = 'no';
		if ($("#" + id).hasClass('trash') ) {
			isTrash = 'yes';
		}

		$(".jqueryFileTree li a").removeClass('ui-selected');
		lastATagClicked = $("#" + id + " > a");
		$(".rightClickMenu").hide();
		$("#" + id + " > a").addClass('ui-selected');
		var elementId = id;
		if (nodeType == 'folder') {
			$("#filePreview").hide();
			var path = $("#" + id).attr('rel');
			//alert('thePath: ' + path);
			//if (path.indexOf("~/") != 0 && path != "/") {
			id = id.replace('liFolder_', '');
			//} else {
			//id = 0;
			//}
		} else {
			id = id.replace('li_', '');
		}
		//alert('theId is: ' + id);

		// if ($(".ui-selected").length > 1) {
		// 	$("#fileDetails").html('');
		// 	$("#filePreview").html('');
		// } else {
		if (id != 0 && id != 'fileTreeMenu') {

			var ajaxHandler = window.ajaxUrlPrefix + 'modules-file-manager-file-browser-ajax.php?method=loadDetails';
			var ajaxQueryString =
			'nodeId=' + encodeURIComponent(id) +
			'&nodeType=' + encodeURIComponent(nodeType) +
			'&isTrash=' + encodeURIComponent(isTrash) +
			'&elementId=' + encodeURIComponent(elementId);
			var ajaxUrl = ajaxHandler + '&' + ajaxQueryString;

			if (window.ajaxUrlDebugMode) {
				var continueDebug = window.confirm(ajaxUrl);
				if (continueDebug != true) {
					return;
				}
			}

			$.ajaxq ('ajaxqueue', {
				url: ajaxHandler,
				data: ajaxQueryString,
				cache: false,
				success: loadDetailsSuccess,
				error: errorHandler
			});

		} else {
			//$("#fileDetails").hide();
			// Viewing the Root Folders so blank the details and preview
			$("#fileDetails").html('');
			$("#filePreview").html('');
		}
		// }

		//configureUserInterface();

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

function loadDetailsSuccess(data, textStatus, jqXHR)
{
	$("#fileDetails").html(data);
	$('#filePreview')[0].scrollIntoView(true);

	// $('html, body').animate({
	// scrollTop: $("#filePreview").offset().top
	// }, 2000);

}

function hideFileSystemDetails()
{
	//$("#fileDetails").hide();
}

function renameItemRightClickSelected(element)
{
	var li_id = $(element).parent().attr('id');
	$("#" + li_id + "_input").show().focus();
}

function updateNodeNameFromTree(elementId, nodeId, nodeType, fileExt)
{
	try {

		var oldValue = $("#" + elementId + " > a").text();
		var newValue = $("#" + elementId + "_input").val();

		var oldValueNoExtension = oldValue.substring(0, oldValue.lastIndexOf('.'));

		if ($.trim(oldValueNoExtension) != $.trim(newValue)) {
			var ajaxHandler = window.ajaxUrlPrefix + 'modules-file-manager-file-browser-ajax.php?method=updateNodeName';
			var ajaxQueryString =
			'elementId=' + encodeURIComponent(elementId) +
			'&nodeId=' + encodeURIComponent(nodeId) +
			'&nodeType=' + encodeURIComponent(nodeType) +
			'&fileExt=' + encodeURIComponent(fileExt) +
			'&newValue=' + encodeURIComponent(newValue);
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
				success: updateNodeNameFromTreeSuccess,
				error: errorHandler
			});
		}

		$("#" + elementId + "_input").hide();

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

function updateNodeNameFromTreeSuccess(data, textStatus, jqXHR)
{
	try {

		var ary = data.split('~');
		var elementId = ary[0];
		var messageText = ary[1];
		var fileListItemId = ary[2];
		var newName = $("#" + fileListItemId + "_input").val();
		var nodeObject = $("#" + fileListItemId + " > a");
		var parentObject = $(nodeObject).parents().eq(2);
		var parentObjectId = parentObject.attr('id');
		var parentAry = parentObjectId.split('_');
		var parent_file_manager_folder_id = parentAry[1];
		//alert(parentObjectId + " " + parent_file_manager_folder_id);
		showTree(parentObject, parent_file_manager_folder_id);
		//$(nodeObject).text(newName);
		if ($("#detailsTheNodeName").length > 0) {
			var detailsSelectedElement = $("#detailsSelectedElement").val();
			if (detailsSelectedElement == fileListItemId) {
				var extention = $("#detailsFileExtention").val();
				if (extention.length > 0) {
					newName = newName + '.' + $("#detailsFileExtention").val();
				}
				$("#detailsTheNodeName").val(newName);
				//messageAlert(messageText, 'successMessage', 'successMessageLabel', elementId);
				messageAlert(messageText, 'successMessage');
			} else {
				//messageAlert(messageText, 'successMessage', 'successMessageLabel', 'a_' + fileListItemId);
				messageAlert(messageText, 'successMessage');
			}
		} else {
			//messageAlert(messageText, 'successMessage', 'successMessageLabel', 'a_' + fileListItemId);
			messageAlert(messageText, 'successMessage');
		}

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

function updateNodeNameFromDetails(elementId, nodeId, nodeType, fileExt)
{
	try {

		var newValue = $("#detailsTheNodeName").val();

		var ajaxHandler = window.ajaxUrlPrefix + 'modules-file-manager-file-browser-ajax.php?method=updateNodeName';
		var ajaxQueryString =
		'elementId=' + encodeURIComponent(elementId) +
		'&nodeId=' + encodeURIComponent(nodeId) +
		'&nodeType=' + encodeURIComponent(nodeType) +
		'&fileExt=' + encodeURIComponent(fileExt) +
		'&newValue=' + encodeURIComponent(newValue);
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
			success: updateNodeNameFromDetailsSuccess,
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

function updateNodeNameFromDetailsSuccess(data, textStatus, jqXHR)
{
	try {

		var ary = data.split('~');
		var elementId = ary[0];
		var messageText = ary[1];
		var fileListItemId = ary[2];
		var extention = $("#detailsFileExtention").val();
		var newName = $("#detailsTheNodeName").val();
		if (extention.length > 0) {
			newName = newName + '.' + $("#detailsFileExtention").val();
		}
		var nodeObject = $("#" + fileListItemId + " > a");
		var parentObject = $(nodeObject).parents().eq(2);
		var parentObjectId = parentObject.attr('id');
		var parentAry = parentObjectId.split('_');
		var parent_file_manager_folder_id = parentAry[1];
		showTree(parentObject, parent_file_manager_folder_id);
		//$(nodeObject).text(newName);
		//messageAlert(messageText, 'successMessage', 'successMessageLabel', elementId);
		messageAlert(messageText, 'successMessage');

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

function fileUploader_uploadCompleted(uploaderId, file_manager_folder_id)
{
	var element = document.getElementById('liFolder_' + file_manager_folder_id);
	showTree(element, file_manager_folder_id);
	//showDrag = false;
}

function fileUploader_DragEnter()
{
	if ($("#btnUpload").val() == 'Upload') {
		var fromUploader = 1;
		uploadButtonClicked(fromUploader);
	}
	$(".qq-upload-drop-area").show();
	$(".qq-upload-button").hide();
}

function fileUploader_DragLeave()
{
	if ($("#btnUpload").val() == 'Cancel Upload') {
		var fromUploader = 1;
		uploadButtonClicked(fromUploader);
	}
	$(".qq-upload-drop-area").hide();
	$(".qq-upload-button").show();
}

function toggleFileFolderPermission(elementId, nodeType)
{
	try {

		var isChecked = $("#" + elementId).is(':checked');

		var ajaxHandler = window.ajaxUrlPrefix + 'modules-file-manager-file-browser-ajax.php?method=toggleFileFolderPermission';
		var ajaxQueryString =
		'elementId=' + encodeURIComponent(elementId) +
		'&nodeType=' + encodeURIComponent(nodeType) +
		'&isChecked=' + encodeURIComponent(isChecked);
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
			success: toggleFileFolderPermissionSuccess,
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

function toggleFileFolderPermissionSuccess(data, textStatus, jqXHR)
{
	try {

		var json = data;

		var elementId = json.elementId;
		var nodeType = json.nodeType;
		var permissionType = json.permissionType;
		var isChecked = json.isChecked;
		var uniqueId = json.uniqueId;
		var role_id = json.role_id;

		if (nodeType == 'folder') {
			var file_manager_folder_id = uniqueId;
		} else {
			var file_manager_file_id = uniqueId;
		}

		var ary = elementId.split('_');

		var rowId = 'tr_' + uniqueId + '_' + role_id;
		var cellId = 'td_' + elementId;
		var viewId = uniqueId + '_' + role_id + '_view';
		if (permissionType == 'view' && $("#" + elementId).is(':checked') == false) {
			$("#" + rowId).find('input').filter(':checked').attr('checked', false);
		} else if ($("#" + rowId).find('input').filter(':checked').length > 0) {
			$("#" + viewId).attr('checked', true);
		}

		var messageText = 'Permission to ' + permissionType + ' successfully updated';
		messageAlert(messageText, 'successMessage');

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

function toggleAllPermissionsForRole(elementId, nodeType)
{
	try {

		var rowId = 'tr_' + elementId;
		var inputCount = $("#" + rowId).find('input').length;
		var checkedCount = $("#" + rowId).find('input').filter(':checked').length;
		var checkAll = 0;
		if (checkedCount < inputCount) {
			checkAll = 1;
		}

		var ajaxHandler = window.ajaxUrlPrefix + 'modules-file-manager-file-browser-ajax.php?method=toggleAllPermissionsForRole';
		var ajaxQueryString =
		'elementId=' + encodeURIComponent(elementId) +
		'&nodeType=' + encodeURIComponent(nodeType) +
		'&checkAll=' + encodeURIComponent(checkAll);
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
			success: toggleAllPermissionsForRoleSuccess,
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

function toggleAllPermissionsForRoleSuccess(data, textStatus, jqXHR)
{
	try {

		var ary = data.split('_');
		var checkAll = ary[2];
		var rowId = 'tr_' + ary[0] + '_' + ary[1];
		if (checkAll == 1) {
			$("#" + rowId).find('input').prop('checked', true);
		} else {
			$("#" + rowId).find('input').prop('checked', false);
		}
		var messageText = 'Permissions successfully updated';
		//messageAlert(messageText, 'successMessage', 'successMessageLabel', rowId);
		messageAlert(messageText, 'successMessage');

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

function applyPermissionsToFolderContents(file_manager_folder_id)
{
	try {

		var answer = confirm('This will replace permissions on all files and folders within this folder with the permissions here.\n\nAre you sure you want replace permissions?');
		if (answer) {

			var ajaxHandler = window.ajaxUrlPrefix + 'modules-file-manager-file-browser-ajax.php?method=applyPermissionsToFolderContents';
			var ajaxQueryString =
			'file_manager_folder_id=' + encodeURIComponent(file_manager_folder_id);
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
				success: applyPermissionsToFileSiblingsSuccess,
				error: errorHandler
			});
		}

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

function applyPermissionsToFileSiblings(fileId, elementId)
{
	try {

		var parent_file_manager_folder_id = $("#" + elementId).parent().parent().attr('id').replace('liFolder_', '');
		//alert('here :' + parent_file_manager_folder_id);
		var answer = confirm('This will replace permissions on all files located in the same folder as this file.\n\nAre you sure you want replace permissions?');
		if (answer) {
			var ajaxHandler = window.ajaxUrlPrefix + 'modules-file-manager-file-browser-ajax.php?method=applyPermissionsToFileSiblings';
			var ajaxQueryString =
			'parent_file_manager_folder_id=' + encodeURIComponent(parent_file_manager_folder_id) +
			'&fileID=' + encodeURIComponent(fileId);
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
				success: applyPermissionsToFileSiblingsSuccess,
				error: errorHandler
			});
		}

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

function applyPermissionsToFileSiblingsSuccess(data, textStatus, jqXHR)
{
	try {

		var messageText = 'Permissions successfully updated';
		messageAlert(messageText, 'successMessage');

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

function uploadButtonClicked(fromUploader)
{
	if ($("#btnUpload").hasClass('disabled') == false) {
		if ($("#btnUpload").val() == 'Upload') {
			if ($(".treeViewUploader.upload").length) {
				$("#btnUpload").val('Close Upload');
				$(".treeViewUploader.upload").show();
				if (fromUploader == 1) {
					$(".treeViewUploader.upload").find('.qq-upload-drop-area').show();
				}
				var maxX = $(".treeViewUploader").getMaxOccupiedLocation().x;
				var cellRightPosition = $("#tdFileTreeMenu").offset().left + $("#tdFileTreeMenu").width();
				var rightDifference = maxX - cellRightPosition;
				if ( rightDifference > 0) {
					var newWidth = $("#tdFileTreeMenu").width() + rightDifference + 30;
					$("#tdFileTreeMenu").width(newWidth);
				}
				if (window.attachEvent) {
					// it is IE or Opera
					var messageText = "For increased upload functionality like drag and drop or multiple-file uploading consider a new browser like Chrome.";
					messageAlert(messageText, 'infoMessage');
				}
				$(".jqueryFileTree a").hide();
				$(".jqueryFileTree .file a").show();
				$(".jqueryFileTree .trash a").show();
			} else {
				var messageText = "You do not have permission to upload to any of the displayed folders";
				messageAlert(messageText, 'warningMessage');
			}
		} else {
			$("#btnUpload").val('Upload');
			$(".treeViewUploader.upload").hide();
			//$(".treeViewUploader.upload").find(".qq-upload-drop-area").hide();
			$(".jqueryFileTree a").show();
		}
	}
}

function newFolderButtonClicked()
{
	if ( $("#btnFolder").hasClass('disabled') == false) {
		if ($(".ui-selected").length == 1) {
			var element = $(".ui-selected");
			newFolderRightClickSelected(element);
		} else {
			messageAlert('Please select only one folder in which to place your new folder.', 'warningMessage');
		}
	}
}

function renameButtonClicked()
{
	if ( $("#btnRename").hasClass('disabled') == false) {
		if ($(".ui-selected").length == 1) {
			var element = $(".ui-selected");
			renameItemRightClickSelected(element);
		} else {
			messageAlert('Please select only one item to rename', 'warningMessage');
		}
	}
}

function deleteButtonClicked()
{
	if ($("#btnDelete").hasClass('disabled') == false) {
		moveItemsToRecycleBin();
	}
}

function restoreButtonClicked()
{
	if ($("#btnRestore").hasClass('disabled') == false) {
		restoreItemsFromRecycleBin();
	}
}

function notYetImplemented()
{
	messageAlert('Not yet implemented.', 'warningMessage');
}

function toggleFileSystemDetails()
{
	if ($("#btnToggleDetails").val() == "Show Info") {
		$("#btnToggleDetails").val('Hide Info');
		$("#btnMenuShowInfo").html('Hide Info');
		if ($("#tblFileSystemDetails").length == 0) {
			// If there are no details then let's try loading them before we show them.
			var nodeId = $(".ui-selected").parent().attr('id');
			var nodeType = "file";
			if ( $(".ui-selected").parent().hasClass('directory') ) {
				nodeType = 'folder';
			}
			loadDetails(nodeId, nodeType);
		}
		$("#fileDetails").show();
	} else {
		$("#btnToggleDetails").val('Show Info');
		$("#btnMenuShowInfo").html('Show Info');
		$("#fileDetails").hide();
	}
}

function triggerBlur()
{
	alert(e.keyCode);
}
/*
function showHideUploaders()
{
$(".treeViewUploader").toggle();
}
*/

/**
* Copied from permanentlyDeleteItemsFromRecycleBin() for now.
*/
function emptyTrash()
{
	try {
		var currentlySelectedProjectId = $('#currentlySelectedProjectId').val();
		var ajaxHandler = window.ajaxUrlPrefix + 'modules-file-manager-file-browser-ajax.php?method=permanentlyemptytheTrash';
		var ajaxQueryString =
		'projectId=' + encodeURIComponent(currentlySelectedProjectId) ;
		// '&files=' + encodeURIComponent(csvMovedFileListItems) +
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
			success: emptyTrashSuccess,
			error: errorHandler
		});

	}catch(error)
	{
		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}


}
function emptyTrash1()
{
	try {

		// var file_manager_folder_id = data;
		// var element = document.getElementById('liFolder_' + file_manager_folder_id);
		// showTree(element, file_manager_folder_id);
		$("#liFolder_-1").show();
		var file_manager_folder_id = -1;
		var element = document.getElementById('liFolder_' + file_manager_folder_id);
		showTree(element, file_manager_folder_id);
		// var promise1 = showTree(element, file_manager_folder_id);
		// promise2.always(function() {

		setTimeout( function() {


			// if ( $(".trash:not(.trashRoot)").children().hasClass('ui-selected')) {
			// 		$(".ui-selected").removeClass('ui-selected');
			// 		if ( $(".trash.delete").length > 0) {
			// 			$(".trash.delete").find('a').addClass('ui-selected');
			// 		}
			// 	}
			var arrMovedFolderListItems = [];
			var arrMovedFileListItems = [];
			$(".trashChild").each(function(index) {
				$(".trash.delete").find('a').addClass('ui-selected');
				alert('id : '+$(this).id +" good : "+$(this).attr('id') );
				if($(this).hasClass('directory'))
				{
					alert('dir');
					var movedFolderListItem = $(this).attr('id').replace('liFolder_', '');
					alert('movedFolderListItem  : '+movedFolderListItem);
					arrMovedFolderListItems.push(movedFolderListItem);
				}

				if($(this).hasClass('file'))
				{
					alert('file');
					var movedFileListItem = $(this).attr('id').replace('li_', '');
					alert('movedFileListItem  : '+movedFileListItem);
					arrMovedFileListItems.push(movedFileListItem);

				}
			});


			// if ( $(".ui-selected").length > 0) {
			// 	var arrMovedFolderListItems = [];
			// 	var arrMovedFileListItems = [];

			// 	// Get the folders that were selected
			// 	$(".ui-selected").each(function(index) {
			// 		if ($(this).parent().hasClass('directory') && $(this).parent().hasClass('trash')) {
			// 			var movedFolderListItem = $(this).parent().attr('id').replace('liFolder_', '');
			// 			arrMovedFolderListItems.push(movedFolderListItem);
			// 		}
			// 	});

			// 	// Loop through the files that were selected and check if their parent folder is already in the folder list.
			// 	var parent_file_manager_folder_id;
			// 	$(".ui-selected").each(function(index) {
			// 		//  $(this).parent().hasClass('file') &&
			// 		if ( $(this).parent().hasClass('trash') ) {
			// 			parent_file_manager_folder_id = $(this).parent().parent().parent().attr('id').replace('liFolder_', '');
			// 			if ($.inArray(parent_file_manager_folder_id, arrMovedFolderListItems) < 0) {
			// 				var movedFileListItem = $(this).parent().attr('id').replace('li_', '');
			// 				arrMovedFileListItems.push(movedFileListItem);
			// 			}
			// 		}
			// 	});



			var csvMovedFolderListItems = arrMovedFolderListItems.join(',');
			var csvMovedFileListItems = arrMovedFileListItems.join(',');

			// This doesn't return a parent folder because the /Trash folder was clicked, which is at the root.
			// var affectedElementParentFolderId = $(".ui-selected").first().parents().eq(2).attr('id').replace('liFolder_', '');
			var affectedElementParentFolderId = '-1';
			var ajaxHandler = window.ajaxUrlPrefix + 'modules-file-manager-file-browser-ajax.php?method=permanentlyDeleteItemsFromRecycleBin';
			var ajaxQueryString =
			'folders=' + encodeURIComponent(csvMovedFolderListItems) +
			'&files=' + encodeURIComponent(csvMovedFileListItems) +
			'&parent_file_manager_folder_id=' + encodeURIComponent(affectedElementParentFolderId);
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
				success: emptyTrashSuccess,
				error: errorHandler
			});
			// }
		}, 1000);
		// });
	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}

function emptyTrashSuccess(data, textStatus, jqXHR)
{
	try {

		var file_manager_folder_id = -1;
		var element = document.getElementById('liFolder_' + file_manager_folder_id);
		showTree(element, file_manager_folder_id);

	} catch(error) {

		if (window.showJSExceptions) {
			var errorMessage = error.message;
			alert('Exception Thrown: ' + errorMessage);
			return;
		}

	}
}
$(window).on("beforeunload", function() {
	if(isDownloadInProgress == 1){
		return confirm("Do you really want to close?");
	}
});
// $.browser was removed as of jQuery 1.9.  This hacks it back in.
// Limit scope pollution from any deprecated API
(function() {

	var matched, browser;

	// Use of jQuery.browser is frowned upon.
	// More details: http://api.jquery.com/jQuery.browser
	// jQuery.uaMatch maintained for back-compat
	jQuery.uaMatch = function( ua ) {
		ua = ua.toLowerCase();

		var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
		/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
		/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
		/(msie) ([\w.]+)/.exec( ua ) ||
		ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
		[];

		return {
			browser: match[ 1 ] || "",
			version: match[ 2 ] || "0"
		};
	};

	matched = jQuery.uaMatch( navigator.userAgent );
	browser = {};

	if ( matched.browser ) {
		browser[ matched.browser ] = true;
		browser.version = matched.version;
	}

	// Chrome is Webkit, but Webkit is also Safari.
	if ( browser.chrome ) {
		browser.webkit = true;
	} else if ( browser.webkit ) {
		browser.safari = true;
	}

	jQuery.browser = browser;

	jQuery.sub = function() {
		function jQuerySub( selector, context ) {
			return new jQuerySub.fn.init( selector, context );
		}
		jQuery.extend( true, jQuerySub, this );
		jQuerySub.superclass = this;
		jQuerySub.fn = jQuerySub.prototype = this();
		jQuerySub.fn.constructor = jQuerySub;
		jQuerySub.sub = this.sub;
		jQuerySub.fn.init = function init( selector, context ) {
			if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
				context = jQuerySub( context );
			}

			return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
		};
		jQuerySub.fn.init.prototype = jQuerySub.fn;
		var rootjQuerySub = jQuerySub(document);
		return jQuerySub;
	};

})();
