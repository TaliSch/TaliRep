var contentMaxHeight = 0;
var postsCount = 0;
$.fn.placePost = null;

//var password = "";
$().ready(function () {
    
    contentMaxHeight = calculateContentHeight("<p>22</p>","");
    //alert("contentMaxHeight="+contentMaxHeight);
    
    var $items = $("#posts").find('.post');
    loadPosts($items);
    $("#posts").show();

    var $olderPosts = $("#olderPosts");
    var $olderPostsBtn = $($olderPosts.find('button'));
    
    $olderPostsBtn.click(function () {    
        loadNextItems();
    })

    var styleSetter = new StyleSetterClass();
    var setStyleCompleted = function () {
        location.reload();
    };
    styleSetter.init(setStyleCompleted);   
    
    var login = new LoginClass();
    var signoutCompleted = function () {
        $(".adminSection").hide();
    };

    var signInCompleted = function () {
        $(".adminSection").show();
    };

    login.init(signoutCompleted, signInCompleted);
    
    //$(login).on("signOutCompleted", function () {
    //    $(".adminSection").hide();
    //})

    var setStyleCompleted = function () {
        location.reload();
    };

   

    var $adminState = $("#AdminState");
    changeAdminState($adminState.attr('checked'));
  
})

function loadPosts(items) {
    $.each(items, function (index, value) {
        var $value = $(value);
        var $title = $($value.find(".postTitle"));
        var $date = $($value.find(".postDate"));
        var $content = $($value.find(".postContent"));        
               
        var title = $title.val();
        var date = new Date($date.val()).toDateString();
        var content = LZString.decompressFromBase64($content.val());
       
        var postId = $value.attr("id");//"post" + index.toString();
       
        displayPost(postId, title, date, content, contentMaxHeight);
        
    })

    postsCount += items.length;
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
                var postId = "post" + String(postsCount + index);                
                var content = LZString.decompressFromBase64(value.Content);                
               
                var date = new Date(Number(value.Date.substring(6,value.Date.length-2)));                
                var strDate = date.toDateString();
                // todo: the same in index get
                strDate = strDate.substring(4, strDate.length);
                 
                displayPost(postId, value.Title, strDate, content, contentMaxHeight);
            })
            postsCount += data.length;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Failed To Load");
            alert(textStatus);
            alert(errorThrown);
            
        }
    });
}

function displayPost(postId, title, date, content, contentMaxHeight) {
    title = FixTitle(title);

    var headerHtml = "<p class='postHeader'><label id='postTitle'>" + title + "</label></p><p class='postHeader'><label id='postDate'>" + date + "</label></p>";

    //var re='/<p>|<h>|<h\d>/'
    var lines = content.split("</p>", 1000);

    var parts = splitPost(headerHtml, lines, contentMaxHeight);

    var partsHtml = "";
    var links = "";
    var newPostId = "new" + postId;
    $.each(parts, function (index, value) {
        var divId = "divId" + index.toString();
        var div = '<div class="part" id="' + divId + '">' + value + '</div>';

        partsHtml = partsHtml.concat(div);
        if (parts.length > 1) {
            links = links.concat('<a class="pageLink" href="#" onclick="choosePage(' + '\'' + divId + '\'' + ',\'' + newPostId + '\',' + index + ');return false;">' + index + '</a> ');
        }
    });

    var $newPost = $('<div class="post" id="' + newPostId + '">' + headerHtml + partsHtml + links + '</div>');
    
    $newPost.placePost($newPost, postId);

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

    var $newPost = $('<table><tr class="fakePost" id="newpostId"><td>' + headerHtml + div + links + '</td></tr></div>');

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

//function setStyle(index) {
//    var success = false;
//    $.ajax({
//        url: 'Home/Style',
//        type: 'POST',
//        dataType: 'Json',
//        //contentType: 'Json',
//        data: { styleIndex: index },
//        timeout: 5000,
//        success: function (data, textStatus, jqXHR) {
//            success = data;
//        }
//    }).done(function (html) {
//        if (success) {
//            location.reload();
//        }
//    });
//    //var url = '@Url.Content("' + "~/Content/home"+index+".css" + ')"';
//    //$("link").attr("href", url);
   
//}

//function login(password) {
    
//    $.ajax({
//        url: 'Home/Login',
//        type: 'POST',
//        dataType: 'Json',
//        //contentType: 'Json',
//        data: { password: password },
//        timeout: 5000,

//        success: function (data, textStatus, jqXHR) {
//            if (data) {
//                $(".hiddenLogin").hide();
//                $("#loginButton").hide();
//                $(".adminSection").show();
//            }

//        },
//        error: function (jqXHR, textStatus, errorThrown) {
//            alert("Failed To connect " + textStatus + ' ' + errorThrown);
//        }
//    });
//}

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

function FixTitle(title) {
    title = title.replace("\n", "<br>");
    var startIndex = 0, endIndex = title.length;
    if (title.charAt(0) == '"') {
        startIndex = 1;
    }
    if (title.charAt(title.length - 1) == '"') {
        endIndex--;
    }
    title = title.substring(startIndex, endIndex);

    return title;
}
