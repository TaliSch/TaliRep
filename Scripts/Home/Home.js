var contentMaxHeight = 0;
var postsCount = 0;
$.fn.placePost = null;

//var password = "";
$().ready(function () {
    
    contentMaxHeight = calculateContentHeight("<p>22</p>");
   // alert("contentMaxHeight="+contentMaxHeight);
    
    var $items = $("#posts .post");//.find('.post');
    postsCount = loadPosts($items);
    $("#posts").show();

    var $olderPostsBtn = $("#olderPosts button");
    
    $olderPostsBtn.click(function () {    
        loadNextItems();
    })

    var styleSetter = new StyleSetterClass();
    function setStyleCompleted() {
        location.reload();
    };
    styleSetter.init(setStyleCompleted);   
    
    var login = new LoginClass();
    function signoutCompleted() {
        $(".adminSection").hide();
    };

    function signInCompleted() {
        $(".adminSection").show();
    };

    login.init(signoutCompleted, signInCompleted);    

    var $adminState = $("#AdminState");
    changeAdminState($adminState.attr('checked'));    
})


function loadPosts(items) {
    $.each(items, function (index, value) {
        var $value = $(value);
        
        //var $date = $(".postDate", $value);
        var $content = $(".postContent", $value);
        var content = LZString.decompressFromBase64($content.val());
        
        //var date = new Date($date.val()).toDateString();
        
        var $title = $(".postTitle", $value);
        var title = $title.html();
        $title.html(FixTitle(title));

        displayPost(value, content, contentMaxHeight);

    })

    return items.length;
}


function loadNextItems() {
    var url= 'Home/NextIndex';
    var data = { from: postsCount, to: postsCount + 10 };
    $.getJSON(url, data, function (data) {
        $.each(data, function (index, value) {
            var $newPostBox = $(".fakePost .postBox").clone();
            $("#olderPosts").before($newPostBox);
            var $newPost = $(".post", $newPostBox);
            var postId = "postId" + String(postsCount + index);
            $newPost.attr("id", postId);
            var content = LZString.decompressFromBase64(value.Content);
            // todo: the same in index get
            var date = new Date(Number(value.Date.substring(6, value.Date.length - 2)));
            var strDate = date.toDateString();            
            strDate = strDate.substring(4, strDate.length);
            $(".postDate", $newPost).html(strDate);
            $(".postTitle", $newPost).html(FixTitle(value.Title));
            
            displayPost($newPost, content, contentMaxHeight);
           
            
        })
        postsCount += data.length;
    }).fail(function(){
        alert("Failed To Load");
    });
}


function displayPost(post, content, contentMaxHeight) {    
    var $post = $(post);    
    var $part = $(".part", $post);
    var $pageLink = $(".pageLink", $post);

    var lines = content.split("</p>", 1000);
    var parts = splitPost(lines, contentMaxHeight);
   
    if (parts.length == 0) {
        $part.html("");
        $pageLink.hide();
    }

    else {
        $.each(parts, function (index, value) {
            if (index == 0) {
                $part.html(value);               
            }
            else {
                var divId = "divId" + index.toString();

                var $nextPart = $part.clone();
                var $nextPageLink = $pageLink.clone();

                $nextPart.attr("id", divId);
                $nextPart.html(value);                

                $nextPageLink.html(" " + index.toString());

                $part.after($nextPart);
                $pageLink.after($nextPageLink);

                $part = $nextPart;
                $pageLink = $nextPageLink;               
            }
        });

        if (parts.length == 1) {
            $pageLink.hide();
        }
        else {
            $(".pageLink", $post).click(function (event) {
                event.preventDefault();
                var $this = $(this);
                var parent = $this.parent();
                var index = parseInt($this.html().trim(), "10");

                choosePage(parent.get(0), index);

            });
            choosePage(post, 0);
        }
   
        //$newPost.placePost($newPost, postId);

        
    }
}


function splitPost(lines, contentMaxHeight) {
    //alert("splitPost");
    var parts = [];
    var currentPart = "";
    var fromIndex = 0;
    for (var j = 0; j < lines.length - 1 ; j++) {
        currentPart += lines[j] + "</p>";

        var currHeight = calculateContentHeight(currentPart);
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

function calculateContentHeight(part) {
    var $cntnr = $("#parts");
    $cntnr.show();

    var $fakePost = $(".fakePost", $cntnr);
    var $part = $(".part", $fakePost);
    $part.html(part);       
    var currHeight = $cntnr.height();
    
    $cntnr.hide();
    return currHeight;
}

function choosePage(post, index) {
    //alert(index);   
    var $post = $(post);    
    //todo
    var divId = "divId" + index.toString();

    $('.part', $post).hide();
    $('#' + divId, $post).show();

    $('.pageLink', $post).each(function (indx, value) {
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
