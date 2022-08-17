import Swiper, {FreeMode} from 'swiper';
import {Fancybox} from "@fancyapps/ui";
import IMask from 'imask';
import "@fancyapps/ui/dist/fancybox.css";
import 'swiper/css';

document.addEventListener('DOMContentLoaded', () => {
    const choiceSlider = new Swiper('.choice-slider', {
        slidesPerView: "auto",
        centeredSlides: true,
        freeMode: true,
        breakpoints: {
            319: {
                slidesPerView: 1.2,
                spaceBetween: 8,
            },
            767: {
                centeredSlides: true,
                slidesPerView: "auto",
                spaceBetween: 16
            },
            1279: {
                spaceBetween: 18,
                slidesPerView: "auto",
                centeredSlides: true,
            },
            1699: {
                spaceBetween: 24,
                slidesPerView: "auto",
                centeredSlides: true,
            }
        },
        modules: [FreeMode],
    })

    let changedTab = document.querySelector('.choice-product__changed');

    choiceSlider.on('slideChange', function () {
        const tab = document.querySelector('.choice-product__list li[data-slide="' + choiceSlider.activeIndex + '"]')
        const siblings = getSiblings(tab);

        siblings.forEach(el => el.classList.remove('active'))
        tab.classList.add('active')

        if (matchMedia('(max-width:767.98px)').matches) {
            changedTab.innerHTML = tab.innerHTML
        }
    });

    /* Portfolio slider */
    const portfolioSlider = new Swiper('.portfolio-slider', {
        slidesPerView: "auto",
        freeMode: true,
        slidesOffsetBefore: 24,
        slidesOffsetAfter: 48,
        breakpoints: {
            319: {
                spaceBetween: 8,
                slidesOffsetBefore: 12,
                slidesOffsetAfter: 12
            },
            767: {
                spaceBetween: 14,
                slidesOffsetBefore: 20,
                slidesOffsetAfter: 20
            },
            1279: {
                spaceBetween: 18,
                slidesOffsetBefore: 24,
                slidesOffsetAfter: 24
            },
            1699: {
                spaceBetween: 24,
                slidesOffsetBefore: 24,
                slidesOffsetAfter: 48
            }
        },
        modules: [FreeMode],
    })

    // Init functions

    headerShow()
    computedWidthSlider()
    scrollToTarget()
    activeTabSlider('.choice-product__list li', choiceSlider);
    detectMenuActiveScroll()
    expertTabs()
    yaMapFooter()
    initPhoneMask(document.querySelector('[data-phone]'))
    sendForm()
    checkFilled()

    if (matchMedia('(max-width:1699.98px)').matches) {
        setMaxHeightSlides()
    }

    let runChangeTab = changeTab('.choice-product__changed', '.choice-product__list', '767.98px')
    let runMenu = changeTab('.header__active-nav', '.header__nav', '1279.98px')

    addEventListener('resize', () => {
        resetHeightSlides()
        choiceSlider.update()
        setMaxHeightSlides()
        computedWidthSlider()

        if (!runMenu) runMenu = changeTab('.header__active-nav', '.header__nav', '1279.98px')
        if (!runChangeTab) runChangeTab = changeTab('.choice-product__changed', '.choice-product__list', '767.98px')
    })

    const arrowSlider = {
        left: document.querySelector('.portfolio-slider-arrow__left'),
        right: document.querySelector('.portfolio-slider-arrow__right')
    }

    arrowSlider.left.addEventListener('click', () => portfolioSlider.slidePrev())
    arrowSlider.right.addEventListener('click', () => portfolioSlider.slideNext())

    Fancybox.bind("[data-fancybox]", {
        mainClass: 'expert-popup',
        dragToClose: false
    });
    Fancybox.bind("[data-fancybox-form]", {
        mainClass: 'popup-window',
        dragToClose: false,
        on: {
            destroy: () => {
                document.querySelector('.snack-wrap')
                    .classList
                    .remove('show')
            }
        }
    });


})

/**
 * Вычисление и установка ширины для слайдера с портволио проектов
 */
