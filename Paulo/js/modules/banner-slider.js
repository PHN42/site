const sliderItems = document.querySelectorAll('[data-banner="item"]');
const slider = document.querySelector('[data-banner="slider"]')
const btnNext = document.querySelector('[data-banner="btn-next"]')
const btnPrevious = document.querySelector('[data-banner="btn-previous"]')
const btnControls = document.querySelectorAll('[data-banner="btn-control"]')
const imgTitles = document.querySelectorAll('[data-banner="img-title"]')
const state = {
    mouseDownPosition: 0,
    movementPosition: 0,
    lastTranslatePosition: 0,
    currentSliderPosition: 0,
    currentSlideIndex: 0
};

function translateSlaide(position) {
    state.lastTranslatePosition = position
    slider.style.transform = `translateX(${position}px)`
};

function getCenterPosition(index) {
    const slide = sliderItems[index]
    const margin = (window.innerWidth - slide.offsetWidth) / 2
    const centerPosition = margin - (slide.offsetWidth * index)
    return centerPosition
};

function forwardSlide() {
    if (state.currentSlideIndex < sliderItems.length - 1) {
        setVisibleSlide(state.currentSlideIndex + 1)
    } else {
        setVisibleSlide(state.currentSlideIndex)
    }
};

function backwadSlide() {
    if (state.currentSlideIndex > 0) {
        setVisibleSlide(state.currentSlideIndex - 1)
    } else {
        setVisibleSlide(state.currentSlideIndex)
    }
};

function animateTransition(active) {
    if (active) {
        slider.style.transition = 'transform .3s'
    } else {
        slider.style.removeProperty('transition')
    }
};

function activeControlButton(index) {
    btnControls.forEach(function (item) {
        item.classList.remove('active')
    })
    const btnControl = btnControls[index]
    btnControl.classList.add('active')
}

function activeImageTitle(index) {
    imgTitles.forEach(function (item) {
        item.classList.remove('active')
    })
    const imgTitle = imgTitles[index]
    imgTitle.classList.add('active')
}

function setVisibleSlide(index) {
    state.currentSlideIndex = index
    const position = getCenterPosition(index)
    activeControlButton(index)
    activeImageTitle(index)
    animateTransition(true)
    translateSlaide(position)
};

function preventDefault(event) {
    event.preventDefault()
};

function onControlButtonClick(event, index) {
    setVisibleSlide(index)
}

function onMouseDown(event, index) {
    const slide = event.currentTarget
    state.mouseDownPosition = event.clientX
    state.currentSliderPosition = event.clientX - state.lastTranslatePosition
    state.currentSlideIndex = index
    animateTransition(false)
    slide.addEventListener('mousemove', onMouseMove)
};

function onMouseMove(event) {
    state.movementPosition = event.clientX - state.mouseDownPosition
    translateSlaide(event.clientX - state.currentSliderPosition)
};

function onMouseUp(event) {
    const slide = event.currentTarget
    if (state.movementPosition > 150) {
        backwadSlide()

    } else if (state.movementPosition < -150) {
        forwardSlide()
    } else {
        const calc = getCenterPosition(state.currentSlideIndex)
        translateSlaide(calc)
    }
    slide.removeEventListener('mousemove', onMouseMove)
};

function onMouseLeave(event) {
    const slide = event.currentTarget
    slide.removeEventListener('mousemove', onMouseMove)
};

function setlisteners() {
    btnNext.addEventListener('click', forwardSlide)
    btnPrevious.addEventListener('click', backwadSlide)
    sliderItems.forEach(function (slide, index) {
        const link = slide.querySelector('.banner-slider_link')
        link.addEventListener('click', preventDefault)
        slide.addEventListener('dragstart', preventDefault)
        slide.addEventListener('mousedown', function (event) {
            onMouseDown(event, index)
        })
        slide.addEventListener('mouseup', onMouseUp)
        slide.addEventListener('mouseleave', onMouseLeave)
        btnControls[index].addEventListener('click', function (event) {
            onControlButtonClick(event, index)
        })

    })
};

function init() {
    setVisibleSlide(1)
    setlisteners()
};

export default {
    init
};