var contentMaxHeight = 0;
var password = "";
$().ready(function () {
    //$(".hiddenLogin").hide();

    contentMaxHeight = calculateContentHeight("<p>22</p>");
    //loadNextItems(0, 10);
    var $items = $("#posts_hidden").find('.post');
    loadPosts($items);
    $("input[name=style]:radio").on("click", function () {
        var value = $("input[name=style]:checked").val();
        setStyle(value);
    });
    $("#loginButton").click(function () {
        var $loginButton = $("#loginButton");
        $loginButton.hide();
        $(".hiddenLogin").show();
    })

    var $input = $(".hiddenLogin").find("input");

    $("#passwordButton").click(function () {
        //alert(password);
        login(password);
        password = "";
        $input.val("");
    })

    $input.click(function (event) {
        event.preventDefault();
        var inputLen = $input.val().length;
        var caretPos = getCaretPosition($input);
        if (caretPos != inputLen) {
            setCaretToPos($input.get(0),inputLen);
        }
    })

    $input.select(function (event) {
        
        event.preventDefault();
        resetInputSelection($input.get(0));
        
    })
    // todo: prevent focus
    $input.keypress(function (event) {
        var key = event.which;
        //alert(key);
        //if ((key >= 31 && key < 40) ||
        //     (key >= 48 && key < 57) ||
        //     (key >= 65 && key < 90) ||
        //     (key >= 97 && key < 122) ||
        //         (key == 8) || (key == 0)) {
           
            event.preventDefault();
            if (key != 0) {
                var val = $input.val();
                if (key == 8) {
                    if (password.length > 0) {
                        password = password.slice(0, password.length - 1);
                        $input.val(val.slice(0, val.length - 1));
                    }
                }
                else {
                    password = password.concat(String.fromCharCode(key));
                    $input.val(val.concat("*"));
                }
            }
        //}
        
    })
})

function loadPosts(items) {
    
    $.each(items, function (index, value) {
        var $value = $(value);
        var $title = $($value.find(".postTitle"));
        var $date = $($value.find(".postDate"));
        var $content = $($value.find(".postContent"));        
               
        var title = $title.val();
        var date = $date.val();
        var content = LZString.decompressFromBase64($content.val());
       
        var postId = "post" + index.toString();        

        displayPost(postId, title, date, content, contentMaxHeight);
        
    })
}
function loadNextItems(from, to) {  
    $.ajax({
        url: 'Home/Index',
        type: 'POST',
        dataType: 'Json',
        //contentType: 'Json',
        data: { From: from, To: to },
        timeout: 5000,

        success: function (data, textStatus, jqXHR) {
            $.each(items, function (index, value) {
                var postId = "post" + index.toString();
                displayPost(postId, value.Title, value.Date, value.Content, contentMaxHeight);
            })
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Failed To Load");
            alert(textStatus);
            alert(errorThrown);
            
        }
    });
}

// todo; change height if too short
function displayPost(postId, title, date, content, contentMaxHeight) {

    var headerHtml = "<p class='postHeader'><label id='postTitle'>" + title + "</label></p><p class='postHeader'><label id='postDate'>" + date + "</label></p>";
   
    var lines = content.split("</p>", 1000);
    
    var parts = splitPost(headerHtml, lines, contentMaxHeight);
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
    $("#posts").append('<div class="post" id="' + postId + '">' + headerHtml + partsHtml + links + '</div>');
    $("#posts").append('<hr>');
    choosePage('divId0', postId, 0);
}
function splitPost(headerHtml, lines, contentMaxHeight) {
    var parts = [];

    var currentPart = "";
    var fromIndex = 0;
    for (var j = 0; j < lines.length - 1 ; j++) {
        currentPart = currentPart + lines[j] + "</p>";

        var currHeight = calculateContentHeight(headerHtml + currentPart);
        //alert(currentPart+":"+currHeight);
        if (currHeight > contentMaxHeight) {
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

function calculateContentHeight(currentPart) {
    var $cntnr = $("#parts");
    var html = '<tr class = "post" id="part"><td>' + currentPart + '</td></tr>';
    $cntnr.append(html);
    var currHeight = $cntnr.find("#part").height();
    //alert(currHeight);
    $cntnr.html("");
    return currHeight;
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

function login(password) {
    
    $.ajax({
        url: 'Home/Login',
        type: 'POST',
        dataType: 'Json',
        //contentType: 'Json',
        data: { password: password },
        timeout: 5000,

        success: function (data, textStatus, jqXHR) {
            if (data) {
                $(".hiddenLogin").hide();
                $("#loginButton").hide();
                $(".adminSection").show();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Failed To connect " + textStatus + ' ' + errorThrown);
        }
    });
}

function resetInputSelection(input) {
    var inputLen = $(input).val().length;
    if (getCaretPosition(input) != inputLen) {
        if (document.selection) {
            document.selection.empty();
        }
        else {
            input.selectionStart = inputLen;
        }
    }
}

function setSelectionRange(input, selectionStart, selectionEnd) {
    if (input.setSelectionRange) {
        input.focus();
        input.setSelectionRange(selectionStart, selectionEnd);
    }
    else if (input.createTextRange) {
        var range = input.createTextRange();
        range.collapse(true);
        range.moveEnd('character', selectionEnd);
        range.moveStart('character', selectionStart);
        range.select();
    }
}

function setCaretToPos(input, pos) {
    setSelectionRange(input, pos, pos);
}

function getCaretPosition(input) {

    // Initialize
    var carPos = 0;

    // IE Support
    if (document.selection) {

        // Set focus on the element
        input.focus();

        // To get cursor position, get empty selection range
        var range = document.selection.createRange();

        // Move selection start to 0 position
        range.moveStart('character', -input.value.length);

        // The caret position is selection length
        carPos = range.text.length;
    }

        // Firefox support
    else if (input.selectionStart || input.selectionStart == '0')
        carPos = input.selectionStart;


    // Return results
    return (carPos);
}