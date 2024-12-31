export default function clearEmptyChildren(curModule: ModuleParams) { 
	const children = curModule.children;
	if (children) {
		if (children.length === 0) {
			delete curModule.children;
		} else {
			children.forEach((childModule) => clearEmptyChildren(childModule));
		}
	}
}