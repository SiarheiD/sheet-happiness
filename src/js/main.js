
	var $tasks = $('.task:not(._ghost)');
	var $panel = $('.buttons-set');
	var todo = $('#todo');
	var done = $('#done');
	var agenda = $('#agenda');

/*============= VIEW =============*/
	var view = {
			ghost : {},
			showTask : function(task){
				$tasks.removeClass('_active');
				task.addClass('_active');
			},

			showPanel : function(){
				$panel.addClass('_show-all');
			},

			hideTask : function(task) {
				task.removeClass('_active');
			},

			hidePanel : function(){
				$panel.removeClass('_show-all');
			},

// sort
			taskSortBegin : function(task) {
				view.ghost = task.clone(task);
				view.ghost.addClass('_ghost');
				task.css({width: task.outerWidth()});
				view.ghost.css({top: task.position().top + 'px', left: task.position().left + 'px'})
				task.addClass('_sortable');
				task.after(view.ghost);
				console.log($tasks);
			},

			taskSort : function(task, deltaY) {
				view.ghost.css({transform: 'translateY(' + deltaY + 'px)'});
			},

			taskSortEnd : function(task){
				view.ghost.remove();
				task.removeClass('_sortable');
				view.ghost = {};
			},

			taskReplace : function(task, target){
				if (!target.is('._ghost')){
					var taskIndex = task.data('index');
					var targetIndex = target.data('index');
					console.log(taskIndex);
					if (taskIndex > targetIndex) {
						target.before(task);
						task.data('index', targetIndex);
						target.data('index', taskIndex);
					} else {
						target.after(task);
					};
					task.data('index', targetIndex);
					target.data('index', taskIndex);
				};
			},

// slide
			taskSlide : function(task, deltaX){
				if (Math.abs(deltaX) > task.outerWidth()/2){
					view.pushTask(task, deltaX);
				};
				task.css({transform: 'translateX(' + deltaX + 'px)'});
			},

			taskSlideEnd : function(task){
				task.css({transform: 'translateX(' + 0 + ')'});
			},

			pushTask : function(task, deltaX){
				$(window).trigger('mouseup');
					var taskParentBoard = task.closest('.board');
					if (deltaX < 0) {
						if (taskParentBoard.is('#agenda')) {
							todo.append(task);
						};
					} else {
						if (taskParentBoard.is('#todo')) {
							agenda.find('.agenda-sector--hot .agenda-sector__pull').append(task);
						}else if (taskParentBoard.is('#agenda')) {
							done.append(task);
						};
					};
			},
	};
/*=========== end VIEW ===========*/



/*============= MODEL =============*/
	var model = {


	};
/*=========== end MODEL ===========*/





/*============= CONTROLLER =============*/
	var controller = {

// tasks
	// click
		mouseClick : function(evt){
			evt.preventDefault();
			if (!$(this).hasClass('_active')) {
				view.showTask($(this));
				view.showPanel();
			} else {
				view.hideTask($(this));
				view.hidePanel();
			};
		},
	// sort
		taskSortBegin : function(evt, firstClick) {
			var task = $(this);
			view.taskSortBegin(task);

			$tasks.on('mouseenter', function(){
				view.taskReplace(task, $(this));
			});

		},

		taskSort : function(evt, deltaY) {
			var task = $(this);
			view.taskSort(task, deltaY);
		},

		taskSortEnd : function(){
			view.taskSortEnd($(this));
			$tasks.off('mouseenter');
		},
	// slide
		taskSlide : function(evt, deltaX){
			var task = $(this);
			view.taskSlide(task, deltaX);
		},
		taskSlideEnd : function(){
			view.taskSlideEnd($(this));
		},
	};
/*=========== end CONTROLLER ===========*/



// inintialize function

	(function(){

		var app = {

			init : function(){
				this.main();
				this.event();
			},

			main: function(){

			},

			event: function(){

				$tasks.on('taskclick', controller.mouseClick);
				$tasks.on('tasksortbegin', controller.taskSortBegin);
				$tasks.on('tasksort', controller.taskSort);
				$tasks.on('sortend', controller.taskSortEnd);
				$tasks.on('taskslide', controller.taskSlide);
				$tasks.on('slideend', controller.taskSlideEnd);


				$tasks.on('mousedown', function(evt){
					evt.preventDefault();
					var action = '';
					var moved = false; // флаг был ли двинут таск
					// тут может начинаться 4 совбытия
					// scroll slide click sort
					var task = $(this);
					var downOn = {
						x: evt.clientX,
						y: evt.clientY
					};

					var listenSort = setTimeout(function(){
						action = 'sort';
						moved = true;
						task.trigger('tasksortbegin');
					}, 500);


					$(window).on('mousemove', function(evt){
						evt.preventDefault();
						var moveOn = {
							x: evt.clientX,
							y: evt.clientY
						};

						var delta = {
							x: moveOn.x - downOn.x,
							y: moveOn.y - downOn.y
						};

						if (action == 'sort') {
							task.trigger('tasksort', delta.y);
						};

						if (action == 'slide') {
							task.trigger('taskslide', delta.x);
						};

						if (Math.abs(delta.x) > 5) {
							if (!action){
								action = 'slide';
								clearTimeout(listenSort);
								moved = true;
								console.log(action);
							};
						};

						if (Math.abs(delta.y) > 5) {
							if (!action){
								action = 'scroll';
								clearTimeout(listenSort);
								moved = true;
								console.log(action);
							};
						};
					});

					$(window).on('mouseup', function(evt){
						$(window).off('mousemove');

						if (action == 'sort'){
							task.trigger('sortend');
							action = '';
						};

						if (action == 'slide'){
							task.trigger('slideend');
							action = '';
						};

						if (!moved) {
							if (!action){
								clearTimeout(listenSort);
								action = 'click';
								task.trigger('taskclick');
							};
						};
					});

				});

			}

		};

		app.init();

	}());

