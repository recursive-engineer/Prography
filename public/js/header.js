$('#open-signin').on('click', function() {
  signin();
});

$('#open-signup').on('click', function() {
  signup();
});

async function openGallery() {
  location.href =
    "//" + window.location.host + "/gallery";
}

var modal = 0;

async function signin() {
  if (modal == 0) {
    modal = 1;
    $("#signin-modal").attr("style", "display:block;");
  }
}
async function signup() {
  if (modal == 0) {
    modal = 1;
    $("#signup-modal").attr("style", "display:block;");
  }
}

$(window).click(function (e) {
  if (!($(e.target).parents().hasClass("modal") || $(e.target).hasClass("modal") || $(e.target).parents().hasClass("open-modal") || $(e.target).hasClass("open-modal")) || $(e.target).hasClass("cancel")) {
    modal = 0;
    $(".modal").attr("style", "display:none;");
  }
});

searchWidth();
function searchWidth() {
  var width = document.body.clientWidth;
  if (width > 1060) {
    $("#search").attr("style", "margin: 10px calc(100% - 1010px) 10px 50px;");
    $("#search").outerWidth(400);
  } else {
    $("#search").attr("style", "margin: 10px 50px 10px 50px;");
    $("#search").outerWidth(width - 660);
  }
}

$(window).resize(function (event) {
  searchWidth();
});

var dropdown = 0;

$(window).click(function (e) {
  if (!$(e.target).hasClass("user") && dropdown == 1) {
    dropdown = 0;
    $("#dropdown-menu").attr("style", "display:none;");
  }
});
$("#user").click(function () {
  if (dropdown == 0) {
    dropdown = 1;
    $("#dropdown-menu").attr("style", "display:block;");
  }
});