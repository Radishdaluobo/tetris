//每个格子
function Cell(r, c, src) {
	this.r = r;
	this.c = c;
	this.src = src;
}
//每种状态
function State(r0, c0, r1, c1, r2, c2, r3, c3) {
	this.r0 = r0;
	this.c0 = c0;
	this.r1 = r1;
	this.c1 = c1;
	this.r2 = r2;
	this.c2 = c2;
	this.r3 = r3;
	this.c3 = c3;
}
//所有图形的父类型
function Shape(r0, c0, r1, c1, r2, c2, r3, c3, src, states, orgi) {
	this.cells = [
		new Cell(r0, c0, src),
		new Cell(r1, c1, src),
		new Cell(r2, c2, src),
		new Cell(r3, c3, src)
	];
	// 保存图形的所有旋转状态
	this.states = states;
	this.orgCell = this.cells[orgi];
	this.statei = 0;
}

Shape.prototype = {
	IMGS: {
		T: 'img/T.png',
		O: 'img/O.png',
		I: 'img/I.png',
		S: 'img/S.png',
		Z: 'img/Z.png',
		L: 'img/L.png',
		J: 'img/J.png'
	},
	moveDown() {
		for (var i = 0; i < this.cells.length; i++) {
			this.cells[i].r++;
		}
	},
	moveLeft() {
		for (var i = 0; i < this.cells.length; i++) {
			this.cells[i].c--;
		}
	},
	moveRight() {
		for (var i = 0; i < this.cells.length; i++) {
			this.cells[i].c++;
		}
	},
	rotateR() {
		this.statei++;
		if (this.statei >= this.states.length) {
			this.statei = 0
		}
		var state = this.states[this.statei];
		this.rotate(state)
	},
	rotateL() {
		this.statei--;
		if (this.statei < 0) {
			this.statei = this.states.length -1;
		}
		var state = this.states[this.statei];
		this.rotate(state)
	},
	rotate(state) {
		var r = this.orgCell.r;
		var c = this.orgCell.c;
		for (var i = 0; i < this.cells.length; i++) {
			this.cells[i].r = r + state['r' + i];
			this.cells[i].c = c + state['c' + i];
		}
	}
}

function O() {
	if (!Shape.prototype.isPrototypeOf(O.prototype)) {
		Object.setPrototypeOf(O.prototype, Shape.prototype)
	}
	var states = [
		new State(0, -1, 0, 0, +1, -1, +1, 0)
	]
	Shape.call(this, 0, 4, 0, 5, 1, 4, 1, 5, this.IMGS.O, states, 1)
}

function I() {
	if (!Shape.prototype.isPrototypeOf(I.prototype)) {
		Object.setPrototypeOf(I.prototype, Shape.prototype)
	}
	var states = [
		new State(0, -1, 0, 0, 0, +1, 0, +2),
		new State(-1, 0, 0, 0, +1, 0, +2, 0)
	];
	Shape.call(this, 0, 3, 0, 4, 0, 5, 0, 6, this.IMGS.I, states, 1)
}

function S() {
	if (!Shape.prototype.isPrototypeOf(S.prototype)) {
		Object.setPrototypeOf(S.prototype, Shape.prototype)
	}
	var states = [
		new State(-1, 0, -1, 1, 0, -1, 0, 0),
		new State(0, 1, 1, 1, -1, 0, 0, 0)
	];
	Shape.call(this, 0, 4, 0, 5, 1, 3, 1, 4, this.IMGS.S, states, 3)
}

function Z() {
	if (!Shape.prototype.isPrototypeOf(Z.prototype)) {
		Object.setPrototypeOf(Z.prototype, Shape.prototype)
	}
	var states = [
		new State(-1, -1, -1, 0, 0, 0, 0, 1),
		new State(-1, 1, 0, 1, 0, 0, 1, 0)
	];
	Shape.call(this, 0, 3, 0, 4, 1, 4, 1, 5, this.IMGS.Z, states, 2)
}

function L() {
	if (!Shape.prototype.isPrototypeOf(L.prototype)) {
		Object.setPrototypeOf(L.prototype, Shape.prototype)
	}
	var states = [
		new State(0, -1, 0, 0, 0, 1, 1, -1),
		new State(-1, 0, 0, 0, 1, 0, 1, -1, -1),
		new State(0, 1, 0, 0, 0, -1, -1, 1),
		new State(1, 0, 0, 0, -1, 0, 1, 1)
	];
	Shape.call(this, 0, 3, 0, 4, 0, 5, 1, 3, this.IMGS.L, states, 1)
}

function J() {
	if (!Shape.prototype.isPrototypeOf(J.prototype)) {
		Object.setPrototypeOf(J.prototype, Shape.prototype)
	}
	var states = [
		new State(0, -1, 0, 0, 0, 1, 1, 1),
		new State(-1, 0, 0, 0, 1, 0, 1, 1, -1),
		new State(0, 1, 0, 0, 0, -1, -1, -1),
		new State(1, 0, 0, 0, -1, 0, -1, 1)
	];
	Shape.call(this, 0, 3, 0, 4, 0, 5, 1, 5, this.IMGS.J, states, 1)
}

function T() {
	if (!Shape.prototype.isPrototypeOf(T.prototype)) {
		Object.setPrototypeOf(T.prototype, Shape.prototype)
	}
	var states = [
		new State(0, -1, 0, 0, 0, +1, +1, 0),
		new State(-1, 0, 0, 0, +1, 0, 0, -1),
		new State(0, +1, 0, 0, 0, -1, -1, 0),
		new State(+1, 0, 0, 0, -1, 0, 0, +1),
	];
	Shape.call(this, 0, 3, 0, 4, 0, 5, 1, 4, this.IMGS.T, states, 1)
}