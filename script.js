let config = {
    blackWord: ['1c', '1с', 'офис', 'разработчик', 'программист', 'аналитик', 'менеджер', 'стажер', 'системный', 'начинающий', 'auto', 'автоматизатор', 'автоматизация', 'автоматизации'],
    minSalary: 120000,      // минимальная зарплата
    skipNotSalary: 0,       // 1 – пропуск вакансий без ЗП, 0 – не пропускать
    relocate: 1,            // 1 – откликаться на вакансии из другой страны, 0 – нет
    autoRes: 1,             // 1 – автоперелистывание, 0 – нет
};

// Массивы для логирования откликов (используются также для вывода в консоль)
let result = [];
let badResult = [];
let categoryView = '';
let vacations;
const version = '1.0';

const styleMin = `@import url(https://fonts.googleapis.com/css2?family=Fira+Sans+Condensed&display=swap);.vf,.vf-start-stop{display:flex;flex-direction:row}.vf{position:fixed;top:8px;left:8px;z-index:9999999}.vf.hide{height:31px;overflow:hidden;width:288px;border-radius:8px}.vf-main-header{position:relative}.vf-panel-hide-open{position:absolute;cursor:pointer;top:0;right:0;transition:color .2s,background-color .2s}.vf-a-del:hover,.vf-a-to-suc:hover,.vf-panel-hide-open:hover,.vf-start:hover,.vf-stop:hover{color:#fff}.vf-main,.vf-menu{padding:8px;border-radius:8px;margin-right:8px;background-color:#d6b25e;color:#2b2b2b;min-width:288px;max-width:288px;height:-moz-fit-content;height:fit-content;box-sizing:border-box}.vf-main *,.vf-menu *{font-family:"Fira Sans Condensed",serif;font-weight:400;font-style:14px;box-sizing:border-box;margin:0;padding:0}.vf-main a,.vf-menu a{text-decoration:none;color:#fff;display:inline-block}.vf-main__item,.vf-menu__item{margin-top:8px;padding:8px;border-radius:8px;transition:color .2s,background-color .2s}.vf-main__item p:first-child,.vf-menu__item p:first-child{margin-bottom:8px}.vf-status{background-color:#857257;color:#fff;overflow:hidden;text-overflow:ellipsis;line-height:14px;height:28px;box-sizing:content-box}.vf-start,.vf-succ-res:hover{background-color:#719156}.vf-start-stop{margin:16px 0;padding-left:0}.vf-menu-header,.vf-settings{flex-direction:row;display:flex}.vf-start,.vf-stop{padding:8px;border-radius:96px;transition:color .2s,background-color .2s;cursor:pointer}.vf-start{color:#84f82d;margin-right:8px}.vf-stop{background-color:#bc725f;color:#ffd2c6}.vf-fail-res,.vf-succ-res{cursor:pointer;background-color:#857257}.vf-succ-res p:first-child{color:#84f82d;margin-bottom:8px}.vf-fail-res p:first-child{color:#ffd2c6;margin-bottom:8px}.vf-fail-res:hover{background-color:#bc725f}.vf-settings{justify-content:space-between;color:#fff;padding-left:0;padding-right:0;cursor:pointer}.vf-settings>*{background-color:#857257;padding:8px;border-radius:96px}.vf-menu-header{align-items:center;justify-content:space-between;border-bottom:1px solid #2b2b2b;padding-bottom:8px;margin-bottom:8px}.vf-menu-close{cursor:pointer}.vf-menu__content__item{border-bottom:1px solid #857257;padding-bottom:8px;margin:8px 0}.vf-menu__content__item input,.vf-menu__content__item select,.vf-menu__content__item textarea{width:100%;background-color:#857257;color:#fff;padding:8px;font-weight:14px;font-size:14px;outline:0;resize:none;border-radius:8px;margin-top:4px;border:none}.vf-menu__content__item textarea{height:58px}.vf-toggle{display:flex;flex-direction:row;margin:8px 0}.vf-see-not>:not(.vf-main-header),.vf-toggle__item input[type=radio]{display:none}.vf-a-def,.vf-toggle__item input[type=radio]:checked+label{background-color:#857257;color:#fff}.vf-toggle__item:first-child label{border-radius:8px 0 0 8px;border-right:none}.vf-toggle__item:last-child label{border-radius:0 8px 8px 0}.vf-toggle__item label{display:block;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none;padding:8px;color:#2b2b2b;border:1px solid #2b2b2b;transition:color .2s,background-color .2s}.vf-vacancies{max-height:480px;overflow-y:auto;overflow-x:hidden;scrollbar-width:thin;scrollbar-color:#857257 transparent}.vf-vacancies::-webkit-scrollbar{width:8px}.vf-vacancies::-webkit-scrollbar-track{background:0 0}.vf-vacancies::-webkit-scrollbar-thumb{background-color:#857257}.vf-vacancies__item{border-bottom:1px solid #857257;margin-top:8px}.vf-vacancies__item:last-child{border:none}.vf-vacancies__info{margin-top:8px}.vf-vacancies__info p:first-child{color:#857257;font-size:12px}.vf-vacancies__info a,.vf-vacancies__info div{padding:8px;border-radius:96px;display:inline-block;margin-bottom:8px;width:-moz-max-content;width:max-content;transition:color .2s,background-color .2s;cursor:pointer}.vf-a-del{background-color:#bc725f;color:#ffd2c6}.vf-a-to-suc{background-color:#719156;color:#84f82d}.vf-panel-not{padding-top:32px;width:100%;height:100%;top:0;left:0;background-color:#d6b25e}.vf-panel-not-btn{background-color:#857257;color:#fff;padding:8px;margin-top:8px;border-radius:96px;cursor:pointer;display:inline-block}.vf-see-not .vf-panel-not{display:block!important}`;

