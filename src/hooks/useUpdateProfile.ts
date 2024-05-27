import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "../types";
import { UpdateProfileData, updateProfileData } from "../utils/api";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation<User, Error, UpdateProfileData, unknown>({
    mutationFn: (data) => updateProfileData(data),
    mutationKey: ["user-data"],
    onSuccess: (result) => {
      console.log("result", result);
      queryClient.setQueryData(["user"], result);
    },
  });
}
