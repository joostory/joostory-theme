(function($) {

	var $window, $spinner,
		$container, $pager,
		_currentPage, _noMore, _loadLock;

	var _loadList = function() {
		if (_noMore || _loadLock) {
			return;
		}

		_loadLock = true;

		$.ajax({
			url: _pathPrefix + "/page/" + (_currentPage + 1),
			method: "get"
		}).done(function(r) {
			var $result = $(r);
			var $contents = $result.find(".contents .post");

			if ($contents.length == 0) {
				_noMore = true;
				$pager.hide();
			} else {
				$container.append($contents);
				_currentPage++;
			}
			_loadLock = false;
		}).fail(function() {
			_noMore = true;
		});
	};

	var onScroll = function(e) {
		if (_noMore || !$pager.is(":visible")) {
			return;
		}

		var top = $pager.offset().top,
			appearTop = $window.scrollTop() + $window.height();

		if (appearTop + 400 > top) {
			_loadList();
		}
	};

	var _makePathPrefix = function() {
		var prefix = location.pathname.split("/page/")[0];
		return (prefix.length == 1)? "":prefix;
	};

	var TumblrEndlessScroll = {
		start: function(container, pager, currentPage) {
			$container = $(container);
			$pager = $(pager);
			_currentPage = currentPage;
			_noMore = false;
			_loadLock = false;
			_pathPrefix = _makePathPrefix();

			$window = $(window);
			$window.on("scroll", onScroll);
		}
	};

	$.tumblrEndlessScroll = function(container, pager, currentPage) {
		TumblrEndlessScroll.start(container, pager, currentPage);
	};

})(jQuery);
