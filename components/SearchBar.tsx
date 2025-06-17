import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function SearchBar() {
  return (
    <div className="flex w-full max-w-md items-center space-x-2">
      <Input type="search" placeholder="Search..." className="flex-1" />
      <Button type="submit" variant="outline">
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
}
