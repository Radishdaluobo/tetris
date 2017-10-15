window.$ = HTMLElement.prototype.$ = function(select) {
	return (this == window ? document : this).querySelectorAll(select)
}

var tetris = {
	RN: 20, //行数
	CN: 10, //总列数
	CSIZE: 26, //每个格子的宽高
	bg: null, //保存游戏主界面对象
	OFFSET_X: 15, //定位时偏移量
	OFFSET_Y: 15,
	currShape: null, //专门保存正在移动的图形对象
	INTERVAL: 3000,
	timer: null,
	wall: [], //墙
	nextShape: null, //保存下一个图形对象
	state: 1, //保存游戏状态
	GAMEOVER: 0, //游戏结束
	RUNNING: 1, //运行中
	PAUSE: 2, //暂停
	score: 0,
	lines: 0,
	SCORES: [0, 10, 30, 60, 100],
	init() {
		this.state = this.RUNNING;
		this.bg = $('.playground')[0];
		this.score = 0;
		this.lines = 0;
		this.currShape = this.randomShape();
		this.nextShape = this.randomShape();
		// 将wall数组初始化为RN个空数组对象
		for (var i = 0; i < this.RN; i++) {
			this.wall[i] = new Array(this.CN);
		}

		this.paintAll();
		document.onkeydown = function(e) {
			switch (e.keyCode) {
				case 37:
					this.moveLeft();
					break;
				case 39:
					this.moveRight();
					break;
				case 40:
					this.drop();
					break;
				case 38:
					this.rotateR();
					break;
				case 90:
					this.rotateL();
			}
		}.bind(this)
		this.timer = setInterval(() => {
			this.drop()
		}, this.INTERVAL)
	},
	randomShape() {
		switch (parseInt(Math.random() * 7)) {
			case 0:
				return new O();
			case 1:
				return new I();
			case 2:
				return new Z();
			case 3:
				return new L();
			case 4:
				return new J();
			case 5:
				return new T();
			case 6:
				return new S();
		}
	},
	moveLeft() {
		if (this.canMove('left')) {
			this.currShape.moveLeft();
			this.paintAll();
		}
	},
	moveRight() {
		if (this.canMove('right')) {
			this.currShape.moveRight();
			this.paintAll();
		}
	},
	rotateR() {
		if (this.canRotate('right')) {
			this.currShape.rotateR();
			this.paintAll();
		}
	},
	rotateL() {
		if (this.canRotate('left')) {
			this.currShape.rotateL();
			this.paintAll();
		}
	},
	canRotate(type) {
		var state = this.currShape.statei;
		var totalStateNum = this.currShape.states.length;
		if (type === 'right') {
			state++;
		} else if (type === 'left') {
			state--;
		} else {
			return false;
		}
		if (state >= totalStateNum) {
			state = 0;
		} else if (state < 0) {
			state = totalStateNum - 1;
		}
		var Nextstate = this.currShape.states[state];
		var orgCell = this.currShape.orgCell;
		var r = orgCell.r;
		var c = orgCell.c;
		for (var i = 0; i < this.currShape.cells.length; i++) {
			var cell = this.currShape.cells[i];
			var nextR = r + Nextstate['r' + i];
			var nextC = c + Nextstate['c' + i];
			if (nextR >= this.RN || nextR < 0 || nextC >= this.CN || nextC < 0) {
				return false;
			}
			if (this.wall[nextR][nextC] !== undefined) {
				return false;
			}
		}
		return true;
	},
	drop() {
		if (this.canMove('down')) {
			this.currShape.moveDown();
		} else {
			this.landIntoWall();
			//拿到currShape所在的行
			// 消行
			this.deleteLines();
			// 计分
			if (!this.isGameOver()) {
				this.currShape = this.nextShape;
				this.nextShape = this.randomShape();
			} else {
				this.currShape = this.nextShape;
				this.nextShape = this.randomShape();
				clearInterval(this.timer);
				this.timer = null;
				this.state = this.GAMEOVER;
			}
		}
		this.paintAll();
	},
	deleteLines() {
		//检查是否满行
		var deleteRows = this.isFull(this.getRows());
		deleteRows = deleteRows ? deleteRows : [];
		var rowsLength = deleteRows.length;
		this.lines += rowsLength;
		this.score += this.SCORES[rowsLength];
		for (var i = 0; i < deleteRows.length; i++) {
			var row = deleteRows[i];
			this.deleteLine(row);
		}
	},
	deleteLine(row) {
		this.wall.splice(row, 1);
		this.wall.unshift(new Array(this.CN));
		for (var i = row; i >= 0; i--) {
			for (var j = 0; j < this.CN; j++) {
				if (this.wall[i][j]) {
					this.wall[i][j].r++;
				}
			}
		}
	},
	getRows() {
		var ret = [];
		var hash = {};
		for (var i = 0; i < this.currShape.cells.length; i++) {
			var cell = this.currShape.cells[i];
			var r = cell.r;
			if (hash[r] !== true) {
				ret.push(r);
				hash[r] = true;
			}
		}
		return ret
	},
	isFull(arr) {
		var rows = [];
		for (var i = 0; i < arr.length; i++) {
			// 如果满格
			if (String(this.wall[arr[i]]).search(/^,|,,|,$/) == -1) {
				rows.push(arr[i])
			}
		}
		return rows;
	},
	canMove(direction) {
		for (var i = 0; i < this.currShape.cells.length; i++) {
			var cell = this.currShape.cells[i];
			if (direction == 'down' && cell.r >= this.RN - 1) {
				return false;
			} else if (direction == 'left' && cell.c <= 0) {
				return false;
			} else if (direction == 'right' && cell.c >= this.CN - 1) {
				return false;
			}
			if (direction == 'down' && this.wall[cell.r + 1][cell.c] !== undefined) {
				return false;
			} else if (direction == 'left' && this.wall[cell.r][cell.c - 1] !== undefined) {
				return false;
			} else if (direction == 'right' && this.wall[cell.r][cell.c + 1] !== undefined) {
				return false;
			}
		}
		return true;
	},

	isGameOver() {
		for (var i = 0; i < this.nextShape.cells.length; i++) {
			var cell = this.nextShape.cells[i];
			if (this.wall[cell.r][cell.c] !== undefined) {
				return true;
			}
		}
		return false;
	},
	paintState() {
		if (this.state !== this.RUNNING) {
			var img = new Image();
			if (this.state === this.GAMEOVER) {
				img.src = 'img/game-over.png';
			} else {
				img.src = 'img/pause.png';
			}
			this.bg.appendChild(img);
		}
	},
	landIntoWall() {
		for (var i = 0; i < this.currShape.cells.length; i++) {
			var cell = this.currShape.cells[i];
			this.wall[cell.r][cell.c] = cell;
		}
	},
	paintCell(cell, frag, isNextShape) {
		var img = new Image();
		img.src = cell.src;
		var x = cell.c * this.CSIZE + this.OFFSET_X;
		var y = cell.r * this.CSIZE + this.OFFSET_Y;
		if (isNextShape === 1) {
			x += 10 * this.CSIZE;
		}
		img.style.left = x + 'px';
		img.style.top = y + 'px';
		img.style.width = this.CSIZE + 'PX';
		frag.appendChild(img)
	},
	paintcurrShape() {
		this.paintShape(this.currShape, 0);
	},
	paintNextShape() {
		this.paintShape(this.nextShape, 1);
	},
	paintShape(shape, isNextShape) { //绘制
		var frag = document.createDocumentFragment();
		for (var i = 0; i < shape.cells.length; i++) {
			var cell = shape.cells[i];
			this.paintCell(cell, frag, isNextShape);
		}
		this.bg.appendChild(frag)
	},
	paintNext() {
		this.nextShape = this.randomShape();
	},
	paintWall() {
		var frag = document.createDocumentFragment();
		for (var i = 0; i < this.RN; i++) {
			for (var j = 0; j < this.CN; j++) {
				if (this.wall[i][j] !== undefined) {
					this.paintCell(this.wall[i][j], frag)
				}
			}
		}
		this.bg.appendChild(frag)
	},
	paintScore() {
		document.getElementById('score').innerHTML = this.score;
		document.getElementById('lines').innerHTML = this.lines;
	},
	paintAll() {
		var reg = /<img [^>]*>/g;
		this.bg.innerHTML = this.bg.innerHTML.replace(reg, '')
		this.paintcurrShape();
		this.paintWall();
		this.paintNextShape();
		this.paintScore();
		this.paintState();
	}
}

tetris.init()