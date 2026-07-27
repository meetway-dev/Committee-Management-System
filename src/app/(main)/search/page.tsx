"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { searchAll } from "@/actions/search.actions";
import { formatCurrency, getInitials } from "@/utils/format";
import { Search, Users, User, Loader2 } from "lucide-react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{
    committees: Array<{
      _id: string;
      name: string;
      description?: string;
      status: string;
      contributionAmount: number;
      currency: string;
      frequency: string;
    }>;
    users: Array<{
      _id: string;
      name: string;
      email: string;
      image?: string;
    }>;
  }>({ committees: [], users: [] });
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(
    async (value: string) => {
      setQuery(value);
      if (value.length < 2) {
        setResults({ committees: [], users: [] });
        setSearched(false);
        return;
      }

      setLoading(true);
      try {
        const data = await searchAll(value);
        setResults(data);
        setSearched(true);
      } catch {
        setResults({ committees: [], users: [] });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const totalResults = results.committees.length + results.users.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Search</h1>
        <p className="text-sm text-muted-foreground">
          Find committees and members
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or committee..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {!searched && !loading && (
        <EmptyState
          icon={Search}
          title="Search for anything"
          description="Type at least 2 characters to search for committees and members."
        />
      )}

      {searched && totalResults === 0 && (
        <EmptyState
          icon={Search}
          title="No results found"
          description={`No results found for "${query}". Try a different search term.`}
        />
      )}

      {results.committees.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4" />
              Committees ({results.committees.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {results.committees.map((committee) => (
              <Link
                key={committee._id}
                href={`/committees/${committee._id}`}
                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{committee.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(
                      committee.contributionAmount,
                      committee.currency
                    )}{" "}
                    / {committee.frequency}
                  </p>
                </div>
                <StatusBadge status={committee.status} />
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      {results.users.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4" />
              Members ({results.users.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {results.users.map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.image || ""} alt={user.name} />
                  <AvatarFallback className="text-xs">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
