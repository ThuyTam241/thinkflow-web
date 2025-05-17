import { X } from "lucide-react";
import TextInput from "../../components/ui/inputs/TextInput";
import { Controller, useForm } from "react-hook-form";
import CustomSelect from "../../components/ui/CustomSelect";
import { useEffect } from "react";

const UserDialog = ({ isOpen, onClose, handleCreateUser, errorCreateUser }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm();

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "unknown", label: "Unknown" },
  ];

  const onSubmit = async (values) => {
    await handleCreateUser({
      first_name: values.first_name,
      last_name: values.last_name,
      password: values.password,
      email: values.email,
      phone: values.phone,
      gender: values.gender,
      system_role: "user",
      status: "waiting_verify",
    });
  };

  useEffect(() => {
    reset();
  }, [])

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-body mx-auto text-xl font-bold text-gray-900 dark:text-white">
            Create New User
          </h2>
          <button
            onClick={onClose}
            className="cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="font-body text-ebony-clay mb-1 block text-sm font-medium">
              Email <span className="text-crimson-red">*</span>
            </label>
            <TextInput
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value:
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: "Invalid email format",
                },
              })}
              errorMessage={errors.email}
            />
          </div>

          <div>
            <label className="font-body text-ebony-clay mb-1 block text-sm font-medium">
              First Name <span className="text-crimson-red">*</span>
            </label>
            <TextInput
              placeholder="First name"
              {...register("first_name", {
                required: "First name is required",
              })}
              errorMessage={errors.first_name}
            />
          </div>

          <div>
            <label className="font-body text-ebony-clay mb-1 block text-sm font-medium">
              Last Name <span className="text-crimson-red">*</span>
            </label>
            <TextInput
              placeholder="Last name"
              {...register("last_name", {
                required: "Last name is required",
              })}
              errorMessage={errors.last_name}
            />
          </div>

          <div>
            <label className="font-body text-ebony-clay mb-1 block text-sm font-medium">
              Password <span className="text-crimson-red">*</span>
            </label>
            <TextInput
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                maxLength: {
                  value: 30,
                  message: "Password must be at most 30 characters",
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!])/,
                  message:
                    "Password must contain uppercase, lowercase, number, and special character",
                },
              })}
              errorMessage={errors.password}
            />
          </div>

          <div>
            <label className="font-body text-ebony-clay mb-1 block text-sm font-medium">
              Phone
            </label>
            <TextInput
              type="phone"
              placeholder="Phone"
              {...register("phone", {
                pattern: {
                  value: /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/,
                  message: "Invalid phone format",
                },
              })}
              errorMessage={errors.phone}
            />
          </div>

          <div>
            <label className="font-body text-ebony-clay mb-1 block text-sm font-medium">
              Gender
            </label>
            <Controller
              control={control}
              name="gender"
              defaultValue="unknown"
              render={({ field }) => (
                <CustomSelect
                  {...field}
                  options={genderOptions}
                  value={genderOptions.find((opt) => opt.value === field.value)}
                  onChange={(selectedOption) =>
                    field.onChange(selectedOption?.value)
                  }
                />
              )}
            />
          </div>

          {errorCreateUser && (
            <span className="font-body text-crimson-red w-full text-left text-xs font-medium md:text-sm">
              {errorCreateUser}
            </span>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-cornflower-blue/80 hover:bg-cornflower-blue cursor-pointer rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserDialog;
