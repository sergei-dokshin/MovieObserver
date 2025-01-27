import { ChangeEvent } from "react";

const FilterInput: React.FC<FilterInputProps> = ({ filter, handleChange }) => {
    return (
        <div className="input-group mb-3">
            <input
                type="text"
                className="form-control bg-body-secondary"
                value={filter}
                placeholder="Поиск по имени пользователя..."
                onChange={handleChange}
            />
        </div>
    );
};

interface FilterInputProps {
    filter: string;
    handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default FilterInput;
