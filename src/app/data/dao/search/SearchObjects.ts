export class CategorySearchValues {
  title: string = null;
}

export class TaskSearchValues {
  title = '';
  completed: number = null;
  priorityId: number = null;
  categoryId: number = null;
  pageNumber = 0;
  pageSize = 10;

  sortColumn = 'id';
  sortDirection = 'asc';
}

export class PrioritySearchValues {
  title: string = null;
}
