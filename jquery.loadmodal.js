/*
    Author: Conan C. Albrecht <ca@byu.edu>
    License: MIT
    Version: 1.1.3 (Feb 2014)

    Reminder on how to publish to GitHub:
        Change the version number in all the files.
        git commit -am 'message'
        git push origin master
        git tag 1.1.10
        git push origin --tags

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
(function($) {
'use strict';

  $.fn.loadmodal = function(options) {

    // get the first item from the array as the element we'll work on
    var elem = this.first();
    if (elem.length === 0) {
      return;
    }//if

    // allow a simple url to be sent as the single option
    if ($.type(options) === 'string') {
      options = { 
        url: options,
      };//options
    }//if
    
    // set the default options
    options = $.extend({
      url: null,                               // a convenience place to specify the url - this is moved into ajax.url
      id: 'jquery-loadmodal-js',               // the id of the modal
      title: window.document.title || 'Dialog',// the title of the dialog
      width: '400px',                          // 20%, 400px, or other css width
      ajax: {                                  // options sent into $.ajax (see JQuery docs for .ajax for the options)
        url: null,                             // required (for convenience, you can specify url above instead)
      },//ajax
      
    }, options);  

    // ensure we have a url
    options.ajax.url = options.ajax.url || options.url;
    if (!options.ajax.url) {
      throw new Error('$().loadmodal requires a url.');
    }//if

    // close any dialog with this id first
    $('#' + options.id).modal('hide');

    // create our own success responder for the ajax
    var origSuccess = options.ajax.success;
    options.ajax.success = function(data, status, xhr) {
      // create the modal html
      var modalWindow = jQuery(document.createElement('div')).addClass('modal fade').prop('id', options.id)
        , modalDialog = jQuery(document.createElement('div')).addClass('modal-dialog modal-lg').css('width', options.width).appendTo(modalWindow)
        , modalContent = jQuery(document.createElement('div')).addClass('modal-content').appendTo(modalDialog)
        , modalHeader = jQuery(document.createElement('div')).addClass('modal-header')
        , modalBody = jQuery(document.createElement('div')).addClass('modal-body').html($.parseHTML(data))
        , title = jQuery(document.createElement('h4')).addClass('modal-title').text(options.title)
        , spanClose = jQuery(document.createElement('span')).addClass('sr-only').text('Close')
        , spanText = jQuery(document.createElement('span')).html('&times;').prop('aria-hidden', true)
        , closeButton = document.createElement('button');
      closeButton.setAttribute('data-dismiss', 'modal');
      jQuery(closeButton).prop({type: 'button'}).addClass('close').append(spanText).append(spanClose);
      modalContent.append(modalHeader.append(closeButton).append(title)).append(modalBody);

      // add the new modal div to the element and show it!
      elem.after(modalWindow);
      modalWindow.modal();

      // event to remove the content on close
      modalWindow.on('hidden.bs.modal', this.remove);

      // run the user success function, if there is one
      if (origSuccess) {
        origSuccess(data, status, xhr);
      }//if

    };//success

    // load the content from the server
    $.ajax(options.ajax);

    // return this to allow chaining
    return this;
  };//setTimer function
  
})(jQuery);