/* eslint-disable max-len */

import fs from 'fs';
import path from 'path';
import { AnyEntity } from 'mikro-orm';
import { UserEntity } from '../users/user.entity';
import { ImageEntity } from '../images/image.entity';
import { MeetupEntity } from '../meetups/entities/meetup.entity';
import { AgendaItemEntity } from '../meetups/entities/agenda-item.entity';

type ImageFile = {
  data?: Buffer;
  size?: number;
  mimetype?: string;
};

function readImageSync(filename: string): ImageFile {
  const image: ImageFile = {};
  image.data = fs.readFileSync(
    path.join(__dirname, '../../data/images', filename),
  );
  image.size = image.data.length;
  image.mimetype = filename.endsWith('.png') ? 'image/png' : 'image/jpeg';
  return image;
}

const CURRENT_YEAR = new Date().getUTCFullYear();
const CURRENT_MONTH = new Date().getUTCMonth();

const IMAGES = {
  // MSK_VUEJS_MEETUP: readImageSync('msk-vuejs-meetup.jpeg'),
  // VUEJS_MOSCOW_MEETUP: readImageSync('vuejs-moscow-meetup.jpeg'),
  // VUEJS_CONF_US: readImageSync('vuejs-moscow-meetup.jpeg'),
  UNPLASH_1: readImageSync(
    'anastasia-kuznichenkova-8w_JshgzTjY-unsplash-compressor.jpg',
  ),
  UNPLASH_2: readImageSync('antenna-ohNCIiKVT1g-unsplash-compressor.jpg'),
  UNPLASH_3: readImageSync(
    'charles-deluvio-wn7dOzUh3Rs-unsplash-compressor.jpg',
  ),
  UNPLASH_4: readImageSync(
    'jakob-dalbjorn-cuKJre3nyYc-unsplash-compressor.jpg',
  ),
  UNPLASH_5: readImageSync('neonbrand-1-aA2Fadydc-unsplash-compressor.jpg'),
};

function buildImage(imageFile: ImageFile, user: UserEntity): ImageEntity {
  const image = new ImageEntity();
  image.data = imageFile.data;
  image.size = imageFile.size;
  image.mimetype = imageFile.mimetype;
  image.user = user;
  return image;
}

