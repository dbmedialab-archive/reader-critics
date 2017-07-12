//TO DO change for fight types
interface UIType {
	modalWindows: any;
	topbar: {
		submenu: {
			isOpen: boolean,
		},
		accountMenu: {
			isOpen: boolean,
		},
	};
	mainPreloader: {
		isVisible: boolean,
		color: string,
		countOfPreloaders: number,
	};
	progressBar: any;
}
export default UIType;
