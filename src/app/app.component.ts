import {Component, OnInit} from '@angular/core';
import {Task} from "./model/Task";
import {Category} from "./model/Category";
import {Priority} from "./model/Priority";
import {Observable} from 'rxjs';
import {IntroService} from "./service/intro.service";
import {DeviceDetectorService} from "ngx-device-detector";
import {CategorySearchValues, TaskSearchValues} from "./data/dao/search/SearchObjects";
import {CategoryService} from "./data/dao/impl/CategoryService";
import {TaskService} from "./data/dao/impl/TaskService";
import {PageEvent} from "@angular/material/paginator";
import {PriorityService} from "./data/dao/impl/PriorityService";
import {MatDialog} from "@angular/material/dialog";
import {DashboardData} from "./object/DashboardData";
import {Statistic} from "./model/Statistic";
import {StatisticService} from "./data/dao/impl/StatisticService";
import {CookiesUtils} from "./utils/CookiesUtils";
import {SpinnerService} from "./service/spinner.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
// Умный компонент - раздает всем данные
export class AppComponent implements OnInit {

  // Tasks And Categories
  title = "Todo";
  tasks: Task[];
  categories: Category[];
  priorities: Priority[];
  selectedCategory: Category = null;
  totalTasksFounded: number;

  // Search
  searchTaskText = '';
  showSearch = true;  // показать/скрыть поиск

  // Statistic
  totalTasksCountInCategory: number;

  // Menu
  menuOpened: boolean;
  showBackdrop: boolean;
  menuMode: any;
  menuPosition: any;

  // Adaptive layout
  isMobile: boolean;
  isTablet: boolean;

  // Statistic
  uncompletedCountForCategoryAll: number;
  showStat = true; // показать/скрыть статистику
  stat: Statistic; // данные общей статистики
  dash: DashboardData = new DashboardData(); // данные для дашбоарда

  // Search Parameters
  categorySearchValues = new CategorySearchValues(); // экземпляр можно создать тут же, т.к. не загружаем из cookies
  taskSearchValues: TaskSearchValues;

  // Cookies
  cookiesUtils = new CookiesUtils();

  // Spinner
  spinner: SpinnerService;

  readonly cookieTaskSearchValues = 'todo:searchValues';
  readonly cookieShowStat = 'todo:showStat';
  readonly cookieShowSearch = 'todo:showSearch';

  readonly defaultPageSize = 10;
  readonly defaultPageNumber = 0;

