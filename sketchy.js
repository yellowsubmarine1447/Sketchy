let ERASER_WIDTH = 75;
let ERASER_HEIGHT = 50;
let RECTANGLE_WIDTH = 75;
let RECTANGLE_HEIGHT = 50;

let previewCanvas = document.getElementById("preview");
let previewCtx = previewCanvas.getContext("2d");
let previewTop = previewCanvas.getBoundingClientRect().top;
let previewLeft = previewCanvas.getBoundingClientRect().left;
previewCanvas.width = window.innerWidth;
previewCanvas.height = window.innerHeight;

let boardCanvas = document.getElementById("board");
let boardCtx = boardCanvas.getContext("2d");
let boardTop = boardCanvas.getBoundingClientRect().top;
let boardLeft = boardCanvas.getBoundingClientRect().left;
boardCanvas.width = window.innerWidth;
boardCanvas.height = window.innerHeight;

function updateOldCoords(e) {
	window.oldX = e.pageX;
	window.oldY = e.pageY;
}

function setupEraser() {
	erase = false;
	previewCtx.clearRect(0, 0, previewCtx.width, previewCtx.height);
	previewCtx.strokeRect(window.oldX-previewLeft, window.oldY-previewTop, ERASER_WIDTH, ERASER_HEIGHT);
	document.onmousedown = function () {
		erase = true;
		boardCtx.clearRect(window.oldX-1-boardLeft, window.oldY-1-boardTop, ERASER_WIDTH+2, ERASER_HEIGHT+2);
	}
	document.onmouseup = function() {
		erase = false;
	}
	document.onmousemove = function(e) {
		previewCtx.clearRect(window.oldX-1-previewLeft, window.oldY-1-previewTop, ERASER_WIDTH+2, ERASER_HEIGHT+2);
		previewCtx.strokeRect(e.pageX-previewLeft, e.pageY-previewTop, ERASER_WIDTH, ERASER_HEIGHT);
		if (erase) {
			boardCtx.clearRect(window.oldX-1-boardLeft, window.oldY-1-boardTop, ERASER_WIDTH+2, ERASER_HEIGHT+2);
		}
		updateOldCoords(e);
	}
}

function setupRectangle() {
	previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
	previewCtx.strokeRect(window.oldX-previewLeft, window.oldY-previewTop, ERASER_WIDTH, ERASER_HEIGHT);
	document.onmousedown = function() {
		boardCtx.strokeRect(window.oldX-boardLeft, window.oldY-boardTop, RECTANGLE_WIDTH, RECTANGLE_HEIGHT);
	}
	document.onmouseup = ()=>{};
	document.onmousemove = function(e) {
		previewCtx.clearRect(window.oldX-1-previewLeft, window.oldY-1-previewTop, ERASER_WIDTH+2, ERASER_HEIGHT+2);
		previewCtx.strokeRect(e.pageX-previewLeft, e.pageY-previewTop, ERASER_WIDTH, ERASER_HEIGHT);
		updateOldCoords(e);
	}
}

function setupDraw() {
	let draw = false;
	previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
	document.onmousedown = function() {
		draw = true;
	}
	document.onmouseup = function() {
		draw = false;
	}
	document.onmousemove = function(e) {
		if (draw) {
			boardCtx.beginPath();
			boardCtx.moveTo(window.oldX-boardLeft, window.oldY-boardTop);
			boardCtx.lineTo(e.pageX-boardLeft, e.pageY-boardTop);
			boardCtx.stroke();
		}
		updateOldCoords(e);
	}
}

function setupLine() {
	let previewLine = false;
	let firstX, firstY;
	previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
	document.onmousedown = function(e) {
		if (previewLine) {
			previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
			boardCtx.beginPath();
			boardCtx.moveTo(firstX-boardLeft, firstY-boardTop);
			boardCtx.lineTo(e.pageX-boardLeft, e.pageY-boardTop);
			boardCtx.stroke();
			previewLine = false;
		} else {
			previewLine = true;
			firstX = e.pageX;
			firstY = e.pageY;
		}
	}
	document.onmouseup = ()=>{};
	document.onmousemove = function(e) {
		if (previewLine) {
			previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
			previewCtx.beginPath();
			previewCtx.moveTo(firstX-boardLeft, firstY-boardTop);
			previewCtx.lineTo(e.pageX-boardLeft, e.pageY-boardTop);
			previewCtx.stroke();
		}
		updateOldCoords(e);
	}
}

function setupDefault() {
	previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
	document.onmousedown = ()=>{};
	document.onmouseup = ()=>{};
	document.onmousemove = function(e) {
		updateOldCoords(e);
	}
}

setupDefault();

document.onkeydown = function(e) {
	e = e || window.event;
	switch (e.key) {
		case 'e': setupEraser(); break;
		case 'r': setupRectangle(); break;
		case 'd': setupDraw(); break; // basically a bunch of 1x1 rectangles
		case 'l': setupLine(); break; 
		case 'Escape'  : setupDefault(); break;
	}
}