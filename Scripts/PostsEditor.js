$().ready(function () {
    $("#name").trigger("oninvalid");
    var opts = {
        absoluteURLs: false,
        cssClass: 'el-rte',
        lang: 'en',
        height: 420,
        toolbar: 'maxi',
        cssfiles: ['http://elrte.org/release/elrte/css/elrte-inner.css'],
    }
    $("#editor").elrte(opts);
})

function invalidName() {
    alert('here');
    if ($('#name').val() == '') {       
        //$(this).css("background-color", "red");
        $('#name').css("border", "3px solid red");
    }
    else
        $('#name').css("border", "3px solid gray");
}