function runWhenConditionTrue(conditionFn, callback, interval) {
    const checkCondition = () => {
        if (conditionFn()) {
            clearInterval(intervalId);
            callback();
        }
    };
    const intervalId = setInterval(checkCondition, interval || 200);
}

function showVacations() {
    // Определяем ключ LS в зависимости от категории
    const storageKey = categoryView === 'Успешные отклики' ? 'vf-resultN' : 'vf-badresultN';
    const jsonData = localStorage.getItem(storageKey);

    // Элементы контейнера
    const container = document.querySelector('.vf-menu-vacancies');
    const vacBlock = container.querySelector('.vf-vacancies');

    // Обновляем заголовок окна
    container.querySelector('.vf-menu-title').innerText = categoryView;

    if (!jsonData) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'block';

    let data;
    try {
        data = JSON.parse(jsonData);
    } catch (e) {
        console.error('Ошибка парсинга JSON:', e);
        container.style.display = 'none';
        return;
    }

    // Собираем все вакансии в единый массив
    let vacancies = [];
    for (const date in data) {
        if (data.hasOwnProperty(date)) {
            const vacancyList = data[date];
            vacancyList.forEach((vac, index) => {
                // Если есть флаг hide === true – пропускаем этот элемент
                if (vac.hide === true) return;

                // Название вакансии и компании – если нет данных, подставляем "Нет данных"
                let title = (!vac["Название"] || vac["Название"].toLowerCase() === "нет данных") ? "Нет данных" : vac["Название"];
                let company = (!vac["Компания"] || vac["Компания"].toLowerCase() === "нет данных") ? "Нет данных" : vac["Компания"];
                let city = (!vac["Город"] || vac["Город"].toLowerCase() === "нет данных") ? "Нет данных" : vac["Город"];

                const dataTitle = (title + company + city).toLowerCase().replaceAll('нет данных', '');

                // Обработка зарплаты:
                let salaryRaw = vac["ЗП"];
                let salaryText;
                let salaryNumeric = 0;

                if (!salaryRaw || salaryRaw.toLowerCase() === "не указана") {
                    salaryText = "Не указана";
                } else {
                    salaryText = salaryRaw;
                    salaryMatch = salaryText.match(/(\d{1,3}(?: \d{3})*)/g);

                    if (salaryMatch) {
                        const salaries = salaryMatch.map(s => parseInt(s.replace(/[  ]/g, ''), 10));
                        salaryNumeric = Math.max(...salaries);
                    }
                }

                // Ссылка на вакансию (если отсутствует, подставляем "#")
                const link = vac["Ссылка"] || "#";

                // Для поиска объединяем название и компанию (приводим к нижнему регистру)

                vacancies.push({
                    id: date + '.' + index,
                    date: date,
                    title: title,
                    company: company,
                    city: city,
                    salary: salaryNumeric,
                    salaryText: salaryText,
                    link: link,
                    dataTitle: dataTitle
                });
            });
        }
    }

    // Получаем текущие параметры фильтрации и сортировки
    const searchInput = container.querySelector('input[type="text"]');
    const sortSelect = container.querySelector('select[name="sort"]');
    const searchTerm = (searchInput.value || '').toLowerCase().trim();
    const sortType = sortSelect.value; // ожидаемые значения: "new", "old", "highSalary", "noSalary"

    // Фильтрация по поисковому запросу (если введён текст, ищем его в объединённом названии + компании)
    if (searchTerm) {
        vacancies = vacancies.filter(v => v.dataTitle.indexOf(searchTerm) !== -1);
    }

    // Сортировка
    if (sortType === 'new') {
        // Сначала новые – более поздняя дата должна быть выше
        vacancies.sort((a, b) => {
            const [dA, mA, yA] = a.date.split('.');
            const [dB, mB, yB] = b.date.split('.');
            return new Date(yB, mB - 1, dB) - new Date(yA, mA - 1, dA);
        });
    } else if (sortType === 'old') {
        // Сначала старые – более ранняя дата первой
        vacancies.sort((a, b) => {
            const [dA, mA, yA] = a.date.split('.');
            const [dB, mB, yB] = b.date.split('.');
            return new Date(yA, mA - 1, dA) - new Date(yB, mB - 1, dB);
        });
    } else if (sortType === 'highSalary') {
        // Сначала с большой ЗП
        vacancies.sort((a, b) => b.salary - a.salary);
    } else if (sortType === 'noSalary') {
        // Сначала вакансии с ЗП равной 0
        vacancies.sort((a, b) => {
            if (a.salary === 0 && b.salary !== 0) return -1;
            if (a.salary !== 0 && b.salary === 0) return 1;
            return 0;
        });
    }

    // Очищаем контейнер перед рендерингом новых элементов
    vacBlock.innerHTML = '';

    // Рендерим новые блоки для каждой вакансии
    vacancies.forEach(v => {
        const item = document.createElement('div');
        item.className = 'vf-vacancies__item';
        item.setAttribute('data-id', v.id);
        item.setAttribute('data-date', v.date);
        item.setAttribute('data-title', v.dataTitle);
        item.setAttribute('data-salary', v.salary);

        item.innerHTML = `
        <div class="vf-vacancies__info">
            <p>Дата отклика</p>
            <p>${v.date}</p>
        </div>
        <div class="vf-vacancies__info">
            <p>Название</p>
            <p>${v.title}</p>
        </div>
        <div class="vf-vacancies__info">
            <p>Компания</p>
            <p>${v.company}</p>
        </div>
        <div class="vf-vacancies__info">
            <p>Город</p>
            <p>${v.city}</p>
        </div>
        <div class="vf-vacancies__info">
            <p>Зарплата</p>
            <p>${v.salaryText}</p>
        </div>
        <div class="vf-vacancies__info">
            <a href="${v.link}" target="_blank" class="vf-a-def">Ссылка на вакансию</a>
            <div class="vf-a-del">Удалить</div>
            ${categoryView === 'Успешные отклики' ? '' : '<div class="vf-a-to-suc">Перенести в успешные</div>'}
        </div>
        `;

        vacBlock.appendChild(item);
    });
}

