/*
    Connor Montgomery — Personal Website

    script.js
*/

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =========================================================
       ELEMENTS
    ========================================================= */

    const header = document.querySelector(".site-header");
    const navLinks = document.querySelectorAll(".nav-links a");
    const sections = document.querySelectorAll("main section[id]");
    const footer = document.querySelector(".site-footer");

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
     * Only these sections correspond to navigation links:
     *
     * #about
     * #work
     * #experience
     * #contact
     *
     * The #intro hero is intentionally excluded.
     */

    const navigableSections = document.querySelectorAll(
        "#about, #work, #experience, #contact"
    );

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

        navigableSections.forEach((section) => {
            sectionObserver.observe(section);
        });
    }


    /* =========================================================
       SMOOTH SECTION NAVIGATION
    ========================================================= */

    const scrollToSection = (target, behavior = "smooth") => {

        if (!target) {
            return;
        }

        /*
         * For normal sections, scroll to the section heading.
         *
         * Contact is slightly different because it doesn't use
         * .section-heading.
         */

        const sectionHeading = target.querySelector(
            ".section-heading"
        );

        const contactContent = target.querySelector(
            ".contact-content"
        );

        let scrollTarget = target;

        if (sectionHeading) {
            scrollTarget = sectionHeading;
        } else if (contactContent) {
            scrollTarget = contactContent;
        }

        const headerHeight = header
            ? header.getBoundingClientRect().height
            : 0;

        const topOffset = headerHeight + 20;

        const targetPosition =
            scrollTarget.getBoundingClientRect().top +
            window.scrollY -
            topOffset;

        window.scrollTo({
            top: Math.max(0, targetPosition),
            behavior: prefersReducedMotion ? "auto" : behavior
        });
    };


    /* =========================================================
       NAVIGATION CLICK HANDLERS
    ========================================================= */

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

            scrollToSection(target);

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
       HISTORY NAVIGATION
    ========================================================= */

    window.addEventListener("popstate", () => {

        const currentHash = window.location.hash;

        if (!currentHash || currentHash === "#top") {

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

        scrollToSection(target);

    });


    /* =========================================================
       INITIAL HASH POSITION
    ========================================================= */

    /*
     * Handles URLs such as:
     *
     * index.html#work
     * index.html#contact
     */

    if (window.location.hash) {

        const initialTarget = document.querySelector(
            window.location.hash
        );

        if (initialTarget) {

            /*
             * Wait one frame so the browser has calculated the
             * page layout before determining the scroll position.
             */

            window.requestAnimationFrame(() => {

                scrollToSection(initialTarget, "auto");

            });

        }

    }


    /* =========================================================
       SCROLL REVEAL
    ========================================================= */

    /*
     * These elements start with:
     *
     * opacity: 0;
     * transform: translateY(24px);
     *
     * in CSS.
     *
     * Once they enter the viewport, JavaScript adds:
     *
     * .is-visible
     *
     * which triggers the CSS transition.
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
         * Reduced-motion users should never be left with
         * invisible content.
         */

        revealElements.forEach((element) => {
            element.classList.add("is-visible");
        });

    }


    /* =========================================================
       STAGGERED PROCESS ITEMS
    ========================================================= */

    if (!prefersReducedMotion) {

        document
            .querySelectorAll(".process-list span")
            .forEach((item, index) => {

                item.style.transitionDelay =
                    `${index * 45}ms`;

            });


        document
            .querySelectorAll(".project-tools span")
            .forEach((item, index) => {

                item.style.transitionDelay =
                    `${index * 25}ms`;

            });

    }


    /* =========================================================
       EXTERNAL LINKS
    ========================================================= */

    document
        .querySelectorAll('a[target="_blank"]')
        .forEach((link) => {

            const text = link.textContent.trim();

            if (text) {
                link.setAttribute(
                    "aria-label",
                    `${text} (opens in a new tab)`
                );
            }

        });


    /* =========================================================
       IMAGE HANDLING
    ========================================================= */

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
       CURRENT YEAR
    ========================================================= */

    if (footer) {

        const copyright = footer.querySelector(
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

    let usingKeyboard = false;

    document.addEventListener("keydown", (event) => {

        if (event.key === "Tab") {

            usingKeyboard = true;

            document.body.classList.add(
                "keyboard-user"
            );

        }

    });

    document.addEventListener("mousedown", () => {

        if (usingKeyboard) {

            usingKeyboard = false;

            document.body.classList.remove(
                "keyboard-user"
            );

        }

    });

});
