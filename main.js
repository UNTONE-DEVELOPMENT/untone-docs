var map = [];
var xhr = new XMLHttpRequest();
xhr.onload = function () {
    map = JSON.parse(xhr.responseText);
    console.log(map);
    fillNav();
}
xhr.open("GET", "src/map.json");
xhr.send();
var initOpened = false;

function generateButtons(pages, element, depth = 0, source = "base", curpath = "src/") {
    for (let x in pages) {
        let curpage = pages[x];
        let button = document.createElement("div");
        button.className = "docs__pagebutton";
        let button_inner = document.createElement("div");
        button_inner.className = "docs__pagebutton-inner";
        let button_inner_text = document.createElement("p");
        button_inner_text.innerHTML = curpage['title'];

        button_inner.appendChild(button_inner_text);
        button.appendChild(button_inner);


        let button_children = null;
        if(curpage['children'] != null) {
            button_children = document.createElement("div");
            button_children.setAttribute("children", depth);
            button_children.className = "docs__pagebutton-children";
            button_children.classList.add("child-hidden");
            generateButtons(curpage['children'], button_children, depth+1, "recursive", curpath + x + "/");
            button.appendChild(button_children);
        }
        
        function openPage() {
            var all = document.querySelectorAll("[children=\""+(depth)+"\"], [children=\""+(depth+1)+"\"], [children=\""+(depth+2)+"\"]");
            for(var el of all) {
                el.classList.add("child-hidden");
            }
            console.log(button_children);
            if(button_children != null) button_children.classList.remove("child-hidden");

            var all_active = document.querySelectorAll(".docs__pagebutton-active");
            for(var el of all_active) {
                el.classList.remove("docs__pagebutton-active");
            }
            button.classList.add("docs__pagebutton-active");

            document.getElementById("content").innerHTML = "Loading...";

            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                document.getElementById("content").innerHTML = marked.parse(xhr.responseText);
            }
            xhr.open("GET", curpath + x + "/" + x + ".md");
            xhr.send();
        }
        if(initOpened == false) {
            openPage();
            initOpened = true;
        }

        button_inner.addEventListener("click", function() {
            openPage();
        })

        element.appendChild(button);
    }
}

function fillNav() {
    generateButtons(map, document.getElementById("navigation"));
}