/*
 * Revo Browser
 * Copyright (c) 2026 solarcosmic
 * 
 * This browser is free of use but may contain a license, check the repository for details.
*/

/*
 * A simple helper function to get an element by its ID.
 *
 * element: The element ID
*/
export function id(element) {
    return document.getElementById(element);
}

/*
 * A simple helper function to get the first element by its class.
 *
 * element: The element class
*/
export function byClass(element) {
    return document.getElementsByClassName(element)[0];
}