  // Внедряем зависимости через конструктор
  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
    private priorityService: PriorityService,
    private dialog: MatDialog, // работа с диалог. окнами
    private statService: StatisticService,
    private introService: IntroService,
    private deviceService: DeviceDetectorService,
    private spinnerService: SpinnerService
  ) {
    this.spinner = spinnerService;

    this.statService.getStatistic().subscribe((result => {     // сначала получаем данные статистики
      this.stat = result;
      this.uncompletedCountForCategoryAll = this.stat.uncompletedTotal;
      // заполнить категории
      this.fillAllCategories().subscribe(res => {
        this.categories = res;
        //пытаемся восстановить cookies, если они были ранее
        if (!this.initSearchCookies()) {
          this.taskSearchValues = new TaskSearchValues();
          this.taskSearchValues.pageSize = this.defaultPageSize;
          this.taskSearchValues.pageNumber = this.defaultPageNumber;
        }
        if (this.isMobile) {
          this.showStat = false; // для мобильных устройств никогда не показываем статистику
        } else {
          this.initShowStatCookie();
        }
        this.initShowSearchCookie();
        // первоначальное отображение задач при загрузке приложения
        // запускаем только после выполнения статистики (т.к. понадобятся ее данные) и загруженных категорий
        this.selectCategory(this.selectedCategory);
      });
    }));

    // определяем тип устройства
    this.isMobile = deviceService.isMobile();
    this.isTablet = deviceService.isTablet();

    this.showStat = !this.isMobile;
    this.showSearch = !this.isMobile;

    this.setMenuValues();
  }

  ngOnInit() {
    // для мобильных и планшетов - не показывать интро
    if (!this.isMobile && !this.isTablet) {
      // this.introService.startIntroJs(true);
    }
    // заполнить категории
    this.fillAllCategories().subscribe(res => {
      this.categories = res;
      // первоначальное отображение задач при загрузке приложения
      // запускаем только после выполнения статистики (т.к. понадобятся ее данные) и загруженных категорий
      this.selectCategory(this.selectedCategory);
    });
    // заполнить приоритеты
    this.fillAllPriorities();
  }

  /* Categories */

  // добавление категории
  addCategory(category: Category) {
    this.categoryService.create(category).subscribe(() => {
        // если вызов сервиса завершился успешно - добавляем новую категорию в локальный массив categories
        this.searchCategory(this.categorySearchValues);
      }
    );
  }

  // удаление категории
  deleteCategory(category: Category) {
    this.categoryService.delete(category.id).subscribe(() => {
      this.selectedCategory = null; // выбираем категорию "Все"
      // когда придет результат - обновим все категории в поиске
      this.searchCategory(this.categorySearchValues);
      this.selectCategory(this.selectedCategory);
    });
  }

  // обновлении категории
  updateCategory(category: Category) {
    this.categoryService.update(category).subscribe(() => {
      this.searchCategory(this.categorySearchValues); // обновляем список категорий
      this.searchTasks(this.taskSearchValues); // обновляем список задач
    });
  }


  // заполняет категории и кол-во невыполненных задач по каждой из них (нужно для отображения категорий)
  fillAllCategories(): Observable<Category[]> {
    return this.categoryService.findAll();
  }


  // поиск категории
  searchCategory(categorySearchValues: CategorySearchValues) {
    this.categoryService.findCategories(categorySearchValues).subscribe(result => {
      this.categories = result;
    });
  }


  // изменение категории
  selectCategory(category: Category): void {
    if (category) { // если это не категория Все - то заполняем дэш данными выбранной категории
      this.fillDashData(category.completedCount, category.uncompletedCount);
    } else {
      this.fillDashData(this.stat.completedTotal, this.stat.uncompletedTotal); // заполняем дэш данными для категории Все
    }
    // сбрасываем, чтобы показывать результат с первой страницы
    this.taskSearchValues.pageNumber = 0;
    this.selectedCategory = category;
    this.taskSearchValues.categoryId = category ? category.id : null;
    this.searchTasks(this.taskSearchValues);
    if (this.isMobile) {
      this.menuOpened = false; // для телефонов - автоматически скрываем боковое меню
    }
  }


  /* Tasks */

  addTask(task: Task) {
    this.taskService.create(task).subscribe(() => {
      if (task.category) { // если в новой задаче была указана категория
        this.updateCategoryCounter(task.category); // обновляем счетчик для указанной категории
      }
      this.updateOverallCounter(); // обновляем всю статистику (в том числе счетчик для категории "Все")
      this.searchTasks(this.taskSearchValues); // обновляем список задач
    });
  }

  updateTask(task: Task) {
    this.taskService.update(task).subscribe(() => {
      if (task.oldCategory) { // если в измененной задаче старая категория была указана
        this.updateCategoryCounter(task.oldCategory); // обновляем счетчик для старой категории
      }
      if (task.category) { // если в измененной задаче новая категория была указана
        this.updateCategoryCounter(task.category); // обновляем счетчик для новой категории
      }
      this.updateOverallCounter(); // обновляем всю статистику (в том числе счетчик для категории "Все")
      this.searchTasks(this.taskSearchValues); // обновляем список задач
    });
  }

  onDeleteTask(task: Task) {
    this.taskService.delete(task.id).subscribe(() => {
      if (task.category) { // если в удаленной задаче была указана категория
        this.updateCategoryCounter(task.category); // обновляем счетчик для указанной категории
      }
      this.updateOverallCounter(); // обновляем всю статистику (в том числе счетчик для категории "Все")
      this.searchTasks(this.taskSearchValues); // обновляем список задач
    });
  }

  // Поиск задач
  searchTasks(searchTaskValues: TaskSearchValues) {
    this.taskSearchValues = searchTaskValues;
    this.cookiesUtils.setCookie(this.cookieTaskSearchValues, JSON.stringify(this.taskSearchValues));
    this.taskService.searchTask(this.taskSearchValues).subscribe(result => {
      // Если выбранная страница для отображения больше, чем всего страниц - заново делаем поиск и показываем 1ю страницу.
      // Если пользователь был например на 2й странице общего списка и выполнил новый поиск, в результате которого доступна только 1 страница,
      // то нужно вызвать поиск заново с показом 1й страницы (индекс 0)
      if (result.totalPages > 0 && this.taskSearchValues.pageNumber >= result.totalPages) {
        this.taskSearchValues.pageNumber = 0;
        this.searchTasks(this.taskSearchValues);
      }
      this.totalTasksFounded = result.totalElements; // сколько данных показывать на странице
      this.tasks = result.content; // массив задач
    });
  }

  /* Priorities */

  // заполняет массив приоритетов
  fillAllPriorities() {
    this.priorityService.findAll().subscribe(result => {
      this.priorities = result;
    });
  }


  /* Statistic */

  // заполнить дэш конкретными значениями
  fillDashData(completedCount: number, uncompletedCount: number) {
    this.dash.completedTotal = completedCount;
    this.dash.uncompletedTotal = uncompletedCount;
  }

  // обновить общую статистику и счетчик для категории Все (и показать эти данные в дашборде, если выбрана категория "Все")
  updateOverallCounter() {
    this.statService.getStatistic().subscribe((res => { // получить из БД актуальные данные
      this.stat = res; // получили данные из БД
      this.uncompletedCountForCategoryAll = this.stat.uncompletedTotal; // для счетчика категории "Все"
      if (!this.selectedCategory) { // если выбрана категория "Все" (selectedCategory === null)
        this.fillDashData(this.stat.completedTotal, this.stat.uncompletedTotal); // заполнить дашборд данными общей статистики
      }
    }));
  }

  // обновить счетчик конкретной категории (и показать эти данные в дашборде, если выбрана эта категория)
  updateCategoryCounter(category: Category) {
    this.categoryService.findById(category.id).subscribe(cat => { // получить из БД актуальные данные
      this.categories[this.getCategoryIndex(category)] = cat; // заменить в локальном массиве
      this.showCategoryDashboard(cat);  // показать дашборд со статистикой категории
    });
  }

  // показать дэшборд с данными статистики из категории
  showCategoryDashboard(cat: Category) {
    if (this.selectedCategory && this.selectedCategory.id === cat.id) { // если выбрана та категория, где сейчас работаем
      this.fillDashData(cat.completedCount, cat.uncompletedCount); // заполнить дашборд данными статистики из категории
    }
  }

  toggleStatistic(showStatistic: boolean) {
    this.showStat = showStatistic;
    this.cookiesUtils.setCookie(this.cookieShowStat, String(showStatistic));
  }

  // параметры меню
  setMenuValues() {
    this.menuPosition = 'left';

    if (this.isMobile) {
      this.menuOpened = false;
      this.menuMode = 'over';
      this.showBackdrop = true;
    } else {
      this.menuOpened = true;
      this.menuMode = 'push';
      this.showBackdrop = false;
    }
  }

  // показать скрыть меню
  toggleMenu() {
    this.menuOpened = !this.menuOpened;
  }

  // если закрыли меню любым способом - ставим значение false
  onClosedMenu() {
    this.menuOpened = false;
  }


  // изменили кол-во элементов на странице или перешли на другую страницу
  // с помощью paginator
  paging(pageEvent: PageEvent) {
    // если изменили настройку "кол-во на странице" - заново делаем запрос и показываем с 1й страницы
    if (this.taskSearchValues.pageSize !== pageEvent.pageSize) {
      this.taskSearchValues.pageNumber = 0; // новые данные будем показывать с 1-й страницы (индекс 0)
    } else {
      // если просто перешли на другую страницу
      this.taskSearchValues.pageNumber = pageEvent.pageIndex;
    }
    this.taskSearchValues.pageSize = pageEvent.pageSize;
    this.taskSearchValues.pageNumber = pageEvent.pageIndex;
    this.searchTasks(this.taskSearchValues); // показываем новые данные
  }

  // показать-скрыть поиск
  toggleSearch(showSearch: boolean) {
    this.showSearch = showSearch;
    this.cookiesUtils.setCookie(this.cookieShowStat, String(showSearch));
  }

  getCategoryIndex(category: Category): number {
    const tmpCategory = this.categories.find(t => t.id === category.id);
    return this.categories.indexOf(tmpCategory);
  }

  settingsChanged(priorities: Priority[]) {
    // this.fillAllPriorities(); // заново загрузить все категории из БД (чтобы их можно было сразу использовать в задачах)
    this.priorities = priorities; // получаем измененные массив с приоритетами
    this.searchTasks(this.taskSearchValues); // обновить текущие задачи и категории для отображения
  }

  initSearchCookies(): boolean {
    const cookie = this.cookiesUtils.getCookie(this.cookieTaskSearchValues);
    if (!cookie) return false; // cookie not found
    const cookieJSON = JSON.parse(cookie);
    if (!cookieJSON) return false; // cookie not found
    if (!this.taskSearchValues) {
      this.taskSearchValues = new TaskSearchValues();
    }
    const tmpPageSize = cookieJSON.pageSize;
    if (tmpPageSize) {
      this.taskSearchValues.pageSize = Number(tmpPageSize);
    }
    const tmpCategoryId = cookieJSON.categoryId;
    if (tmpCategoryId) {
      this.taskSearchValues.categoryId = Number(tmpCategoryId);
      this.selectedCategory = this.getCategoryFromArray(tmpCategoryId);
    }
    const tmpPriorityId = cookieJSON.priorityId;
    if (tmpPriorityId) {
      this.taskSearchValues.priorityId = Number(tmpPriorityId);
    }
    const tmpTitle = cookieJSON.title;
    if (tmpTitle) {
      this.taskSearchValues.title = tmpTitle;
    }
    const tmpCompleted = cookieJSON.completed;
    if (tmpCompleted) {
      this.taskSearchValues.completed = tmpCompleted;
    }
    const tmpSortColumn = cookieJSON.sortColumn;
    if (tmpSortColumn) {
      this.taskSearchValues.sortColumn = tmpSortColumn;
    }
    const tmpSortDirection = cookieJSON.sortDirection;
    if (tmpSortDirection) {
      this.taskSearchValues.sortDirection = tmpSortDirection;
    }
    return true; // кук был найден и загружен
  }

  getCategoryFromArray(id: number): Category {
    return this.categories.find(t => t.id === id);
  }

  private initShowSearchCookie() {
    const val = this.cookiesUtils.getCookie(this.cookieShowSearch);
    if (val) this.showSearch = val === 'true';
  }

  private initShowStatCookie() {
    if (!this.isMobile) {
      const val = this.cookiesUtils.getCookie(this.cookieShowStat);
      if (val) this.showStat = val === 'true';
    }
  }
}
