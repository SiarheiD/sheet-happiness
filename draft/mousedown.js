		mouseDown : function(evt){
			evt.preventDefault();
			var task = $(this);
			var downOn = {
				x: evt.clientX,
				y: evt.clientY
			};
			var up = false;
			$(window).on('mousemove', function(evt){

				var moveOn = {
					x: evt.clientX,
					y: evt.clientY
				};

				var delta = {
					x: moveOn.x - downOn.x,
					y: moveOn.y - downOn.y
				};

				if (Math.abs(delta.x) > 5){
					task.css('transform', 'translateX(' + delta.x + 'px)');
					if (!up) {
						up = true;
						$(window).on('mouseup', function(){
							if (delta.x > task.outerWidth()/3) {
								console.log(task.closest('.board'))
								if (task.closest('.board').is('#main-board')){
									done.append(task);
								}else if (task.closest('.board').is('#backlog')){
									mainBoard.append(task);
								}
							} else if (delta.x < -task.outerWidth()/3) {
								console.log(task.closest('.board'))
								if (task.closest('.board').is('#main-board')){
									backlog.append(task);
								}else if (task.closest('.board').is('#done')){
									mainBoard.append(task);
								}
							}

							task.css('transform', 'translateX(' + 0 + 'px)');
							$(window).off('mousemove');
						});
					};
				};

			});
		},