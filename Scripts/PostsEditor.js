
$().ready(function () {
    var compressed = $("#editor").val();
    var decompressed = LZString.decompressFromBase64(compressed);
    if (decompressed)
        $("#editor").val(decompressed);

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

    $("#EditForm").submit(function (event) {
        event.preventDefault();
        var data = $("#editor").val();
        var name = $("#name").val();
        var id = $("#id-hidden").val();
        var url = '/Posts/Edit';
        postData(id, name, data, url);
    })

    $("#CreateForm").submit(function (event) {
        event.preventDefault();
        var data = $("#editor").val();
       
        var name = $("#name").val();
        var id = 0;
        var url = '/Posts/Create';
       
        postData(id, name, data, url);
    })

    function postData(id, name, data, url) {
        var compressedData = LZString.compressToBase64(data);
        
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'Json',
            //contentType: 'Json',
            data: { ID: id, Data: compressedData, Name: name },
            timeout: 5000,

            success: function (data, textStatus, jqXHR) {
                if (data) {
                    location.href = "/Posts/Index";
                }
                else
                    alert("Failed To Save");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Failed To Send");
            }
        });
    }
    //$("#CreateForm").submit(function (event) {
    //    event.preventDefault();
    //    var data = $("#editor").val();
    //    var name = $("#name").val();
        
    //    var compressedData = LZString.compress(data);        

    //    $.ajax({
    //        url: '/Posts/Create',
    //        type: 'POST',
    //        dataType: 'Json',
    //        //contentType: 'Json',
    //        data: { ID: "0", Data: compressedData, Name: name },
    //        timeout: 5000,

    //        success: function (data, textStatus, jqXHR) {
    //            if (data) {
    //                location.href = "/Posts/Index";
    //            }
    //            else
    //                alert("Failed To Save");
    //        },
    //        error: function (jqXHR, textStatus, errorThrown) {
    //            alert("Failed To Send");
    //        }
    //    });
    //})
})

function invalidName() {
    if ($('#name').val() == '') {       
        //$(this).css("background-color", "red");
        $('#name').css("border", "3px solid red");
    }
    else
        $('#name').css("border", "3px solid gray");
}