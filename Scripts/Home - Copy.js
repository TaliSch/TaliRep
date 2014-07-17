$().ready(function () {
    loadNextItems(0, 10);
    //var $a = $("#posts").find('a');
    //alert($a);
    //$('a').click(function () {
    //    alert("click1");
    //    //$('a').removeClass('linkOn');
    //    //$('a').addClass('linkOff');
    //    $(this).addClass('linkOn');
    ////    $(this).addClass('linkOn');
    //});
})
function loadNextItems(from, to) {
  
    $.ajax({
        url: 'Home/Index',
        type: 'POST',
        dataType: 'Json',
        //contentType: 'Json',
        data: { From: from, To: to },
        timeout: 5000,

        success: function (data, textStatus, jqXHR) {
           // alert(data.length);
         
            for (var i = 0; i < data.length; i++) {
                // alert(data[i].Data);
                var post = LZString.decompressFromBase64(data[i].Data);
               
                if (post != null) {
                    var maxHeight = calculateHeigth("<p>22</p>");

                    var lines = post.split("</p>", 1000);

                    var parts = splitPost(lines, maxHeight);
                    //alert(parts);
                    var partsHtml = "";
                    var links = "";
                    var postId = "post" + i.toString();
                    $.each(parts, function (index, value) {
                        var divId = "divId" + index.toString();
                        var div = '<div id="' + divId + '">' + value + '</div>';

                        partsHtml = partsHtml.concat(div);
                        if (parts.length > 1) {                            
                            links = links.concat('<a href="#" onclick="choosePage(' + '\'' + divId + '\'' + ',' + '\'' + postId + '\',' + index + ');return false;">' + index + '</a> ');
                            
                        }
                    });

                    $("#posts").append('<table class="post" id="' + postId + '"<tr><td>' + partsHtml + links + '</td></tr></table>');
                    choosePage('divId0', postId, 0);
                }
               
            }
          
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Failed To Load");
            
        }
    });

    
    function splitPost(lines, maxHeight) {
        var parts = [];
              
        var currentPart = "";
        var fromIndex = 0;
        for (var j = 0; j < lines.length-1 ; j++) {         
            currentPart = currentPart + lines[j] + "</p>";
            
            var currHeight = calculateHeigth(currentPart);
            //alert(currHeight);
            if (currHeight > maxHeight) {
                currentPart = "";
               // alert('fromIndex=' + fromIndex + ',j=' + j);
                if (fromIndex < j) {
                    for (var k = fromIndex; k < j; k++) {
                        currentPart = currentPart.concat(lines[k] + "</p>");
                    }
                    parts[parts.length] = currentPart;
                    fromIndex = j;
                }
                                
                currentPart = lines[j] + "</p>";
            }
            
            // alert(lines[j]);
            // create div per part, with hide
        }
        if (currentPart != "") {
            parts.push(currentPart);
        }

        return parts;
    }

    function calculateHeigth(currentPart) {
       var $table = $("#parts");
       var html = '<table class = "post" id="part"<tr><td>' + currentPart + '</td></tr></table>';
       $table.append(html);
       var currHeight = $table.find("#part").height();
       $table.html("");
       return currHeight;
    }
}

function choosePage(divId, postId,index) {
    //alert(index);
    var $post = $('#posts').find('#' + postId);
 
    $post.find('div').hide();
    $post.find('#' + divId).show();

    $post.find('a').each(function(indx, value) {
        if (indx == index) {
            $(value).removeClass("linkOff");
            $(value).addClass("linkOn");
        }
        else {
            $(value).removeClass("linkOn");
            $(value).addClass("linkOff");
        }
    })    
}
