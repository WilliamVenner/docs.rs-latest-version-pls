// ==UserScript==
// @name         docs.rs-latest-version-pls
// @namespace    WilliamVenner
// @version      1.0.0
// @description  Automatically redirects to the latest version on docs.rs when navigating from a search engine
// @author       William Venner <william@venner.io>
// @supportURL   https://github.com/WilliamVenner/docs.rs-latest-version-pls/issues
// @match        https://docs.rs/*/*/*
// @icon         https://docs.rs/favicon.ico
// @grant        none
// @run-at       document-start
// @noframes
// ==/UserScript==

(function() {
	'use strict';

	// Do nothing if we didn't navigate from somewhere else
	if (!document.referrer) return;

	// Prevent redirecting twice - maybe the user actually intended to go to this page
	// and pressed their browser's back button
	if (window.history.state && window.history.state.docs_rs_latest_version_pls) return;

	const SEARCH_ENGINES = [
		searchEngine('google'),
		searchEngine('bing'),
		searchEngine('duckduckgo'),
		searchEngine('yahoo'),
		searchEngine('yandex'),
		searchEngine('startpage'),
		searchEngine('searchencrypt'),
	];

	function searchEngine(name) {
		// Build a Regex that matches ^(http|https)://*.$searchEngine.*/
		return new RegExp(`^https?:\/\/(?:.+?\.)?${name}\.[^.]+?(?:\/|$)`, 'i');
	}

	function getRedirectButton() {
		// This kinda sucks
		return document.querySelector('a[title~="outdated"][title~="latest"]');
	}

	function isOutdated() {
		return !!getRedirectButton();
	}

	function redirectToLatest() {
		// Save in the history stack that we redirected at this index
		window.history.replaceState({ docs_rs_latest_version_pls: true }, '', document.location);

		// Redirect to latest version
		document.location = getRedirectButton().getAttribute('href');
	}

	for (let i = 0; i < SEARCH_ENGINES.length; i++) {
		if (document.referrer.match(SEARCH_ENGINES[i])) {
			window.addEventListener('DOMContentLoaded', () => {
				if (isOutdated()) {
					redirectToLatest();
				}
			});
			return;
		}
	}
})();