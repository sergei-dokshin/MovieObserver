export type Order = 'asc' | 'desc';

export interface OrderBy {
	iter: string;
	order: Order;
}
