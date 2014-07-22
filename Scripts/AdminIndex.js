$().ready(function () {
    $("#home").click(function () {
        location.href = '/';
    })//unbinf

    $("#signOut").click(function () {
        $.ajax({
            url: '/Admin/SignOut',
            type: 'POST',
            success: function () {
                $('button').prop("disabled", true);
                 
                $('table').attr("class", "disabled");
                $('h3').attr("class", "disabled");
                
                $("#home").prop("disabled", false);
            }
        });
    })

    $("#createNew").click(function () {
        location.href = "/Admin/Create/" + this.name;
    })

    $(".edit").click(function () {
        location.href = "/Admin/Edit/" + this.name;
    })

    $(".delete").click(function () {        
        var $this = $(this);        
        $this.removeClass("delete").addClass("deleteSure");               
    })

    $(".deleteSure").click(function() {       
        var $this = $(this[0]);
        var id = $this.id;

        $.ajax({
            url: '/Admin/Delete',
            type: 'POST',
            dataType: 'Json',
            //contentType: 'Json',
            data: { "id": parseInt(id) },
            timeout: 5000,

            success: function (data, textStatus, jqXHR) {
                if (data) {
                    location.href = "/Admin/Index";
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
        $this.removeClass("deleteSure").addClass("delete");       
    })
})