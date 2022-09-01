const slider = ()=> {

    const slides = document.querySelectorAll('.menu__item'),
          slidesWrapper = document.querySelector('.menu__sliders'),
          slidesField = document.querySelector('.menu__inner'),
          next = document.querySelector('.menu__arrow-right'),
          prev = document.querySelector('.menu__arrow-left'),
          width = window.getComputedStyle(slidesWrapper).width;

          let offset = 0;

          slidesField.style.width = 100 * slides.length + '%';
          slidesField.style.display = 'flex';
          slidesField.style.transition = '0.5s all';

         // slidesWrapper.style.overflow = 'hidden';

        
}
export default slider;
