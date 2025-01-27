import _ from "lodash";

const Pagination: React.FC<PaginationProps> = (props) => {
    const { numberOfItems, pageSize, currentPage, onPageChange } = props;
    const numberOfPages = Math.ceil(numberOfItems / pageSize);
    const pages = _.range(1, numberOfPages + 1); // создаем массив [1, 2, 3, ...]

    if (numberOfPages === 1) {
        return null;
    }
    return (
        <nav aria-label="Page navigation example">
            <ul className="pagination">
                {pages.map((page) => (
                    <li
                        className={
                            `page-item ` +
                            (currentPage === page ? "active" : "")
                        }
                        key={"page_" + page}
                    >
                        <a
                            className="page-link text-secondary-emphasis"
                            onClick={() => onPageChange(page)}
                        >
                            {page}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

interface PaginationProps {
    numberOfItems: number;
    pageSize: number;
    currentPage: number;
    onPageChange: Function;
}

export default Pagination;
