/*

    Connor Montgomery — Personal Website

    script.js

    Designed to work with the existing index.html + style.css.
    */

document.addEventListener("DOMContentLoaded", () => {
"use strict";

/* =========================================================
   ELEMENTS
========================================================= */

const header = document.querySelector(".site-header");
const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("main section[id]");
const footerYear = document.querySelector(".site-footer");

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;


/* =========================================================
   HEADER SCROLL STATE
========================================================= */

const updateHeader = () => {
    if (!header) return;

    if (window.scrollY > 40) {
        header.classList.add("is-scrolled");
    } else {
        header.classList.remove("is-scrolled");
    }
};

updateHeader();

window.addEventListener("scroll", updateHeader, {
    passive: true
});


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

/*
 * The navigation points to:
 * #about
 * #work
 * #experience
 * #contact
 *
 * The hero (#intro) is intentionally not included because
 * there is no corresponding navigation link for it.
 */

if ("IntersectionObserver" in window) {

    const sectionObserver = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) {
                    return;
                }

                const currentId = entry.target.id;

                navLinks.forEach((link) => {

                    const href = link.getAttribute("href");

                    if (href === `#${currentId}`) {
                        link.classList.add("is-active");
                    } else {
                        link.classList.remove("is-active");
                    }

                });

            });

        },
        {
            root: null,
            threshold: 0,
            rootMargin: "-35% 0px -55% 0px"
        }
    );

    sections.forEach((section) => {
        sectionObserver.observe(section);
    });
}


/* =========================================================
   SMOOTH NAVIGATION
========================================================= */

/*
 * CSS already provides scroll-behavior: smooth.
 *
 * This handler adds a small amount of JavaScript control so
 * the scroll position accounts for the navigation/header.
 */

navLinks.forEach((link) => {

    link.addEventListener("click", (event) => {

        const targetId = link.getAttribute("href");

        if (!targetId || !targetId.startsWith("#")) {
            return;
        }

        const target = document.querySelector(targetId);

        if (!target) {
            return;
        }

        event.preventDefault();

        const headerHeight = header
            ? header.getBoundingClientRect().height
            : 0;

        const targetPosition =
            target.getBoundingClientRect().top +
            window.scrollY -
            headerHeight;

        window.scrollTo({
            top: Math.max(0, targetPosition),
            behavior: prefersReducedMotion ? "auto" : "smooth"
        });

        /*
         * Update the URL without forcing a page reload.
         */
        history.pushState(null, "", targetId);
    });

});


/* =========================================================
   BACK TO TOP
========================================================= */

const backToTop = document.querySelector(
    '.footer-right a[href="#top"]'
);

if (backToTop) {

    backToTop.addEventListener("click", (event) => {

        event.preventDefault();

        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? "auto" : "smooth"
        });

        history.pushState(null, "", "#top");
    });

}


/* =========================================================
   SCROLL REVEAL
========================================================= */

/*
 * Elements are given a class rather than inline styles so
 * the animation can be controlled entirely through CSS.
 *
 * The script only activates this behavior when the browser
 * supports IntersectionObserver and the user has not asked
 * for reduced motion.
 */

const revealElements = document.querySelectorAll(
    ".section-heading, " +
    ".about-grid, " +
    ".currently-grid, " +
    ".project, " +
    ".timeline-item, " +
    ".leadership-card, " +
    ".contact-content"
);

if (
    !prefersReducedMotion &&
    "IntersectionObserver" in window
) {

    revealElements.forEach((element) => {
        element.classList.add("reveal");
    });

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");

                observer.unobserve(entry.target);

            });

        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -60px 0px"
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });

} else {

    /*
     * If reduced motion is enabled, make sure everything
     * remains visible immediately.
     */

    revealElements.forEach((element) => {
        element.classList.add("is-visible");
    });

}


/* =========================================================
   STAGGERED PROJECT / TIMELINE ELEMENTS
========================================================= */

