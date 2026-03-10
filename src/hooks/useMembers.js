// Shared hook for managing the member list in Firestore
import { useFirestore } from "./useFirestore";
import { defaultMembers } from "../data/members";

export function useMembers() {
  const [members, setMembers] = useFirestore("lambdagolf_members", defaultMembers);

  const addMember = (name) => {
    const trimmed = name.trim();
    if (!trimmed || members.includes(trimmed)) return false;
    setMembers((prev) => [...prev, trimmed].sort());
    return true;
  };

  const removeMember = (name) => {
    setMembers((prev) => prev.filter((m) => m !== name));
  };

  return { members, addMember, removeMember };
}
