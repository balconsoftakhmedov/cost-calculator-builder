export default function copyText(id) {
	const copyText = document.querySelector(`.calc-short-code[data-id='${id}']`)
	if ( copyText ) {
		copyText.setAttribute('type', 'text');
		copyText.select();
		copyText.setSelectionRange(0, 99999);
		document.execCommand("copy");
		copyText.setAttribute('type', 'hidden');
	}
};