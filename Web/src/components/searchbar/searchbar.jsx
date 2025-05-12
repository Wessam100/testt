import'./searchbar.css'

export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search books..."
        value={value}
        onChange={onChange}
        className="search-input"
      />
    </div>
  );
}



