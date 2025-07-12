// src/pages/UserProfilePage.jsx
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../lib/api";
import { MapPinIcon } from "lucide-react";
import { getLanguageFlag } from "../components/FriendCard";
import { capitialize } from "../lib/utils";

const UserProfilePage = () => {
  const { id } = useParams();

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
  });

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;
  if (isError || !user) return <div className="p-10 text-center">User not found.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="card bg-base-200 p-6">
        <div className="flex items-center gap-6">
          <div className="avatar size-24 rounded-full">
            <img
            src={user.profilePic || "/default-avatar.png"}
            alt={user.fullName}
            className="object-cover w-full h-full"
          />

          </div>
          <div>
            <h2 className="text-2xl font-bold">{user.fullName}</h2>
            {user.location && (
              <p className="text-sm flex items-center opacity-70">
                <MapPinIcon className="size-4 mr-1" />
                {user.location}
              </p>
            )}
            <p className="mt-2 text-sm">{user.bio}</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            <span className="badge badge-secondary">
              {getLanguageFlag(user.nativeLanguage)} Native: {capitialize(user.nativeLanguage)}
            </span>
            <span className="badge badge-outline">
              {getLanguageFlag(user.learningLanguage)} Learning: {capitialize(user.learningLanguage)}
            </span>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Skills Offered:</h3>
            <div className="flex flex-wrap gap-2">
              {user.skillsOffered.map((skill, i) => (
                <span key={i} className="badge badge-primary">{skill}</span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Skills Wanted:</h3>
            <div className="flex flex-wrap gap-2">
              {user.skillsWanted.map((skill, i) => (
                <span key={i} className="badge badge-accent">{skill}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
