import { useEffect } from "react";

const ResponsiveMover = () => {
  useEffect(() => {
    type ElementMapping = {
      card: HTMLElement | null;
      target: HTMLElement | null;
      originalParent?: HTMLElement | null;
    };

    const elements: ElementMapping[] = [
      {
        card: document.querySelector(".course-card-mover"),
        target: document.querySelector(".mob-details-move"),
      },
      {
        card: document.querySelector(".course-fee-mover"),
        target: document.querySelector(".course-fee-move"),
      },
      {
        card: document.querySelector(".buy-btns-details-mover"),
        target: document.querySelector(".buy-btns-details-move"),
      },
    ];

    const extraMobileElements: ElementMapping[] = [
      {
        card: document.querySelector(".course-card-mover"),
        target: document.querySelector(".mob-details-move"),
      },
      {
        card: document.querySelector(".course-card-details-movers"),
        target: document.querySelector(".course-card-details-move"),
      },
    ];

    elements.forEach((el) => {
      if (el.card) {
        el.originalParent = el.card.parentElement as HTMLElement;
      }
    });

    extraMobileElements.forEach((el) => {
      if (el.card) {
        el.originalParent = el.card.parentElement as HTMLElement;
      }
    });

    const mediumQuery = window.matchMedia("(max-width: 991px) and (min-width: 767px)");
    const smallQuery = window.matchMedia("(max-width: 991px)");

    function moveCards(list: ElementMapping[], matches: boolean) {
      list.forEach((el) => {
        if (!el.card || !el.target || !el.originalParent) return;

        if (matches) {
          if (!el.target.contains(el.card)) {
            el.target.appendChild(el.card);
          }
        } else {
          if (!el.originalParent.contains(el.card)) {
            el.originalParent.appendChild(el.card);
          }
        }
      });
    }

    const mediumHandler = (e: MediaQueryListEvent) => moveCards(elements, e.matches);
    const smallHandler = (e: MediaQueryListEvent) => moveCards(extraMobileElements, e.matches);

    // Initial run
    moveCards(elements, mediumQuery.matches);
    moveCards(extraMobileElements, smallQuery.matches);

    // Add listeners
    mediumQuery.addEventListener("change", mediumHandler);
    smallQuery.addEventListener("change", smallHandler);

    return () => {
      mediumQuery.removeEventListener("change", mediumHandler);
      smallQuery.removeEventListener("change", smallHandler);
    };
  }, []);

  return null; // This component is only for side-effects
};

export default ResponsiveMover;