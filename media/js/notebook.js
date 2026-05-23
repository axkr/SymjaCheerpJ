/**
 * Symja worksheet <-> Jupyter (.ipynb) save/load.
 *
 * Calls the WASM bridges window.toIpynbWasm / window.fromIpynbWasm exposed
 * by index.html (backed by ServletWASM#toIpynb / ServletWASM#fromIpynb).
 *
 * Uses the modern File System Access API when available (Chromium-based
 * browsers) and falls back to an anchor-download / <input type="file">
 * combination so the feature works in Firefox and Safari too. Everything
 * happens in the browser - no server round-trip is required.
 */

function _timestampedNotebookName() {
	var d = new Date();
	function pad(n) { return (n < 10 ? '0' : '') + n; }
	return 'symja-worksheet-' + d.getFullYear() + pad(d.getMonth() + 1)
		+ pad(d.getDate()) + '-' + pad(d.getHours()) + pad(d.getMinutes())
		+ pad(d.getSeconds()) + '.ipynb';
}

function _downloadBlob(blob, filename) {
	var url = URL.createObjectURL(blob);
	var a = document.createElement('a');
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
}

function _pickAndReadFile() {
	return new Promise(function (resolve, reject) {
		var input = document.createElement('input');
		input.type = 'file';
		input.accept = '.ipynb,application/json,application/x-ipynb+json';
		input.style.display = 'none';
		input.addEventListener('change', function () {
			var file = input.files && input.files[0];
			document.body.removeChild(input);
			if (!file) { reject(new Error('No file selected')); return; }
			var reader = new FileReader();
			reader.onload = function () { resolve(reader.result); };
			reader.onerror = function () {
				reject(reader.error || new Error('Read failed'));
			};
			reader.readAsText(file);
		});
		document.body.appendChild(input);
		input.click();
	});
}

async function saveNotebookFile() {
	if (!window.toIpynbWasm) {
		alert('WASM engine is still initializing...');
		return;
	}
	try {
		var content = getContent();
		var ipynb = await window.toIpynbWasm(content);
		var filename = _timestampedNotebookName();

		if (window.showSaveFilePicker) {
			try {
				var handle = await window.showSaveFilePicker({
					suggestedName: filename,
					types: [{
						description: 'Jupyter Notebook',
						accept: { 'application/x-ipynb+json': ['.ipynb'] }
					}]
				});
				var writable = await handle.createWritable();
				await writable.write(ipynb);
				await writable.close();
				return;
			} catch (e) {
				if (e && e.name === 'AbortError') return;
				console.log('showSaveFilePicker failed, falling back:', e);
			}
		}
		_downloadBlob(
			new Blob([ipynb], { type: 'application/x-ipynb+json' }),
			filename);
	} catch (e) {
		alert('Save failed: ' + (e && e.message ? e.message : e));
	}
}

async function openNotebookFile() {
	if (!window.fromIpynbWasm) {
		alert('WASM engine is still initializing...');
		return;
	}
	try {
		var text;
		if (window.showOpenFilePicker) {
			try {
				var handles = await window.showOpenFilePicker({
					multiple: false,
					types: [{
						description: 'Jupyter Notebook',
						accept: {
							'application/x-ipynb+json': ['.ipynb'],
							'application/json': ['.json']
						}
					}]
				});
				var file = await handles[0].getFile();
				text = await file.text();
			} catch (e) {
				if (e && e.name === 'AbortError') return;
				console.log('showOpenFilePicker failed, falling back:', e);
				text = await _pickAndReadFile();
			}
		} else {
			text = await _pickAndReadFile();
		}
		var worksheetJson = await window.fromIpynbWasm(text);
		setContent(worksheetJson);
	} catch (e) {
		alert('Open failed: ' + (e && e.message ? e.message : e));
	}
}
