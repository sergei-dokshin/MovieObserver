export function debounce(callback: Function, delay: number) {
	let timer: any = null;
	// spread/rest оператор "...args" используется для корректноой передачи нескольких параметров функции
	return (...args: any) => {
		clearTimeout(timer);

		timer = setTimeout(() => {
			callback(...args);
		}, delay);
	};
}
