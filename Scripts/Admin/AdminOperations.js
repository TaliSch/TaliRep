
function LoginClass() {
    
    this.init = function (signoutCompleted, signinCompleted) {
        var viewname = $(".login").get(0).id;
        var url = viewname + '/SignOut';
        
        $("#signOutBtn").click(function () {
            $.getJSON(url, function () {
                $("#loginBtn").show();
                $("#signOutBtn").hide();
                if (signoutCompleted) signoutCompleted();
            });
        })

        $("#loginBtn").click(function () {
            $("#loginBtn").hide();
            $(".insertPassword").show();
        })

        $("#signInBtn").click(function () {
            var url = '/' + viewname + '/SignIn';
            var data = { password: $("#password").val() };

            $.post(url, data, function (data) {
                if (data) {
                    $(".insertPassword").hide();
                    $("#signOutBtn").show();
                    if (signinCompleted) signinCompleted();                    
                }
            }, 'json').fail(function () {
                alert("Failed To connect ");
            });
           
            $("#password").val("");
        })
    }
};

function StyleSetterClass() {
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

    var setStyle = function (index, setStyleCompleted) {
        var success = false;
        $.post('Admin/Style', { styleIndex: index }, function (data) {
            if (setStyleCompleted) setStyleCompleted(index);
        });
    }
}
