**Match Tracker** — это веб-приложение, созданное для отображения и управления информацией о спортивных матчах. Оно включает в себя функции фильтрации матчей по статусу, обновления данных в реальном времени и возможность взаимодействия с интерфейсом (расширения карточек для просмотра деталей). Приложение обладает интуитивно понятным интерфейсом и адаптировано под современный стиль UI.
### **Функциональность**
- **Отображение матчей**:
    - Список матчей отображается в виде карточек, включающих названия команд, их логотипы и статусы (например, "Live", "Finished", "Scheduled").
    - Возможность раскрывать карточки для просмотра дополнительной информации о матче.

- **Фильтрация по статусу**:
    - Доступен фильтр для сортировки матчей по их статусу (все матчи, только действующие, завершенные или запланированные).

- **Механизм обновления**:
    - Данные о матчах загружаются через API. Пользователь может принудительно обновить список, используя кнопку "Обновить".
    - Обработка ошибок с отображением уведомлений об ошибке при невозможности загрузки данных.

- **Пагинация**:
    - Для удобства работы с большим количеством матчей реализована пагинация с переключением страниц.

Инструменты
- **React 19.0.0**: Библиотека для построения пользовательского интерфейса. Компоненты организованы по функциональной логике, что упрощает их переиспользование и поддержку.
- **JavaScript ES6+**: Для написания логики приложения и взаимодействия с React.
- **SWR (2.3.3)**:
    - Библиотека для выполнения HTTP-запросов, извлечения и кеширования данных.
    - Используется для асинхронного запроса матчей через API (RESTful запрос).
    - Реализует функции обновления данных и реактивности (например, кнопка "Обновить").
- **CSS**:
    - Кастомные стили для интерфейса определены в файле `MatchTracker.css`.
    - Использован кастомный шрифт **Inter** (подключён через `@font-face`) для современного дизайна.
    - Цветовая гамма: тёмные оттенки (background) для создания фокусного контраста с белым текстом и яркими кнопками.
#### 5. **REST API**
- Источник данных: `https://app.ftoyd.com/fronttemp-service/fronttemp`.
    - Данные о матчах получаются в формате JSON.
    - Ошибки API обрабатываются с выводом соответствующего уведомления в UI.
![image](https://github.com/user-attachments/assets/b21268ee-42b9-40fa-aa29-f4050261b15a)
![image](https://github.com/user-attachments/assets/99069248-94bb-4aa8-801e-8bfa063de780)
![image](https://github.com/user-attachments/assets/94e56807-6734-44bd-b993-d9801a040ab2)
![image](https://github.com/user-attachments/assets/a0b9862d-0529-4ee5-9133-f62ad9c21d02)
