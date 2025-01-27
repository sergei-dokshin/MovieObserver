type PaginateFunction<T> = (
    items: T[],
    startIndex: number,
    pageSize: number
) => T[];

export const paginate: PaginateFunction<any> = (items, startIndex, pageSize) => {
    return [...items].splice(startIndex, pageSize);
};