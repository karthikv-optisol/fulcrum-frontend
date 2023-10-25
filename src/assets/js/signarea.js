$('#signArea').signaturePad({drawOnly:true, drawBezierCurves:true, lineTop:90});
$('#clear').click(function() {
    $('#signArea').signaturePad().clearCanvas();
});