function computedWidthSlider() {
    const container = document.querySelector('.container'),
        widthContainer = container.clientWidth,
        paddingContainer = parseInt(getComputedStyle(container).getPropertyValue('padding-left')),
        windowWidth = window.outerWidth,
        deltaOffset = (windowWidth - (widthContainer - (paddingContainer * 2))) / 2,
        portfolioContainer = document.querySelector('.portfolio-slider')

    if (matchMedia('(max-width:1279.98px)').matches) {
        portfolioContainer.style.marginLeft = -deltaOffset + 'px'
        portfolioContainer.style.width = 'calc(100% + ' + deltaOffset * 2 + 'px)';
    } else {
        if (portfolioContainer.style.marginLeft) {
            portfolioContainer.style.marginLeft = '0';
        }
        portfolioContainer.style.width = 'calc(100% + ' + deltaOffset + 'px)';
    }
}

/**
 * Сброс высоты слайдеров
 */
function resetHeightSlides() {
    const slides = document.querySelectorAll('.choice-product-item');

    slides.forEach(el => el.style.height = 'auto')
}

/**
 * Установить одинаковую высоту у всех слайдов
 */
function setMaxHeightSlides() {
    const maxHeight = detectMaxHeightElement('.choice-product-item'),
        slides = document.querySelectorAll('.choice-product-item');

    slides.forEach((el) => {
        if (el.clientHeight < maxHeight) el.style.height = maxHeight + 'px'
    })
}

/**
 * Установка класса active табу с удалением у соседних элементов
 * @param slider
 * @param tabClassName {String} Класс табов
 */
function activeTabSlider(tabClassName, slider = undefined) {
    const $tabs = document.querySelectorAll(tabClassName)

    $tabs.forEach((el) => {
        el.addEventListener('click', function () {
            const siblings = getSiblings(this);

            siblings.forEach(el => el.classList.remove('active'))
            this.classList.add('active')

            if (slider) {
                const activeTabIndex = this.getAttribute('data-slide')

                slider.slideTo(activeTabIndex)
            }
        })
    })
}


/**
 * Получение соседних элементов (для ф-ии getSiblings)
 *
 * @param el
 * @param next
 * @param arr
 * @returns {*|*[]}
 */
function getNextPrevElements(el, next, arr = [],) {
    let checkEl = next ? el.nextElementSibling : el.previousElementSibling;

    if (checkEl != null) {
        arr.push(checkEl);
        return getNextPrevElements(checkEl, next, arr);

    } else return arr;
}

function getSiblings($this) {
    return [...getNextPrevElements($this, false), ...getNextPrevElements($this, true)];
}

/**
 * Определение максимальной высоты среди элементов
 * @param el
 * @returns {number}
 */
function detectMaxHeightElement(el) {
    const elements = document.querySelectorAll(el);
    let maxHeight = 0;

    elements.forEach(el => maxHeight = el.clientHeight > maxHeight ? el.clientHeight : maxHeight)

    return maxHeight;
}

/**
 * Табы на мобильном для слайдера с выбором решения
 * @param select {String}
 * @param list {String}
 * @param media {String}
 * @returns {boolean}
 */
function changeTab(select, list, media) {
    if (matchMedia('(max-width:' + media + ')').matches) {
        const changed = document.querySelector(select),
            tabList = document.querySelectorAll(list + ' li');

        function closeMenuOuterTouch(e) {
            if (!e.target.closest(list) && !e.target.classList.contains(select.slice(1))) {
                changed.classList.remove('open');
            }
        }

        changed.addEventListener('click', () => {
            if (!changed.classList.contains('open')) {
                changed.classList.add('open')
                document.addEventListener('touchstart', closeMenuOuterTouch)
            } else {
                changed.classList.remove('open')
                document.removeEventListener('touchstart', closeMenuOuterTouch)
            }
        })

        tabList.forEach((el) => {
            el.addEventListener('click', function () {
                changed.innerHTML = "<span>" + this.innerHTML + "</span>";
                changed.classList.remove('open')
                document.removeEventListener('touchstart', closeMenuOuterTouch)
            })
        })

        return true
    }
}


/**
 * Скролл к якорю
 */