/*
 * Adds a small delay between related items.
 * This is purely progressive enhancement.
 */

document
    .querySelectorAll(".process-list span")
    .forEach((item, index) => {

        if (!prefersReducedMotion) {
            item.style.transitionDelay = `${index * 45}ms`;
        }

    });

document
    .querySelectorAll(".project-tools span")
    .forEach((item, index) => {

        if (!prefersReducedMotion) {
            item.style.transitionDelay = `${index * 25}ms`;
        }

    });


/* =========================================================
   EXTERNAL LINKS
========================================================= */

/*
 * External links already use target="_blank" and
 * rel="noopener noreferrer".
 *
 * This additionally identifies them for accessibility.
 */

document
    .querySelectorAll('a[target="_blank"]')
    .forEach((link) => {

        link.setAttribute(
            "aria-label",
            `${link.textContent.trim()} (opens in a new tab)`
        );

    });


/* =========================================================
   IMAGE HANDLING
========================================================= */

/*
 * The current page uses placeholder divs.
 *
 * When those are eventually replaced with <img> elements,
 * this automatically adds a loaded class and handles failed
 * image loads without requiring additional JS.
 */

document.querySelectorAll("img").forEach((image) => {

    if (image.complete && image.naturalWidth > 0) {
        image.classList.add("is-loaded");
    }

    image.addEventListener("load", () => {
        image.classList.add("is-loaded");
    });

    image.addEventListener("error", () => {
        image.classList.add("is-error");
    });

});


/* =========================================================
   IMAGE PLACEHOLDER LABELING
========================================================= */

/*
 * Makes placeholder regions keyboard-focusable only if
 * they eventually become interactive.
 *
 * At the moment they remain purely visual, so we don't add
 * tabindex values unnecessarily.
 */


/* =========================================================
   CURRENT YEAR
========================================================= */

/*
 * The current HTML says © 2026.
 *
 * This keeps the footer current automatically in future years.
 */

if (footerYear) {

    const copyright = footerYear.querySelector(
        ".footer-right span"
    );

    if (copyright) {

        copyright.textContent =
            `© ${new Date().getFullYear()} Connor D. Montgomery`;

    }

}


/* =========================================================
   KEYBOARD ACCESSIBILITY
========================================================= */

/*
 * Add a class when the user navigates with the keyboard.
 * This allows a future CSS rule to distinguish keyboard
 * focus from mouse interaction.
 */

let usingKeyboard = false;

document.addEventListener("keydown", (event) => {

    if (event.key === "Tab") {
        usingKeyboard = true;
        document.body.classList.add("keyboard-user");
    }

});

document.addEventListener("mousedown", () => {

    if (usingKeyboard) {
        usingKeyboard = false;
        document.body.classList.remove("keyboard-user");
    }

});


/* =========================================================
   HANDLE HISTORY NAVIGATION
========================================================= */

window.addEventListener("popstate", () => {

    const currentHash = window.location.hash;

    if (!currentHash) {
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? "auto" : "smooth"
        });

        return;
    }

    const target = document.querySelector(currentHash);

    if (!target) {
        return;
    }

    const headerHeight = header
        ? header.getBoundingClientRect().height
        : 0;

    const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight;

    window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: prefersReducedMotion ? "auto" : "smooth"
    });

});


/* =========================================================
   INITIAL HASH POSITION
========================================================= */

/*
 * If somebody visits:
 *
 * example.com/#work
 *
 * wait until layout has settled before positioning the page.
 */

if (window.location.hash) {

    const initialTarget = document.querySelector(
        window.location.hash
    );

    if (initialTarget) {

        window.requestAnimationFrame(() => {

            const headerHeight = header
                ? header.getBoundingClientRect().height
                : 0;

            const targetPosition =
                initialTarget.getBoundingClientRect().top +
                window.scrollY -
                headerHeight;

            window.scrollTo({
                top: Math.max(0, targetPosition),
                behavior: "auto"
            });

        });

    }

}

});
