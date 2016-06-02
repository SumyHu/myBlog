$(function() {
	$.imageFileVisible ({
		wrapSelector: ".logo", 
		fileSelector: ".uploadImage",
	});
});

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

	$(opts.fileSelector).on("change",function(){

		var file = this.files[0];

		var imageType = /image.*/;

		if (file.type.match(imageType)) {

				var reader = new FileReader();

				reader.onload = function(){

					imageSrc = reader.result;

					$(opts.wrapSelector).css("background", "url('" + imageSrc + "') no-repeat");
					$(opts.wrapSelector).css("background-size", "200px 200px");

					$(".imageSrc").val(imageSrc);
				}

				reader.readAsDataURL(file);

		}else{

			alert(opts.errorMessage);

		}

	});
}