
$().ready(function () {
    
    $("#editor").addClass("tinymce");
    invalidName();
    //$("#editor").addClass("tinymce");
    tinymce.init({
        selector: "#editor",
        oninit : "postInitWork",
        plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen textcolor"
            
        ],//"insertdatetime media table contextmenu paste moxiemanager"
        toolbar1: "newdocument fullpage | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | styleselect formatselect fontselect fontsizeselect",
        toolbar2: "cut copy paste | searchreplace | bullist numlist | outdent indent blockquote | undo redo | link unlink anchor image media code | insertdatetime preview | forecolor backcolor",
        toolbar3: "table | hr removeformat | subscript superscript | charmap emoticons | print fullscreen | ltr rtl | spellchecker | visualchars visualblocks nonbreaking template pagebreak restoredraft",

        menubar: false,
        toolbar_items_size: 'small',

        style_formats: [
                { title: 'Bold text', inline: 'b' },
                { title: 'Red text', inline: 'span', styles: { color: '#ff0000' } },
                { title: 'Red header', block: 'h1', styles: { color: '#ff0000' } },
                { title: 'Example 1', inline: 'span', classes: 'example1' },
                { title: 'Example 2', inline: 'span', classes: 'example2' },
                { title: 'Table styles' },
                { title: 'Table row 1', selector: 'tr', classes: 'tablerow1' }
        ],

        templates: [
                { title: 'Test template 1', content: 'Test 1' },
                { title: 'Test template 2', content: 'Test 2' }
        ],

        content_css: "../../Content/EditorLayout.css"// ?" + new Date().getTime(),

    });

    function postInitWork() {
        $("#editor").css("background-color", "navi");
    }
   

    LoginInit();

    $(".login").on("signOutCompleted", function () {
        $("#submit").prop("disabled", true);
        $("header").addClass("disabledHeader")
    })

    $(".login").on("signInCompleted", function () {
        $("#submit").prop("disabled", false);
        $("header").removeClass("disabledHeader");
    })    

    var compressed = $("#editor").val();
    var decompressed = LZString.decompressFromBase64(compressed);
    if (decompressed)
        $("#editor").val(decompressed);

    $("#title").trigger("oninvalid");
    //var opts = {
    //    absoluteURLs: false,
    //    cssClass: 'el-rte',
    //    lang: 'en',
    //    height: 420,
    //    toolbar: 'maxi',
    //    cssfiles: ['http://elrte.org/release/elrte/css/elrte-inner.css'],
    //}
    //$("#editor").elrte(opts);

    

    $("#submit").click(function (event) {
        event.preventDefault();
        var content = tinymce.activeEditor.getContent();
        var title = $("#title").val();        
        var id = $("#id-hidden").val();;
        var url = '/Admin/'+this.name;
        postData(id, title, content, url);
    })

    $("#postsManager").click(function () {
        location.href = "/Admin";
    })
})

function postData(id, title, content, url) {
        var compressedData = LZString.compressToBase64(content);
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'Json',
            //contentType: 'Json',
            data: { ID: id, Content: compressedData, Title: title },
            timeout: 5000,

            success: function (data, textStatus, jqXHR) {
                if (data) {
                    location.href = "/Admin/Index";
                }
                else
                    alert("Failed To Save");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Failed To Send");
            }
        });
    }
    


function invalidName() {
    if ($('#title').val() == '') {
        //$(this).css("background-color", "red");
        $('#headerLabel').removeClass("goodInput").addClass("badInput");
        $('#title').removeClass("goodInput").addClass("badInput");
    }
    else {
        $('#headerLabel').removeClass("badInput").addClass("goodInput");
        $('#title').removeClass("badInput").addClass("goodInput");
    }
}