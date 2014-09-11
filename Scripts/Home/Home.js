var contentMaxHeight = 0;
var itemsInPage = 10;
var postsCount = 0;
//$.fn.placePost = null;

var postsTemplate;
var postsTable = null;
//var fakeTemplate;

$().ready(function () {
    $.get('Templates/Post.htm', function (template) {
       
        $("#posts").html(template);

        var $postsTemplate = $("#posts #postsTemplate");
        postsTemplate = Tempo.prepare($postsTemplate, { 'escape': false });
      
        contentMaxHeight = calculateContentHeight("<p>22</p>", true);

        loadNextItems();
    });

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
})

function loadNextItems() {
    var url= 'Home/NextIndex';
    var data = { from: postsCount, to: postsCount + itemsInPage - 1 };
    console.log(data);
    $.getJSON(url, data, function (data) {
        var templateData = [];
        $.each(data, function (index, value) {
           
            var date = new Date(Number(value.Date.substring(6, value.Date.length - 2)));
      
            var title = FixTitle(value.Title);
            
            var content = LZString.decompressFromBase64(value.Content);
            var lines = content.split("</p>", 1000);
            var parts = splitPost(lines, contentMaxHeight);
            
            templateData.push(createPostBoxTemplateData(title, date, parts));            
        })
        
        addTemplateData(templateData);
       
        $.each($("#posts .post"), function (index, value) {
            if (index >= postsCount) {
                createlinkFunction(value);
            }
        });

        postsCount += data.length;
     
    }).fail(function(){
        alert("Failed To Load");
    });
}

function addTemplateData(templateData) {
    if (postsTable == null){    
        postsTable = postsTemplate.render(templateData);
    }
    else {
        postsTable = postsTable.append(templateData);
    }
}

function createPostBoxTemplateData(title, date, parts) {
    var partsData = [];
    var linksData = [];
    for (i = 0; i < parts.length ; i++) {
        var partData = { content: parts[i], id: "divId" + i.toString() };
        partsData.push(partData);
        linksData.push(i.toString());
    }

    var postTemplateData = { title: title, date: date, parts: partsData, links: linksData };
    
    return postTemplateData;
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

//function nano(template, data) {
//    return template.replace(/\{([\w\.]*)\}/g, function(str, key) {
//        var keys = key.split("."), v = data[keys.shift()];
//        for (var i = 0, l = keys.length; i < l; i++) v = v[keys[i]];
//        return (typeof v !== "undefined" && v !== null) ? v : "";
//    });
//}


function createlinkFunction(post) {
    var $post = $(post);
    var $pageLinks = $(".pageLink", $post);
    if ($pageLinks.length == 1) {
        $pageLinks.prop("hidden", true);
    }
    else {
        $(".pageLink", $post).click(function (event) {
            event.preventDefault();
            var $this = $(this);
            var parent = $this.parents(".post");//$this.parent();
            var index = parseInt($this.html().trim(), "10");

            choosePage(parent.get(0), index);

        });
        choosePage(post, 0);
    }
}

function calculateContentHeight(part, max) {
    var parts = [];
    parts.push(part);
    var data = createPostBoxTemplateData("tttt", Date(), parts);

    addTemplateData(data);

    var fakePost = $("#posts .postBox").get(postsCount);
    //console.log("fake="+fakePost.outerHTML);
    var $fakePost = $(fakePost);
    if (max != null) {
        if (max) $fakePost.addClass("templatePost");
    }
    var currHeight = $fakePost.height();
    //console.log("currHeight=" + currHeight);
    fakePost.remove();
  
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
