$().ready(function () {
    
    loadNextItems(0, 10);
    $("input[name=style]:radio").on("click", function () {
        var value = $("input[name=style]:checked").val();
        setStyle(value);
    });
    
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
            var maxHeight = calculateHeigth("<p>22</p>");
            for (var i = 0; i < data.length; i++) {
                // alert(data[i].Data);
                var post = LZString.decompressFromBase64(data[i].Data);
                if (post != null) {
                    var postId = "post" + i.toString();
                    displayPost(post, postId, maxHeight);
                   // alert(maxHeight);
                    
                }
               
            }
          
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Failed To Load");
            
        }
    });

    function displayPost(post, postId, maxHeight) {
        var lines = post.split("</p>", 1000);

        var parts = splitPost(lines, maxHeight);
        //alert(parts);
        var partsHtml = "";
        var links = "";
        
        $.each(parts, function (index, value) {
            var divId = "divId" + index.toString();
            var div = '<div id="' + divId + '">' + value + '</div>';

            partsHtml = partsHtml.concat(div);
            if (parts.length > 1) {
                links = links.concat('<a href="#" onclick="choosePage(' + '\'' + divId + '\'' + ',' + '\'' + postId + '\',' + index + ');return false;">' + index + '</a> ');

            }
        });

        // $("#posts").append('<table class="post" id="' + postId + '"<tr><td>' + partsHtml + links + '</td></tr></table>');
        $("#posts").append('<div class="post" id="' + postId + '">' + partsHtml + links + '</div>');
        choosePage('divId0', postId, 0);
    }
    function splitPost(lines, maxHeight) {
        var parts = [];
              
        var currentPart = "";
        var fromIndex = 0;
        for (var j = 0; j < lines.length-1 ; j++) {         
            currentPart = currentPart + lines[j] + "</p>";
            
            var currHeight = calculateHeigth(currentPart);
            //alert(currentPart+":"+currHeight);
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
       var $cntnr = $("#parts");
       var html = '<tr class = "post" id="part"><td>' + currentPart + '</td></tr>';
       $cntnr.append(html);
       var currHeight = $cntnr.find("#part").height();
       //alert(currHeight);
       $cntnr.html("");
       return currHeight;
    }
}

function choosePage(divId, postId,index) {
    //alert(index);
    var $post = $('#posts').find('#' + postId);
    //alert($post.html());
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

function setStyle(index) {
    var success = false;
    $.ajax({
        url: 'Home/Style',
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
            location.reload();
        }
    });
    //var url = '@Url.Content("' + "~/Content/home"+index+".css" + ')"';
    //$("link").attr("href", url);
   
}
