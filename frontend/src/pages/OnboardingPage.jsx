// ✅ UPDATED ONBOARDING PAGE
import { useState } from "react";
import { useLocation } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import { useNavigate } from "react-router-dom";

import {
  LoaderIcon,
  MapPinIcon,
  ShipWheelIcon,
  ShuffleIcon,
  CameraIcon,
} from "lucide-react";
import { LANGUAGES, COMMON_SKILLS } from "../constants";
// import imageCompression from 'browser-image-compression';

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const isEditing = authUser?.isOnboarded;

  const queryClient = useQueryClient();
  const navigate = useNavigate(); // ✅ ADD THIS LINE HERE

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
    skillsOffered: authUser?.skillsOffered || [],
    skillsWanted: authUser?.skillsWanted || [],
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
   onSuccess: () => {
  toast.success("Profile onboarded successfully");

  // ✅ Immediately update isOnboarded in cache
  queryClient.setQueryData(["authUser"], (prev) => ({
    ...prev,
    isOnboarded: true,
  }));

  navigate("/");
},

    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });



  const resizeImage = (file, maxWidth = 300, maxHeight = 300) => {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.8); // 80% quality
      resolve(dataUrl);
    };

    reader.readAsDataURL(file);
  });
};



  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormState({ ...formState, profilePic: reader.result });
    };
      resizeImage(file).then((resizedBase64) => {
      setFormState({ ...formState, profilePic: resizedBase64 });
    });

   };






// const handleImageChange = async (e) => {
//   const file = e.target.files[0];
//   if (!file) return;

//   try {
//     const options = {
//       maxSizeMB: 0.3,
//       maxWidthOrHeight: 300,
//       useWebWorker: true,
//     };

//     const compressedFile = await imageCompression(file, options);
//     const reader = new FileReader();

//     reader.onloadend = () => {
//       setFormState({ ...formState, profilePic: reader.result });
//     };

//     reader.readAsDataURL(compressedFile);
//   } catch (err) {
//     console.error("Image compression failed:", err);
//     toast.error("Failed to process image");
//   }
// };




  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random profile picture generated!");
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            {isEditing ? "Edit Your Profile" : "Complete Your Profile"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PROFILE PIC */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                {formState.profilePic ? (
                  <img src={formState.profilePic} alt="Profile Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button type="button" onClick={handleRandomAvatar} className="btn btn-accent">
                  <ShuffleIcon className="size-4 mr-2" /> Generate Random Avatar
                </button>

                <label className="btn btn-outline btn-sm">
                  Upload from Device
                  <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                </label>
              </div>
            </div>

            {/* FULL NAME */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formState.fullName}
                onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                className="input input-bordered w-full"
                placeholder="Your full name"
              />
            </div>

            {/* BIO */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                name="bio"
                value={formState.bio}
                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                className="textarea textarea-bordered h-24"
                placeholder="Tell others about yourself and your language learning goals"
              />
            </div>

            {/* LANGUAGES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Native Language</span>
                </label>
                <select
                  name="nativeLanguage"
                  value={formState.nativeLanguage}
                  onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                  className="select select-bordered w-full"
                >
                  <option value="">Select your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Learning Language</span>
                </label>
                <select
                  name="learningLanguage"
                  value={formState.learningLanguage}
                  onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value })}
                  className="select select-bordered w-full"
                >
                  <option value="">Select language you're learning</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* SKILLS WANTED */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Skills You Want to Learn</span>
              </label>
              <select
                className="select select-bordered w-full"
                onChange={(e) => {
                  const skill = e.target.value;
                  if (skill && !formState.skillsWanted.includes(skill)) {
                    setFormState({
                      ...formState,
                      skillsWanted: [...formState.skillsWanted, skill],
                    });
                  }
                  e.target.value = "";
                }}
              >
                <option value="">Select a skill to add</option>
                {COMMON_SKILLS.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>

              <div className="flex flex-wrap gap-2 mt-2">
                {formState.skillsWanted.map((skill, index) => (
                  <div key={index} className="badge badge-secondary gap-2 px-3 py-2">
                    {skill}
                    <button
                      type="button"
                      className="ml-1 text-white hover:text-red-300"
                      onClick={() =>
                        setFormState({
                          ...formState,
                          skillsWanted: formState.skillsWanted.filter((_, i) => i !== index),
                        })
                      }
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <input
                type="text"
                className="input input-bordered w-full mt-2"
                placeholder="Type a custom skill and press Enter"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim() !== "") {
                    e.preventDefault();
                    const newSkill = e.target.value.trim();
                    if (!formState.skillsWanted.includes(newSkill)) {
                      setFormState({
                        ...formState,
                        skillsWanted: [...formState.skillsWanted, newSkill],
                      });
                    }
                    e.target.value = "";
                  }
                }}
              />
            </div>

            {/* SKILLS OFFERED */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Skills Offered</span>
              </label>
              <select
                className="select select-bordered w-full"
                onChange={(e) => {
                  const skill = e.target.value;
                  if (skill && !formState.skillsOffered.includes(skill)) {
                    setFormState({
                      ...formState,
                      skillsOffered: [...formState.skillsOffered, skill],
                    });
                  }
                  e.target.value = "";
                }}
              >
                <option value="">Select a skill to add</option>
                {["Graphic Design", "Video Editing", "Photoshop", "Java", "Python", "Full Stack Web"].map(
                  (skill) => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  )
                )}
              </select>

              <div className="flex flex-wrap gap-2 mt-2">
                {formState.skillsOffered.map((skill, index) => (
                  <div key={index} className="badge badge-primary gap-2 px-3 py-2">
                    {skill}
                    <button
                      type="button"
                      className="ml-1 text-white hover:text-red-300"
                      onClick={() =>
                        setFormState({
                          ...formState,
                          skillsOffered: formState.skillsOffered.filter((_, i) => i !== index),
                        })
                      }
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <input
                type="text"
                className="input input-bordered w-full mt-2"
                placeholder="Type a custom skill and press Enter"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim() !== "") {
                    e.preventDefault();
                    const newSkill = e.target.value.trim();
                    if (!formState.skillsOffered.includes(newSkill)) {
                      setFormState({
                        ...formState,
                        skillsOffered: [...formState.skillsOffered, newSkill],
                      });
                    }
                    e.target.value = "";
                  }
                }}
              />
            </div>

            {/* LOCATION */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                <input
                  type="text"
                  name="location"
                  value={formState.location}
                  onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                  className="input input-bordered w-full pl-10"
                  placeholder="City, Country"
                />
              </div>
            </div>

            <button className="btn btn-primary w-full" disabled={isPending} type="submit">
              {!isPending ? (
                <>
                  <ShipWheelIcon className="size-5 mr-2" />
                  {isEditing ? "Update Profile" : "Complete Onboarding"}
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                  {isEditing ? "Updating..." : "Onboarding..."}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
