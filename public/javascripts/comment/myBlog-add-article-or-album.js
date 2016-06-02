$(function() {
	init();

	$.imageFileVisible({
		wrapSelector: ".showPicture",
		fileSelector: ".uploadPicture"
	});
});

var init = function() {
	bindEvent();
};

var handleEvent = {
	createRemoveBtn: function() {
		var input = document.createElement("input");
		$(input).attr("type", "button");
		$(input).attr("value", "remove");
		$(input).attr("class", "btn btn-primary removeBtn");

		$(input).on("click", function() {
			var removeTarget = $(this).parent();
			var index = $(".uploadPictureDiv").index(removeTarget);
			removeTarget.remove();
			$(".showPicture img")[index].remove();
		});

		return input;
	},

	createInput: function() {
		var input = document.createElement("input");
		$(input).attr("type", "file");
		$(input).attr("name", "uploadPicture");
		$(input).attr("accept", "image/*");
		$(input).attr("class", "file");
		$(input).attr("multiple", "multiple");

		$.imageFileVisible({
			wrapSelector: ".showPicture",
			fileSelector: input
		});

		return input;
	},

	appendChild: function() {
		var removeBtn = handleEvent.createRemoveBtn();
		var input = handleEvent.createInput();

		var parent = document.createElement("div");
		$(parent).attr("class", "uploadPictureDiv");

		$(parent).append(input);
		$(parent).append(removeBtn);

		return parent;
	},

	appendUploadDiv: function() {
		var child = handleEvent.appendChild();
		var $parent = $(".uploadPicture");
		$parent.append(child);
	},

	createImage: function() {
		var image = document.createElement("img");
		
		$(image).css("display", "block");
		return image;
	}
}; 

var bindEvent = function() {
	$(".init").on("click", function() {
		handleEvent.appendUploadDiv();
	});

	$(".goToArticle").on("click", function() {
		window.location.href = "../myBlog-article";
	});

	$(".goToAlbum").on("click", function() {
		window.location.href = "../myBlog-album";
	})
}

$.imageFileVisible = function(options) {     

	// 默认选项

	var defaults = {    

		//包裹图片的元素

		wrapSelector: null,    

		//<input type=file />元素

		fileSelector:  null ,

		errorMessage: "不是图片，请重新选择！"

	};    

	// Extend our default options with those provided.    

	var opts = $.extend(defaults, options);  

	var image = handleEvent.createImage();   

	$(opts.fileSelector).on("change",function(){

		var file = this.files[0];

		var imageType = /image.*/;

		if (file.type.match(imageType)) {

				var reader = new FileReader();

				reader.onload = function(){

					imageSrc = reader.result;

					var wrapSelector = $(opts.wrapSelector);


					$(image).attr("src", imageSrc);

					wrapSelector.append($(image));

					$(".imageSrc").val(imageSrc);
				}

				reader.readAsDataURL(file);

		}else{

			alert(opts.errorMessage);

		}

	});
}