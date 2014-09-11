var faceFile = null;
var backgroundFile = null;
var itemsInPage = 10;
var postsCount = 0;
var postsTemplate;
var postsTable;

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

    postsCount = 0;
    
    $.get('Templates/AdminTable.htm', function (template) {
       
        $("#postsTable").html(template);
             
        postsTemplate = Tempo.prepare('itemsTemplate');
        GetNextItems();        
    }); 
    
    $("#createNew").click(function () {
        location.href = "/Admin/Create/" + this.name;
    })

    $("#faceFake").click(function() {
        $("#face").click();
    })

    $("#backgroundFake").click(function () {
        $("#background").click();
    })

    $("#more").click(function () {
        GetNextItems();
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
            $.post('Admin/UploadFaceImage', { data: faceFile }, function (data) {                
            }, 'json').fail(function () {
                alert("Failed To upload face ");
            });                       
        }
        if (backgroundFile != null) {
            $.post('Admin/UploadBackgroundImage', { data: backgroundFile }, function (data) {
            }, 'json').fail(function () {
                alert("Failed To upload background ");
            });                       
        }
        var title = $("#title").val();
        var style = styleSetter.getChosenStyle();
        var data = { title: title, style: style };

        $.post('Admin/Preferences', data, function (data) {
        }, 'json');
      
        $("#personal").prop("disabled", false);
        //$( $("#personal").find('button') ) .prop("disabled", false);
        $("#personal button").prop("disabled", false);

        $("#personal").removeClass("changed");
        $("#personal").addClass("saved");       
    });

    $(".edit").live('click', function (event) {
        event.preventDefault();        
        location.href = "/Admin/Edit/" + this.name;
    })

    $(".delete").live('click', function (event) {
        event.preventDefault();
        var $this = $(this);
        $this.hide();
        $('.deleteSure', $this.parent()).show();        
    })

    $(".cancel").live('click', function (event) {
        event.preventDefault();
        var $this = $(this);
        var parent = $this.parent().parent();

        $('.deleteSure', parent).hide();

        $('.delete', parent).show();
    })

    $(".sure").live('click', function (event) {
        event.preventDefault();
        var $this = $(this);
        var parent = $this.parent().parent();
        var id = this.name;//parent.get(0).id;
        var row = $this.parents("tr");
        console.log(row.html());
        console.log(id);
        $.ajax({
            url: '/Admin/Delete',
            type: 'POST',
            dataType: 'Json',
            //contentType: 'Json',
            data: { "id": parseInt(id) },
            timeout: 5000,

            success: function (data, textStatus, jqXHR) {
                if (data) {
                    $('.deleteSure', parent).prop("hidden", true);
                    row.remove();
                }
                else {
                    alert("Failed To Delete");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Failed To Send Delete," + textStatus + "," + errorThrown);
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
        $('#more').prop("disabled", disabled);

        $('table').attr("class", className);
        $('header').attr("class", className);
        $('td').attr("class", className);
        $('th').attr("class", className);

        //$("#home").prop("disabled", false);
    }
   
})


function GetNextItems() {
    console.log("postsCount=" + postsCount);
    var firstItems = (postsCount == 0);

    var url = 'Admin/NextItems';
    var data = { from: postsCount, to: postsCount + itemsInPage };

    var adminEnabled;
    var templateData = [];
    //$.ajaxSetup({
    //    async: false
    //});
    $.getJSON(url, data, function (data) {
      
        var items = data.PostDatas;
        adminEnabled = data.AdminEnabled;

        $.each(items, function (index, value) {
            var date = new Date(Number(value.Date.substring(6, value.Date.length - 2)));
            var templateItem = { 'id': value.ID, title: value.Title, date: date };
            templateData.push(templateItem);
        });
        console.log(templateData);
        console.log("items.length=" + templateData.length);
        postsCount += templateData.length;

        if (firstItems) {
            postsTable = postsTemplate.render(templateData);
        }
        else {
            postsTable.append(templateData);
        }
        console.log("now");
        if (adminEnabled) {
            $(":disabled").prop("disabled", false);
            $(".disabled").removeClass("disabled").addClass("enabled");
        }
        else {
            $(":enabled").prop("enabled", false);
            $(".enabled").removeClass("enabled").addClass("disabled");
        }
        
    });
    //$.ajaxSetup({
    //    async: true
    //});

}

