export default function ParserRequestException (message: string) {
	this.message = message;
	this.name = 'ParserRequestException';
}
