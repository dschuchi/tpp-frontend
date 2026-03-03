export interface DataTableOptions {
  page: number;
  itemsPerPage: number;
  sortBy: { key: string; order: 'asc' | 'desc' }[];
  groupBy?: { key: string; order: 'asc' | 'desc' }[];
  search?: string;
}
