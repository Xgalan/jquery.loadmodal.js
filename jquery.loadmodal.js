/*
Original author: Conan C. Albrecht <ca@byu.edu>
License: MIT
Forked from version: 1.1.3 (Feb 2014)

Dependencies:
- JQuery 1.5+
- Bootstrap (tested against v3)

A JQuery plugin to open a Bootstrap modal (dialog) with content loaded via Ajax.

See the README for an example.

 */
(function ($) {
	'use strict';

	// provide your template for the modal window
	var modalWindowTmpl = function (data) {
		var __t,
		__p = '';
		__p += '<div class="modal fade" id="' +
		((__t = (data.id)) === null ? '' : __t) +
		'" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">' +
		((__t = (data.title)) === null ? '' : __t) +
		'</h4></div><div class="modal-body">' +
		((__t = (data.content)) === null ? '' : __t) +
		'</div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div>';
		return __p;
	};

	$.fn.loadmodal = function (options) {

		// allow a simple url to be sent as the single option
		if ($.type(options) === 'string') {
			options = {
				url : options,
			}; //options
		} //if

		// set the default options
		options = $.extend({
				url : null, // a convenience place to specify the url - this is moved into ajax.url
				id : 'jquery-loadmodal-js', // the id of the modal
				appendToSelector : 'body', // the element to append the dialog <div> code to.  Normally, this should be left as the 'body' element.
				title : window.document.title || 'Dialog', // the title of the dialog
				width : '400px', // 20%, 400px, or other css width
				ajax : { // options sent into $.ajax (see JQuery docs for .ajax for the options)
					url : null, // required (for convenience, you can specify url above instead)
				}, //ajax

			}, options);

		// ensure we have a url
		options.ajax.url = options.ajax.url || options.url;
		if (!options.ajax.url) {
			throw new Error('$().loadmodal requires a url.');
		} //if

		// close any dialog with this id first
		$('#' + options.id).modal('hide');

		// create our own success responder for the ajax
		var origSuccess = options.ajax.success;
		options.ajax.success = function (data, status, xhr) {
			var objToRender = {
				content : data,
				id : options.id,
				width : options.width,
				title : options.title
			};

			// create the modal html
			var modalWindow = $(modalWindowTmpl(objToRender));

			// add the new modal window to the chosen element and show it!
			$(options.appendToSelector).append(modalWindow);
			modalWindow.modal();

			// event to remove the content on close
			modalWindow.one('hidden.bs.modal', this.remove);

			// run the user success function, if there is one
			if (origSuccess) {
				origSuccess(data, status, xhr);
			} //if

		}; //success

		// load the content from the server
		$.ajax(options.ajax);

		return this;
	};

})(jQuery);
