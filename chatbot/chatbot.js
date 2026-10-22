/* Strong Roots Co. website chatbot — rule-based FAQ + lead capture.
   Lead form posts to the same FormSubmit endpoint as the site contact form. */
(function () {
  var PHONE = "(801) 330-1444";
  var PHONE_LINK = "tel:+18013301444";
  var EMAIL = "Strongrootsco25@gmail.com";
  var FORM_ENDPOINT = "https://formsubmit.co/ajax/Strongrootsco25@gmail.com";

  var RULES = [
    { k: ["price", "cost", "much", "quote", "estimate", "charge"],
      a: "Tree work is priced per job since every tree is different — but estimates are always FREE. Tell me what you need (or tap \"Free quote\" below) and Austin will get back to you with a number, usually same-day." },
    { k: ["firewood", "wood", "cord", "fireplace", "burn"],
      a: "We deliver seasoned, split firewood:\n• Light Load (quarter cord) — $149 delivered\n• Half Cord — $199 delivered\n• Full Cord — $300 delivered (best value)\nDelivery is free in the Salt Lake Valley. Want to order? Tap \"Free quote\" and mention firewood, or call " + PHONE + "." },
    { k: ["topsoil", "gravel", "mulch", "materials", "dirt", "sand", "rock", "road base", "compost", "delivery", "deliver"],
      a: "We deliver landscaping materials by the load:\n• Topsoil — $350/load\n• Gravel — $575/load\n• Road base — $375/load\n• Sand — $400–$550 (by type)\n• Mulch — $50/cubic yard\nFill dirt, compost & decorative rock are call-for-pricing. Salt Lake Valley delivery included; Park City/Heber +$75, Utah/Davis County +$40." },
    { k: ["removal", "remove", "cut down", "take down", "tree removal"],
      a: "Yes — tree removal is our core work, including tricky and close-to-structure removals. Every job gets a free on-site estimate. Tap \"Free quote\" with your address and a photo of the tree if you can, and we'll get you scheduled." },
    { k: ["trim", "prune", "pruning", "shaping", "branches"],
      a: "We do trimming and pruning for health, shape, and clearance (including fruit trees). Free estimates — tap \"Free quote\" and tell us how many trees and what they need." },
    { k: ["stump", "grind"],
      a: "We grind stumps below grade so you can replant or lay sod right over. Tap \"Free quote\" with the stump's rough diameter and we'll price it out." },
    { k: ["emergency", "storm", "fallen", "fell on", "urgent", "asap", "right now"],
      a: "We're open 24/7 for everything — including storm damage and hazardous trees. For anything urgent, call " + PHONE + " right now — that's the fastest way to reach us. For non-urgent work, tap \"Free quote\"." },
    { k: ["area", "serve", "location", "where", "park city", "sandy", "draper", "murray", "herriman", "riverton", "west jordan"],
      a: "We serve Salt Lake, Utah, Davis, Weber & Wasatch counties — including West Jordan, Sandy, Draper, Murray, Taylorsville, Herriman, Riverton, South Jordan, Midvale, Park City and Heber." },
    { k: ["hour", "open", "when", "weekend", "sunday"],
      a: "We're open 24 hours, 7 days a week — including emergency tree service at night and on weekends." },
    { k: ["land clearing", "clearing", "lot", "acreage"],
      a: "We do land clearing for lots and acreage. These jobs really need eyes on site — tap \"Free quote\" and we'll set up a free walkthrough." },
    { k: ["human", "person", "call", "phone", "talk", "real"],
      a: "You can reach Austin directly at " + PHONE + " — call or text anytime, 24/7." },
    { k: ["hi", "hello", "hey", "yo"],
      a: "Hello! Ask me about our services, pricing, or service areas — or tap \"Free quote\" and I'll get your info to Austin." },
    { k: ["thank", "thanks", "great", "awesome", "perfect"],
      a: "You're welcome! Anything else I can help with?" }
  ];

  var FALLBACK = "I want to make sure you get the right answer — tap \"Free quote\" and Austin will reply personally, or call " + PHONE + " anytime.";

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function linkify(t) {
    return t.replace(/\(801\) 330-1444/g, '<a href="' + PHONE_LINK + '">(801) 330-1444</a>');
  }

  var panel, body, quick, input;

  function addMsg(text, who) {
    var m = el("div", "sr-msg " + (who || "sr-bot"), linkify(text));
    body.appendChild(m);
    body.scrollTop = body.scrollHeight;
    return m;
  }

  function setQuick(items) {
    quick.innerHTML = "";
    items.forEach(function (t) {
      var c = el("button", "sr-chip", t);
      c.type = "button";
      c.onclick = function () { sendUser(t); };
      quick.appendChild(c);
    });
  }

  var DEFAULT_QUICK = ["Free quote", "Services", "Firewood prices", "Call us"];

  function answer(text) {
    var t = text.toLowerCase();
    if (/free quote|get.*quote|estimate request|book/.test(t)) { startLeadForm(); return; }
    if (/service/.test(t)) {
      addMsg("Here's what we do:\n• Tree Removal\n• Trimming & Pruning\n• Stump Grinding\n• 24/7 Emergency Tree Service\n• Land Clearing\n• Firewood Delivery\n• Materials Delivery (topsoil, gravel, mulch & more)\n\nTap \"Free quote\" for pricing on any of these.");
      setQuick(DEFAULT_QUICK); return;
    }
    if (/call/.test(t)) {
      addMsg('Call or text us anytime at <a href="' + PHONE_LINK + '">' + PHONE + '</a> — we\'re open 24/7.');
      setQuick(DEFAULT_QUICK); return;
    }
    for (var i = 0; i < RULES.length; i++) {
      var r = RULES[i];
      for (var j = 0; j < r.k.length; j++) {
        if (t.indexOf(r.k[j]) !== -1) { addMsg(r.a); setQuick(DEFAULT_QUICK); return; }
      }
    }
    addMsg(FALLBACK);
    setQuick(["Free quote", "Call us"]);
  }

  function sendUser(text) {
    addMsg(text, "sr-user");
    setQuick([]);
    setTimeout(function () { answer(text); }, 350);
  }

  function startLeadForm() {
    var wrap = el("div", "sr-msg sr-bot");
    wrap.innerHTML =
      '<div class="sr-lead-form">' +
      "<b>Free quote request</b><br><br>" +
      '<input id="sr-f-name" placeholder="Your name" autocomplete="name">' +
      '<input id="sr-f-phone" placeholder="Phone number" inputmode="tel" autocomplete="tel">' +
      '<select id="sr-f-service">' +
      "<option>Tree removal</option><option>Trimming / pruning</option>" +
      "<option>Stump grinding</option><option>Emergency tree service</option>" +
      "<option>Land clearing</option><option>Firewood delivery</option>" +
      "<option>Materials delivery</option><option>Something else</option>" +
      "</select>" +
      '<textarea id="sr-f-msg" rows="3" placeholder="Tell us about the job (address, tree size, photos help!)"></textarea>' +
      '<button id="sr-f-go" type="button">Send my request</button>' +
      "</div>";
    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
    setQuick([]);
    wrap.querySelector("#sr-f-go").onclick = function () {
      var name = wrap.querySelector("#sr-f-name").value.trim();
      var phone = wrap.querySelector("#sr-f-phone").value.trim();
      var service = wrap.querySelector("#sr-f-service").value;
      var msg = wrap.querySelector("#sr-f-msg").value.trim();
      if (!name || !phone) {
        addMsg("Please add your name and phone number so Austin can reach you.");
        return;
      }
      var btn = wrap.querySelector("#sr-f-go");
      btn.disabled = true; btn.textContent = "Sending...";
      var payload = {
        _subject: "Website chatbot lead: " + service + " — " + name,
        Name: name, Phone: phone, Service: service, Details: msg || "(none)",
        _template: "table", _captcha: "false"
      };
      fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      }).then(function (r) { return r.json(); }).then(function () {
        wrap.innerHTML = "Sent! Austin will get back to you at <b>" + phone.replace(/</g, "&lt;") + "</b>, usually same-day.";
        addMsg("Anything else I can help with?");
        setQuick(DEFAULT_QUICK);
      }).catch(function () {
        btn.disabled = false; btn.textContent = "Send my request";
        addMsg("Hmm, that didn't send. Please call or text " + PHONE + " and we'll take care of you.");
        setQuick(DEFAULT_QUICK);
      });
    };
  }

  function build() {
    var btn = el("button", "", "");
    btn.id = "sr-chat-btn";
    btn.setAttribute("aria-label", "Chat with us");
    btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/></svg><span class="sr-dot">1</span>';

    panel = el("div", ""); panel.id = "sr-chat-panel";
    panel.innerHTML =
      '<div id="sr-chat-head"><div class="sr-avatar">🌲</div>' +
      '<div><div class="sr-title">Strong Roots Assistant</div><div class="sr-sub">Online now</div></div>' +
      '<button id="sr-chat-close" aria-label="Close chat">&times;</button></div>' +
      '<div id="sr-chat-body"></div><div id="sr-quick"></div>' +
      '<div id="sr-chat-foot"><input id="sr-chat-input" placeholder="Ask a question..." autocomplete="off">' +
      '<button id="sr-chat-send">Send</button></div>';

    document.body.appendChild(btn);
    document.body.appendChild(panel);
    body = panel.querySelector("#sr-chat-body");
    quick = panel.querySelector("#sr-quick");
    input = panel.querySelector("#sr-chat-input");

    var opened = false;
    function toggle(force) {
      var open = force !== undefined ? force : !panel.classList.contains("sr-open");
      panel.classList.toggle("sr-open", open);
      if (open && !panelPinned) placePanel();
      if (open) {
        var dot = btn.querySelector(".sr-dot");
        if (dot) dot.classList.add("sr-hide");
        try { localStorage.setItem("sr-chat-seen", "1"); } catch (e) {}
      }
      if (open && !opened) {
        opened = true;
        addMsg("Hi! 👋 Looking for tree work, firewood, or materials delivery? Ask me anything — or tap below to get a free quote.");
        setQuick(DEFAULT_QUICK);
      }
      if (open) setTimeout(function () { input.focus(); }, 100);
    }
    /* --- Draggable widget: drag the button to move it; the panel follows.
       Drag the panel's header to move the panel on its own. Position persists. --- */
    var suppressClick = false;
    var panelPinned = false;
    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
    function toXY(node) {
      var r = node.getBoundingClientRect();
      node.style.left = r.left + "px";
      node.style.top = r.top + "px";
      node.style.right = "auto";
      node.style.bottom = "auto";
      return r;
    }
    function savePos() {
      try {
        var b = btn.getBoundingClientRect(), p = panel.getBoundingClientRect();
        localStorage.setItem("sr-chat-pos", JSON.stringify({
          bl: b.left, bt: b.top, pl: p.left, pt: p.top, pinned: panelPinned
        }));
      } catch (e) {}
    }
    function restorePos() {
      try {
        var s = JSON.parse(localStorage.getItem("sr-chat-pos") || "null");
        if (!s) return;
        btn.style.left = s.bl + "px"; btn.style.top = s.bt + "px";
        btn.style.right = "auto"; btn.style.bottom = "auto";
        if (s.pinned) {
          panelPinned = true;
          panel.style.left = s.pl + "px"; panel.style.top = s.pt + "px";
          panel.style.right = "auto"; panel.style.bottom = "auto";
        }
      } catch (e) {}
    }
    function placePanel() {
      var r = btn.getBoundingClientRect();
      var pw = Math.min(378, window.innerWidth - 40);
      var ph = Math.min(540, window.innerHeight - 130);
      panel.style.left = clamp(r.left + r.width - pw, 8, Math.max(8, window.innerWidth - pw - 8)) + "px";
      panel.style.top = clamp(r.top - ph - 12, 8, Math.max(8, window.innerHeight - ph - 8)) + "px";
      panel.style.right = "auto"; panel.style.bottom = "auto";
    }
    function dragify(handle, node, opts) {
      var on = false, moved = false, sx = 0, sy = 0, ox = 0, oy = 0;
      handle.addEventListener("pointerdown", function (e) {
        if (opts.ignore && e.target.closest(opts.ignore)) return;
        on = true; moved = false; sx = e.clientX; sy = e.clientY;
        var r = toXY(node); ox = r.left; oy = r.top;
        handle.classList.add("sr-dragging"); node.classList.add("sr-dragging");
        try { handle.setPointerCapture(e.pointerId); } catch (err) {}
        e.preventDefault();
      });
      handle.addEventListener("pointermove", function (e) {
        if (!on) return;
        var dx = e.clientX - sx, dy = e.clientY - sy;
        if (!moved && Math.hypot(dx, dy) < 8) return;
        moved = true;
        var w = node.offsetWidth, h = node.offsetHeight;
        node.style.left = clamp(ox + dx, 0, Math.max(0, window.innerWidth - w)) + "px";
        node.style.top = clamp(oy + dy, 0, Math.max(0, window.innerHeight - h)) + "px";
        if (opts.onMove) opts.onMove();
      });
      function done() {
        if (!on) return;
        on = false;
        handle.classList.remove("sr-dragging"); node.classList.remove("sr-dragging");
        if (opts.onEnd) opts.onEnd(moved);
      }
      handle.addEventListener("pointerup", done);
      handle.addEventListener("pointercancel", done);
    }
    dragify(btn, btn, {
      onMove: function () { if (panel.classList.contains("sr-open") && !panelPinned) placePanel(); },
      onEnd: function (wasDrag) { suppressClick = wasDrag; if (wasDrag) savePos(); }
    });
    dragify(panel.querySelector("#sr-chat-head"), panel, {
      ignore: "#sr-chat-close",
      onEnd: function (wasDrag) { if (wasDrag) { panelPinned = true; savePos(); } }
    });
    btn.onclick = function () { if (suppressClick) { suppressClick = false; return; } toggle(); };
    try {
      if (localStorage.getItem("sr-chat-seen")) {
        var seenDot = btn.querySelector(".sr-dot");
        if (seenDot) seenDot.classList.add("sr-hide");
      }
    } catch (e) {}
    restorePos();
    panel.querySelector("#sr-chat-close").onclick = function () { toggle(false); };
    function send() {
      var v = input.value.trim();
      if (!v) return;
      input.value = "";
      sendUser(v);
    }
    panel.querySelector("#sr-chat-send").onclick = send;
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") send(); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else { build(); }
})();
