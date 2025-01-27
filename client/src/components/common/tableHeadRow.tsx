import { OrderBy } from "../../types/usersList.types";

const TableHeadRow: React.FC<TableHeadRowProps> = (props) => {
    const { handleSort, orderBy, tableHeadData } = props;
    function renderSortArrow(iter: string) {
        const iconClassName = `bi bi-caret-${
            orderBy.order === "asc" ? "up" : "down"
        }-fill`;
        return (
            <i
                style={{
                    visibility: iter === orderBy.iter ? undefined : "hidden"
                }}
                className={iconClassName}
            ></i>
        );
    }

    return (
        <tr>
            {tableHeadData.map((data) => {
                if (data.sortType) {
                    return (
                        <th
                            onClick={() => handleSort(data.sortType)}
                            scope="col"
                            key={data.name}
                        >
                            {data.name}
                            {renderSortArrow(data.sortType)}
                        </th>
                    );
                } else {
                    return (
                        <th scope="col" key={data.name}>
                            {data.name}
                        </th>
                    );
                }
            })}
        </tr>
    );
};

interface TableHeadData {
    name: string;
    sortType: string;
}

interface TableHeadRowProps {
    handleSort: (head: string) => void;
    orderBy: OrderBy;
    tableHeadData: TableHeadData[];
}

export default TableHeadRow;
