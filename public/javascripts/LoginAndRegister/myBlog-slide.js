$(document).ready(function() {

	init();
  
});

var $slider = $(".slider"),
  $slideBGs = $(".slide-bg"),
  diff = 0,
  curSlide = 0,
  numOfSlides = $(".slide").length-1,
  animating = false,
  animTime = 500,
  autoSlideTimeout,
  autoSlideDelay = 6000,
  $pagination = $(".slider-pagi");

var animation = {
	createBullets: function() {
    for (var i = 0; i < numOfSlides+1; i++) {
      var $li = $("<li class='slider-pagi-elem'></li>");
      $li.addClass("slider-pagi-elem-"+i).data("page", i);
      if (!i) $li.addClass("active");
      $pagination.append($li);
    }
  },
  	  
  manageControls: function() {
    $(".slider-control").removeClass("inactive");
    if (!curSlide) $(".slider-control.left").addClass("inactive");
    if (curSlide === numOfSlides) $(".slider-control.right").addClass("inactive");
  },
  
  autoSlide: function() {
    autoSlideTimeout = setTimeout(function() {
      curSlide++;
      if (curSlide > numOfSlides) window.location.href = "/myBlog-login";
      animation.changeSlides();
    }, autoSlideDelay);
  },
  	  
  changeSlides: function(instant) {
    if (!instant) {
      animating = true;
      animation.manageControls();
      $slider.addClass("animating");
      $slider.css("top");
      $(".slide").removeClass("active");
      $(".slide-"+curSlide).addClass("active");
      setTimeout(function() {
        $slider.removeClass("animating");
        animating = false;
      }, animTime);
    }
    window.clearTimeout(autoSlideTimeout);
    $(".slider-pagi-elem").removeClass("active");
    $(".slider-pagi-elem-"+curSlide).addClass("active");
    $slider.css("transform", "translate3d("+ -curSlide*100 +"%,0,0)");
    $slideBGs.css("transform", "translate3d("+ curSlide*50 +"%,0,0)");
    diff = 0;
    animation.autoSlide();
  },

  navigateLeft: function() {
    if (animating) return;
    if (curSlide > 0) curSlide--;
    animation.changeSlides();
  },

  navigateRight: function() {
    if (animating) return;
    if (curSlide < numOfSlides) curSlide++;
    animation.changeSlides();
  }
};

var bindEvent = function() {
	$(".slider-control").on("click", function() {
    if ($(this).hasClass("left")) {
      animation.navigateLeft();
    } else {
      animation.navigateRight();
    }
  });
  
  $(".slider-pagi-elem").on("click", function() {
    curSlide = $(this).data("page");
    animation.changeSlides();
  });
};

var init = function() {
	animation.createBullets();
	animation.autoSlide();
	bindEvent();
};