$().ready(function () {
    
    $("#EditForm").submit(function (event) {
        event.preventDefault();
        var data = $("#editor").val();
        var name = $("#name").val();
        var id = $("#id-hidden").val();
  
        var compressedData = LZString.compress(data);
      
        $.ajax({
            url: '/Posts/Edit',
            type: 'POST',
            dataType: 'Json',
            //contentType: 'Json',
            compresseData: { ID: id, Data: compressedData, Name: name },
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
    })
})