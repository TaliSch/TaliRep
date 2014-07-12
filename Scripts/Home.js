$().ready(function () {
    var datas = GetNextItems(0, 10);
    if (datas) {
        for (var i = 0; i < datas.length; i++) {
            $(posts).append("<p>" + datas[i] + "<p>");
        }
    }
})
function GetNextItems(from, to) {
    var retval =[];
    $.ajax({
        url: 'Home/Index',
        type: 'POST',
        dataType: 'Json',
        //contentType: 'Json',
        data: { From: from, To: to },
        timeout: 5000,

        success: function (data, textStatus, jqXHR) {
           // alert(data.length);
         
            for (var i = 0; i < data.length; i++) {
                // alert(data[i].Data);
                
                retval.push(LZString.decompressFromBase64(data[i].Data));
                // alert(retval[i]);
            }
            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Failed To Load");
        }
    });
    alert(retval.length);
    return retval;
}

