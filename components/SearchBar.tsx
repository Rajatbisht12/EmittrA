import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function SearchBar() {
  return (
    <form className="flex flex-col sm:flex-row w-full max-w-xs sm:max-w-md items-stretch sm:items-center gap-2 sm:gap-0">
      <Input type="search" placeholder="Search..." className="flex-1 rounded-b-none sm:rounded-b-none sm:rounded-r-none" />
      <Button type="submit" variant="outline" className="w-full sm:w-auto rounded-t-none sm:rounded-t-none sm:rounded-l-none">
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
}
