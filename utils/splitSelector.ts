export default function splitSelector(selector: string): string[] { 
	return selector.substring(9, selector.length-1).split(',');
}