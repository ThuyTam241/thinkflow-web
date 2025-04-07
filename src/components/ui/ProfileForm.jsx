import { Controller, useForm } from "react-hook-form";
import TextInput from "./inputs/TextInput";
import PrimaryButton from "./buttons/PrimaryButton";
import IconButton from "./buttons/IconButton";
import { useContext, useEffect, useState } from "react";
import CustomSelect from "./CustomSelect";
import { Tooltip } from "react-tooltip";
import { AuthContext } from "../context/AuthContext";
import notify from "./CustomToast";
import UserRoundPen from "../../assets/icons/user-round-pen.svg";
import X from "../../assets/icons/x.svg";
import EditAvatar from "../../assets/images/edit-avatar.png";
import { motion } from "framer-motion";
import { fullName } from "../../utils/userUtils";
import FileUploadInput from "./inputs/FileUploadInput";
import {
  updateUserProfileApi,
  uploadImageApi,
} from "../../services/api.service";
import { MoonLoader } from "react-spinners";
import Avatar from "../ui/Avatar";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const { user, getUserProfile } = useContext(AuthContext);

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "unknown", label: "Unknown" },
  ];

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    control,
  } = useForm();

  useEffect(() => {
    reset({
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      email: user.email,
      gender: user.gender || "",
    });
    if (!isEditing) {
      setSelectedFile(null);
      setPreview(null);
    }
  }, [isEditing, user]);

  const handleUploadAvatar = async (event) => {
    if (!event.target.files[0] || event.target.files.length === 0) {
      setSelectedFile(null);
      setPreview(null);
      return;
    }
    const file = event.target.files[0];
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (values) => {
    setIsUpdating(true);
    let newAvatarId = user.avatar.id;
    if (selectedFile) {
      setIsUploading(true);
      const resAvatar = await uploadImageApi(selectedFile);
      setIsUploading(false);
      if (resAvatar.data) {
        newAvatarId = resAvatar.data;
      } else {
        notify("error", "Upload avatar failed", "", "var(--color-crimson-red)");
        setIsUpdating(false);
        return;
      }
    }
    console.log("Sending data to API:", {
      first_name: values.first_name,
      last_name: values.last_name,
      gender: values.gender,
      phone: values.phone,
      email: values.email,
      avatar_id: newAvatarId,
    });
    const res = await updateUserProfileApi(
      values.first_name,
      values.last_name,
      values.gender,
      values.phone,
      values.email,
      newAvatarId,
    );
    setIsUpdating(false);
    if (res.data) {
      await getUserProfile();
      notify(
        "success",
        "Profile updated successfully",
        "",
        "var(--color-silver-tree)",
      );
      setIsEditing(false);
    } else {
      notify("error", "Update failed", "", "var(--color-crimson-red)");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative flex w-full flex-col space-y-8"
    >
      <div className="relative mb-16 flex w-fit gap-10">
        <div className="bg-hawkes-blue/60 absolute top-14 -left-2 h-40 w-52 rounded-full blur-[30px]"></div>
        <div className="relative h-48 w-48">
          <Avatar
            src={preview ? preview : user.avatar?.url}
            className={`z-10 h-48 w-48 rounded-full object-cover transition-opacity duration-300 ${isUploading ? "opacity-50" : "opacity-100"}`}
          />
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <MoonLoader size={40} color="#6366F1" />
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center gap-2">
          <h2 className="font-body text-ebony-clay text-xl font-bold">
            {fullName(user)}
          </h2>
          <h3 className="font-body text-gravel text-base">{user.email}</h3>
        </div>
        {isEditing && (
          <motion.div
            className={`absolute -bottom-4 left-30 z-20 ${isUpdating ? "cursor-progress opacity-60" : "opacity-100"}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isEditing ? 1 : 0, y: isEditing ? 0 : 10 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <FileUploadInput
              src={EditAvatar}
              onChange={handleUploadAvatar}
              accept=".jpg,.png"
              disabled={isUploading}
            />
          </motion.div>
        )}
      </div>
      <div className="absolute -top-10 right-0">
        <IconButton
          onClick={() => setIsEditing(!isEditing)}
          data-tooltip-id={
            isEditing ? "discard-changes-tooltip" : "edit-profile-tooltip"
          }
          data-tooltip-content={isEditing ? "Discard Changes" : "Edit Profile"}
          src={isEditing ? X : UserRoundPen}
        />
        <Tooltip
          id={isEditing ? "discard-changes-tooltip" : "edit-profile-tooltip"}
          place="right"
          style={{
            backgroundColor: "#6368d1",
            color: "white",
            padding: "6px 12px",
            borderRadius: "6px",
          }}
          className="font-body"
        />
      </div>
      <div className="flex gap-8">
        <TextInput
          placeholder="First name"
          {...register("first_name", {
            required: "First name is required",
          })}
          disabled={!isEditing}
          errorMessage={errors.first_name}
        />
        <TextInput
          placeholder="Last name"
          {...register("last_name", {
            required: "Last name is required",
          })}
          disabled={!isEditing}
          errorMessage={errors.last_name}
        />
      </div>

      <div className="flex gap-8">
        <Controller
          control={control}
          name="gender"
          render={({ field }) => (
            <CustomSelect
              {...field}
              isDisabled={!isEditing}
              options={genderOptions}
              value={genderOptions.find((opt) => opt.value === field.value)}
              onChange={(selectedOption) =>
                field.onChange(selectedOption?.value)
              }
            />
          )}
        />
        <TextInput
          type="phone"
          placeholder="Phone"
          {...register("phone", {
            pattern: {
              value: /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/,
              message: "Invalid phone format",
            },
          })}
          disabled={!isEditing}
          errorMessage={errors.phone}
        />
      </div>

      <TextInput
        type="email"
        placeholder="Email"
        {...register("email")}
        disabled
        errorMessage={errors.email}
      />

      <motion.div
        className="mt-4 ml-auto h-10"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: isEditing ? 1 : 0, x: isEditing ? 0 : 10 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {isEditing && (
          <PrimaryButton
            type="submit"
            color="blue"
            label="Save Changes"
            isLoading={isUpdating}
          />
        )}
      </motion.div>
    </form>
  );
};

export default Profile;
