(function($) {
	$.fn.gyroOn = function(_options) {
		return this.each(function() {
			var $window = $(window);
			var $element = null;
			var options = {};
			var invertAxes = false;
			var parallaxDelta = 0;
			var invertAxes = window.orientation ? true : false;

			function moveElement(top, left) {
				$element.css({
					top: top,
					left: left
				});
			}

			function moveElementGyro(e) {
				if (!e || !e.originalEvent || !e.originalEvent.rotationRate) {
					$(window).unbind('devicemotion', moveElementGyro);
					return;
				}

				var rotL = (e.originalEvent.rotationRate.beta);
				var rotT = (e.originalEvent.rotationRate.alpha);

				console.log(invertAxes ? 'yes' : 'no');
				if (invertAxes) {
					var tmp = rotL;
					rotL = rotT;
					rotT = tmp;
				}

				var top = (rotT * parallaxDelta);
				var left = -(rotL * 2 * parallaxDelta);
				moveElement(top, left);
			}

			function moveElementMouse(e) {
				var center = {
					top: $window.height() >> 1,
					left: $window.width() >> 1
				}

				var top = (e.clientY - center.top) * options.distance / $window.height();
				var left = (e.clientX - center.left) * options.distance / $window.width();

				moveElement(top, left);
			}

			$element = $(this);

			options = $.extend({
				distance: 50,
				speed: 1000,
				direction: 'both',
				position: 'relative',
				top: 0,
				left: 0,
				mouse: true
	        }, _options );

	        parallaxDelta = options.distance * (navigator.userAgent.match(/(iPod|iPhone|iPad)/i) ? 0.1 : 2);

	        if ('fixed' !== options.position && 'absolute' !== options.position) {
	        	options.position = 'relative';
	        }

	        $element.css({
	        	'position': options.position,
	        	'top': options.top,
	        	'left': options.left,
	        	'transition-property': 'top, left',
	        	'transition-duration': options.speed + 'ms',
	        	'transition-delay': 0
	        });

	        $window.on('devicemotion', moveElementGyro);
	        if (true === options.mouse) {
	        	$window.on('mousemove', moveElementMouse);
	        }
	        $window.on('orientationchange', function(e) {
	        	invertAxes = window.orientation ? true : false;
	        });
		});
	}
})(jQuery);
