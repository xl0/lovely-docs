import { browser } from '$app/environment';

function createWideMode() {
	let wideMode = $state(browser ? localStorage.getItem('wideMode') === 'true' : false);

	return {
		get value() {
			return wideMode;
		},
		toggle() {
			wideMode = !wideMode;
			if (browser) {
				localStorage.setItem('wideMode', String(wideMode));
			}
		},
		set(value: boolean) {
			wideMode = value;
			if (browser) {
				localStorage.setItem('wideMode', String(wideMode));
			}
		}
	};
}

export const wideMode = createWideMode();
