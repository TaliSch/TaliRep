
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

/*
function LoginInit() {
    
    viewname = $(".login").get(0).id;

    $("#signOutBtn").click(function () {
        $.ajax({
            url: '/' + viewname + '/SignOut',
            type: 'POST',
            timeout: 5000,
            success: function () {                
                $("#loginBtn").show();
                $("#signOutBtn").hide();

                $('.login').trigger("signOutCompleted");               
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

                    $('.login').trigger("signInCompleted");
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Failed To connect " + textStatus + ' ' + errorThrown);
            }
        });
        $("#password").val("");
    })
}
*/
function SetStyleInit() {
    //viewname = $(".setStyle").get(0).id;
    $("input[name=style]:radio").on("click", function () {
        var value = $("input[name=style]:checked").val();
        setStyle(value);
    });
}

function SetStyleDisabled(disabled, className) {   
    $("input[name=style]:radio").prop("disabled", disabled);
    $('label').attr("class", className);
}

function SetStyleInitNoOperation() {
    //viewname = $(".setStyle").get(0).id;
    $("input[name=style]:radio").on("click", function () {
        var value = $("input[name=style]:checked").val();
        $('.setStyle').trigger("setStyleChanged", value);
    });
}

function GetStyleChosen() {    
    var value = $("input[name=style]:checked").val();
    return value;    
}

function setStyle(index) {
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
            $('.adminSection').trigger("setStyleCompleted", index);
        }
    });
    //var url = '@Url.Content("' + "~/Content/home"+index+".css" + ')"';
    //$("link").attr("href", url);

}