function scrollToTarget() {
    document.querySelectorAll('[data-scroll]').forEach(link => {

        link.addEventListener('click', function (e) {
            e.preventDefault();


            let href = this.getAttribute('data-scroll');

            const scrollTarget = document.querySelector('[data-scroll-target=' + href + ']');

            const topOffset = document.querySelector('.header').offsetHeight;
            const elementPosition = scrollTarget.getBoundingClientRect().top;
            const offsetPosition = elementPosition - topOffset;
            const siblings = getSiblings(this);

            this.classList.add('active')
            siblings.forEach(el => el.classList.remove('active'))

            scrollBy({
                top: offsetPosition,
                behavior: 'smooth'
            });
            localStorage.test = '1'
        });
    });
}

/**
 * Отображение выплываюей шапки
 */
function headerShow() {
    const posTop = document.querySelector('.partners').offsetTop
    const header = document.querySelector('.header')

    addEventListener('scroll', () => {
        if (scrollY > posTop) {
            header.classList.add('show')
        } else {
            header.classList.remove('show')
        }
    })
}

/**
 * Определение активного класса меню при скролле к соответствующей секции
 */
function detectMenuActiveScroll() {
    const sections = document.querySelectorAll('[data-scroll-target]')
    let elementPositions = {}

    sections.forEach((el) => {
        elementPositions[el.getAttribute('data-scroll-target')] = el.offsetTop
    })

    const arKeys = Object.keys(elementPositions)
    const delay = {
        pos: 0
    }
    addEventListener('scroll', () => {
        const scroll = scrollY + 300;


        if (localStorage.test === '1') {
            delay.pos = scroll
            setTimeout(() => {
                if (delay.pos === scroll) {
                    computedActive(arKeys, elementPositions, scroll)
                    localStorage.test = '0'
                }
            }, 50)
        } else {
            computedActive(arKeys, elementPositions, scroll)
        }
    })
}

/**
 * Вычисление активного класса для меню (для ф-ии detectMenuActiveScroll)
 * @param arKeys { Array } Массив значений аттрибута data-scroll-target
 * @param elementPositions { Object } Объект ключей и значений позиции от верха страницы элементов с  data-scroll-target
 * @param scroll { Number } Позиция скрола
 * @returns {boolean}
 */

function computedActive(arKeys, elementPositions, scroll) {
    for (let i = 0; i <= arKeys.length; i++) {
        if (scroll < elementPositions[arKeys[0]]) {
            document.querySelector('[data-scroll=' + arKeys[0] + ']')
                .classList
                .remove('active')
            return false;
        }
        if (arKeys[i + 1]) {
            if (scroll > elementPositions[arKeys[i]] && scroll < elementPositions[arKeys[i + 1]]) {
                setActiveMenu(arKeys[i])
                return false;
            }
        } else {
            if (scroll > elementPositions[arKeys[i]]) {
                setActiveMenu(arKeys[i])
                return false;
            }
        }
    }
}

/**
 * Устанавливаем активный класс меню при скролле (для ф-ии computedActive)
 * @param target { String } Значение для data-scroll
 */
function setActiveMenu(target) {
    const el = document.querySelector('[data-scroll=' + target + ']')
    const siblings = getSiblings(el);

    el.classList.add('active')
    if (matchMedia('(max-width:1279.98px) and (min-width:767.98px)').matches) {
        document.querySelector('.header__active-nav').innerHTML = "<span>" + el.innerHTML + "</span>"
    }
    siblings.forEach(el => el.classList.remove('active'))
}

/**
 * Табы кейсов и статей в блоке экспертов
 */
function expertTabs() {
    const tabs = document.querySelectorAll('.experts-card-cases-list [data-tab]')

    tabs.forEach((el) => {
        el.addEventListener('click', function () {
            const siblings = getSiblings(this);

            this.closest('.experts-card-cases')
                .setAttribute('data-active-tab', this.getAttribute('data-tab'))

            this.classList.add('active')
            siblings.forEach(el => el.classList.remove('active'))
        })
    })
}

/**
 * Яндекс карта в футере
 */
