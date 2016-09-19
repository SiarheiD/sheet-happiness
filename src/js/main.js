var ctrlDown;
var art = 'article[class*="sheet"]';
// for dragging
var prepToDrag = false;
var draggable;
var avatar;
var firstClick = new Object();
var firstPos = new Object();
//
var date = new Date();
	console.log(date.getFullYear());
	console.log(date.getMonth() );
	console.log(date.getDate());
var editForm = $('<article class="edit-form">' +
	'<div class="menu">'+
		'<ul>' +
			'<li class="close"><i class="fa fa-close"></i></li>' +
		'</ul>' +
	'</div>' +
	'<div class="select-box">' +
		'<input id="select-box_green" type="radio" name="select" value="_green" checked>' +
		'<input id="select-box_yellow" type="radio" name="select" value="_yellow">' +
		'<input id="select-box_red" type="radio" name="select" value="_red">' +
		'<ul>' +
			'<li><label for="select-box_green"></label></li>' +
			'<li><label for="select-box_yellow"></label></li>' +
			'<li><label for="select-box_red"></label></li>' +
		'</ul>' +
	'</div>' +
		'<h1 class="title"><input type="text" placeholder="Title"></h1>' +
		'<textarea name="" rows="10" placeholder="Content..."></textarea>' +
		'<p class="deadline"><input type="date" value="' + dateToString(date) +'" min="' + dateToString(date) +'"></p>' +
		'<div class="save"><i class="fa fa-check"></i></div>' +
	'</article>');
var newArt = $('<article class="iteration__column__sheet _new"  data-id="-1"><div class="menu"><ul><li class="edit"><i class="fa fa-pencil"></i></li><li class="description"><i class="fa fa-eye"></i></li><li class="to-done"><i class="fa fa-check"></i></li><li class="delete"><i class="fa fa-close"></i></li></ul></div><h1 class="title"></h1><p class="content"></p><p class="deadline"></p><div class="ribbon-wrapper"><div class="corner-ribbon" data-color=""></div></div></article>');
$(document).on('keydown keyup', function(e){
	keyState(e.keyCode, e.type);
});
function keyState(kCode, eType){
	var val;
	val = (eType == 'keydown')? true : false;

	switch (kCode){
		case 17:
			ctrlDown = val;
	}
}
//*** BOARD ***\\
var fieldTimer;
$('.side-button').on('click', function() {
	$(this).parent().toggleClass('active');
});
$('div[class*="field"]').on('mouseenter', function(){
	var toggElem = $(this).parent();
	fieldTimer = setTimeout(function(){
		if (!toggElem.hasClass('active')) {
			toggElem.addClass('active');
		};
	}, 800);
});

$('div[class*="field"]').on('mouseleave', function(){
	clearTimeout(fieldTimer);
});

$(document).on('click', 'article[class*="sheet"]',function(e){
	var target = $(e.target);
	if (target.is(art + '> h1')){
		target = target.parent(art)
	}
	if (target.is(art)){
		if (!ctrlDown) {
			if (target.hasClass('active')){
				target.removeClass('active');
			}else{
				$('article[class*="sheet"]').removeClass('active');
				target.toggleClass('active');
			}
		}else{
			target.toggleClass('active');
		}
	}
});

$(document).on('click', function(e){
	console.log();
	if ($(e.target).is('.iteration') || $(e.target).is('.iteration__column') || $(e.target).is('main')){
		$(art).filter('.active').removeClass('active');
		$('.recycle').filter('.active').removeClass('active');
	}
});
$('.main-panel__recycle').on('click', function(){
	$('.recycle').toggleClass('active');
});
$(document).on('click', '.edit-form .select-box ul',function(){
	$(this).toggleClass('active');
});
$(document).on('click', '.edit-form ul li.close',function(){
	console.log($(this))
	actionButt($(this));
});
$('.recycle').on('click', function(e){
	if ($(e.target).is('.recycle')){
		$(this).removeClass('active'); //close recycle after click on empty space
	}
})
// delete (move to recycle)
$(document).on('click', art + ' li', function(){
	console.log($(this))
	actionButt($(this));
})
$('.recycle-field__panel li').on('click', function(){
	console.log($(this))
	actionButt($(this));
});
$('.main-panel div').on('click', function(){
	console.log($(this))
	actionButt($(this));
});
$(document).on('click', '.edit-form .save', function(){
	actionButt($(this));
});
//********DRAGGING**********\\

