// MembersTab — Admin can add and remove members from the group
import { useState } from "react";
import { useMembers } from "../hooks/useMembers";

export default function MembersTab() {
  const { members, addMember, removeMember } = useMembers();
  const [newName, setNewName] = useState("");
  const [confirmRemove, setConfirmRemove] = useState(null);

  const handleAdd = (e) => {
    e.preventDefault();
    if (addMember(newName)) {
      setNewName("");
    }
  };

  return (
    <div>
      {/* Add member form */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="New member name..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2d6a4f]"
        />
        <button
          type="submit"
          disabled={!newName.trim()}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
            newName.trim()
              ? "bg-[#2d6a4f] text-white active:scale-95"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Add
        </button>
      </form>

      <p className="text-xs text-gray-500 mb-3">{members.length} members</p>

      {/* Member list */}
      <div className="space-y-2">
        {members.map((name) => (
          <div
            key={name}
            className="bg-white rounded-xl p-3 border border-gray-100 flex items-center justify-between"
          >
            <span className="text-sm font-medium">{name}</span>
            {confirmRemove === name ? (
              <div className="flex gap-2">
                <button
                  onClick={() => { removeMember(name); setConfirmRemove(null); }}
                  className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold min-h-[36px]"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setConfirmRemove(null)}
                  className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-semibold min-h-[36px]"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmRemove(name)}
                className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-500 text-xs font-medium min-h-[36px] hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
