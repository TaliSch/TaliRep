﻿$().ready(function () {
    LoginInit();

    $("#home").click(function () {
        location.href = '/';
    })//unbinf

    //$("#signOut").click(function () {
    //    $.ajax({
    //        url: '/Admin/SignOut',
    //        type: 'POST',
    //        success: function () {
    //            enabbeDisable(true);
    //            $("#signOut").hide();
    //        }
    //    });
    //})
    $(".login").on("signOutCompleted",function () {       
        enabbeDisable(true);
    })

    $(".login").on("signInCompleted", function () {
        enabbeDisable(false);
    })

    $("#createNew").click(function () {
        location.href = "/Admin/Create/" + this.name;
    })

    $(".edit").click(function () {
        var $this = $(this);
        var parent = $this.parent();
        var id = parent.get(0).id;
       
        location.href = "/Admin/Edit/" + id;
    })

    $(".delete").click(function () {        
        var $this = $(this);
        var parent = $this.parent();
        var id = parent.get(0).id;

        $this.hide();

        parent.find('.deleteSure').prop("hidden", false);        
        
    })

    $(".cancel").click(function () {
        var $this = $(this);
        var parent = $this.parent().parent();
        var id = parent.get(0).id;

        parent.find('.deleteSure').prop("hidden", true);        
    })

    $(".sure").click(function () {
        
        var $this = $(this);
        var parent = $this.parent().parent();        
        var id = parent.get(0).id;

        alert(id);
        $.ajax({
            url: '/Admin/Delete',
            type: 'POST',
            dataType: 'Json',
            //contentType: 'Json',
            data: { "id": parseInt(id) },
            timeout: 5000,

            success: function (data, textStatus, jqXHR) {
                alert(data);
                if (data) {
                    parent.find('.deleteSure').prop("hidden", true);
                    location.href = "/Admin/Index";
                }
                else {
                    alert("Failed To Delete");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Failed To Send Delete," + textStatus + ","+errorThrown);
            }
        });        
    })

    function enabbeDisable(disabled) {
        var className = disabled ? "disabled" : "enabled";

        $('.cancel').prop("disabled", disabled);
        $('.edit').prop("disabled", disabled);
        $('.delete').prop("disabled", disabled);
        $('.sure').prop("disabled", disabled);
        $('#createNew').prop("disabled", disabled);

        $('table').attr("class", className);
        $('header').attr("class", className);
        $('td').attr("class", className);
        $('th').attr("class", className);

        $("#home").prop("disabled", false);      
    }
})