$(document).on('mousedown', art ,function(e){
	var target = $(e.target);
	if (target.is(art + '> h1')){
		target = target.parent(art)
	}
	if (target.is(art)){
		e.preventDefault();
		prepToDrag = true;
		firstClick.x = e.pageX;
		firstClick.y =e.pageY;
		firstPos.left = target.offset().left;
		firstPos.top = target.offset().top;
	}
});
$(document).on('mouseup', function(e){
	prepToDrag = false;
	if(avatar){
		dragStop();
	}
});
$(document).on('mousemove', function(e){
	var target = $(e.target);
	var placeBefore;
	if (target.parent().is(art)){
		target = target.parent(art)
	}

	if(avatar){
		dragging(e);
		if(target.is('._article-box')){
			if(!target.children().is(draggable)){
				draggable.appendTo(target);
			}
		}else if(target.is(art)){
			placeBefore = (e.pageY - target.offset().top)/parseInt(target.css('height')) < .5;
			if (placeBefore){
				draggable.insertBefore(target);
			}else{
				draggable.insertAfter(target);
			}
		}
	}
	if (target.is(art)){
		if (prepToDrag){
			dragStart(target);
			prepToDrag = false;
		}
	}
});


function dragStart(tar){
	if (!avatar){
		draggable = tar;
		// draggable.removeClass('active');
		avatar = draggable.clone();
		avatar.addClass('draggable');
		avatar.css({width: draggable.css('width')});
		avatar.css({left: firstPos.left - draggable.parent().offset().left, top: firstPos.top - draggable.parent().offset().top});
		draggable.addClass('ghost');
		avatar.insertAfter(draggable);

		console.log(draggable.index());
		console.log(avatar.parent().children(':not(.ghost)').index(avatar));
	}
}
function dragging(evt){
	var dx = (evt.pageX - firstClick.x) + firstPos.left - avatar.parent().offset().left;
	var dy = (evt.pageY - firstClick.y) + firstPos.top - avatar.parent().offset().top;
	avatar.css({left: dx, top: dy});
}
function dragStop(){
	var id = draggable.data('id');
	var oldIndex = avatar.parent().children(':not(.ghost)').index(avatar); // не avatar.index() чтобы не париться с гостом, есть его нету, появился до после
	var oldPlace = avatar.parents('._article-box').data('place');
	var newIndex = draggable.parent().children(':not(.draggable)').index(draggable); //класс draggable имеет отношение только к аватару, к одноименному элементу отношения не имеет
	var newPlace = draggable.parents('._article-box').data('place');
	ajaxMoveArt(id, oldPlace, oldIndex, newPlace, newIndex);
	avatar.remove();
	draggable.removeClass('ghost');
	avatar = undefined;
}

//art action buttons

function actionButt(elem){
	if (elem.hasClass('edit') && !$('.edit-form').is('.edit-form')){
		editArt(elem);
	}else
	if (elem.hasClass('description')){
		elem.toggleClass('color-yellow');
		elem.parents(art).children('.content').toggleClass('display-block');
	}else
	if (elem.hasClass('to-done')&& !$('.edit-form').is('.edit-form')){
		doneArt(elem);
	}else
	if (elem.hasClass('delete') && !$('.edit-form').is('.edit-form')){
		console.log('delete');
		deleteArt(elem);
	}else
// recycle
	if (elem.hasClass('close')){
		if (elem.parents('.edit-form').is('.edit-form')){
			endEditArt(false);
		}else
		if (elem.parents('.active').is('.active')){
			elem.parents('.active').removeClass('active');
		}
	}else
	if (elem.hasClass('clear')){
		deleteArt('*');
		elem.parents('._article-box').children(art).remove();
	}else
//panel
	if (elem.hasClass('main-panel__create') && !$('.edit-form').is('.edit-form')){
		editArt();
	}else
//edit
	if (elem.hasClass('save')){
		endEditArt(true);
	}
}
function deleteArt(elem){
	if (elem == '*'){
		ajaxRemoveArt('*');
		return;
	}
	var article = elem.parents(art);
	var id = article.data('id');
	var place = article.parents('._article-box').data('place');
	var index = article.index();
	if(!article.parents('.recycle-field').is('.recycle-field')){
		article.appendTo($('.recycle-field'));
		ajaxMoveArt(id, place, index, $('.recycle-field').data('place'), article.index() - 1);
	}else{
		console.log("params " + id + " " + place + " " + index)
		ajaxRemoveArt(id, place, index);
		article.remove();
	}
}
function doneArt(elem){
	var article = elem.parents(art);
	var id = article.data('id');
	var place = article.parents('._article-box').data('place');
	var index = article.index();
	article.appendTo('.done__field');
	ajaxMoveArt(id, place, index, $('.done__field').data('place'), article.index());
}


