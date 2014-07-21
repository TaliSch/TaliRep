var contentMaxHeight = 0;

//var password = "";
$().ready(function () {
    //$(".hiddenLogin").hide();

    contentMaxHeight = calculateContentHeight("<p>22</p>");
    //loadNextItems(0, 10);
    var $items = $("#posts_hidden").find('.post');
    loadPosts($items);
    //$items.html("");

    var $olderPosts = $("#olderPosts");
    var $olderPostsBtn = $($olderPosts.find('button')[0]);
 
    $olderPostsBtn.click(function () {
        alert("olderPosts");
        loadNextItems();
    })

    $(document).on("click", "#olderPostsBtn", function () {
        alert("hi");
    });
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
    //var re='/<p>|<h>|<h\d>/'
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
            links = links.concat('<a class="pageLink" href="#" onclick="choosePage(' + '\'' + divId + '\'' + ',' + '\'' + postId + '\',' + index + ');return false;">' + index + '</a> ');
        }
    });
    //alert(jQuery.parseJSON("#"+postId)
    //alert($(postId).html());
    var $post = $("#" + postId);
    $post.replaceWith('<div class="post" id="' + postId + '">' + headerHtml + partsHtml + links + '</div>');
    $post.Append('<hr>');
    //$(content).append('<div class="post" id="' + postId + '">' + headerHtml + partsHtml + links + '</div>');
    //alert($(content).html());
    // $("#posts").append('<table class="post" id="' + postId + '"<tr><td>' + partsHtml + links + '</td></tr></table>');
    //$("#posts").append('<div class="post" id="' + postId + '">' + headerHtml + partsHtml + links + '</div>');
    //$("#posts").append('<hr>');
    //choosePage('divId0', postId, 0);
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
