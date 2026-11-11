(function () {
  var font = document.createElement("link");
  font.rel = "stylesheet";
  font.href = "https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap";
  document.head.appendChild(font);

  var style = document.createElement("style");
  style.textContent = [
    "html, body { width: 100% !important; max-width: 100% !important; }",
    "header.fixed, nav.fixed { width: 100% !important; max-width: 100% !important; left: 0 !important; right: 0 !important; }",
    "header .h-16 > .flex:first-child { min-width: 0; }",
    "header .h-16 .font-label-lg, header .h-16 .font-caption { white-space: nowrap; }",
    ".ccs-logo { display: flex; flex-direction: column; justify-content: center; line-height: 1; flex: 0 0 auto; }",
    ".ccs-logo strong { font-family: 'DM Serif Display', Georgia, serif; font-weight: 400; font-size: 22px; color: #C9A84C; letter-spacing: 0.2px; }",
    ".ccs-logo em { font-family: 'Plus Jakarta Sans', sans-serif; font-style: normal; font-weight: 600; font-size: 7.5px; letter-spacing: 0.16em; text-transform: uppercase; color: #C9A84C; margin-top: 3px; }",
    ".ccs-logo.compact strong { font-size: 15px; }",
    ".ccs-logo.compact em { font-size: 6px; letter-spacing: 0.08em; }"
  ].join("");
  document.head.appendChild(style);

  document.querySelectorAll('img[alt="Charlotte Cleaning Service Logo"]').forEach(function (img) {
    var next = img.nextElementSibling;
    var admin = next && /Felix/.test(next.textContent || "");
    var logo = document.createElement("div");
    logo.className = "ccs-logo" + (admin ? " compact" : "");
    logo.setAttribute("role", "img");
    logo.setAttribute("aria-label", "Charlotte Cleaning Service");
    logo.innerHTML = "<strong>Charlotte</strong><em>Cleaning Service</em>";
    img.replaceWith(logo);
    if (next && /Cleaning Service/.test(next.textContent || "") && !admin) next.remove();
  });

  var ROUTES = {
    home: "/screens/home.html",
    bookings: "/screens/bookings.html",
    "new-clean": "/screens/book.html",
    profile: "/screens/profile.html",
    "schedule-agenda": "/screens/agenda.html",
    "requests-queue": "/screens/requests.html",
    "clients-directory": "/screens/clients.html"
  };

  var ALIASES = {
    "/home": "home",
    "/bookings": "bookings",
    "/book": "new-clean",
    "/profile": "profile",
    "/agenda": "schedule-agenda",
    "/requests": "requests-queue",
    "/clients": "clients-directory"
  };

  function currentKey() {
    var path = location.pathname.replace(/\/$/, "") || "/";
    if (ALIASES[path]) return ALIASES[path];
    var keys = Object.keys(ROUTES);
    for (var i = 0; i < keys.length; i++) {
      if (ROUTES[keys[i]] === path) return keys[i];
    }
    return "";
  }

  function go(key) {
    var url = ROUTES[key];
    if (!url || currentKey() === key) return;
    if (window.parent !== window) {
      window.parent.postMessage({ type: "ccs-nav", path: key }, "*");
    }
    location.href = url;
  }

  document.addEventListener(
    "click",
    function (event) {
      var link = event.target.closest("[data-path]");
      if (!link) return;
      var key = link.getAttribute("data-path");
      if (!ROUTES[key]) return;
      event.preventDefault();
      go(key);
    },
    true
  );

  var adminBtn = document.getElementById("adminModeBtn");
  if (adminBtn) {
    adminBtn.addEventListener(
      "click",
      function (event) {
        event.preventDefault();
        event.stopPropagation();
        go("schedule-agenda");
      },
      true
    );
  }

  document.querySelectorAll("button").forEach(function (button) {
    var label = (button.textContent || "").replace(/\s+/g, " ");
    if (label.indexOf("Book a Clean Now") !== -1) {
      button.addEventListener("click", function () {
        go("new-clean");
      });
    }
  });

  document.querySelectorAll(".service-card").forEach(function (card) {
    card.addEventListener("click", function () {
      go("new-clean");
    });
  });
})();
