﻿
var LoginClass = function() {
    this.viewname = "";
    this.signoutCompleted = null;
    this.init = function (signoutCompleted, signinCompleted) {
        viewname = $(".login").get(0).id;

        $("#signOutBtn").click(function () {
            $.ajax({
                url: '/' + viewname + '/SignOut',
                type: 'POST',
                timeout: 5000,
                success: function () {
                    $("#loginBtn").show();
                    $("#signOutBtn").hide();
                    if (signoutCompleted) signoutCompleted();
                    //$('.login').trigger("signOutCompleted");
                }
            });

        })

        $("#loginBtn").click(function () {
            $("#loginBtn").hide();
            $(".insertPassword").show();
        })

        $("#signInBtn").click(function () {
            $.ajax({
                url: '/' + viewname + '/SignIn',
                type: 'POST',
                dataType: 'Json',
                //contentType: 'Json',
                data: { password: $("#password").val() },
                timeout: 5000,

                success: function (data, textStatus, jqXHR) {
                    if (data) {
                        $(".insertPassword").hide();
                        $("#signOutBtn").show();
                        if (signinCompleted) signinCompleted();
                        //$('.login').trigger("signInCompleted");
                    }

                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("Failed To connect " + textStatus + ' ' + errorThrown);
                }
            });
            $("#password").val("");
        })
    }
};

var StyleSetterClass = function () {
    this.init = function (setStyleCompleted) {
        $("input[name=style]:radio").on("click", function () {
            var value = $("input[name=style]:checked").val();
            setStyle(value, setStyleCompleted);
        });
    }

    this.initNoOperations = function (setStyleChanged) {
        $("input[name=style]:radio").on("click", function () {
            var value = $("input[name=style]:checked").val();
            if (setStyleChanged) setStyleChanged(value);            
        });
    }

    this.SetStyleDisabled = function (disabled, className) {
        $("input[name=style]:radio").prop("disabled", disabled);
        $('label').attr("class", className);
    }
    this.getChosenStyle = function () {
        var value = $("input[name=style]:checked").val();
        return value;
    }
}

function setStyle(index, setStyleCompleted) {
    var success = false;
    $.ajax({
        url: 'Admin/Style',
        type: 'POST',
        dataType: 'Json',
        //contentType: 'Json',
        data: { styleIndex: index },
        timeout: 5000,
        success: function (data, textStatus, jqXHR) {
            success = data;
        }
    }).done(function (html) {
        if (success) {
            if (setStyleCompleted) setStyleCompleted(index);            
        }
    });
    //var url = '@Url.Content("' + "~/Content/home"+index+".css" + ')"';
    //$("link").attr("href", url);
}

