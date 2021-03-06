const electron = require('electron');
const { ipcRenderer } = electron;
let win = electron.remote.getCurrentWindow();
let windowTitle = document.title;
// When document has loaded, initialise
document.onreadystatechange = () => {
	if (document.readyState == 'complete') {
		handleWindowControls();
	}
};
function updateTitle(text) {
	let suffix = '';
	if (isDev) suffix = ' - Dev Build';
	document.title = text + suffix;
	document.querySelector('.window-title').textContent = text + suffix;
}
updateTitle(windowTitle);


function handleWindowControls() {
	// Make minimise/maximise/restore/close buttons work when they are clicked
	document.getElementById('min-button').addEventListener('click', (event) => {
		win.minimize();
	});

	document.getElementById('max-button').addEventListener('click', (event) => {
		win.maximize();
	});

	document.getElementById('restore-button').addEventListener('click', (event) => {
		win.unmaximize();
	});

	document.getElementById('close-button').addEventListener('click', (event) => {
		if (saved) {
			let popup = addPopup('confirm-logout', 'Confirmation', '').body;
			let container = addElement('div', { class: 'logout-container' }, '', popup);


			addElement('p', { class: 'dialog-prompt timeout-prompt', id: 'timeout-unsaved' }, `Do you want to save changes?`, container);
			let collection = addElement('collection', { class: 'dialog-collection timeout-collection', id: 'timeout-unsaved' }, '', container);

			let buttons = {
				save: {
					text: 'Save',
					onclick: `save(); removePopup("confirm-logout")`
				},
				dontSave: {
					text: `Don't Save`,
					onclick: 'win.close()'
				},
				cancel: {
					text: `Cancel`,
					onclick: 'removePopup("confirm-logout")'
				}
			}

			for (let button in buttons) {
				addElement('button', { class: `dialog-button timeout-button`, id: `${button}-button`, onclick: buttons[button].onclick }, buttons[button].text, collection);
			}
		} else {
			win.close();
		}
	});

	// Toggle maximise/restore buttons when maximisation/unmaximisation occurs
	toggleMaxRestoreButtons();
	win.on('maximize', toggleMaxRestoreButtons);
	win.on('unmaximize', toggleMaxRestoreButtons);

	function toggleMaxRestoreButtons() {
		if (win.isMaximized()) {
			document.body.classList.add('maximized');
		} else {
			document.body.classList.remove('maximized');
		}
	}
}


function lockVault() {
	let popup = addPopup('confirm-logout', 'Confirmation', '').body;
	let container = addElement('div', { class: 'logout-container' }, '', popup);
	if (saved) {
		addElement('p', { class: 'dialog-prompt timeout-prompt', id: 'timeout-unsaved' }, `Do you want to save changes?`, container);
		let collection = addElement('collection', { class: 'dialog-collection timeout-collection', id: 'timeout-unsaved' }, '', container);

		let buttons = {
			save: {
				text: 'Save',
				onclick: `save('all')`
			},
			dontSave: {
				text: `Don't Save`,
				onclick: 'quit()'
			},
			cancel: {
				text: `Cancel`,
				onclick: 'removePopup("confirm-logout")'
			}
		}

		for (let button in buttons) {
			addElement('button', { class: `dialog-button timeout-button`, id: `${button}-button`, onclick: buttons[button].onclick }, buttons[button].text, collection);
		}
	} else {
		addElement('p', { class: 'dialog-prompt timeout-prompt', id: 'timeout-unsaved' }, `Do you want to lock vault?`, container);
		let collection = addElement('collection', { class: 'dialog-collection timeout-collection', id: 'timeout-unsaved' }, '', container);

		let buttons = {
			lock: {
				text: 'Lock',
				onclick: 'quit()'
			},
			cancel: {
				text: 'Cancel',
				onclick: 'removePopup("confirm-logout")'
			},
		}


		for (let button in buttons) {
			addElement('button', { class: `dialog-button timeout-button`, id: `${button}-button`, onclick: buttons[button].onclick }, buttons[button].text, collection);
		}
	}
}

// Lock Vault function
function quit() {
	ipcRenderer.send('logout');
	win.close();
}