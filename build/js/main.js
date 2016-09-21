(function($){

	var activateTask = function(evt){
		evt.preventDefault();

		$(this).toggleClass('_active');
		$('.buttons-set').toggleClass('_show-all')

	};

	$('.task').on('click', activateTask);

}(jQuery));