function hideVacations() {
    const container = document.querySelector('.vf-menu-vacancies');
    container.style.display = 'none';

    const vacBlock = container.querySelector('.vf-vacancies');
    vacBlock.innerHTML = '';

    const searchInput = container.querySelector('input[type="text"]');
    const sortSelect = container.querySelector('select[name="sort"]');

    searchInput.value = '';
    sortSelect.value = '';
}

function showPanel() {
    // Если панель ещё не создана
    if (!document.querySelector('.vf')) {

        // Определяем, на какой странице мы находимся
        let blockStartStop = '<p>Вы находитесь не на той странице. Запустите этот код еще раз, на странице поиска! Пример <a href="https://cheboksary.hh.ru/search/vacancy?text=тестировщик&L_save_area=true">тут</a></p>';
        if (document.querySelector('#a11y-main-content') && document.querySelector('#a11y-main-content .magritte-redesign')) {
            blockStartStop = `
            <div class="vf-start">Запустить</div>
            <div class="vf-stop" style="display: none;">Остановить</div>`;
        }

        // Если в LS уже есть сохранённые настройки, берём их
        if (localStorage.getItem('vf-config')) {
            config = JSON.parse(localStorage.getItem('vf-config'));
        }

        // Функция для сохранения настроек в LS
        function saveConfig() {
            localStorage.setItem('vf-config', JSON.stringify(config));
        }

        // Вставляем HTML панели в начало body
        document.body.insertAdjacentHTML('afterbegin', `
            <style>${styleMin}</style>
            <div class="vf">
                <div class="vf-main ${localStorage.getItem('vf-config') ? '' : 'vf-see-not'}">
                    <div class="vf-main-header">
                        <div class="vf-panel-hide-open">Скрыть</div>
                        <div class="vf-panel-not" style="display: none;">
                            <p>Похоже, ты впервые используешь этого помощника или все твои данные пропали. Вся информация хранится только в твоем браузере, поэтому не удаляй данные и куки, не используй режим инкогнито, иначе ничего не сохранится.<br>Бот пока не умеет многое, например, передавать твое сопроводительное письмо. Поэтому, если у тебя появится окно для ввода письма, напиши его и отправь, а бот затем продолжит свою работу.<br> Если у тебя есть вопросы или идеи для улучшения, пиши сюда: <a href="https://t.me/vf_hh_ru_bot" target="_blank">https://t.me/vf_hh_ru_bot</a>. <br> Для начала рекомендую настроить все под себя — перейди в настройки. Также не забудь, чтобы бот работал, сначала перейти на страницу поиска <a href="https://cheboksary.hh.ru/search/vacancy?text=тестировщик&L_save_area=true" target="_blank">пример</a> и заново запустить этот скрипт в консоли.</p>
                            <center><div class="vf-panel-not-btn">Понятно</div></center>
                        </div>
                    </div>
                    <p>Статус</p>
                    <div class="vf-main__item vf-status">
                        Ждем запуска. Если вы готовы, то нажмите на кнопку "Запустить" 
                    </div>
                    <div class="vf-main__item vf-start-stop">${blockStartStop}</div>
                    <div class="vf-main__item vf-succ-res">
                        <p>Успешных откликов</p>
                        <p>За сегодня: 0</p>
                        <p>Всего: 0</p>
                    </div>
                    <div class="vf-main__item vf-fail-res">
                        <p>Неудачных откликов</p>
                        <p>За сегодня: 0</p>
                        <p>Всего: 0</p>
                    </div>
                    <div class="vf-main__item vf-settings">
                        <div class="vf-settings-open">Настройки</div>
                        <a href="https://t.me/vf_hh_ru_bot" target="_blank">Версия ${version}</a>
                    </div>
                </div>
                <div class="vf-menu vf-menu-settings" style="display: none;">
                    <div class="vf-menu-header">
                        <div class="vf-menu-title">Настройки</div>
                        <div class="vf-menu-close" title="Закрыть">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#2b2b2b">
                                <path d="M0 0h24v24H0V0z" fill="none"/>
                                <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/>
                            </svg>
                        </div>
                    </div>
                    <div class="vf-menu__content">
                        <div class="vf-menu__content__item">
                            <p>Список черных слов. Перечислите их через запятую. Если в названии вакансии есть какое-то из этих слов, то мы пропускаем эту вакансию.</p>
                            <textarea name="blackWord"></textarea>
                        </div>
                        <div class="vf-menu__content__item">
                            <p>Минимальная зарплата вакансии в руб.</p>
                            <input type="number">
                        </div>
                        <div class="vf-menu__content__item">
                            <p>Если у вакансии НЕ указана зарплата</p>
                            <div class="vf-toggle">
                                <div class="vf-toggle__item">
                                    <input id="notSalary-1" type="radio" name="notSalary" value="see">
                                    <label for="notSalary-1">Смотрим</label>
                                </div>
                                <div class="vf-toggle__item">
                                    <input id="notSalary-2" type="radio" name="notSalary" value="skip">
                                    <label for="notSalary-2">Пропускаем</label>
                                </div>
                            </div>
                        </div>
                        <div class="vf-menu__content__item">
                            <p>Если вакансия из другой страны</p>
                            <div class="vf-toggle">
                                <div class="vf-toggle__item">
                                    <input id="relocate-1" type="radio" name="relocate" value="see">
                                    <label for="relocate-1">Смотрим</label>
                                </div>
                                <div class="vf-toggle__item">
                                    <input id="relocate-2" type="radio" name="relocate" value="skip">
                                    <label for="relocate-2">Пропускаем</label>
                                </div>
                            </div>
                        </div>
                        <div class="vf-menu__content__item">
                            <p>Если закончили смотреть вакансии на этой странице</p>
                            <div class="vf-toggle">
                                <div class="vf-toggle__item">
                                    <input id="autoRes-1" type="radio" name="autoRes" value="see">
                                    <label for="autoRes-1">Останавливаемся</label>
                                </div>
                                <div class="vf-toggle__item">
                                    <input id="autoRes-2" type="radio" name="autoRes" value="skip">
                                    <label for="autoRes-2">Перелистываем</label>
                                </div>
                            </div>
                        </div>
                        <div class="vf-menu__content__item">
                            Настройки сохраняются автоматически, можете спокойно закрывать.
                        </div>
                        <p>Версия ${version} | Если у вас есть вопросы и предложения по улучшению пишите сюда <a href="https://t.me/vf_hh_ru_bot" target="_blank">t.me/vf_hh_ru_bot</a></p>
                    </div>
                </div>
                <div class="vf-menu vf-menu-vacancies" style="display: none;">
                    <div class="vf-menu-header">
                        <div class="vf-menu-title">Успешные отклики</div>
                        <div class="vf-menu-close" title="Закрыть">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#2b2b2b"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/></svg>
                        </div>
                    </div>
                    <div class="vf-menu__content">
                        <div class="vf-menu__content__item">
                            <p>Поиск среди вакансий</p>
                            <input type="text">
                        </div>
                        <div class="vf-menu__content__item">
                            <p>Сортировка</p>
                            <select name="sort" id="sort">
                                <option value="new">Сначала новые</option>
                                <option value="old">Сначала старые</option>
                                <option value="highSalary">Сначала с большой ЗП</option>
                                <option value="noSalary">Сначала без ЗП</option>
                            </select>
                        </div>
                        <div class="vf-menu__content__item">
                            <div class="vf-vacancies">
                                <div class="vf-vacancies__item">
                                    <div class="vf-vacancies__info">
                                        <p>Дата отклика</p>
                                        <p>01.02.2025</p>
                                    </div>
                                    <div class="vf-vacancies__info">
                                        <p>Название</p>
                                        <p>Тестировщик-автоматизатор/Automation engineer junior</p>
                                    </div>
                                    <div class="vf-vacancies__info">
                                        <p>Зарплата</p>
                                        <p>Не указана</p>
                                    </div>
                                    <div class="vf-vacancies__info">
                                        <a href="" target="_blank" class="vf-a-def">Ссылка на вакансию</a>
                                        <div class="vf-a-del">Удалить</div>
                                        <div class="vf-a-to-suc">Перенести в успешные</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);

        // Функция для обновления значений элементов формы из объекта config
        function updateConfig() {
            document.querySelector('.vf-menu-settings textarea[name="blackWord"]').value = config.blackWord.join(', ');
            document.querySelector('.vf-menu-settings input[type="number"]').value = config.minSalary;
            document.querySelector(`.vf-menu-settings input[name="notSalary"][value="${config.skipNotSalary ? 'skip' : 'see'}"]`).checked = true;
            document.querySelector(`.vf-menu-settings input[name="relocate"][value="${config.relocate ? 'see' : 'skip'}"]`).checked = true;
            document.querySelector(`.vf-menu-settings input[name="autoRes"][value="${config.autoRes ? 'skip' : 'see'}"]`).checked = true;
        }
        updateConfig();

        // Обработчик для открытия/закрытия настроек
        document.querySelector('.vf').addEventListener('click', ({ target }) => {
            if (target.closest('.vf-settings-open')) {
                document.querySelector('.vf-menu-settings').style.display = 'block';
            } else if (target.closest('.vf-menu-close')) {
                target.closest('.vf-menu').style.display = 'none';

                if (target.closest('.vf-menu-vacancies')) {
                    hideVacations();
                }
            } else if (target.closest('.vf-panel-hide-open')) {
                if (document.querySelector('.vf').classList.contains('hide')) {
                    document.querySelector('.vf-panel-hide-open').innerText = 'Скрыть';
                    document.querySelector('.vf').classList.remove('hide')
                } else {
                    document.querySelector('.vf-panel-hide-open').innerText = 'Раскрыть';
                    document.querySelector('.vf').classList.add('hide')
                }
            } else if (target.closest('.vf-succ-res')) {
                categoryView = 'Успешные отклики';
                showVacations();
            } else if (target.closest('.vf-fail-res')) {
                categoryView = 'Неудачные отклики';
                showVacations();
            } else if (target.closest('.vf-panel-not-btn')) {
                document.querySelector('.vf-main').classList.remove('vf-see-not');
                document.querySelector('.vf-menu-settings').style.display = 'block';
            } else if (target.closest('.vf-start')) {
                document.querySelector('.vf-start').style.display = 'none';
                document.querySelector('.vf-stop').style.display = 'block';
                window.stopScVf = false;
                mainSc();
            } else if (target.closest('.vf-stop')) {
                document.querySelector('.vf-start').style.display = 'block';
                document.querySelector('.vf-stop').style.display = 'none';
                window.stopScVf = true;
            } else if (target.closest('.vf-a-del') || target.closest('.vf-a-to-suc')) {
                // Находим карточку вакансии
                const itemVac = target.closest('.vf-vacancies__item');
                if (!itemVac) return;
            
                // Получаем уникальный идентификатор из data-id
                const itemVacId = itemVac.getAttribute('data-id');
                if (!itemVacId) return;
            
                // Разбираем itemVacId на части
                const parts = itemVacId.split('.');
                const date = parts.slice(0, 3).join('.');
                const index = parseInt(parts[3], 10);
            
                // Определяем, была ли нажата кнопка переноса в успешные отклики
                const isSuccessMove = target.closest('.vf-a-to-suc');
            
                // Устанавливаем текущий localStorage (где сейчас вакансия)
                const currentStorageKey = isSuccessMove ? 'vf-badresultN' : 
                                                         (categoryView === 'Успешные отклики' ? 'vf-resultN' : 'vf-badresultN');
            
                // Если нажали `.vf-a-to-suc`, переносим вакансию в успешные отклики (vf-resultN)
                const targetStorageKey = isSuccessMove ? 'vf-resultN' : null;
            
                // Получаем данные из localStorage
                const currentData = localStorage.getItem(currentStorageKey);
                const targetData = isSuccessMove ? localStorage.getItem(targetStorageKey) : null;
            
                let currentJson, targetJson;
                try {
                    currentJson = currentData ? JSON.parse(currentData) : {};
                    targetJson = isSuccessMove ? (targetData ? JSON.parse(targetData) : {}) : null;
                } catch (e) {
                    console.error('Ошибка парсинга JSON:', e);
                    return;
                }
            
                // Проверяем, существует ли запись в текущем хранилище
                if (currentJson.hasOwnProperty(date) && currentJson[date][index] !== undefined) {
                    const vacancy = currentJson[date][index];
            
                    // Если это перенос в успешные отклики, добавляем в конец списка
                    if (isSuccessMove) {
                        if (!targetJson[date]) targetJson[date] = [];
                        targetJson[date].push(vacancy);
                        localStorage.setItem(targetStorageKey, JSON.stringify(targetJson));

                        updateCounters();
                    }
            
                    // Удаляем вакансию из текущего хранилища
                    currentJson[date].splice(index, 1);
                    if (currentJson[date].length === 0) delete currentJson[date];
            
                    // Обновляем localStorage
                    localStorage.setItem(currentStorageKey, JSON.stringify(currentJson));
            
                    // Удаляем карточку из DOM
                    itemVac.style.display = 'none';
                } else {
                    console.warn('Элемент с индексом', index, 'не найден для даты', date);
                }
            }            
        });

        // При изменении списка черных слов обновляем config и сохраняем настройки
        const blackWordInput = document.querySelector('.vf-menu-settings textarea[name="blackWord"]');
        blackWordInput.addEventListener('input', (e) => {
            config.blackWord = e.target.value
                .split(',')
                .map(item => item.trim())
                .filter(item => item !== '');
            saveConfig();
        });

        // Обновление минимальной зарплаты
        const minSalaryInput = document.querySelector('.vf-menu-settings input[type="number"]');
        minSalaryInput.addEventListener('input', (e) => {
            config.minSalary = parseInt(e.target.value, 10) || 0;
            saveConfig();
        });

        // Обновление настройки для вакансий без зарплаты
        const notSalaryRadios = document.querySelectorAll('.vf-menu-settings input[name="notSalary"]');
        notSalaryRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    // Если значение "skip" – пропускаем вакансии без ЗП, иначе смотрим
                    config.skipNotSalary = e.target.value === 'skip' ? 1 : 0;
                    saveConfig();
                }
            });
        });

        // Обновление настройки для вакансий из другой страны
        const relocateRadios = document.querySelectorAll('.vf-menu-settings input[name="relocate"]');
        relocateRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    // Если значение "see" – рассматриваем, иначе пропускаем
                    config.relocate = e.target.value === 'see' ? 1 : 0;
                    saveConfig();
                }
            });
        });

        // Обновление настройки для автоперелистывания
        const autoResRadios = document.querySelectorAll('.vf-menu-settings input[name="autoRes"]');
        autoResRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    // Если значение "skip" – перелистываем, если "see" – останавливаемся
                    config.autoRes = e.target.value === 'skip' ? 1 : 0;
                    saveConfig();
                }
            });
        });

        let debounceTimer;
        const debouncedShowVacations = () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                showVacations();
            }, 1000);
        };

        // Обновляем список при вводе в поисковое поле
        const searchInput = document.querySelector('.vf-menu-vacancies input[type="text"]');
        searchInput.addEventListener('input', debouncedShowVacations);

        // Обновляем список при изменении сортировки
        const sortSelect = document.querySelector('.vf-menu-vacancies select[name="sort"]');
        sortSelect.addEventListener('change', () => {
            showVacations();
        });

        updateCounters();
        saveConfig();

        if (typeof ym === 'function') {
            ym(99893419, 'init', {});
            ym(99893419, 'reachGoal', 'use_pan');
        }
    }
}

function logSee(text) {
    console.log(text);

    const statusBlock = document.querySelector('.vf-status');
    if (statusBlock) {
        statusBlock.innerText = text;
    }
}

function mainSc() {
    runWhenConditionTrue(
        () => document.querySelector('#a11y-main-content') && document.querySelector('#a11y-main-content .magritte-redesign'),
        () => {
            showPanel();

            const main = document.querySelector('#a11y-main-content');
            vacations = main.querySelectorAll('.magritte-redesign');
            processVacationsSequentially();
        }
    );
}

function updateLocalStorageEntry(storageKey, entry) {
    const today = new Date().toLocaleDateString('ru-RU', { timeZone: 'Europe/Moscow' });
    let storage = localStorage.getItem(storageKey) ? JSON.parse(localStorage.getItem(storageKey)) : {};
    if (!storage[today]) storage[today] = [];
    storage[today].push(entry);
    localStorage.setItem(storageKey, JSON.stringify(storage));
    updateCounters();
}

function updateCounters() {
    const today = new Date().toLocaleDateString('ru-RU', { timeZone: 'Europe/Moscow' });
    let resultStorage = localStorage.getItem('vf-resultN') ? JSON.parse(localStorage.getItem('vf-resultN')) : {};
    let badResultStorage = localStorage.getItem('vf-badresultN') ? JSON.parse(localStorage.getItem('vf-badresultN')) : {};
    const totalSuccess = Object.values(resultStorage).reduce((sum, arr) => sum + arr.length, 0);
    const totalFail = Object.values(badResultStorage).reduce((sum, arr) => sum + arr.length, 0);
    const todaySuccess = resultStorage[today] ? resultStorage[today].length : 0;
    const todayFail = badResultStorage[today] ? badResultStorage[today].length : 0;

    if (document.querySelector('.vf-succ-res')) {
        document.querySelector('.vf-succ-res').innerHTML = `<p>Успешных откликов</p><p>За сегодня: ${todaySuccess}</p><p>Всего: ${totalSuccess}</p>`;
    }
    if (document.querySelector('.vf-fail-res')) {
        document.querySelector('.vf-fail-res').innerHTML = `<p>Неудачных откликов</p><p>За сегодня: ${todayFail}</p><p>Всего: ${totalFail}</p>`;
    }
}

async function processVacation(vacation, i) {
    const btn = vacation.querySelector('a[data-qa="vacancy-serp__vacancy_response"]');
    const titleElement = vacation.querySelector('span[data-qa="serp-item__title-text"]');
    const priceElement = vacation.querySelector('div[class^="compensation-labels--"] span[class^="magritte-text___pbp"]');
    const companyElement = vacation.querySelector('span[data-qa="vacancy-serp__vacancy-employer-text"]');
    const adressElement = vacation.querySelector('span[data-qa="vacancy-serp__vacancy-address"]');

    if (titleElement) {
        const titleText = titleElement.innerText.toLowerCase();
        const hasBlackWord = config.blackWord.some(word => titleText.includes(word.toLowerCase()));
        if (hasBlackWord) {
            logSee(`Вакансия пропущена из-за запрещённого слова: "${titleText}".`);
            return;
        }
    }

    if (priceElement) {
        const priceText = priceElement.innerText.trim();
        const salaryMatch = priceText.match(/(\d{1,3}(?: \d{3})*)/g);
        if (salaryMatch) {
            const salaries = salaryMatch.map(s => parseInt(s.replace(/[  ]/g, ''), 10));
            const maxSalaryValue = Math.max(...salaries);
            if (maxSalaryValue < config.minSalary) {
                logSee(`Вакансия не подходит: ЗП (${maxSalaryValue.toLocaleString('ru-RU')}) меньше ${config.minSalary.toLocaleString('ru-RU')}.`);
                return;
            }
        } else {
            logSee(`Не удалось распознать ЗП: "${priceText}".`);
            return;
        }
    } else if (config.skipNotSalary === 1) {
        logSee("ЗП не указана – вакансия пропущена.");
        return;
    }

    if (!btn) {
        logSee(`Вакансия пропущена: ${titleElement.innerText}, кнопка отклика отсутствует.`);
        return;
    }

    logSee('Обработка клика…');
    btn.click();

    await new Promise(resolve => {
        runWhenConditionTrue(
            () => vacation.querySelector('[data-qa="vacancy-serp__vacancy_responded"]') ||
                document.querySelector('[data-qa="relocation-warning-confirm"]') ||
                document.querySelector('[data-qa="task-body"] .bloko-checkbox__text, [data-qa="task-body"] .bloko-form-item-baseline, [data-qa="task-body"] [data-qa="textarea-wrapper"], [data-qa="task-body"] [data-qa="task-question"]'),
            async () => {
                if (document.querySelector('[data-qa="task-body"] .bloko-checkbox__text, [data-qa="task-body"] .bloko-form-item-baseline, [data-qa="task-body"] [data-qa="textarea-wrapper"], [data-qa="task-body"] [data-qa="task-question"]')) {
                    logSee(`У вакансии "${titleElement.innerText}" есть анкета – автоматом заполнить нельзя. Возврат.`);
                    const entry = {
                        'Название': titleElement.innerText,
                        'ЗП': priceElement ? priceElement.innerText : 'Не указана',
                        'Компания': companyElement ? companyElement.innerText : 'Нет данных',
                        'Город': adressElement ? adressElement.innerText : 'Нет данных',
                        'Ссылка': btn.href
                    };
                    badResult.push(entry);
                    updateLocalStorageEntry('vf-badresultN', entry);
                    history.back();
                    await new Promise(resolveBack => {
                        runWhenConditionTrue(
                            () => document.querySelector('#a11y-main-content a[data-qa="vacancy-serp__vacancy_response"]'),
                            () => {
                                const main = document.querySelector('#a11y-main-content');
                                vacations = main.querySelectorAll('.magritte-redesign');
                                resolveBack();
                            }
                        );
                    });
                    logSee('Продолжаем обработку вакансий.');
                } else if (document.querySelector('[data-qa="relocation-warning-confirm"]')) {
                    if (config.relocate === 1) {
                        document.querySelector('[data-qa="relocation-warning-confirm"]').click();
                    } else {
                        const relocateCancel = document.querySelector('[data-qa="relocation-warning-abort"]');
                        if (relocateCancel) {
                            relocateCancel.click();
                            const entry = {
                                'Название': titleElement.innerText,
                                'ЗП': priceElement ? priceElement.innerText : 'не указана',
                                'Компания': companyElement ? companyElement.innerText : 'Нет данных',
                                'Город': adressElement ? adressElement.innerText : 'Нет данных',
                                'Ссылка': btn.href
                            };
                            badResult.push(entry);
                            updateLocalStorageEntry('vf-badresultN', entry);
                        }
                    }
                    resolve();
                } else {
                    const entry = {
                        'Название': titleElement.innerText,
                        'ЗП': priceElement ? priceElement.innerText : 'не указана',
                        'Компания': companyElement ? companyElement.innerText : 'Нет данных',
                        'Город': adressElement ? adressElement.innerText : 'Нет данных',
                        'Ссылка': btn.href
                    };
                    result.push(entry);
                    updateLocalStorageEntry('vf-resultN', entry);
                    logSee(`✅ Отклик на "${titleElement.innerText}" успешно отправлен.`);
                }
                resolve();
            }
        );
    });
}

async function processVacationsSequentially() {
    let i = 0;
    while (i < vacations.length) {
        if (window.stopScVf) {
            logSee('Скрипт остановлен пользователем.');
            return;
        }
        await processVacation(vacations[i], i);
        const main = document.querySelector('#a11y-main-content');
        vacations = main.querySelectorAll('.magritte-redesign');
        i++;
    }
    if (result.length === 0) {
        logSee('❗❗❗ Ничего не найдено – перейдите на другую страницу.');
    }
    if (config.autoRes) {
        logSee('Переход на следующую страницу через 5 секунд.');
        setTimeout(autoResSc, 5000);
    }
}

function autoResSc() {
    if (window.stopScVf) {
        logSee('Скрипт остановлен.');
        return;
    }

    const navItem = document.querySelector('[data-qa="pager-block"] li:last-child a');
    if (navItem) {
        navItem.click();
    }

    let oldLoc = window.location.href;
    runWhenConditionTrue(
        () => oldLoc !== window.location.href,
        () => {
            mainSc();
        }
    );
}

showPanel();