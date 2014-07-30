$.fn.placePost = function ($newPost, postId) {
    
    var $post = $("#" + postId);

    if ($post.get(0) == undefined) {
        $("#olderPosts").before($newPost);
    }

    else {
        $post.replaceWith($newPost);
    }

    $newPost.before('<div class="postTop"></div>');
}
$().ready(function () {
    var $face = $(".myImage");
    var faceImage = $face.get(0).id;
    if (faceImage != null) {
        var decompresssed = LZString.decompressFromBase64(faceImage);        
        $face.css("background-image", "url(" + decompresssed + ")");
    }

    var $background = $(".blogHeaderTop");
    var backgroundImage = $background.get(0).id;
    if (backgroundImage != null) {
        decompresssed = LZString.decompressFromBase64(backgroundImage);
        $background.css("background-image", "url(" + decompresssed + ")");
    }    
})

//function b64_to_utf8(str) {
//    return decodeURIComponent(escape(window.atob(str)));
//}
//function utf8_to_b64(str) {
//    return window.btoa(unescape(encodeURIComponent(str)));
//}