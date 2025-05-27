import { Search } from "lucide-react";

const SearchBar = ({ register }) => {
  return (
    <div className="flex items-center">
      <Search className="text-gravel h-4 w-4 min-w-4" />
      <input
        spellCheck="false"
        type="search"
        name="search"
        {...register("searchTitle")}
        placeholder="Search"
        className="font-body text-ebony-clay w-full px-3 py-[6px] text-sm outline-none md:text-base"
      />
    </div>
  );
};

export default SearchBar;
