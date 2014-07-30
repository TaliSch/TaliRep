var faceFile = null;
var backgroundFile = null;

$().ready(function () {

    LoginInit();
    SetStyleInitNoOperation();

    $("#home").click(function () {
        location.href = '/';
    })//unbinf
    
    $(".login").on("signOutCompleted",function () {       
        enabbeDisable(true);
    })

    $(".login").on("signInCompleted", function () {
        enabbeDisable(false);
    })

    //$(".adminSection").on("setStyleCompleted", function (event, index) {
    //    if (index != "1") {
    //        $(".style1Params").hide();
    //    }
    //    else {
    //        $(".style1Params").show();
    //    }
    //})
    $("#createNew").click(function () {
        location.href = "/Admin/Create/" + this.name;
    })

    $(".setStyle").on("setStyleChanged", function (event, value) {
        alert("here");
        $("#personal").removeClass("saved").addClass("changed");
        if (value != "1") {
            $(".style1Params").hide();
        }
        else {
            $(".style1Params").show();
        }        
    })

    $("#title").change(function () {
        $("#personal").removeClass("saved").addClass("changed");
    })

    $("input[type=file]").change(function (event) {
       $("#submit").prop("disabled",true);
        var files = event.target.files;
        var file = files[0];
        var reader = new FileReader();

        var id = this.id;
        //todo: sync
        reader.onload = function (e) {
            var image = LZString.compressToBase64(e.target.result);
            if (id == 'face') {
                faceFile = image;
            }
            else {
                backgroundFile = image;
            }
            $("#submit").prop("disabled", false);

            $("#personal").addClass("changed");
            $("#personal").removeClass("saved");
        };

        reader.readAsDataURL(file);

        
    })
    
    $("#personal").submit(function () {
        $("#submit").prop("disabled", true);
        
       // var obj = [];
        var obj1 = { url:'Admin/UploadFaceImage', data :{ data: faceFile }};
        var obj2 = { url: 'Admin/UploadBackgroundImage', data: { data: backgroundFile } };

        var title = $("#title").val();
        var style = GetStyleChosen();
        var data = { title: title, style: style, faceImage: null, backgroundImage: null };
        var obj3 = { url: 'Admin/Preferences', data: { title: title, style: style, faceImage: null, backgroundImage: null } };

        var obj = [obj1, obj2, obj3];

        submitPreferences(obj);

        //postAjaxAsync('Admin/UploadFaceImage', { data: faceFile });
           
        //PostAjaxAsync('Admin/UploadBackgroundImage', { data: backgroundFile });

        //var title = $("#title").val();
        //var style = GetStyleChosen();
        //var data = { title: title, style: style, faceImage: null, backgroundImage: null };

        //PostAjaxAsync('Admin/Preferences', data);

        //$.ajax({
        //    type: "POST",
        //    url: 'Admin/Preferences',
        //    dataType: 'Json',
        //    data: data,
        //    //data: { data: utf8_to_b64(e.target.result) },
        //    success: function (data) {
        //        if (data)
        //            alert("success");
        //        else
        //            alert("error");
        //    },
        //    error: function (jqXHR, textStatus, errorThrown) {
        //        alert("Failed To Send " + textStatus + " " + errorThrown);
        //    }
        //});

        $("#personal").removeClass("changed").addClass("saved");
        $("#submit").prop("disabled", false);
    });

    function submitPreferences(urlDatas) {
        submitPreferencesRec(urlDatas, 0);
    }
    submitPreferencesRec
    function postSubmitRec(urlDatas, index) {
        $.ajax({
            type: "POST",
            url: urlDatas[index].url,
            dataType: 'Json',
            data: urlDatas[index].data,
            complete: function (data) {
                alert("go");
                if (++index < urlDatas.length) {
                    submitPreferencesRec(urlDatas, index);
                }
            },
            success:function(data) {
                alert("success: "+data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Failed To Send " + textStatus + " " + errorThrown);

            }
        });
        return rv;
    }


    function UpdatePersonalImage(file, url) {
        //var url = 'Admin/' + (this.id == 'face' ? 'UploadFaceImage' : 'UploadBackgroundImage');
        //UpdatePersonalImage(file, url);
        var reader = new FileReader();
        
        // Closure to capture the file information.
        reader.onload = function (e) {

            //alert("result:" + e.target.result.toString());
            //alert(e.target.result.byteLength);


            // alert(btoa(e.target.result));

            // alert(LZString.compressToBase64(e.target.result));
            $.ajax({
                type: "POST",
                url: url,
                dataType: 'Json',
                data: { data: LZString.compressToBase64(e.target.result) },
                //data: { data: utf8_to_b64(e.target.result) },
                success: function (data) {
                    if (data)
                        alert("success");
                    else
                        alert("error");
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("Failed To Send " + textStatus + " " + errorThrown);
                }
            });
        };

        //Read in the image file as a data URL.
        reader.readAsDataURL(file);       
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

        $(parent.find('.deleteSure')).show();    
        
    })

    $(".cancel").click(function () {
        var $this = $(this);
        var parent = $this.parent().parent();
     
        $(parent.find('.deleteSure')).hide();

        var $deleteBtn = $(parent.find('.delete'));
        $deleteBtn.show();
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