import flatpickr from "flatpickr";
import iziToast from "izitoast";

import "flatpickr/dist/flatpickr.min.css";
import "izitoast/dist/css/iziToast.min.css";

let userSelectedDate = null;

const btn = document.querySelector("button[data-start]");
const input = document.querySelector("#datetime-picker");

// Блокируем кнопку старта по умолчанию
btn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    // Проверяем, если выбранная дата меньше текущей
    if (selectedDate < new Date()) {
      iziToast.show({
        title: 'Error',
        message: 'Please choose a date in the future!',
        position: 'topCenter',
        color: 'red',
      });

      btn.disabled = true;
      return;
    }

    iziToast.show({
      title: 'Success',
      message: 'Date is valid. Let\'s go!',
      position: 'topCenter',
      color: 'green',
    });

    btn.disabled = false; // Разблокируем кнопку при корректной дате
    userSelectedDate = selectedDate;
    timer.deadline = userSelectedDate; // Устанавливаем дедлайн для таймера
  },
};

document.addEventListener("DOMContentLoaded", function() {
  flatpickr("#datetime-picker", options);
});

const timer = {
  deadline: null,
  elements: {
    days: document.querySelector("span[data-days]"),
    hours: document.querySelector("span[data-hours]"),
    minutes: document.querySelector("span[data-minutes]"),
    seconds: document.querySelector("span[data-seconds]"),
  },
  intervalId: null,
  start() {
    if (!this.deadline) {
      console.log("Выберите дату для старта таймера");
      return;
    }

    // Блокируем инпут и кнопку "Старт" при запуске таймера
    input.disabled = true;
    btn.disabled = true;

    this.stop(); // Останавливаем предыдущий таймер, если он был запущен

    this.intervalId = setInterval(() => {
      const diff = this.deadline - new Date();

      if (diff <= 0) {
        this.stop();
        console.log('Таймер остановлен!');

        // Разблокируем инпут после окончания таймера
        input.disabled = false;
        return;
      }

      const { days, hours, minutes, seconds } = this.getTimeObject(diff);

      // Не используем pad для дней, так как может быть более 2-х цифр
      this.elements.days.textContent = days;
      this.elements.hours.textContent = this.pad(hours);
      this.elements.minutes.textContent = this.pad(minutes);
      this.elements.seconds.textContent = this.pad(seconds);
    }, 1000);
  },
  stop() {
    if (this.intervalId === null) return;

    clearInterval(this.intervalId);
    this.intervalId = null; // Сбрасываем ID таймера
  },
  getTimeObject(diff) {
    return {
      days: Math.floor(diff / 1000 / 60 / 60 / 24),
      hours: Math.floor(diff / 1000 / 60 / 60) % 24,
      minutes: Math.floor(diff / 1000 / 60) % 60,
      seconds: Math.floor(diff / 1000) % 60,
    };
  },
  pad(value) {
    return String(value).padStart(2, '0');
  },
};

// Запускаем таймер по клику на кнопку
btn.addEventListener('click', () => {
  timer.start();
});
