$(function() {
	var $alert = $(".alert");
	var $content = $(".content");

	$.each($content, function(index, target) {
		if ($(target).text() === "") {
			$(target).parent("div").css("display", "none");
		}
		else {
			$(target).parent("div").css("display", "block");
		}
	})

	$(".close").on("click", function() {
		$(this).parent("div").css("display", "none");
		$(this).find(".content").text("");
	});

	$(".register").on("click", function() {
		window.location.href = "../myBlog-register";
	});

	$(".goToLogin").on("click", function() {
		window.location.href = "../myBlog-login";
	});

	$(".goToIndex").on("click", function() {
		window.location.href = "../myBlog-index";
	});

	$(".goToUploadImage").on("click", function() {
		window.location.href = "../myBlog-upload-image";
	});

	$(".goToChangePassword").on("click", function() {
		window.location.href = "../myBlog-change-password";
	});
});