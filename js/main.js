//@codekit-prepend "../bower_components/jquery/dist/jquery.js"

jQuery(document).ready(function($) {
  var imgContainer = $('#image'),
      newConfig = {"frames": {}},
      hotSpotStyleForm = $('#hotspotStyle')
      boxXForm = $('#boxXInput'),
      boxYForm = $('#boxYInput'),
      newConfigForm = $('#newConfig'),
      scrubber = $('#scrubber'),
      frameIndexForm = $('#frameIndex'),
      controlsForm = $('#controlsForm'),
      frames = [],
      imgPrefix = "https://orgeadvi.sirv.com/";

  scrubber.on('input', function(e){
    showFrame($(this).val());
  });
  $('#previousFrameButton').click(previousFrame);
  $('#nextFrameButton').click(nextFrame);
  controlsForm.on('submit', function(e){
    e.preventDefault();
    showFrame(frameIndexForm.val());
  })

  function showFrame(num) {
    imgContainer.empty().append(frames[num - 1]);
    frameIndexForm.val(num);
    scrubber.val(num);
  }

  function nextFrame(){
    index = parseInt(scrubber.val());
    if (index < parseInt(scrubber.attr('max'))) {
      showFrame(index + 1);
      scrubber.val(index + 1);
    }
  }

  function previousFrame(){
    index = parseInt(scrubber.val());
    if (index > 1) {
      showFrame(index - 1);
      scrubber.val(index - 1);
    }
  }

  $('#spinFileForm').submit(function(e){
    e.preventDefault();
    var url = $('#spinFileInput').val();
    var parser = document.createElement('a');
    parser.href = url;
    path = parser.pathname.split('/')
    imgPrefix = imgPrefix + path.slice(1, path.length - 1).join('/') + '/';
    $.ajax({
      url: url,
      jsonp: "callback",
      dataType: "jsonp",
      cache: true,
      // Work with the response
      success: function( response ) {
        $('#spinFile').val(JSON.stringify(response, null, '\t'));
        scrubber.attr('max', Object.keys(response.layers[1]).length);
        $.each(response.layers[1], function(k, v){
          var i = new Image();
          i.src = imgPrefix + v;
          frames.push(i);
        })
        showFrame(1);
        //   var div = $('<div>').appendTo(imgContainer);
        //   $('<img>')
        //   .attr('src', '//orgeadvi.sirv.com/vanimation/' + v)
        //   .attr('data-frame', k)
        //   .appendTo(div)
        //   $('<p>').appendTo(div);
        // })//https://orgeadvi.sirv.com/vanimation/vanimation.spin

        imgContainer.click(function(e) {
          var offset = $(this).offset(),
          x = Math.round((e.pageX - offset.left) / $(this).width() * 100),
          y = Math.round((e.pageY - offset.top) / $(this).height() * 100);
          newConfig.frames[scrubber.val()] = {
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
          nextFrame();
        });
      }
    });
  });
});
