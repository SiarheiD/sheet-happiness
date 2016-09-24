(function($){
	var $mainContainer = $('#main-container');
	var tasks = '.task:not(._ghost)';
	var panel = '.buttons-set';
	var todo = '#todo';
	var done = '#done';
	var agenda = '#agenda';
	var create = '.buttons-set__button--add';
	var editTask = '.buttons-set__button--edit';
	var tabChecked = 'input[name="board"]:checked';
	var endEdit = '.endEdit';
	var remove = '.buttons-set__button--delete';

/*============= VIEW =============*/
	var view = {
			ghost : {},
			showTask : function(task){
				$(tasks).removeClass('_active');
				task.addClass('_active');
			},

			showPanel : function(){
				$(panel).addClass('_show-all');
			},

			hideTask : function(task) {
				task.removeClass('_active');
			},

			hidePanel : function(){
				$(panel).removeClass('_show-all');
			},

// sort
			taskSortBegin : function(task) {
				view.ghost = task.clone(task);
				view.ghost.addClass('_ghost');
				view.ghost.css({width: task.outerWidth()});
				view.ghost.css({top: task.position().top + 'px', left: task.position().left + 'px'})
				task.addClass('_sortable');
				task.data('oldIndex', task.data('index'));
				task.after(view.ghost);
			},

			taskSort : function(task, deltaY) {
				view.ghost.css({transform: 'translateY(' + deltaY + 'px)'});
			},

			taskSortEnd : function(task){
				var activeBoard = $(task).closest('.board');
				view.ghost.remove();
				task.removeClass('_sortable');
				view.ghost = {};
				model.updateIndexes(activeBoard);
				var id = task.data('id');
				var oldPlace = activeBoard.attr('id');
				var newPlace = activeBoard.attr('id');
				var oldIndex = parseInt(task.data('oldIndex'));
				var newIndex = parseInt(task.data('index'));
					if (oldPlace &&  newPlace && (newIndex || newIndex === 0) && (oldIndex || oldIndex === 0)) {
						$(document).trigger('taskslideup', {id: id, oldPlace: oldPlace, oldIndex: oldIndex, newPlace: newPlace, newIndex: newIndex})
					}
			},

			taskReplace : function(task, target){
				if (!target.is('._ghost')){
					var taskIndex = task.data('index');
					var targetIndex = target.data('index');
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
				$(document).trigger('mouseup');
					var taskParentBoard = task.closest('.board');
							var id = task.data('id');
							var oldPlace;
							var newPlace;
							var oldIndex;
							var new_index;
					if (deltaX < 0) {
						if (taskParentBoard.is('#agenda')) {
							oldPlace = 'agenda';
							newPlace = 'todo';
							oldIndex = task.data('index');
							newIndex = parseInt($(todo).children(tasks).length) || 0;
							$(todo).append(task);
							model.updateIndexes($(agenda));
						};
					} else {
						if (taskParentBoard.is('#todo')) {
							oldPlace = 'todo';
							newPlace = 'agenda';
							oldIndex = parseInt(task.data('index'));
							newIndex = parseInt($(agenda).children(tasks).length) || 0;
							$(agenda).append(task);
							model.updateIndexes($(todo));
						}else if (taskParentBoard.is('#agenda')) {
							oldPlace = 'agenda';
							newPlace = 'done';
							oldIndex = task.data('index');
							newIndex = parseInt($(done).children(tasks).length) || 0;
							$(done).append(task);
							model.updateIndexes($(agenda));
						};
					};
					if (oldPlace &&  newPlace && (newIndex || newIndex === 0) && (oldIndex || oldIndex === 0)) {
						$(document).trigger('taskslideup', {id: id, oldPlace: oldPlace, oldIndex: oldIndex, newPlace: newPlace, newIndex: newIndex})
					}
			},


			newArtConstructor : function(id, content, index, place){
				var newArt = $('<article class="task task--main-section">'+
																'<div class="task__description container">'+
																		'<p>' + content + '</p>'+
																	'</div>'+
														'</article>');
				newArt.data({id:id, index:index, place: place, content});
				return newArt;
			},

			parseBoardData : function(html, data){

						$mainContainer.html(html);
						for (var i = 0; i < data.length; i++) {
							var content = data[i]['content'];
							var id = data[i]['id'];
							var imp = data[i]['importance'];
							var index = data[i]['index'];
							var place = data[i]['place'];

							var newArt = view.newArtConstructor(id, content, index, place);
							var parent;
							switch(place) {
								case 'agenda':
									parent = $(agenda);
									break;
								case 'todo':
									parent = $(todo);
									break;
								case 'done':
									parent = $(done);
									break;
							};
							parent.append(newArt);
						};
			},

// tasks actions

		getTaskForm: function(content){
			content = content || '';
			var form = $('<div class="newArtForm art-form">'+
										'<textarea name="content">' + content + '</textarea>' +
										'<button class="endEdit art-form__button">ok</button>' +
									'</div>');
			return form;
		},

		getTaskId : function(){
			var maxId = 0;
			$(tasks).each(function(){
				var currId = parseInt($(this).data('id'));
				if (currId > maxId) {
					maxId = currId;
				};
			});
			return maxId + 1;
		},

		createTask : function(){
			var place = $(tabChecked).attr('id').split('-')[0];
			var activeBoard = $('#'+ place);
			var id = view.getTaskId();
			var content;
			var index = parseInt(activeBoard.children(tasks).length) || 0;

			var newTask;
			var form = view.getTaskForm();
			activeBoard.append(form);

			form.children('.endEdit').on('click', function(){
				content = form.children('textarea').val();
				newTask = view.newArtConstructor(id, content, index, place);
				form.remove();
				activeBoard.append(newTask);
				form.children('.endEdit').off('click');
				model.updateIndexes(activeBoard);
				$(document).trigger('taskadded', newTask);
			});
		},

		editTask: function(task){
			var id = task.data('id');
			var content = task.find('p').text();
			var form = view.getTaskForm(content);
			task.addClass('_task-edit');
			task.after(form);

			form.children('.endEdit').on('click', function(){
				content = form.children('textarea').val();
				task.find('p').text(content);
				form.remove();
				task.removeClass('_task-edit');
				form.children('.endEdit').off('click');
				var id = task.data('id');
				$(document).trigger('taskeditioncomplete', {id: id, content: content})
			});
		},

		removeTask : function(task){
			var activeBoard = $(task).closest('.board');
			task.remove();
			model.updateIndexes(activeBoard);
		}


	};
/*=========== end VIEW ===========*/



/*============= MODEL =============*/
	var model = {
		userName : '',

		updateIndexes : function(board){
			var i = 0;
			board.children(tasks).each(function(){
				$(this).data('index', i);
				i++;
			});
		},

		ajaxRemoveTask: function(task){
			var id = task.data('id');
			var content = task.data('content');
			var index = task.data('index');
			var place = task.data('place');
			console.log(id + ' | ' + place + ' | ' + index + ' | ' + content)
			$.ajax({
				type: "POST",
				url: 'php/remove_art.php',
				data: {
					'id': id,
					'place': place,
					'index': index,
					'user' : model.userName,
				},
			});

		},

		ajaxAddTask: function(task){
			var id = $(task).data('id');
			var content = $(task).data('content');
			var index = $(task).data('index');
			var place = $(task).data('place');


			$.ajax({
				type: "POST",
				url: 'php/new_art.php',
				data: {
					'id': id,
					'content': content,
					'place': place,
					'index': index,
					'user' : model.userName,
				},
			});
		},

		ajaxLoadBoard: function(data){
				$.ajax({
					url: "board.html",
					cache: false,
					success: function(html){
						view.parseBoardData(html, data)
					},
				});
		},

		ajaxSlideTask : function(data){

			$.ajax({
				type: "POST",
				url: 'php/slide_art.php',
				data: {
					'id': data.id,
					'old_place': data.oldPlace,
					'old_index': data.oldIndex,
					'new_place': data.newPlace,
					'new_index' : data.newIndex,
					'user' : model.userName,
				},
			});
		},

		ajaxEditTask : function(data) {
		$.ajax({
				type: "POST",
				url: 'php/edit_art.php',
				data: {
					'id': data.id,
					'content': data.content,
					'user' : model.userName,
				},
			});
		},
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

			$(tasks).on('mouseenter touchenter', function(){
				// $(this).css('background-color', 'red')
				view.taskReplace(task, $(this));
			});

		},

		taskSort : function(evt, deltaY) {
			var task = $(this);
			view.taskSort(task, deltaY);
		},

		taskSortEnd : function(){
			view.taskSortEnd($(this));
			$(tasks).off('mouseenter');
		},
	// slide
		taskSlide : function(evt, deltaX){
			var task = $(this);
			view.taskSlide(task, deltaX);
		},
		taskSlideEnd : function(){
			view.taskSlideEnd($(this));
		},

		// board data is ready
		boardDataIsReady : function(evt, data){
			model.ajaxLoadBoard(data.data);
		},

		// ACTIONS
		createTask : function(){
			view.createTask()
		},

		editTask : function(){
			var task = $(tasks+'._active');
			view.editTask(task)
		},

		removeTask : function(){
			var task = $(tasks+'._active');
			model.ajaxRemoveTask(task);
			view.removeTask(task);
		},

// DB
		addTaskDB : function(evt, task){
			model.ajaxAddTask(task);
		},

		taskSlideUp : function(evt, data){
			model.ajaxSlideTask(data);
		},

		taskEdComplete : function(evt, data) {
			model.ajaxEditTask(data);
		}
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
				var checkUserName = function(name){
					var userName = name.val();
					if (userName.length < 3) {
						return false;
					} else {
						return userName;
					}
				};

				var checkUserPass = function(pass) {
					var userPass = pass.val();
					if (userPass.length < 3) {
						return false;
					} else {
						return userPass;
					}
				};

				var regFormAddErrMsg = function(regForm){
					regForm.find('.errMsg').removeClass('_hidden');
					regForm.find('input').on('focus', function(){
						regForm.find('.errMsg').addClass('_hidden');
					});
				};


				function setCookie(name, value, options) {
				  options = options || {};
				  var expires = options.expires || 1000;
				  if (typeof expires == "number" && expires) {
				    var d = new Date();
				    d.setTime(d.getTime() + expires * 1000 * 60 * 60);
				    expires = options.expires = d;
				  }
				  if (expires && expires.toUTCString) {
				    options.expires = expires.toUTCString();
				  }

				  value = encodeURIComponent(value);

				  var updatedCookie = name + "=" + value;

				  for (var propName in options) {
				    updatedCookie += "; " + propName;
				    var propValue = options[propName];
				    if (propValue !== true) {
				      updatedCookie += "=" + propValue;
				    }
				  }
				  document.cookie = updatedCookie;
				};

				function getCookie(name) {
				  var matches = document.cookie.match(new RegExp(
				    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
				  ));
				  return matches ? decodeURIComponent(matches[1]) : undefined;
				};

				var tryToReg = function(userName, userPass, action){
							if(userName && userPass){
								$.ajax({
										type: "POST",
										url: 'php/registration.php',
										data: {
											'login': userName,
											'password': userPass,
											'action': action,
										},
										success: function(answer){
											model.userName = userName;
											setCookie('sh_user_name', userName);
											setCookie('sh_user_pass', userPass);
											if (answer) {
												var data = JSON.parse(answer);
												$(document).trigger('boarddataisready', {data: data});
											};
										},
									});
							} else {
								regFormAddErrMsg($regForm);
							};
				};

				var loadWelcome = function(){
					$.ajax({
						url: "welcome.html",
						cache: false,
						success: function(html){
							$mainContainer.html(html);
							$regForm = $('.registrationForm');
							$regForm.find('button').on('click', function(){
								var action = $(this).attr('name');
								var userName = checkUserName($regForm.find('input[name="userName"]'));
								var userPass = checkUserPass($regForm.find('input[name="userPass"]'));
								tryToReg(userName, userPass, action);
							});
						},
					});
				};

				var userName = getCookie('sh_user_name');
				var userPass = getCookie('sh_user_pass');
				console.log(userName, userPass)
				if (userName && userPass) {
					tryToReg(userName, userPass, 'login');
				} else {

					loadWelcome();
				}
			},

			event: function(){

				$(document).on('taskclick', tasks, controller.mouseClick);
				$(document).on('tasksortbegin', tasks, controller.taskSortBegin);
				$(document).on('tasksort', tasks, controller.taskSort);
				$(document).on('sortend',  tasks, controller.taskSortEnd);
				$(document).on('taskslide', tasks, controller.taskSlide);
				$(document).on('slideend', tasks, controller.taskSlideEnd);

				$(document).on('click', create, controller.createTask);
				$(document).on('click', editTask, controller.editTask);
				$(document).on('click', remove, controller.removeTask);

				$(document).on('taskadded', controller.addTaskDB);
				$(document).on('boarddataisready', controller.boardDataIsReady);
				$(document).on('taskslideup', controller.taskSlideUp);
				$(document).on('taskeditioncomplete', controller.taskEdComplete);

				$(document).on('mousedown touchstart', tasks, function(evt){
							evt.preventDefault();
							evt.originalEvent.preventDefault();
						var action = '';
						var moved = false; // флаг был ли двинут таск
						// тут может начинаться 4 совбытия
						// scroll slide click sort
						var task = $(this);
						var moveX, moveY;
						var downOn = {};

						if(evt.originalEvent.touches){
							downOn = {
								x: evt.originalEvent.touches[0].clientX,
								y: evt.originalEvent.touches[0].clientY
							};
							moveX = function(evt) {
								return evt.originalEvent.changedTouches[0].clientX;
							}
							moveY = function(evt) {
								return evt.originalEvent.changedTouches[0].clientY;
							}
						} else
						if (evt.clientX) {
							downOn = {
								x: evt.clientX,
								y: evt.clientY
							};
							moveX = function(evt) {
								return evt.clientX;
							};
							moveY = function(evt) {
								return evt.clientY
							};
						} ;



						var listenSort = setTimeout(function(){
							action = 'sort';
							moved = true;
							evt.preventDefault();
							evt.originalEvent.preventDefault();
							task.trigger('tasksortbegin');
						}, 500);


						$(document).on('mousemove touchmove', function(evt){
							evt.preventDefault();
							evt.originalEvent.preventDefault();


							var moveOn = {
								x: moveX(evt),
								y: moveY(evt)
							};

							var delta = {
								x: moveOn.x - downOn.x,
								y: moveOn.y - downOn.y
							};

							if (action == 'sort') {
								evt.preventDefault();
								evt.originalEvent.preventDefault();
								task.trigger('tasksort', delta.y);
							};

							if (action == 'slide') {
								evt.preventDefault();
								evt.originalEvent.preventDefault();

								task.trigger('taskslide', delta.x);
							};

							if (Math.abs(delta.x) > 5) {
								if (!action){
									evt.preventDefault();
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

						$(document).on('mouseup touchend', function(evt){
							$(document).off('mousemove');
							$(document).off('touchmove');

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
					// }
				});

			},

		};

		app.init();

	}());

}(jQuery));