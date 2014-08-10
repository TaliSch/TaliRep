//function splitPost(headerHtml, lines, contentMaxHeight) {
//    var parts = [];
//    var currentPart = "";
//    var fromIndex = 0;
//    for (var j = 0; j < lines.length - 1 ; j++) {
//        currentPart += lines[j] + "</p>";

//        var currHeight = calculateContentHeight(currentPart, headerHtml);
//        //alert("line " + j + ": currHeight=" + currHeight);
//        if (currHeight > contentMaxHeight) {
//            //alert("line " + j + ": currHeight=" + currHeight);
//            currentPart = "";
//            // alert('fromIndex=' + fromIndex + ',j=' + j);
//            if (fromIndex < j) {
//                for (var k = fromIndex; k < j; k++) {
//                    currentPart = currentPart.concat(lines[k] + "</p>");
//                }
//                parts[parts.length] = currentPart;
//                fromIndex = j;
//            }

//            currentPart = lines[j] + "</p>";
//        }
//    }
//    if (currentPart != "") {
//        parts.push(currentPart);
//    }

//    return parts;
//}

//function calculateContentHeight(part, headerHtml) {
//    var $cntnr = $("#parts");

//    // create the html paragraph
//    var div = '<div class="part" id="divId">' + part + '</div>';

//    var links = '<a class="pageLink" href="#">1</a> ';

//    var $newPost = $('<table><tr class="fakePost" id="newpostId"><td>' + headerHtml + div + links + '</td></tr></div>');

//    // append the paragraph to the containetr

//    $cntnr.append($newPost);

//    // find out the height
//    var currHeight = $cntnr.height();

//    // clear the container

//    $cntnr.html("");

//    return currHeight;
//}
