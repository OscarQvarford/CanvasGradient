const loadHtml = (id, file) => {
	console.log('hello');
	fetch(`../${file}`)
		.then(res => res.text())
		.then(html => {
			document.getElementById(id).innerHTML = html;
		})
		.catch(err => console.error(err));
}