$(document).ready(function() {

// ****************
// GLOBAL VARIABLES
// ****************

// pixel array
var pixelColors = [];

// image width
var imageWidth;

// pixel width
var pixelWidth = 1;

// generated CSS
var boxShadow;


// *************
// CONFIGURATION
// *************

// FILE UPLOAD //

var imageLoader = document.getElementById('image-file');
imageLoader.addEventListener('change', handleImage, false);

// set up the canvas
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// read the image
function handleImage(e){
    var reader = new FileReader();

    reader.onload = function(event){
        var img = new Image();
        img.onload = function(){

            // check image
            if (img.height > 100 || img.width > 100) {
               alert("File is too big. The longest side should be 100px or less.");
               this.value = "";
               return 'File too large.';
            }

            imageWidth = img.width;
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            var pixels = imageData.data;
            var numPixels = imageData.width * imageData.height;

            // collect colors
            for (var i = 0; i < numPixels; i++) {
                var red = pixels[i * 4];
                var green = pixels[i * 4 + 1];
                var blue = pixels[i * 4 + 2];
                var alpha = pixels[i * 4 + 3];

                pixelColors[i] = [red, green, blue, alpha];
            }

            // activate run button
            $('#run-button').removeClass('disabled');
        }

        img.src = event.target.result;
    }

    reader.readAsDataURL(e.target.files[0]);
}

// RUN BUTTON //

var runButton = document.getElementById('run-button');
runButton.addEventListener('click', renderPixels, false);

// PIXEL WIDTH //

var pixelWidthRange = document.getElementById('pixel-width');

// set default shadow-box size
$('#box-shadow').css({
    'height' : pixelWidth,
    'width'  : pixelWidth
});

// listen to range input
pixelWidthRange.addEventListener('input', function(){
    pixelWidth = parseInt(pixelWidthRange.value);
    document.getElementById('pixel-width-indicator').innerHTML = pixelWidthRange.value;
    renderPixels();
}, false);


// ****************
// RENDER PIXEL ART
// ****************

function renderPixels(){

    // define shadow-box size
    $('#box-shadow').css({
        'height' : pixelWidth,
        'width'  : pixelWidth
    });

    // convert to box-shadow properties
    boxShadow = '';
    var xOffset = 0;
    var yOffset = 0;

    for (var i = 0; i < pixelColors.length; i++) {
        boxShadow += 
            String(xOffset * pixelWidth) + 'px ' +
            String(yOffset * pixelWidth) + 'px rgba(' +
            String(pixelColors[i][0]) + ', ' +
            String(pixelColors[i][1]) + ', ' +
            String(pixelColors[i][2]) + ', ' +
            String(pixelColors[i][3]) + '), ';

        xOffset++;;

        // advance to next row
        if (xOffset === imageWidth) {
            xOffset = 0;
            yOffset++;
        }
    }

    // clean string
    boxShadow = boxShadow.substring(0, boxShadow.length - 2);

    // apply box-shadow
    $('#box-shadow').css('box-shadow', boxShadow);

    // output code
    displayCode();

}

// ***********
// OUTPUT CODE
// ***********

function displayCode() {
    document.getElementById('css').textContent =
        'display: inline-block; ' +
        'height: ' + pixelWidth + 'px; ' +
        'width: ' + pixelWidth + 'px; ' +
        'box-shadow: ' +  boxShadow + ';';
}



}); // end doc ready

