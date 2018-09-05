export function cfEmailDecode(encodedString : string) : String {
	let email = '', n, i;
	const r = parseInt(encodedString.substr(0, 2), 16);

	for (n = 2; encodedString.length - n; n += 2){
		i = parseInt(encodedString.substr(n, 2), 16) ^ r;
		email += String.fromCharCode(i);
	}
	return email;
}
