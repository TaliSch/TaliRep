var contentMaxHeight = 0;
var itemsInPage = 10;
var postsCount = 0;
//$.fn.placePost = null;
var postBoxNanoString;
var partNanoString;
var linkNanoString;
//var password = "";
$().ready(function () {
    postBoxNanoString = $("#postBoxTemplate .postBox")[0].outerHTML;
    partNanoString = $("#postBoxTemplate .part")[0].outerHTML.replace('hidden="hidden"', "");
    linkNanoString = $("#postBoxTemplate .pageLink")[0].outerHTML.replace('hidden="hidden"', "");

    contentMaxHeight = calculateContentHeight("<p>22</p>");
   // alert("contentMaxHeight="+contentMaxHeight);
    
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
    
    loadNextItems();
})

function loadNextItems() {
    var url= 'Home/NextIndex';
    var data = { from: postsCount, to: postsCount + itemsInPage };
    
    $.getJSON(url, data, function (data) {
        $.each(data, function (index, value) {
           // var postId = "postId" + String(postsCount + index);

            var date = new Date(Number(value.Date.substring(6, value.Date.length - 2)));
            var strDate = date.toDateString();
            strDate = strDate.substring(4, strDate.length);
            var title = FixTitle(value.Title);
            
            var content = LZString.decompressFromBase64(value.Content);
            var lines = content.split("</p>", 1000);
            var parts = splitPost(lines, contentMaxHeight);
            
            var $newPostBox = createPostBox(title, strDate, parts);

            //$newPost.attr("id", postId);

            $("#olderPosts").before($newPostBox);          
        })
        postsCount += data.length;
    }).fail(function(){
        alert("Failed To Load");
    });
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

function nano(template, data) {
    return template.replace(/\{([\w\.]*)\}/g, function(str, key) {
        var keys = key.split("."), v = data[keys.shift()];
        for (var i = 0, l = keys.length; i < l; i++) v = v[keys[i]];
        return (typeof v !== "undefined" && v !== null) ? v : "";
    });
}

function createPostBox(title, date, parts) {
    var partsHtml = "";
    for (i = 0; i < parts.length ; i++) {
        var partData = { post: { content: parts[i], id: "divId" + i.toString() } };
        partsHtml = partsHtml.concat(nano(partNanoString, partData));
        //var $part = $(nano(partNanoString, partData));
        //$part.attr("id", "divId" + i.toString());
        //partsHtml = partsHtml.concat($part[0].outerHTML);
    }
    //console.log(partsHtml);
    var linksHtml = "";
    console.log(linkNanoString);
    if (parts.length > 1) {        
        for (i = 0; i < parts.length ; i++) {
            var linkData = { post: { link: i.toString() } };
            linksHtml = linksHtml.concat(nano(linkNanoString, linkData));
        }
    }
    //console.log(linksHtml);
    var data = { post: { title: title, date: date, parts: partsHtml, links: linksHtml } };
    // var htmlString = nano(postNanoString, data);
    var postBox = $(nano(postBoxNanoString, data));
    createlinkFunction($(".post", postBox));
    return postBox;
}

function createlinkFunction(post) {
    var $post = $(post);
    $(".pageLink", $post).click(function (event) {
        event.preventDefault();
        var $this = $(this);
        var parent = $this.parent();
        var index = parseInt($this.html().trim(), "10");

        choosePage(parent.get(0), index);

    });
    choosePage(post, 0);
}

function createPostBoxSinglePart(title, date, part) {
    var parts = [];
    parts.push(part);
    return createPostBox(title, date, part);
}

function calculateContentHeight(part) {
    var $cntnr = $("#parts1");
    var $templatePost = $(".templatePost", $cntnr);
   
    var $postBox = createPostBoxSinglePart("tttt", "dddd", part);
   
    $postBox.appendTo($("td", $templatePost));
    $cntnr.show();
   // console.log($cntnr.html());
    var currHeight = $cntnr.height();
  //  console.log("currHeight=" + currHeight);
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
