const body     = document.body;
const header   = document.querySelector(".header");
const navLi    = document.querySelectorAll(".header__li");

const navBtn   = document.querySelector(".header__btn");
const heroBtn  = document.querySelector(".hero__btn");
const closeBtn = document.querySelector(".button__close");

const link     = document.querySelectorAll(".link__a");
const video    = document.querySelectorAll(".play");

const loader   = document.querySelector(".loader");

loader.addEventListener("animationend", ()=>{
  navLi.forEach((element, i)=>{
    navLi[i].classList.add('slideRight')

    setTimeout(() => {
      navLi[i].classList.remove("slideRight");
    }, 4500);
  })
})

navBtn.addEventListener("click", () => {
  header.classList.toggle("active");
  body.classList.toggle("no-scroll");
});

closeBtn.addEventListener("click", () => heroBtn.classList.add("hidden"));

window.addEventListener("scroll", () => {
  let pixel = window.scrollY;
  let windowHeight = window.innerHeight;
  let headerHeight = header.offsetHeight;

  if (pixel > windowHeight + headerHeight) {
    header.classList.add("fixed");
  } else {
    header.classList.remove("fixed");
  }

  parallax(pixel);
});

function parallax(pixel) {
  const mobileWidth = 767;
  const around = document.querySelector(".around__parallax");
  let aroundHeight = around.offsetHeight;

  if (window.innerWidth > mobileWidth) {
    around.style.transform = `translateY(${(aroundHeight - pixel) / 30}px)`;
  } else {
    around.style.transform = `translateY(0px)`;
  }
}

// --- Link opacity ---
link.forEach((element, i) => {
  
  link[i].addEventListener("mouseover", () => {
    link.forEach((element, i) => {
      link[i].classList.add("fade");
    });
    link[i].classList.remove("fade");
  });

  link[i].addEventListener("mouseout", () => {
    link.forEach((element, i) => {
      link[i].classList.remove("fade");
    });
  });
});

// --- Video ---
video.forEach((element) => element.addEventListener("click", playVideo, false));

function playVideo(e) {
  e.preventDefault();
  this.setAttribute("style", "display:none");
  this.previousElementSibling.play();
  this.previousElementSibling.setAttribute("controls", "controls");
}

// --- Slider ---
const slider = document.querySelector(".slider__ul"),
  slides = Array.from(document.querySelectorAll(".slider__li"));

let isDragging = false,
  startPos = 0,
  currentTranslate = 0,
  prevTranslate = 0,
  animationID,
  currentIndex = 0;

slides.forEach((slide, i) => {
  const slideImage = slide.querySelector("picture");
  // disable default image drag
  slideImage.addEventListener("dragstart", (e) => e.preventDefault());
  // touch events
  slide.addEventListener("touchstart", touchStart(i));
  slide.addEventListener("touchend", touchEnd);
  slide.addEventListener("touchmove", touchMove);
  // mouse events
  slide.addEventListener("mousedown", touchStart(i));
  slide.addEventListener("mouseup", touchEnd);
  slide.addEventListener("mousemove", touchMove);
  slide.addEventListener("mouseleave", touchEnd);
});

window.addEventListener("resize", setPositionByIndex);

function getPositionX(event) {
  return event.type.includes("mouse") ? event.pageX : event.touches[0].clientX;
}

function touchStart(i) {
  return function (event) {
    currentIndex = i;
    startPos = getPositionX(event);
    isDragging = true;
    animationID = requestAnimationFrame(animation);
  };
}

function touchMove(event) {
  if (isDragging) {
    const currentPosition = getPositionX(event);
    currentTranslate = prevTranslate + currentPosition - startPos;
  }
}

function touchEnd() {
  cancelAnimationFrame(animationID);
  isDragging = false;
  const movedBy = currentTranslate - prevTranslate;

  // Snap to next slide
  if (movedBy < -100 && currentIndex < slides.length - 1) currentIndex += 1;

  // Snap to previous slide
  if (movedBy > 100 && currentIndex > 0) currentIndex -= 1;

  setPositionByIndex();
}

function animation() {
  setSliderPosition();
  if (isDragging) requestAnimationFrame(animation);
}

function setPositionByIndex() {
  currentTranslate = currentIndex * -window.innerWidth;
  prevTranslate = currentTranslate;
  setSliderPosition();
  setProgressBar();
}

function setProgressBar() {
  const progressBar = document.querySelector(".slider__bar");
  let progress = currentIndex * 100;
  progressBar.style.transform = `translateX(${progress}%)`;
}

function setSliderPosition() {
  slider.style.transform = `translateX(${currentTranslate}px)`;
}