function editArt(elem){
	var article;
	var createdArt;
	var title;
	var content;
	var deadline;
	var date;
	if (elem){
		article = elem.parents(art).is(art) ? elem.parents(art) : elem;
		article.addClass('art-edit');
		article.after(editForm);
		title = article.children('.title').text();
		content = article.children('.content').text();
		deadline = article.children('.deadline').text();
		if (content == '...') {
			content = '';
		}
		$('.edit-form h1 input').val(title);
		$('.edit-form textarea').val(content);
		$('.edit-form .deadline input').val(deadline);


		$('.edit-form ul li label[for="select-box_yellow"]').trigger('click mousedown');
	}else{
		createdArt = newArt.clone();
		if ($('.back-log').hasClass('active')){
			createdArt.appendTo($('.back-log__field')).addClass('art-edit');
		}else
		if ($(art).filter('.active').is('.active') &&
			 !$(art).filter('.active').parents('.recycle').is('.recycle') &&
			 !$(art).filter('.active').parents('.done').is('.done')){
			createdArt.insertAfter($(art).filter('.active')).addClass('art-edit');
		}else{
			createdArt.appendTo($('.iteration__column:nth-child(3)')).addClass('art-edit');
		}
		editArt(createdArt);
	}
}


function endEditArt(cond){
	var article = $(art).filter('.art-edit');
	var edit = $('.edit-form');
	var title;
	var content;
	var deadline;
	var ribbonColor;
	var place;
	var index;
	var id; //для передачи ид реадктируемого элемента или Undefined, если он новый
	if (cond){
		title = edit.children('h1').children('input').val();
		content = edit.children('textarea').val();
		deadline = edit.children('.deadline').children('input').val();
		ribbonColor = edit.children('.select-box').children('input:checked').val();
		place = edit.parents('._article-box').data('place');
		index = edit.index() - 1; //тк это индекс формы, а будущий элемент чуть впереди	

		if (!article.hasClass('_new')){
			id = article.data('id');
		}
		if (!title) {
			title = 'Task №' + ($(art).length - 1);
		}
		if (!content) {
			content = '...';
		}
		if (!deadline){
			date = new Date();
			deadline = dateToString(date, 7);
		}
		article.children('.title').text(title);
		article.children('.content').text(content);
		article.children('.deadline').text(deadline);
		article.find('.corner-ribbon').removeClass('_green _yellow _red').addClass(ribbonColor).data('color', ribbonColor);
		ajaxNewArt(title, content, deadline, ribbonColor, place, index, id); //ajax create on server
	}else{
		article.filter('._new').remove();
	}
	edit.remove();
	article.removeClass('art-edit');
}


function dateToString(d, offset) {
	if (offset) {
		d.setDate(d.getDate() + offset);
	}
	return d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
}
//create and edit art on the serv
function ajaxNewArt (title, content, deadline, ribbonColor, place, index, id){
	var imp;
	switch (ribbonColor){
		case '_green':
			imp = 0;
			break;
		case '_yellow':
			imp = 1;
			break;
		case '_red':
			imp = 2;
			break;
	}
	$.ajax({
		type: "POST",
		url: '/ajax/new_art.php',
		data: {
			'title': title,
			'content': content,
			'deadline': deadline,
			'importance': imp,
			'place': place,
			'index': index,
			'new': id,
		},
		success: function(d){
			$(art).filter('._new').attr('data-id', d + '').removeClass('_new');
		},
	});
}

function ajaxRemoveArt (id, place,index){
	if (id == '*'){
		$.ajax({
			type: "POST",
			url: '/ajax/remove_art.php',
			data: {
				'id': id,
			},
			success: function(data){
				console.log(data);
			},
		});
		return;
	}
	$.ajax({
		type: "POST",
		url: '/ajax/remove_art.php',
		data: {
			'id': id,
			'place': place,
			'index': index,
		},
		success: function(data){
			console.log(data);
		},
	});
}
function ajaxMoveArt(id, oldPlace, oldIndex, newPlace, newIndex){
	console.log(arguments);
		$.ajax({
		type: "POST",
		url: '/ajax/move_art.php',
		data: {
			'id': id,
			'old_place': oldPlace,
			'old_index': oldIndex,
			'new_place': newPlace,
			'new_index': newIndex,
		},
		success: function(d){
			console.log('success');
			console.log(d)
		},
	});
}