get_artworks();

async function get_artworks() {
  const response = await httpGet(
    "//" + window.location.host + "/api/artworks/get/gallery"
  );
  console.log(response);
  var artworks = document.getElementById("artworks");
  for (var i = 0; i < response.length; i++) {
    var li = document.createElement("li");
    li.classList.add("li");
    li.setAttribute("data-art_id", response[i].id);
    li.setAttribute("data-author_id", response[i].author_id);
    li.setAttribute("data-name", response[i].name);
    li.setAttribute("data-title", response[i].title);
    var img = document.createElement("img");
    img.setAttribute(
      "src",
      "../image/thumbnail/" + response[i].id + ".png"
    );
    img.setAttribute("id", response[i].id);
    img.classList.add("artwork");
    li.appendChild(img);
    artworks.appendChild(li);
  }
  const artwork = document.getElementsByClassName("artwork");
  for (let i = 0; i < artwork.length; i++) {
    artwork[i].addEventListener("click", openViewer, false);
  }
  $(".li").hover(
    function () {
      var info = document.createElement("div");
      info.setAttribute("class", "info");
      var title = document.createElement("div");
      title.setAttribute("class", "title");
      title.textContent = $(this).attr("data-title");
      var author = document.createElement("div");
      author.setAttribute("class", "author");
      author.setAttribute(
        "data-author_id",
        $(this).attr("data-author_id")
      );
      var icon = document.createElement("img");
      icon.setAttribute("class", "icon");
      icon.setAttribute("src", "../image/vivi.png");
      icon.setAttribute("data-author_id", $(this).attr("data-author_id"));
      var name = document.createElement("div");
      name.setAttribute("class", "name");
      name.textContent = $(this).attr("data-name");
      name.setAttribute("data-author_id", $(this).attr("data-author_id"));
      author.append(icon);
      author.append(name);
      info.append(title);
      info.append(author);
      $(this).append(info);
      $(".author").on("click", openUserPage);
    },
    function () {
      $(".info").remove();
    }
  );
}

async function openUserPage(e) {
  var author_id = e.target.getAttribute("data-author_id");
  location.href =
    "//" +
    window.location.host +
    "/views/userpage.html?=" +
    user_id +
    "=" +
    author_id;
}

async function openViewer(e) {
  location.href =
    "//" +
    window.location.host +
    "/views/viewer.html?=" +
    user_id +
    "=" +
    e.target.id;
}

artworkWidth();

function artworkWidth() {
  var width = document.body.clientWidth;
  $("#artworks").attr(
    "style",
    "grid-template-columns:repeat(" +
      Math.floor(width / 200) +
      ", minmax(0, 1fr));"
  );
}

$(window).resize(function (event) {
  artworkWidth();
});