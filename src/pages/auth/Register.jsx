import IconButton from "../../components/ui/buttons/IconButton";
import TextInput from "../../components/ui/inputs/TextInput";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton";
import { Link, useNavigate } from "react-router";
import circleArrowLeftIcon from "../../assets/icons/circle-arrow-left-icon.svg";
import facebookIconButton from "../../assets/icons/facebook-button-icon.svg";
import googleIconButton from "../../assets/icons/google-button-icon.svg";
import { motion } from "framer-motion";
import { fadeIn } from "../../utils/motion";
import { useForm } from "react-hook-form";
import { registerUserApi } from "../../services/api.service";
import notify from "../../components/ui/CustomToast";

const RegisterPage = () => {
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm();

  const onSubmit = async (values) => {
    const res = await registerUserApi(
      values.email,
      values.password,
      values.first_name,
      values.last_name,
    );
    if (res.data) {
      notify(
        "success",
        "Account created!",
        "Thanks for joining us",
        "var(--color-silver-tree)",
      );
      navigate("/login");
    } else {
      if (res.code === 400) {
        setError(
          "email",
          {
            type: "custom",
            message: "Email already exists",
          },
          {
            shouldFocus: true,
          },
        );
        return;
      }
      notify(
        "error",
        "Registration failed!",
        "Something went wrong",
        "var(--color-crimson-red)",
      );
    }
  };

  return (
    <div className="from-hawkes-blue flex h-screen items-center justify-center bg-gradient-to-b via-[rgba(218,215,252,0.6)] to-[rgba(218,215,252,0.15)] px-6">
      {/* Back button */}
      <motion.div
        variants={fadeIn("right", 0.2)}
        initial="hidden"
        viewport={{ once: true }}
        whileInView="show"
        whileHover={{ boxShadow: "0px 6px 20px rgba(0,0,0,0.1)" }}
        className="absolute top-6 left-6 h-12 rounded-full md:top-10 md:left-[60px]"
      >
        <IconButton
          onClick={() => {
            navigate(-1);
          }}
          src={circleArrowLeftIcon}
        />
      </motion.div>

      <motion.div
        variants={fadeIn("up", 0.4)}
        initial="hidden"
        viewport={{ once: true }}
        whileInView="show"
        className="w-full max-w-96 rounded-[6px] bg-white/60 px-8 py-7 text-center shadow-[0px_4px_20px_rgba(99,104,209,0.4)]"
      >
        <h1 className="font-heading text-indigo text-3xl font-bold md:text-[32px]">
          Sign Up
        </h1>

        {/* Sign up form */}
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 mb-3"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="flex w-full flex-col gap-4 md:flex-row md:gap-4">
              <TextInput
                placeholder="First name"
                {...register("first_name", {
                  required: "First name is required",
                })}
                errorMessage={errors.first_name}
              />
              <TextInput
                placeholder="Last name"
                {...register("last_name", {
                  required: "Last name is required",
                })}
                errorMessage={errors.last_name}
              />
            </div>
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
            <TextInput
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!])/,
                  message:
                    "Password must contain uppercase, lowercase, number, and special character",
                },
              })}
              errorMessage={errors.password}
            />
            <p className="font-body text-ebony-clay text-left text-xs md:text-sm">
              By signing up, you agree to our{" "}
              <Link to="#" className="font-body text-indigo font-medium">
                Term of Use & Privacy Policy
              </Link>
            </p>
            <PrimaryButton color="blue" label="Sign Up" type="submit" />
          </div>
        </form>

        {/* Sign in link */}
        <p className="font-body text-ebony-clay text-xs md:text-sm">
          Already have an account?{" "}
          <Link to="/login" className="font-body text-indigo font-medium">
            Sign in
          </Link>
        </p>

        {/* Social media authentication */}
        <div className="mt-5">
          <p className="font-body text-silver-chalice before:bg-silver-chalice/50 after:bg-silver-chalice/50 flex items-center gap-2 text-xs font-light before:block before:h-[1px] before:w-1/2 after:block after:h-[1px] after:w-1/2">
            OR
          </p>
          <div className="mt-5 flex justify-center gap-5">
            <IconButton
              onClick={() => {
                alert("gg auth");
              }}
              src={googleIconButton}
            />
            <IconButton
              onClick={() => {
                alert("fb auth");
              }}
              src={facebookIconButton}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
