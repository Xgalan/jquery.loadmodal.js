/*
Original author: Conan C. Albrecht <ca@byu.edu>
License: MIT
Forked from version: 1.1.3 (Feb 2014)

Dependencies:
- JQuery 1.5+
- Bootstrap (tested against v3)

A JQuery plugin to open a Bootstrap modal (dialog) with content loaded via Ajax.

Simple example:

$('#someid').loadmodal('/your/server/url/');

Advanced example:

$('#someid').loadmodal(
url: '/your/server/url',
id: 'custom_modal_id',
title: 'My Title',
width: '400px',
ajax: {
dataType: 'html',
method: 'POST',
success: function(data, status, xhr) {
console.log($('#custom_modal_id'));
},//
// any other options from the regular $.ajax call (see JQuery docs)
},
});

Closing a dialog: (this is standard bootstrap)

$('#someid').modal('hide');


 */
(function ($) {
	'use strict';

	// provide your template
	var tmpl = '<div id="{id}" class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true"><div class="modal-dialog modal-lg"><div class="modal-content"><div class="modal-header"><h4 class="modal-title">{title}</h4></div><div class="modal-body">{content}</div></div></div></div>';

	function render(tmpl, data) {
		tmpl = tmpl || '';

		return (new Function("_", "e", "return '" +
				tmpl.replace(/[\\\n\r']/g, function (char) {
					return template_escape[char];
				}).replace(/{\s*([\w\.]+)\s*}/g, "' + (e?e(_.$1,'$1'):_.$1||(_.$1==null?'':_.$1)) + '") + "'"))(data);
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
			// create the modal html
			var data = {
				content : data,
				id : options.id,
				width : options.width,
				title : options.title
			};
			var modalWindow = jQuery(render(tmpl, data));

			// add the new modal div to the element and show it!
			jQuery(options.appendToSelector).append(modalWindow);
			modalWindow.modal();

			// event to remove the content on close
			modalWindow.on('hidden.bs.modal', this.remove);

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
