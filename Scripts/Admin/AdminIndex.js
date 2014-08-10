var faceFile = null;
var backgroundFile = null;

$().ready(function () {

    var login = new LoginClass();
    var signOutCompleted = function () {
        disableAll(true);
    };

    var signInCompleted = function () {
        disableAll(false);
    };
    login.init(signOutCompleted, signInCompleted);

    var styleSetter = new StyleSetterClass();
    var setStyleChanged = function (value) {
        $("#personal").removeClass("saved").addClass("changed");
        if (value != "1") {
            $(".style1Params").hide();
        }
        else {
            $(".style1Params").show();
        }
    };

    styleSetter.initNoOperations(setStyleChanged);
   
    var disabled = $("#submit").prop("disabled");
    var className = disabled ? "disabled" : "enabled";
    styleSetter.SetStyleDisabled(disabled, className);

    $("#home").click(function () {
        location.href = '/';
    })//unbinf
    
    
    $("#createNew").click(function () {
        location.href = "/Admin/Create/" + this.name;
    })

    $("#faceFake").click(function() {
        $("#face").click();
    })

    $("#backgroundFake").click(function () {
        $("#background").click();
    })



    $("#title").change(function () {
        $("#personal").removeClass("saved").addClass("changed");
    })

    $("input[type=file]").change(function (event) {
        disablePreferences(true);
        var files = event.target.files;
        var file = files[0];
        var filename = file.name;
        
        var reader = new FileReader();

        var id = this.id;
        //todo: sync
        reader.onload = function (e) {
            var image = LZString.compressToBase64(e.target.result);
            if (id == 'face') {
                faceFile = image;
                $("#faceFakeFilename").val(filename);
            }
            else {
                backgroundFile = image;
                $("#backgroundFakeFilename").val(filename);
            }
            disablePreferences(false);
            $("#personal").addClass("changed");
            $("#personal").removeClass("saved");
        };

        reader.readAsDataURL(file);
    })
    
    $("#personal").submit(function (event) {
        event.preventDefault();

        $("personal").prop("disabled", true);
        //$($("#personal").find('button')).prop("disabled", true);
        $("#personal button").prop("disabled", true);
        
        if (faceFile != null) {
            if (!postAjaxSync('Admin/UploadFaceImage', { data: faceFile })) {
                //todo
            }            
        }
        if (backgroundFile != null) {
            if (!postAjaxSync('Admin/UploadBackgroundImage', { data: backgroundFile })) {
                //todo
            }            
        }
        var title = $("#title").val();
        var style = styleSetter.getChosenStyle();
        var data = { title: title, style: style };

        postAjaxSync('Admin/Preferences', data);        

        $("#personal").prop("disabled", false);
        //$( $("#personal").find('button') ) .prop("disabled", false);
        $("#personal button").prop("disabled", false);

        $("#personal").removeClass("changed");
        $("#personal").addClass("saved");       
    });

    function postAjaxSync(url, data) {
        var rv;
        
        $.ajax({
            type: "POST",
            url: url,
            async:false,
            dataType: 'Json',
            data: data,           
            success: function (data) {               
                rv = data;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Failed To Send " + textStatus + " " + errorThrown);                                
                rv = false;
            }
        });

        return rv;
    }
        
    $(".edit").click(function () {
        var $this = $(this);
        var parent = $this.parent();
        var id = parent.get(0).id;
       
        location.href = "/Admin/Edit/" + id;
    })

    $(".delete").click(function () {        
        var $this = $(this);
        var parent = $this.parent();
     
        $this.hide();

        //$(parent.find('.deleteSure')).show();    
        $('.deleteSure', parent).show();        
    })

    $(".cancel").click(function () {
        var $this = $(this);
        var parent = $this.parent().parent();
     
        //$(parent.find('.deleteSure')).hide();
        $('.deleteSure', parent).hide();

        //var $deleteBtn = $(parent.find('.delete'));
        //$deleteBtn.show();
        $('.delete', parent).show();
    })

    $(".sure").click(function () {
        
        var $this = $(this);
        var parent = $this.parent().parent();        
        var id = parent.get(0).id;

        $.ajax({
            url: '/Admin/Delete',
            type: 'POST',
            dataType: 'Json',
            //contentType: 'Json',
            data: { "id": parseInt(id) },
            timeout: 5000,

            success: function (data, textStatus, jqXHR) {
                if (data) {
                    //parent.find('.deleteSure').prop("hidden", true);
                    $('.deleteSure', parent).prop("hidden", true);
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

    function disablePreferences(disabled) {
        var className = disabled ? "disabled" : "enabled";

        $("#personal").prop("disabled", disabled);
        $("#submit").prop("disabled", disabled);
        $("#title").prop("disabled", disabled);
        $("#faceFake").prop("disabled", disabled);
        $("#backgroundFake").prop("disabled", disabled);
        $("#faceFakeFilename").prop("disabled", disabled);
        $("#backgroundFakeFilename").prop("disabled", disabled);
        styleSetter.SetStyleDisabled(disabled, className);
    }

    function disableAll(disabled) {
        var className = disabled ? "disabled" : "enabled";

        disablePreferences(disabled);

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