import { useQuery } from "@tanstack/react-query";
import { User } from "../types";
import { getUserReviews } from "../utils/api";

export function useUserReviews(userId: User["id"]) {
  return useQuery({
    queryKey: ["reviews", { postedToId: userId }],
    queryFn: () => getUserReviews(userId),
  });
}
