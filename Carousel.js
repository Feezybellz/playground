function InitCarousel() {
  let isDragging = false;
  let startX;
  let scrollLeft;

  const dragStop = (elem) => {
    isDragging = false; // Stop dragging
    elem.classList.remove("dragging");
  };

  const dragging = (elem) => {
    if (!isDragging) return;
    const x = window.event.pageX || window.event.touches[0].pageX; // Get current mouse/touch position
    const walk = (x - startX) * 2; // Calculate distance moved
    elem.scrollLeft = scrollLeft - walk; // Update scroll position

    console.log(x);
    console.log(walk);
  };

  function scrollElem(parent_carousel, direction = "right") {
    const carousel = parent_carousel.querySelector("[data-carousel]");
    const clientWidth = carousel.clientWidth;
    parent_carousel.scrollLeft +=
      direction === "left" ? -clientWidth : clientWidth;
  }

  const allCarouselParent = document.querySelectorAll(
    "[data-carousel-parent-elem]"
  );

  allCarouselParent.forEach((elem) => {
    const carouselArrows = document.querySelectorAll(
      `[data-carousel-parent="#${elem.id}"]`
    );
    const parent_carousel = elem;
    const carousel = parent_carousel.querySelector("[data-carousel]");

    parent_carousel.addEventListener("mousedown", (event) => {
      isDragging = true;
      startX = event.pageX;
      scrollLeft = parent_carousel.scrollLeft;
      parent_carousel.style.cursor = "grab";
    });
    parent_carousel.addEventListener("mousemove", function () {
      dragging(parent_carousel);
    });
    document.addEventListener("mouseup", function () {
      dragStop(parent_carousel);
      parent_carousel.style.cursor = "";
    });

    carouselArrows.forEach(function (_arrow) {
      // Initialize ResizeObserver

      const resizeObserver = new ResizeObserver(() => {
        const direction = _arrow.dataset.carouselArrow;
        // Update scroll on arrow click
        _arrow.addEventListener("click", function () {
          scrollElem(parent_carousel, direction);
        });
      });
      resizeObserver.observe(carousel);
    });
  });
}

InitCarousel();
