
	var $tasks = $('.task');
	var $panel = $('.buttons-set');
	var backlog = $('#backlog');
	var done = $('#done');
	var mainBoard = $('#main-board');

/*============= VIEW =============*/
	var view = {

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

	};
/*=========== end VIEW ===========*/



/*============= MODEL =============*/
	var model = {
		temp: {},

		taskActionBegin : function(x, y, jqElem){
			model.temp.down = {x: x, y: y};
			model.temp.jqElem = jqElem;
		},

		taskAction : function(){

		},

	};
/*=========== end MODEL ===========*/





/*============= CONTROLLER =============*/
	var controller = {

// tasks
		mouseClick : function(evt){
			evt.preventDefault();
			console.log($(this))
			if (!$(this).hasClass('_active')) {
				view.showTask($(this));
				view.showPanel();
			} else {
				view.hideTask($(this));
				view.hidePanel();
			};
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



				$tasks.on('mousedown', function(evt){
					evt.preventDefault();
					var action;
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
						console.log(action);
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

