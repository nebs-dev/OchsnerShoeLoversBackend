'use strict';

jQuery(document).ready(function ($) {

    // we dont want all buttons to submit forms
    $('button.btn').not('.submitBtn').click(function (e) {
        e.preventDefault();
    });

    // Enable parsley for validation
    $('.ajaxForm').parsley();

    $('.ajaxForm').submit(function (e) {
        e.preventDefault();
        var $btn = $(this).find('.submitBtn');
        var $form = $(this);
        var form = $form[0];

        // remove any file inputs that are empty, FormData appends 0 valued file blobs
        $form.find('input[type="file"]').each(function () {
            if (!$(this).val()) $(this).remove();
        });

        var formData = new FormData($form[0]);
        var uploadHTML = $('<div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar"></div></div>');

        // check if croppers exist... and if they do we must append cropped images to form
        var $croppers = $form.find('.cropper.modified'), allDone = 0;
        if ($croppers.length) {

            // add notification that its uploading...
            var uploadProgress = toastr.info(uploadHTML, 'Upload progress', {
                positionClass: 'toast-top-right',
                timeOut: 0,
                extendedTimeOut: 0,
                tapToDismiss: false
            });

            // append all cropped images to form data
            $croppers.each(function () {
                var $cropper = $(this);

                // create blob from canvas, using width height data from html
                $cropper.cropper('getCroppedCanvas', {
                    width: $cropper.data('width'),
                    height: $cropper.data('height')
                }).toBlob(function (blob) {
                    formData.append($cropper.data('name'), blob, $cropper.data('name') + '.png');

                    allDone++;

                    if ($croppers.length === allDone) {
                        ajaxSend();
                    }
                });

            });
        } else {
            // just send data, no need to add cropper images
            ajaxSend();
        }


        // function that is run on formdata rdy
        function ajaxSend() {

            function progressHandler(e) {
                if (e.lengthComputable) {
                    var percent = (e.loaded / e.total) * 100;
                    uploadHTML.find('.progress-bar').css('width', percent + '%');
                }
            }

            $.ajax(form.action, {
                method: form.method,
                data: formData,
                contentType: false,
                processData: false,
                xhr: function () {
                    var myXhr = $.ajaxSettings.xhr();
                    if (myXhr.upload) {
                        myXhr.upload.addEventListener('progress', progressHandler, false);
                    }
                    return myXhr;
                },
                beforeSend: function () {
                    $btn.prop('disabled', true).addClass('submitting');
                },
                success: function (response) {
                    if (response.err) {
                        toastr.error('Error saving!');
                        return console.error(response.err);
                    }

                    // sometimes response will have redirect url, we must handle that
                    if (response.redirect) {
                        return window.location = response.redirect;
                    }

                    toastr.success('Saved!');
                },
                error: function () {
                    toastr.error('Error saving!');
                },
                complete: function () {
                    $btn.prop('disabled', false).removeClass('submitting');
                    if (uploadProgress) {
                        toastr.clear(uploadProgress);
                    }
                }
            });
        }
    });


    // set up croppers
    $('.cropper').each(function () {
        var $this = $(this);

        // we need to provide some data for cropper to work as expected
        if (!$this.data('width') || !$this.data('height')) return alert('Set data width/height for cropper');

        // init cropper
        $this.cropper({
            aspectRatio: $this.data('width') / $this.data('height'),
            preview: $this.data("preview") || "",
            multiple: true,
            autoCropArea: 1,
            strict: true,
            responsive: true,
            modal: true,
            zoomable: false,
            cropend: function (e) {
                // if something happened to cropper, add class modified so new image uploads
                $this.addClass('modified');
            }
        });
    });


    // file input field which loads browsed image to cropper instance that is in parent with him
    $('.cropper-picker').change(function (e) {
        var $this = $(this);
        var $cropper = $this.parent().find('.cropper');
        var file = e.target.files[0];

        // check if file type matches to image
        if (file.type.match('image.*')) {

            // start filereader
            var reader = new FileReader();
            reader.onload = function (event) {
                // we add class modified, because cropper loaded new image that needs to be uploaded
                $cropper.addClass('modified').cropper('replace', event.target.result);
            };

            // Read in the image file as a data URL.
            reader.readAsDataURL(file);

        } else {
            alert('Only images allowed!');
        }

        // reset value to null, we dont need this in upload
        $this.val('');

    });


    // set all text areas to wysiwyg editors
    $('.wysiwyg').each(function () {
        $(this).summernote({
            toolbar: [
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['font', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']],
                ['insert', ['link']],
                ['extra', ['fullscreen', 'codeview']]
            ]
        });
    });

    // Disable/enable input_field_name in competitions
    $('#add_input_field').on('change', function () {
        if ($(this).is(":checked")) {
            $('#input_field_name').attr('disabled', false);
        } else {
            $('#input_field_name').attr('disabled', true);
        }
    });

    // Enable daterangepicker
    $('input[id="daterange"]').daterangepicker({
        minDate: new Date(),
        locale: {
            format: 'DD.MM.YYYY'
        }
    });


    // List view delete button
    $('.deleteBtn').click(function (e) {
        e.preventDefault();
        var btn = $(this);
        btn.prop('disabled', true);

        var answer = confirm(btn.data('msg'));

        if (answer) {
            $.post(this.href, {}, function (data) {
                if (data.err) return console.log(data.err);

                btn.parents('tr').remove();
            })
        }
    });

    // Filter tables by status
    $('#selectFilter').on('change', function () {
        var rows = $('.filterTable tr.bodyRow').hide();

        if ($(this).val() == 'all') {
            rows.show();
        } else {
            rows.filter("." + $(this).val() + "").show();
        }
    });

    // add class to all active links in side menu
    $('.treeview.active a[href~="' + globals.currentUrl + '"]').addClass('activeLink');
    $('.treeview.active a[href~="' + globals.currentUrl.substring(0, globals.currentUrl.length - 2) + '"]').addClass('activeLink');
    $('.treeview.active a[href~="' + globals.currentUrl.substring(0, globals.currentUrl.length - 7) + '"]').addClass('activeLink');


    // Teaser links
    $('.linkType').on('change', function(){
        if($(this).val() > 0) {
            $('#link').prop('disabled', true);
            $('.linkSection').prop('disabled', false);
        } else {
            $('#link').prop('disabled', false);
            $('.linkSection').prop('disabled', true);
            $('.linkItem').prop('disabled', true);
        }
    });

    $('.linkSection').on('change', function(){
        $('.linkItem').prop('disabled', false);

        $.post('/teasers/linkItems', {
            'section': $(this).val(),
            'language': globals.language
        }, function (data) {
            if (data.err) return console.log(data.err);

            //console.log(data);
            $('.linkItemDiv').html(data);
        })
    });

});