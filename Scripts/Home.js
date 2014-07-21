var contentMaxHeight = 0;

//var password = "";
$().ready(function () {
    contentMaxHeight = calculateContentHeight("<p>22</p>","");
    //alert("contentMaxHeight="+contentMaxHeight);
    
    var $items = $("#posts").find('.post');
    loadPosts($items);

    var $olderPosts = $("#olderPosts");
    var $olderPostsBtn = $($olderPosts.find('button'));
    
    $olderPostsBtn.click(function () {
       
        loadNextItems();
    })

    //$olderPostsBtn.trigger("click");
    $("input[name=style]:radio").on("click", function () {
        var value = $("input[name=style]:checked").val();
        setStyle(value);
    });
    $("#loginButton").click(function () {
        var $loginButton = $("#loginButton");
        $loginButton.hide();
        $(".hiddenLogin").show();
    })

    var $password = $(".hiddenLogin").find("input:password");

    $("#passwordButton").click(function () {    
        login($password.val());
    })

    $("#signOutButton").click(function () {
        changeAdminState(false);
    })

    var $adminState = $("#AdminState");
    changeAdminState($adminState.attr('checked'));
    $("#AdminState").change(function () {       
        changeAdminState($adminState.attr('checked'));
    })
    //$olderPostsBtn.trigger("click");
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
       
        var postId = $value.attr("id");//"post" + index.toString();
   
        displayPost(postId, title, date, content, contentMaxHeight);
        
    })
}
function loadNextItems() {  
    $.ajax({
        url: 'Home/NextIndex',
        type: 'POST',
        dataType: 'Json',
        //contentType: 'Json',
        //data: { From: from, To: to },
        timeout: 5000,

        success: function (data, textStatus, jqXHR) {
            $.each(data, function (index, value) {
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
    //var headerHtml = "<p><label class='postHeader' id='postTitle'>" + title + "</label></p><p><label class='postHeader' id='postDate'>" + date + "</label></p>";
    var headerHtml = "<p class='postHeader'><label id='postTitle'>" + title + "</label></p><p class='postHeader'><label id='postDate'>" + date + "</label></p>";
    
    //var re='/<p>|<h>|<h\d>/'
    var lines = content.split("</p>", 1000);
    
    var parts = splitPost(headerHtml, lines, contentMaxHeight);
    
    var partsHtml = "";
    var links = "";
    var newPostId = "new"+postId;
    $.each(parts, function (index, value) {
        var divId = "divId" + index.toString();
        var div = '<div class="part" id="' + divId + '">' + value + '</div>';

        partsHtml = partsHtml.concat(div);
        if (parts.length > 1) {
            links = links.concat('<a class="pageLink" href="#" onclick="choosePage(' + '\'' + divId + '\'' + ',\'' + newPostId + '\',' + index + ');return false;">' + index + '</a> ');
        }
    });
   
    var $post = $("#" + postId);

    var $newPost = $('<div class="post" id="' + newPostId + '">' + headerHtml + partsHtml + links + '</div>');
 
    $post.replaceWith($newPost);
    $newPost.append('<hr>');
    choosePage('divId0', newPostId, 0);

}

function splitPost(headerHtml, lines, contentMaxHeight) {
    var parts = [];
    var currentPart = "";
    var fromIndex = 0;
    for (var j = 0; j < lines.length - 1 ; j++) {
        currentPart += lines[j] + "</p>";

        var currHeight = calculateContentHeight(currentPart, headerHtml);
        //alert("line " + j + ": currHeight=" + currHeight);
        if (currHeight > contentMaxHeight) {
            //alert("line " + j + ": currHeight=" + currHeight);
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
    }
    if (currentPart != "") {
        parts.push(currentPart);
    }

    return parts;
}

function calculateContentHeight(part, headerHtml) {
    var $cntnr = $("#parts");

    // create the html paragraph
    var div = '<div class="part" id="divId">' + part + '</div>';
 
    var links = '<a class="pageLink" href="#">' + '1' + '</a> ';

    var $newPost = $('<table><tr class="post" id="newpostId"><td>' + headerHtml + div + links + '</td></tr></div>');

    // append the paragraph to the containetr

    $cntnr.append($newPost);

    // find out the height
    var currHeight = $cntnr.height();

    // clear the container

    $cntnr.html("");

    return currHeight;
}

function choosePage(divId, postId, index) {
    //alert(index);
    //alert($post.html());
    var $post = $("#"+postId);

    $post.find('.part').hide();
    $post.find('#' + divId).show();
    
    $post.find('.pageLink').each(function (indx, value) {
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

function changeAdminState(state) {
    if (state) {
        $(".hiddenLogin").hide();
        $("#loginButton").hide();
        $(".adminSection").show();
    }
    else {
        $(".hiddenLogin").hide();
        $("#loginButton").show();
        $(".adminSection").hide();

    }
}
