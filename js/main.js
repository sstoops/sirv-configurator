//@codekit-prepend "../bower_components/jquery/dist/jquery.js"

jQuery(document).ready(function($) {
  var imgContainer = $('#images'),
      newConfig = {"frames": {}},
      hotSpotStyleForm = $('#hotspotStyle')
      boxXForm = $('#boxXInput'),
      boxYForm = $('#boxYInput'),
      newConfigForm = $('#newConfig');

  $('#spinFileForm').submit(function(e){
    e.preventDefault();
    var url = $('#spinFileInput').val();
    $.ajax({
      url: url,
      jsonp: "callback",
      dataType: "jsonp",
      cache: true,
      // Work with the response
      success: function( response ) {
        $('#spinFile').val(JSON.stringify(response, null, '\t'));
        $.each(response.layers[1], function(k, v){
          var div = $('<div>').appendTo(imgContainer);
          $('<img>')
          .attr('src', '//orgeadvi.sirv.com/vanimation/' + v)
          .attr('data-frame', k)
          .appendTo(div)
          $('<p>').appendTo(div);
        })

        $('img').click(function(e) {
          var offset = $(this).offset(),
          x = Math.round((e.pageX - offset.left) / $(this).width() * 100),
          y = Math.round((e.pageY - offset.top) / $(this).height() * 100);
          $(this).parent().find('p').empty().append(x + ", " + y);
          newConfig.frames[$(this).data('frame')] = {
            "pointer": {
              "style": hotSpotStyleForm.val(),
              "x": x + "%",
              "y": y + "%"
            },
            "box": {
              "x": boxXForm.val(),
              "y": boxYForm.val()
            }
          };
          newConfigForm.val(JSON.stringify(newConfig, null, '\t'));
        });

      }
    });
  });
});
