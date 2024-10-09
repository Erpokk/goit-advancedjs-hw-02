import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector('.form');
const msInput = document.querySelector('input[type=number]');
const radioButtons = document.querySelectorAll('input[name="state"]');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const delay = Number(msInput.value);
    const isFulfilled = Array.from(radioButtons).some(radio => radio.checked && radio.value === "fulfilled");

    createPromise(delay, isFulfilled)
        .then((delay) => {
            console.log(`✅ Fulfilled promise in ${delay}ms`);
            iziToast.show({
                title: '✅',
                message: `Fulfilled promise in ${delay}ms`,
                position: 'topRight',
                color: 'green',
            });
        })
        .catch((delay) => {
            console.log(`❌ Promise rejected after ${delay}ms`);
            iziToast.show({
                title: '❌',
                message: `Promise rejected after ${delay}ms`,
                position: 'topRight',
                color: 'red',
            });
        });
    
    form.reset()
});

// Функция для создания промиса
function createPromise(delay, isFulfilled) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (isFulfilled) {
                resolve(delay); // Выполняем промис
            } else {
                reject(delay); // Отклоняем промис
            }
        }, delay);
    });
}