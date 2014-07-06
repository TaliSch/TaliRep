$(document).ready(function () {
    var currId = 0;
    var prefix = '<span>';
    var sufix = '</span>';

    function createPrefixStyle(style) {
        return "<span style=\'" + style + '\'>';
    }

    // $('.editable').contentEditable = true;
    //tree with indexes (textfrom-textto) and styles
    $('#chooseColor').change(function () {
        //event.preventDefault();
        var chosenColor = $(this).val();//[0].atrr('value');
        //alert(chosenColor);
        //getSel();
        //alert('onclick');
        changeHtml('color:' + chosenColor);
    })
    $('#setBold').click(function () {
        changeHtml('font-weight:700');
    })

    
    function changeHtml(style) {
        //alert(style);


        var selection = window.getSelection();//$.Range.current();//   
        var startNode = selection.anchorNode;
        //alert(startNode.textContent);
        var endNode = selection.focusNode;
        alert("startNode:" + startNode);
        alert("endNode:" + endNode);
        var startOffset = selection.anchorOffset;
        //    alert("startOffset="+startOffset);
        var endOffset = selection.focusOffset;
        //    alert("endoffset="+endOffset);
        if (startNode == endNode) {
            alert('same');

            setStartEndStyle(startNode, startOffset, endNode, endOffset, style);
        }

        else {
            alert('different');

            var parentNode = selection.getRangeAt(0).commonAncestorContainer;

            setTreeStyle(parentNode, startNode, endNode, style);

            setStartStyle(startNode, startOffset, style);

            setEndStyle(endNode, endOffset, style);

            //alret(document.getElementById("user_post").outerHTML);

        }

    }

    function setStartEndStyle(startNode, startOffset, endNode, endOffset, style) {

        var newString = prefix + startNode.textContent.substring(0, startOffset) +
            createPrefixStyle(style) + startNode.textContent.substring(startOffset, endOffset) + sufix +
            startNode.textContent.substring(endOffset, startNode.textContent.length) + sufix;
        //alert(newString);
        var $newNode = $(newString);
        startNode.textContent = "###" + currId++;
        //alert(startNode.textContent);
        $(startNode).replaceWith($newNode);
    }

    function setStartStyle(startNode, startOffset, style) {
        if (startOffset < startNode.textContent.length) {
            var newHtml = prefix + startNode.textContent.substring(0, startOffset) +
                createPrefixStyle(style) + startNode.textContent.substring(startOffset, startNode.textContent.length) + sufix + sufix;
            //alert(newHtml);
            var $newNode = $(newHtml);
            startNode.textContent = currId++ + "###" + currId++;
            $(startNode).replaceWith($newNode);
        }
    }

    function setEndStyle(endNode, endOffset, style) {
        if (endOffset > 0) {
            var newEndHtml = prefix + createPrefixStyle(style) + endNode.textContent.substring(0, endOffset) + sufix +
                endNode.textContent.substring(endOffset, endNode.textContent.length) + sufix;
            //alert(newEndHtml);
            endNode.textContent = currId++ + "$$$" + currId++;
            var $newEndNode = $(newEndHtml);
            $(endNode).replaceWith($newEndNode);
        }
    }
    /* From startNode to EndNode, not including */
    function setTreeStyle(parentNode, startNode, endNode, style) {
        var pNode = startNode;
        // set style from startNode all the way up to parentNode
        while (pNode != parentNode) {
            setNextSiblingsStyle(pNode, style);
            pNode = pNode.parentNode;
        }
        // set style from end node all the way up to parentNode
        pNode = endNode;

        while (pNode != parentNode) {
            setPrevSiblingsStyle(pNode, style);
            pNode = pNode.parentNode;
        }
    }

    function setNextSiblingsStyle(node, style) {
        var next = node.nextSibling;
        alert("next=" + next);
        //alert("contains="+containsNode(endNode, next));
        while (next != null) {
            setStyle(next, style);
            next = next.nextSibling;
        }
    }

    function setPrevSiblingsStyle(node, style) {
        var prev = node.prevSibling;
        alert("prev=" + prev);
        //alert("contains="+containsNode(endNode, next));
        while (prev != null) {
            setStyle(prev, style);
            prev = prev.prevSibling;
        }
    }

    function getStyleType(style) {
        return style.substring(0, style.indexOf(":"));
    }

    function setStyle(node, style) {
        var curStyleType = getStyleType(style);
        //var string = "sfewsrfewewsrewr"
        var currStyle = $(node).attr("style");
        if (currStyle != null) {
            var styles = currStyle.split(";", 100);
            for (var i = 0; i < styles.length ; i++) {
                var styleType = getStyleType(styles[i]);
                if (styleType == curStyleType) {
                    style = currStyle.replace(styles[i], style);
                    break;
                }
            }
        }
        $(node).attr("style", style);

        var children = node.children;// Nodes.split(',');
        if (children != null) {
            for (var i = 0; i < children.length ; i++)
                setStyle(children.item(i), style);
        }
        //children.forEach(function recSetStyle(value, style) { setStyle(value, style); });
    }
    function containsNode(nodeToFind, node) {
        var found = false;
        if (node == nodeToFind)
            return true;
        var children = node.childNodes;

        for (var i = 0; i < children.length ; i++) {
            if (containsNode(nodeToFind, children.item(i))) {
                found = true;
                break;
            }
        }

        return found;

    }

})