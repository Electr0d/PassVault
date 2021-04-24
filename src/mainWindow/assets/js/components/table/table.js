function addRow(tableData, index) {
	let row = addElement('div', { class: `row-${index}`, id: 'tr' }, '', elements.table);
	// append data values
	for (let dataType in tableData) {

		let cell = addElement('div', { class: `cell-${index} table-cell ${dataType}`, id: `${dataType}-${index}`, onclick: 'copy(this)' }, '', row);
		let content = addElement('input', { class: `cell-${index} cell-content ${dataType}`, id: `${dataType}-content`, readonly: '' }, tableData[dataType], cell);
		// set the content text to bullets if data type is passwor and is set to hidden
		if (dataType == 'password') {
			content.type = data[`cell-${index}`].hidden ? 'password' : 'text';
			// get strength and append to html
			let strength = getStrengthOf(tableData[dataType]);
			strength.container = addElement('div', { class: `cell-${index} strength-container`, id: 'strength-div' }, '', cell);
			addElement('p', { class: `cell-${index} strength-text`, id: 'strength-text' }, strength.tier, strength.container);
			let strengthBar = addElement('div', { class: `cell-${index} strength-bar`, id: 'strength-bar' }, '', strength.container);
			strengthBar.style.background = strength.bar.background;
			strengthBar.style.width = strength.bar.width;


			// add event listener
			content.addEventListener('input', updateStrength);
		}

		// add icon if its a service icon
		if (dataType == 'service') iconChecker(cell, tableData[dataType]);
	}
	let controlsCell = addElement('div', { class: `cell-${index} controls`, id: `controls-${index}` }, '', row);

	let controls = {
		edit: {
			onclick: 'editRow(this, "show")',
			icon: icons.pencil,
			tooltip: 'Edit'
		},
		hideShow: {
			onclick: 'togglePasswordVisibility(this)',
			icon: data[`cell-${index}`].hidden ? icons.eye.eye : icons.eye.crossed,
			tooltip: 'Hide/Show'
		},
		delete: {
			onclick: 'deleteRow(this)',
			icon: icons.trashcan,
			tooltip: 'Delete'
		}
	}
	for(let control in controls) {
		// add control
		let container = addElement('div', { class: `cell-${index} cell-control cell-${control}`, id: `cell-${control}-${index}`, onmouseover: `addTooltip(this, "${controls[control].tooltip}", true)`, onclick: controls[control].onclick }, '', controlsCell);
		
		// add control icon
		addElement('img', { class: `cell-${index} cell-control-icon cell-${control}-icon`, id: `cell-${control}-icon-${index}`, src: controls[control].icon }, '', container);
	}

	// tbody animation
	elements.table.classList.add('tbody-animation');
	setTimeout(function () {
		table.classList.remove('tbody-animation');
	}, 250);
	return row;
}

function copy(e) {
	let d = e.id;
	let c = e.classList[0];
	let copylet = data[c][d];

	let input = addElement('input', { class: 'hidden', style: 'position: absolute; left: -50000px' }, copylet, document.body);
	input.select();
	try {
		document.execCommand('copy');
		toast('Copied to clipboard!');
		document.body.removeChild(input);
	} catch (err) {
		toast(`Copying ${c}${d} was unsuccessful!`);
	}
}

// delete row function
function deleteRow(e) {
	let d = e.id;
	let c = e.classList[0];
	let index = data[c].index;
	let row = `row-${index}`;
	row = document.querySelector(`.row-${index}`);
	row.classList.toggle('draw-out-animation');
	setTimeout(() => {
		let removedIndex = Number(c.replace('cell-', ''));
		row.remove();
		delete data[c];
		for (let i = removedIndex + 1; i < data.cellIndex; i++) {
			let row = data['cell-' + i];
			data['cell-' + (i - 1)] = {
				class: 'cell-' + (i - 1),
				type: row.type,
				service: row.service,
				email: row.email,
				password: row.password,
				onCopy: row.onCopy,
				index: i - 1,
				hidden: row.hidden
			};

			// update class name of cells
			let rowCells = document.querySelectorAll('.cell-' + i);
			let rowLength = rowCells.length;
			for (let x = 0; x < rowLength; x++) {
				let element = rowCells[x];
				// change first class while keeping other classes
				element.setAttribute('class', element.classList['value'].replace(element.classList[0], `cell-${(i - 1)}`));
			}

			// update class name of rows
			document.querySelector(`.row-${i}`).setAttribute('class', `row-${(i - 1)}`);
		}
		data.cellIndex--;
		delete data[`cell-${data.cellIndex}`];
	}, 250);
	// draw-out animations
}

function togglePasswordVisibility(e) {
	let c = e.classList[0];
	let password = document.querySelector(`.${c}.cell-content.password`);
	let icon = document.querySelector(`.${c}.cell-hideShow-icon`);
	
	// toggle password visibility
	if(password.type == 'password') {
		password.type = 'text';
		icon.setAttribute('src', icons.eye.crossed);
	} else {
		password.type = 'password';
		icon.setAttribute('src', icons.eye.eye);
	}
		data[c].hidden = !data[c].hidden;
}