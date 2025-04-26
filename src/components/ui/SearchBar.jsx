import { Search } from "lucide-react";

const SearchBar = () => {
  return (
    <div className="flex items-center w-48">
      <Search className="text-gravel min-w-4 h-4 w-4" />
      <input
        type="search"
        name="search"
        placeholder="Search"
        className="font-body text-ebony-clay py-[6px] px-3 outline-none text-sm md:text-base"
      />
    </div>
  );
};

export default SearchBar;
