$().ready(function () {
    $("input").click(function () {
        var $this = $(this)[0];
        var id = $this.id;
        //alert("id=" + id);
        //alert(id);
        var name = $this.name;
        //alert(name);
        if (confirm("Are you sure you want to delete " + name + "?"))
            $.ajax({
                url: '/Posts/Delete',
                type: 'POST',
                dataType: 'Json',
                //contentType: 'Json',
                data: { "id": parseInt(id) },
                timeout: 5000,

                success: function (data, textStatus, jqXHR) {
                    if (data) {
                        location.href = "/Posts/Index";
                    }
                    else
                        alert("Failed To Delete");
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("Failed To Send Delete");
                    alert(textStatus);
                    alert(errorThrown);
                }
            });
    })
})