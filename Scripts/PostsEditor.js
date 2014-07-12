
$().ready(function () {
    $("#editor").addClass("tinymce");
    tinymce.init({
        selector: "textarea",
        plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen"
            
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
        ]

    });


    //$('textarea.tinymce').tinymce({
    //    // Location of TinyMCE script
    //    script_url:  '/Scripts/tinymce/js/tinymce/jscripts/tiny_mce/tiny_mce.js',

    //    // General options
    //    theme: "advanced",
    //    plugins: "pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template",

    //    // Theme options
    //    theme_advanced_buttons1: "save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
    //    theme_advanced_buttons2: "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
    //    theme_advanced_buttons3: "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
    //    theme_advanced_buttons4: "insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,pagebreak",
    //    theme_advanced_toolbar_location: "top",
    //    theme_advanced_toolbar_align: "left",
    //    theme_advanced_statusbar_location: "bottom",
    //    theme_advanced_resizing: true,

    //    // Example content CSS (should be your site CSS)
    //    content_css: "css/content.css",

    //    // Drop lists for link/image/media/template dialogs
    //    //template_external_list_url: "lists/template_list.js",
    //    //external_link_list_url: "lists/link_list.js",
    //    //external_image_list_url: "lists/image_list.js",
    //    //media_external_list_url: "lists/media_list.js",

    //    // Replace values for the template plugin
    //    template_replace_values: {
    //        username: "Some User",
    //        staffid: "991234"
    //    }
    //});
    


    var compressed = $("#editor").val();
    var decompressed = LZString.decompressFromBase64(compressed);
    if (decompressed)
        $("#editor").val(decompressed);

    $("#name").trigger("oninvalid");
    //var opts = {
    //    absoluteURLs: false,
    //    cssClass: 'el-rte',
    //    lang: 'en',
    //    height: 420,
    //    toolbar: 'maxi',
    //    cssfiles: ['http://elrte.org/release/elrte/css/elrte-inner.css'],
    //}
    //$("#editor").elrte(opts);

    $("#EditForm").submit(function (event) {
        event.preventDefault();
        var data = tinymce.activeEditor.getContent();
        var name = $("#name").val();
        var id = $("#id-hidden").val();
        var url = '/Posts/Edit';
        postData(id, name, data, url);
    })

    $("#CreateForm").submit(function (event) {       
        event.preventDefault();
        var data = tinymce.activeEditor.getContent();        
        var name = $("#name").val();
        var id = 0;
        var url = '/Posts/Create';
       
        postData(id, name, data, url);
    })
})

    function postData(id, name, data, url) {
        var compressedData = LZString.compressToBase64(data);
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'Json',
            //contentType: 'Json',
            data: { ID: id, Data: compressedData, Name: name },
            timeout: 5000,

            success: function (data, textStatus, jqXHR) {
                if (data) {
                    location.href = "/Posts/Index";
                }
                else
                    alert("Failed To Save");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Failed To Send");
            }
        });
    }
    //$("#CreateForm").submit(function (event) {
    //    event.preventDefault();
    //    var data = $("#editor").val();
    //    var name = $("#name").val();
        
    //    var compressedData = LZString.compress(data);        

    //    $.ajax({
    //        url: '/Posts/Create',
    //        type: 'POST',
    //        dataType: 'Json',
    //        //contentType: 'Json',
    //        data: { ID: "0", Data: compressedData, Name: name },
    //        timeout: 5000,

    //        success: function (data, textStatus, jqXHR) {
    //            if (data) {
    //                location.href = "/Posts/Index";
    //            }
    //            else
    //                alert("Failed To Save");
    //        },
    //        error: function (jqXHR, textStatus, errorThrown) {
    //            alert("Failed To Send");
    //        }
    //    });
    //})


function invalidName() {
    if ($('#name').val() == '') {       
        //$(this).css("background-color", "red");
        $('#name').css("border", "3px solid red");
    }
    else
        $('#name').css("border", "3px solid gray");
}