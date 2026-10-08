$(function () {
  initSlider();
  initTyping();
  initReveal();
  initHeader();
  initMenu();
  initSmoothScroll();
  initMenuActiveOnScroll();
  initModal();
});

let isMenuScrolling = false;

/* 포폴 슬라이더로 */
function initSlider() {
  $(".portfolio").each(function () {
    const $section = $(this);
    const $slider = $section.find(".portfolio-slider");
    const total = $section.find(".portfolio-item").length;
    let index = 0;

    $section.find(".right").on("click", function (e) {
      e.stopPropagation();
      index = (index + 1) % total;
      $slider.css("transform", `translateX(-${index * 100}%)`);
    });

    $section.find(".left").on("click", function (e) {
      e.stopPropagation();
      index = (index - 1 + total) % total;
      $slider.css("transform", `translateX(-${index * 100}%)`);
    });
  });
}


function scrollToSection(id) {
  const $target = $("#" + id);
  if (!$target.length) return;

  isMenuScrolling = true;

  $(".menu a").removeClass("active");
  $(`.menu a[href="#${id}"]`).addClass("active");

  window.scrollTo({
    top: $target.offset().top - 70,
    behavior: "smooth"
  });

  isMenuScrolling = false;
  updateActiveMenu();
}


/* 스크롤할시에 스르륵나오게하기 */
function initReveal() {
  function reveal() {
    $(".reveal").each(function () {
      const top = $(this).offset().top;
      const scroll = $(window).scrollTop();
      const height = $(window).height();

      if (scroll > top - height + 100) {
        $(this).addClass("active");
      }
    });
  }

  reveal();
  $(window).on("scroll", reveal);
}


/* 첫 홈화면 타이틀 다다다닥 타이핑 */
function initTyping() {
  const text = "MY PORTFOLIO";
  let i = 0;

  $("#typing").text("");

  function type() {
    if (i < text.length) {
      $("#typing").append(text.charAt(i));
      i++;
      setTimeout(type, 110);
    } else {
      $("#subtitle").addClass("show");
    }
  }

  type();
}


/* 헤더 */
function initHeader() {
  const $header = $("#header");

  function updateHeader() {
    const homeHeight = $("#home").outerHeight();
    const scroll = $(window).scrollTop();

    if (scroll < homeHeight - 100) {
      $header.addClass("home-header");
    } else {
      $header.removeClass("home-header");
    }
  }

  updateHeader();
  $(window).on("scroll resize", updateHeader);
}


/* 모바일 메뉴 */
function initMenu() {
  $(".hamburger").on("click", function () {
    $("#nav").toggleClass("active");
  });

  $(".menu a").on("click", function () {
    $("#nav").removeClass("active");
  });
}


/* 메뉴 클릭하면 바로 이동 */
function initSmoothScroll() {
  $(".menu a, .home-btn").on("click", function (e) {
    const href = $(this).attr("href");

    if (!href || !href.startsWith("#")) return;

    const $target = $(href);
    if (!$target.length) return;

    e.preventDefault();

    isMenuScrolling = true;

    if ($(this).closest(".menu").length) {
      $(".menu a").removeClass("active");
      $(`.menu a[href="${href}"]`).addClass("active");
    }

    window.scrollTo({
      top: $target.offset().top - 70,
      behavior: "smooth"
    });

    isMenuScrolling = false;
    updateActiveMenu();
  });
}


function updateActiveMenu() {
  if (isMenuScrolling) return;

  const scrollCenter = $(window).scrollTop() + $(window).height() * 0.35;
  let currentId = "";
  let minDistance = Infinity;

  $("section[id]").each(function () {
    const $section = $(this);
    const sectionTop = $section.offset().top;
    const distance = Math.abs(scrollCenter - sectionTop);

    if (distance < minDistance) {
      minDistance = distance;
      currentId = $section.attr("id");
    }
  });

  if (currentId) {
    const $targetMenu = $(`.menu a[href="#${currentId}"]`);

    if ($targetMenu.length && !$targetMenu.hasClass("active")) {
      $(".menu a").removeClass("active");
      $targetMenu.addClass("active");
    }
  }
}


function initMenuActiveOnScroll() {
  updateActiveMenu();
  $(window).on("scroll resize", updateActiveMenu);
}


function initModal() {
  $(".portfolio-img-wrap").on("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    const youtubeId = $(this).data("youtube");
    const videoSrc = $(this).data("video");
    const imgSrc = $(this).find("img").attr("src");

    const $modal = $(".portfolio-modal");
    const $modalImg = $(".modal-img");
    const $modalVideo = $(".modal-video");
    const $modalYoutube = $(".modal-youtube");

    const modalVideoEl = $modalVideo.get(0);

    // 초기화
    $modalImg.hide().attr("src", "");
    $modalVideo.hide();
    $modalYoutube.hide().attr("src", "");

    if (modalVideoEl) {
      modalVideoEl.pause();
      modalVideoEl.currentTime = 0;
    }

    // YouTube
    if (youtubeId) {
      $modalYoutube
        .attr(
          "src",
          "https://www.youtube.com/embed/" +
          youtubeId +
          "?autoplay=1&rel=0"
        )
        .show();

      $modal.addClass("active");
      return;
    }

    // MP4
    if (videoSrc) {
      $(".modal-video source").attr("src", videoSrc);

      if (modalVideoEl) {
        modalVideoEl.load();
      }

      $modalVideo.show();
      $modal.addClass("active");
      return;
    }

    // 이미지
    $modalImg
      .attr("src", imgSrc)
      .show();

    $modal.addClass("active");
  });


  $(".close").on("click", function (e) {
    e.stopPropagation();
    closeModal();
  });


  $(".portfolio-modal").on("click", function (e) {
    if (e.target === this) {
      closeModal();
    }
  });


  $(document).on("keydown", function (e) {
    if (e.key === "Escape") {
      closeModal();
    }
  });


  function closeModal() {
    const $modal = $(".portfolio-modal");
    const $modalImg = $(".modal-img");
    const $modalVideo = $(".modal-video");
    const $modalYoutube = $(".modal-youtube");

    const modalVideoEl = $modalVideo.get(0);

    $modal.removeClass("active");

    $modalImg.hide().attr("src", "");
    $modalYoutube.hide().attr("src", "");
    $modalVideo.hide();

    if (modalVideoEl) {
      modalVideoEl.pause();
      modalVideoEl.currentTime = 0;
      $(".modal-video source").attr("src", "");
      modalVideoEl.load();
    }
  }
}