function yaMapFooter() {
    ymaps.ready(init);

    let $sizeIcon = {
        size: [120, 120],
        offset: [-60, -110]
    }

    if (matchMedia('(max-width: 1699.98px) and (min-width: 767.98px)').matches) {
        $sizeIcon = {
            size: [100, 100],
            offset: [-50, -90]
        }
    } else if (matchMedia('(max-width: 767.98px)').matches) {
        $sizeIcon = {
            size: [80, 80],
            offset: [-40, -70]
        }
    }

    function init() {
        let myMap = new ymaps.Map("map", {
                center: [56.29960056843114, 44.07893849999999],
                zoom: 14,
                controls: []
            }),
            myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
                hintContent: 'ООО «Протон»',
                balloonContent: '<div style="font-size: 18px">' +

                    'ООО «Протон»\n' +
                    '<br><span style="font-size: 14px">Ежедневно с 9:00 до 18:00</span>\n' +
                    '<br>г. Нижний Новгород,\n' +
                    '<br>ул. Родионова, д. 203, оф. 405</div>'
            }, {
                iconLayout: 'default#image',
                iconImageHref: 'images/protonGroup/place.png',
                iconImageSize: $sizeIcon.size,
                iconImageOffset: $sizeIcon.offset
            })
        myMap.geoObjects
            .add(myPlacemark);
    }
}

/**
 * Маска для телефона
 * @param el
 */
function initPhoneMask(el) {
    new IMask(el, {
        mask: '+7 (000) 000-00-00',
        prepare: (val, masked) => !masked.value && val === '8' ? "" : val
    });
}

/**
 * Отправка формы с проверкой на заполненность обязательных полей
 */
function sendForm() {
    document.addEventListener('submit', (e) => {
        if (e.target.getAttribute('data-form') !== null) {
            e.preventDefault()

            const fields = e.target.querySelectorAll('[data-field][data-req]')

            // Получаем массив незаполненных обязательных полей
            const emptyFields = Array.prototype
                .slice
                .call(fields)
                .filter(field => !field.value)

            // Выводим ошибку
            printFormErrors(emptyFields)
            if (!emptyFields.length) {
                fetch('/', {}).then(r => {
                    // onAjaxSuccess(r)
                    showSnack('success')
                })
            } else {
                showSnack()
            }
        }
    });
}

/**
 * Добавление ошибки обязательному для заполнения полю (для ф-ии sendForm)
 * @param emptyFields { Array } Массив с незаполненными полями
 */
function printFormErrors(emptyFields) {
    if (emptyFields.length) {
        emptyFields.forEach((empty) => {
            const parent = empty.closest('.form-group')

            parent.classList.add('has-error')
            resetErrorField(empty)
        })
    }
}

/**
 * Всплываюшее окно об успехе/провале отправки данных
 *
 * @param response
 */
function onAjaxSuccess(response) {
    let textMessage = "К сожалению произошла ошибка отправки данных. <br> Пожалуйста повторите позже.";

    if (response["status"] === true) {
        textMessage = response["message"];
    }
    Fancybox.close();

    /*Создаем окно успешной отправки*/
    document.body.insertAdjacentHTML("beforeend", "<div id='success-message' style='display: none; text-align: center'>" +
        textMessage + "</div>");

    const fancybox = new Fancybox([
        {src: "#success-message", type: "inline"}
    ]);

    /*Удаляем сообщение успешной отправки после закрытия попапа*/
    new Promise(resolve => {
        fancybox.on("destroy", () => resolve());

    }).then(() => document.getElementById('success-message').remove())
}

/**
 * Сброс ошибки при изменении поля
 * @param el
 */
function resetErrorField(el) {
    el.addEventListener('input', () => {
        let parent = el.closest('.form-group')

        if (el.value) {
            if (parent.classList.contains('has-error')) {
                parent.classList.remove('has-error')
            }
        } else {
            if (el.getAttribute('data-req') === 'Y') {
                parent.classList.add('has-error')
            }
        }
    })
}

/**
 * Проверка полей на заполненность и присвоение класса
 */
function checkFilled() {
    document.addEventListener('input', (e) => {
        const $this = e.target

        if ($this.getAttribute('data-field') !== null) {
            if ($this.value) {
                $this.classList.add('filled')
            } else {
                $this.classList.remove('filled')
            }
        }
    })
}

/**
 * Отображение снэка
 * @param type { String } Тип error|success
 */
function showSnack(type = 'error') {
 const error = document.querySelector('.snack-wrap')

    error.classList.add('show')
    error.classList.add('show--' + type)

    setTimeout( () => {
        error.classList.remove('show')

        setTimeout( () => {error.classList.remove('show--' + type)}, 500)
    }, 3000)
}