export function getDataToSeed(): AnyEntity[] {
  const randomPassword = () =>
    Math.random()
      .toFixed(16)
      .toString()
      .substring(2);

  const userIgorSh = new UserEntity({
    email: 'igor@email',
    fullname: 'Игорь Ш.',
    password: randomPassword(),
  });
  const userEugeneF = new UserEntity({
    email: 'eugeny@email',
    fullname: 'Eugeny F.',
    password: randomPassword(),
  });
  const userEvanYou = new UserEntity({
    email: 'evanyou@email',
    fullname: 'Evan You',
    password: randomPassword(),
  });
  const userGrigoriiK = new UserEntity({
    email: 'me@shgk.me',
    fullname: 'Grigorii K. Shartsev',
    password: randomPassword(),
  });
  const userDemo = new UserEntity({
    email: 'demo@email',
    fullname: 'Demo Organizer',
    password: 'password',
  });

  const mskVueJsMeetup1 = new MeetupEntity({
    title: 'MSK VUE.JS MEETUP #1',
    description:
      'С каждым днем Vue.js становится популярней, все больше разработчиков и компаний делают ставку на данную технологию — 18 июля при поддержке компании Voximplant пройдет митап сообщества MSK VUE.JS, посвященный фреймворку. Спикеры поделятся опытом разработки, участники сообщества обсудят перспективы развития Vue.js.\n' +
      '\n' +
      'https://voximplant.timepad.ru/event/986750/',
    date: Date.UTC(CURRENT_YEAR, CURRENT_MONTH, 8),
    place: 'Москва, офис Voximplant (ул. Мытная 66)',
  });
  mskVueJsMeetup1.organizer = userIgorSh;
  mskVueJsMeetup1.image = buildImage(IMAGES.UNPLASH_1, userIgorSh);

  mskVueJsMeetup1.agenda.add(
    new AgendaItemEntity({
      startsAt: '18:30',
      endsAt: '19:00',
      type: 'registration',
    }),
    new AgendaItemEntity({
      startsAt: '19:00',
      endsAt: '19:45',
      type: 'talk',
      language: 'RU',
      title: 'Vue.js 3 — все что ждет нас в будущем',
      description:
        'Скоро нас ждет Vue.js 3. Теперь наш любимый фреймворк станет лучше, быстрее, моднее. Давайте поговорим, что нового нас ждет, что мы получим и что потеряем в результате обновления. Рассмотрим технологии, которыми обогатится Vue.js и которые сделают его, на мой взгляд, самым быстрым и простым фреймворком на рынке.',
      speaker: 'Игорь Шеко — Lead Developer, Voximplant',
    }),
    new AgendaItemEntity({
      startsAt: '19:45',
      endsAt: '20:15',
      type: 'coffee',
    }),
    new AgendaItemEntity({
      startsAt: '20:15',
      endsAt: '21:00',
      type: 'talk',
      language: 'RU',
      title: 'Опыт использования Vue.js в «Едадиле»',
      description:
        '— Долгая жизнь с Vue: промышленное использования начиная с версии 0.x.\n' +
        '— Vue внутри webview нативного приложения: подводные камни.\n' +
        '— Не «стандартный подход» к организации кода и сборке.\n' +
        '— Авто-оптимизация приложения Vue.\n' +
        '— Настоящая изоморфность: Vue и другой рантайм.',
      speaker:
        'Андрей Кобец — Руководитель отдела разработки фронтенда «Едадила», Яндекс',
    }),
    new AgendaItemEntity({
      startsAt: '21:00',
      endsAt: '21:45',
      type: 'talk',
      language: 'RU',
      title: 'Прогрессивные приложения на прогрессивном фреймворке',
      description:
        'PWA (progressive web app, прогрессивное веб-приложение) — один из главных трендов в вебе последние 2 года. Наверняка, вы не раз о нем слышали и даже не раз делали. Или, как я, давно хотели попробовать, но на рабочих проектах в нем не было необходимости. Этот доклад для неслышавших или слышавших, но не пробовавших. Расскажу, что такое PWA, какие технологии подразумевает, в каких браузерах они работают, как интегрировать их во vue-приложение, чем тестировать и какие удобные готовые решения есть можно использовать.',
      speaker: 'Ольга Лесникова — Senior Developer, Voximplant',
    }),
    new AgendaItemEntity({
      startsAt: '22:00',
      endsAt: '22:00',
      type: 'closing',
    }),
  );

  const vueMoscowMeetup1 = new MeetupEntity({
    title: 'Vue.js Moscow Meetup #1',
    description:
      'Ссылка на трансляцию: https://www.youtube.com/watch?v=h9NQs0SEVoA\n' +
      '\n' +
      'Друзья привет! Рады сообщить о первом московском митапе, посвященном исключительно фреймоврку Vue.js.\n' +
      '\n' +
      'Наша встреча пройдет 22 марта 2018 под покровительством компании Acronis в технопарке - Физтехпарк (г.Москва, Долгопрудненское шоссе, д.3)\n' +
      'Приглашаются все заинтересованные разработчики от начинающих до опытных.\n' +
      'Физтехпарк находится за МКАД, но не беспокойтесь, будет организован трансфер от станции метро Алтуфьево и после мероприятия обратно.\n' +
      'Для желающим приехать на собственном транспорте, проблем с парковкой не будет. Для тех кто все же не сможет до нас добраться, будет организована трансляция выступлений.\n' +
      '\n' +
      'https://www.meetup.com/ru-RU/vue-js-moscow/events/248462774/',
    date: Date.UTC(CURRENT_YEAR, CURRENT_MONTH - 1, 22),
    place: 'Москва, Физтехпарк, офис Acronis',
  });
  vueMoscowMeetup1.organizer = userEugeneF;
  vueMoscowMeetup1.image = buildImage(IMAGES.UNPLASH_2, userEugeneF);

  vueMoscowMeetup1.agenda.add(
    new AgendaItemEntity({
      startsAt: '18:30',
      endsAt: '19:00',
      type: 'registration',
      title: 'Сбор и трансфер',
    }),
    new AgendaItemEntity({
      startsAt: '19:00',
      endsAt: '19:30',
      type: 'talk',
      language: 'RU',
      title: 'Практика и методы работы со сложными формами во Vue.js',
      description:
        'В докладе на примере от простого к сложному, рассмотрим основные методы и архитектурные подходы работы с редактируемыми пользовательскими данными в современных frontend приложениях.',
      speaker: 'Александр Башкирцев (Software developer, Acronis)',
    }),
    new AgendaItemEntity({
      startsAt: '19:30',
      endsAt: '20:00',
      type: 'talk',
      language: 'RU',
      title:
        'Внедряем Vue.js в готовый проект, безболезненное избавление от jQuery.',
      description:
        'Что если нам достался в наследство сайт состоящий из неструктурированной, неподдерживаемой лапши из html-css-jquery.... Давайте не будем расстраиваться, а засучим рукава, возьмем в руки vue.js и заставим наше наследство сиять по новому!',
      speaker: 'Alexander Mayorov (CTO, NewHR)',
    }),
    new AgendaItemEntity({
      startsAt: '20:00',
      endsAt: '20:10',
      type: 'coffee',
      title: 'Перерыв на кофе и обсуждения',
    }),
    new AgendaItemEntity({
      startsAt: '20:10',
      endsAt: '20:40',
      type: 'talk',
      language: 'RU',
      title: 'Простое и понятное управление состоянием во vue.js',
      description:
        'Веб-фреймворки хорошо помогают создавать сложные системы с большим жизненным циклом. Но при решении простых задач современные идеи начинают показывать себя с другой стороны. Разработка компонентов даже с простой бизнес-логикой забирает на себя слишком много времени. Vue хорошо показывает себя в упрощении разработки. Но есть еще места, в которых бывает многовато кода на единицу бизнес-логики. В докладе я расскажу и покажу на примерах как сделать код приложения на Vue еще проще, не потеряв в надежности и выразительности.',
      speaker: 'Александр Сафт (Senior Frontend Developer, Смотрешка)',
    }),
    new AgendaItemEntity({
      startsAt: '20:40',
      endsAt: '21:10',
      type: 'talk',
      language: 'RU',
      title: 'Опыт использования Nuxt.js',
      description:
        'Фреймворк Nuxt.js позволяет очень быстро собирать на Vue.js статические сайты. Получающиеся пререндеренные HTML страницы грузятся очень быстро, затем загружают JavaScript код и оживают в ваше приложение. Мы в Voximplant используем Nuxt для внутренних проектов, документации, одностраничных сайтов. В докладе я кратко расскажу про сам фреймворк, его возможности, ограничения, сильные и слабые стороны - и, конечно же, нашу практику его использования',
      speaker: 'Григорий Петров (технический евангелист Voximplant)',
    }),
    new AgendaItemEntity({
      startsAt: '21:10',
      endsAt: '23:00',
      type: 'afterparty',
      title:
        'Жгучее afterpaty, итальянская пицца, вкусные напитки и продуктивный нетворкинг',
    }),
  );

  const vueMoscowMeetup2 = new MeetupEntity({
    title: 'Vue.js Moscow Meetup #2 - Mail.ru',
    description:
      '!!! Внимание !!!\n' +
      'Регистрация строго по ссылке:\n' +
      'https://corp.mail.ru/ru/press/events/481/ (Регистрация закрыта)\n' +
      'Вы не сможете попасть на мероприятия, не пройдя регистрацию по ссылке выше.\n' +
      '\n' +
      'Друзья привет! Открываем регистрацию на вторую встречу JavaScript/Vue.js разработчиков и всех интересующихся.\n' +
      'Для тех кто все же не сможет до нас добраться, будет организована трансляция выступлений.\n' +
      '\n' +
      'https://www.meetup.com/ru-RU/vue-js-moscow/events/251880636/' +
      '\n' +
      'Ссылка на онлайн трансляцию: https://www.youtube.com/watch?v=SiPKxngecQ0',
    date: Date.UTC(CURRENT_YEAR, CURRENT_MONTH, 5),
    place: 'Москва, Офис компании Mail.Ru Group',
  });
  vueMoscowMeetup2.organizer = userEugeneF;
  vueMoscowMeetup2.image = buildImage(IMAGES.UNPLASH_3, userEugeneF);

  vueMoscowMeetup2.agenda.add(
    new AgendaItemEntity({
      startsAt: '18:30',
      endsAt: '19:00',
      type: 'registration',
      title: 'Сбор и регистрация',
    }),
    new AgendaItemEntity({
      startsAt: '19:00',
      endsAt: '19:30',
      type: 'talk',
      language: 'RU',
      title:
        'Почему Vue.js одинаково хорош для внедрения в legacy код и для построения архитектуры большого приложения с нуля.',
      description:
        'На примерах того как мы в Delivery Club:\n' +
        '- внедряли vue.js в legacy проект 2009 года.\n' +
        '- писали приложение на стеке vue + vuex + typescript + rxjs с нуля\n' +
        '- пишем новый проект на vue.js\n' +
        'расскажу и покажу «от простого к сложному», каким может быть vue.js в вашем проекте.',
      speaker:
        'Никита Крикун, Frontend Developer, Mail.Ru Group (Delivery Club)',
    }),
    new AgendaItemEntity({
      startsAt: '19:30',
      endsAt: '20:00',
      type: 'talk',
      language: 'RU',
      title: 'Сложные анимации во Vue.js',
      description:
        'Анимация состояний и переходов во Vue на примере боевого сайта. От стандартных средств до Timeline-анимации переходов между страницами с помощью сторожевых хуков vue-router и Green Sock.',
      speaker:
        'Сергей Корниенко, Frontend teamlead в Beta Digital Production, преподаватель курса по Vue.js в Moscow Coding School',
    }),
    new AgendaItemEntity({
      startsAt: '20:00',
      endsAt: '20:10',
      type: 'coffee',
      title: 'Перерыв на кофе и обсуждения',
    }),
    new AgendaItemEntity({
      startsAt: '20:10',
      endsAt: '20:40',
      type: 'talk',
      language: 'RU',
      title: 'Замечательный PWA',
      description:
        'Настало время, когда можно перестать писать код ради кода. Время, когда не надо держать отдельные отделы разработки для написания одних и тех же приложений под разные платформы. PWA – это решение многих проблем кроссплатформенной разработки доступное здесь и сейчас.',
      speaker: 'Владислав Смирнов, Frontend разработчик, Comindware',
    }),
    new AgendaItemEntity({
      startsAt: '20:40',
      endsAt: '21:10',
      type: 'talk',
      language: 'RU',
      title: 'Модульно-микросервисная архитектура на на Vue.js',
      description:
        'Мы в ведомостях любим микросервисы. А ещё мы любим Vue.js. В этом докладе я расскажу про опыт объединения микросервисов и вариант реализации модулей в рамках экосистемы Vue.',
      speaker: 'Антон Федоров, Ведущий фронтенд-разработчик, Ведомости',
    }),
    new AgendaItemEntity({
      startsAt: '21:10',
      endsAt: '23:00',
      type: 'closing',
      title: 'Завершение; Cбор на afterparty',
    }),
  );

  const vueMoscowMeetup3 = new MeetupEntity({
    title: 'Vue.js Moscow #3 - Ozon',
    description:
      'Друзья привет! Открываем регистрацию на третью встречу JavaScript/Vue.js разработчиков и всех интересующихся. В этот раз мы побываем в гостях у компании Ozon по адресу – “Москва, Пресненская Набережная, 10 блок С, Башня на Набережной”\n' +
      'Для тех кто все же не сможет до нас добраться, будет организована трансляция выступлений.\n' +
      'Мероприятие бесплатное, но необходима регистрация, количество мест ограничено.\n' +
      'До встречи!\n' +
      '\n' +
      'https://www.meetup.com/ru-RU/vue-js-moscow/events/263421476/',
    date: Date.UTC(CURRENT_YEAR, CURRENT_MONTH, 12),
    place: 'Москва, Офис компании Mail.Ru Group',
  });
  vueMoscowMeetup3.organizer = userEugeneF;
  vueMoscowMeetup3.image = buildImage(IMAGES.UNPLASH_4, userEugeneF);

  vueMoscowMeetup3.agenda.add(
    new AgendaItemEntity({
      startsAt: '19:00',
      endsAt: '19:30',
      type: 'registration',
      title: 'Сбор и регистрация',
    }),
    new AgendaItemEntity({
      startsAt: '19:30',
      endsAt: '20:00',
      type: 'talk',
      language: 'RU',
      title: 'Vue, Typescript и JSX',
      description:
        'Один из существенных недостатков Vue - плохая совместимость с TypeScript из коробки 😅 Я расскажу как победить этот недостаток и начать писать type-safe приложения ✌️!',
      speaker: 'Евгений Петухов, Ozon',
    }),
    new AgendaItemEntity({
      startsAt: '20:00',
      endsAt: '20:30',
      type: 'talk',
      language: 'RU',
      title: 'Интеграция и использование Redux во Vue.js',
      description:
        'Доклад о варианте интеграции Redux.js во Vue.js, используя Vuex.',
      speaker: 'Анатолий Колесов, Ведущий разработчик, Банк Восточный',
    }),
    new AgendaItemEntity({
      startsAt: '20:30',
      endsAt: '20:40',
      type: 'coffee',
      title: 'Перерыв на кофе и обсуждения',
    }),
    new AgendaItemEntity({
      startsAt: '20:40',
      endsAt: '21:10',
      type: 'talk',
      language: 'RU',
      title: 'Quasar Framework и SunEngine',
      description:
        'Расскажу про очень функциональный UI и не только UI фреймворк Quasar и продемонстрирую наиболее эффектные его компоненты.\n' +
        'Расскажу про проект SunEngine и использования Quasar в реальной практике.\n',
      speaker: 'Дмитрий Полянин, lead developer at SunEngine',
    }),
    new AgendaItemEntity({
      startsAt: '21:10',
      endsAt: '21:40',
      type: 'talk',
      language: 'RU',
      title: 'Модульно-микросервисная архитектура на на Vue.js',
      description:
        'За последние пару месяцев я просмотрел порядка 20 тестовых заданий для Vue. Все плохо. Основная проблема в том, что люди не умеют (или не хотят) разделять слой представления и слой бизнес-логики в своих приложениях.\n' +
        '\n' +
        'Я расскажу, как, используя простые паттерны и подходы, можно писать большие и сложные приложения. И чтобы их было легко читать, тестировать и менять.',
      speaker: 'Никита Соболев, CTO at wemake.services',
    }),
    new AgendaItemEntity({
      startsAt: '21:40',
      endsAt: '23:00',
      type: 'afterparty',
    }),
  );

  const vueConfUs = new MeetupEntity({
    title: 'VueConf US',
    date: Date.UTC(CURRENT_YEAR, CURRENT_MONTH, 12),
    place: 'USA, AUSTIN CONVENTION CENTER',
    description: 'ATX. Code. Vue.\n' + 'https://vueconf.us/',
  });
  vueConfUs.organizer = userEvanYou;
  vueConfUs.image = buildImage(IMAGES.UNPLASH_5, userEvanYou);

  vueConfUs.agenda.add(
    new AgendaItemEntity({
      startsAt: '07:30',
      endsAt: '09:00',
      type: 'registration',
    }),
    new AgendaItemEntity({
      startsAt: '09:00',
      endsAt: '09:30',
      type: 'opening',
      title: 'Opening Keynote with Evan',
    }),
    new AgendaItemEntity({
      startsAt: '09:40',
      endsAt: '10:10',
      type: 'talk',
      language: 'EN',
      title: 'Get the most out of Vue Router',
      speaker: 'Eduardo',
      description:
        "Routers in Single page applications touch a broad part of our business logic. As a consequence, we often end up with different ways of handling the same pattern/UX/logic in our code and we often wonder which one is better and why. Different ways of handling data fetching that change the user experience, different ways to implement layouts, and many more. During this talk, I will cover very practical implementations that I have found useful in the past and explain the differences between various Vue Router features. After the talk you will have a better understanding of Vue Router's API and hopefully the excitement to refactor some bits of your Vue app!",
    }),
    new AgendaItemEntity({
      startsAt: '10:10',
      endsAt: '09:30',
      type: 'break',
      title: 'Break 1.0',
    }),
    new AgendaItemEntity({
      startsAt: '10:40',
      endsAt: '11:10',
      type: 'talk',
      language: 'EN',
      title: 'All you need is <s>love</s> Apollo Client',
      speaker: 'Natalia Tepluhina',
      description:
        'While we usually mention Apollo Client only in connection with GraphQL, it can do a lot more things to your Vue application such as accessing REST endpoints and replacing Vuex in managing application state! In this talk, I will cover these advanced cases while also explaining the basics of using Apollo with GraphQL endpoints',
    }),
    new AgendaItemEntity({
      startsAt: '11:10',
      endsAt: '11:40',
      type: 'talk',
      language: 'EN',
      title: 'The State of CSS in Vue',
      speaker: 'Jamena McInteer',
      description:
        "There are a lot of ways to include CSS in your Vue apps, and they all have pros and cons. Knowing which method to choose can be confusing with all the different options available. In this talk, you'll learn about different ways to bring CSS into your Vue app and how to pick a methodology for your project.",
    }),
    new AgendaItemEntity({
      startsAt: '11:40',
      endsAt: '12:10',
      type: 'talk',
      language: 'EN',
      title: "What you'll love in Vue 3",
      speaker: 'Alex Kyriakidis',
      description: "What you'll love in Vue 3",
    }),
    new AgendaItemEntity({
      startsAt: '12:10',
      endsAt: '13:10',
      type: 'coffee',
      title: 'Lunch 1.0',
    }),
    new AgendaItemEntity({
      startsAt: '13:10',
      endsAt: '14:10',
      type: 'other',
      title: 'Lightning Talks 1.0',
    }),
    new AgendaItemEntity({
      startsAt: '14:10',
      endsAt: '14:40',
      type: 'break',
      title: 'Break 1.1',
    }),
    new AgendaItemEntity({
      startsAt: '14:40',
      endsAt: '15:10',
      type: 'talk',
      language: 'EN',
      title: 'Vuetify v2+',
      speaker: 'John Leider',
      description:
        'A review of the past year of Vuetify, the v2 releases and upcoming features in v2.2. Details of new packages for the Vuetify ecosystem and future projects on the horizon.',
    }),
    new AgendaItemEntity({
      startsAt: '15:10',
      endsAt: '15:40',
      type: 'talk',
      language: 'EN',
      title: "Content Loading That Isn't Broken",
      speaker: 'Maria Lamardo',
      description:
        "How does Vue.js handle rerouting and loading new content with a screen reader? Let's explore how we can improve the experience for a lot of users who rely on assistive technologies.",
    }),
    new AgendaItemEntity({
      startsAt: '15:40',
      endsAt: '16:10',
      type: 'talk',
      language: 'EN',
      title: 'Documenting components made easy',
      speaker: 'Bart Ledoux',
      description:
        "Using shared components without proper documentation can be a pain. Whether you're publishing a component library, or just sharing components with your colleagues, increase the ease of adoption by writing clear documentation. In this talk, I'll show you how easy it is to write beautiful documentation for your components which other developers will love.",
    }),
    new AgendaItemEntity({
      startsAt: '16:10',
      endsAt: '16:40',
      type: 'break',
      title: 'Break 1.3',
    }),
    new AgendaItemEntity({
      startsAt: '16:40',
      endsAt: '17:10',
      type: 'talk',
      language: 'EN',
      title: 'TypeScript & Vue @ Politico',
      speaker: 'Jack Koppa',
      description:
        '“JavaScript that scales” is the tagline for TypeScript, and it can be a beautiful partner for increasingly complex Vue apps. We’ll discuss how CLI TypeScript Vue projects can increase development speed, decrease onboarding time, type errors, and typos, while encouraging self-documenting & maintainable code. Finally, let’s look at remaining hurdles for Vue’s TS implementation (Vuex, mixins, templates), and how the composition API + Vetur will continue to ease those growing pains.',
    }),
    new AgendaItemEntity({
      startsAt: '17:10',
      endsAt: '17:40',
      type: 'talk',
      language: 'EN',
      title: 'Unconventional Vue—Vue as a Backend Framework',
      speaker: 'Oscar Spencer',
      description:
        'While Vue has emerged as a dominant frontend framework, we can’t forget about the other side of the spectrum. What if we leveraged Vue 3.0’s powerful standalone observability system to manage our backend datastore, with all its reactivity goodness? We could build a highly reactive chat app, power a live scoreboard, or maybe even have Vue trigger AWS Lambda functions as app data changes…',
    }),
    new AgendaItemEntity({
      startsAt: '18:15',
      endsAt: '19:45',
      type: 'afterparty',
      title:
        'Conference Reception: Austin SPEAKEASY, 412 Congress Ave. Drinks and light snacks.',
    }),
  );

  const vueJsCourse = new MeetupEntity({
    title: 'Vue 3 Course',
    date: Date.UTC(CURRENT_YEAR, CURRENT_MONTH + 1, 15),
    place: 'learn.javascript.ru',
    description: 'Курс по Vue 3',
  });
  vueJsCourse.organizer = userGrigoriiK;

  const demoMeetup = new MeetupEntity({
    title: 'Демо-Митап',
    date: new Date().toISOString(),
    place: 'Internet',
    description:
      'Описание демонстрационного митапа\n' +
      '\n' +
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  });
  demoMeetup.organizer = userDemo;

  demoMeetup.agenda.add(
    new AgendaItemEntity({
      startsAt: '09:00',
      endsAt: '10:00',
      type: 'opening',
      title: 'Общий сбор',
    }),
    new AgendaItemEntity({
      startsAt: '10:00',
      endsAt: '11:00',
      type: 'registration',
    }),
    new AgendaItemEntity({
      startsAt: '11:00',
      endsAt: '12:00',
      type: 'talk',
      language: 'RU',
      title: 'Как делать демо доклады?',
      description:
        'Вместо доклада проведём демонстрацию доклада.\n' +
        'Приходите, будет демонстрационно!',
      speaker: 'Demo, user in Demo Company',
    }),
    new AgendaItemEntity({
      startsAt: '12:00',
      endsAt: '12:30',
      type: 'coffee',
      title: 'Перерыв на кофе',
    }),
    new AgendaItemEntity({
      startsAt: '12:30',
      endsAt: '13:00',
      type: 'break',
      title: 'Перерыв после кофе',
    }),
    new AgendaItemEntity({
      startsAt: '13:00',
      endsAt: '14:00',
      type: 'closing',
    }),
    new AgendaItemEntity({
      startsAt: '14:00',
      endsAt: '23:00',
      type: 'afterparty',
    }),
  );

  /* Participation */

  mskVueJsMeetup1.participants.add(userDemo);
  vueMoscowMeetup1.participants.add(userDemo);
  vueJsCourse.participants.add(userDemo);

  return [
    mskVueJsMeetup1,
    vueMoscowMeetup1,
    vueMoscowMeetup2,
    vueMoscowMeetup3,
    vueConfUs,
    vueJsCourse,
  ];
}
