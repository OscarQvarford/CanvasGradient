const loadHtml = (id, file) => {
	return new Promise((resolve, reject) => {
		fetch(`../${file}`)
		.then(res => res.text())
		.then(html => {
			document.getElementById(id).innerHTML = html;
			resolve();
		})
		.catch(err => reject(err));
	});
}
