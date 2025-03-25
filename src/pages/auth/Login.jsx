import IconButton from "../../components/ui/buttons/IconButton";
import TextInput from "../../components/ui/inputs/TextInput";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton";
import { Link, useNavigate } from "react-router";
import circleArrowLeftIcon from "../../assets/icons/circle-arrow-left-icon.svg";
import facebookIconButton from "../../assets/icons/facebook-button-icon.svg";
import googleIconButton from "../../assets/icons/google-button-icon.svg";
import { motion } from "framer-motion";
import { fadeIn } from "../../utils/motion";
import Checkbox from "../../components/ui/inputs/Checkbox";
import { useForm } from "react-hook-form";
import {
  loginApi,
  loginFacebookApi,
  loginGoogleApi,
  resendEmailCodeApi,
} from "../../services/api.service";
import notify from "../../components/ui/CustomToast";
import { useContext } from "react";
import { AuthContext } from "../../components/context/AuthContext";
import { EmailVerificationContext } from "../../components/context/EmailVerificationContext";

const LoginPage = () => {
  const navigate = useNavigate();

  const { getUserProfile } = useContext(AuthContext);
  const { setEmail } = useContext(EmailVerificationContext);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    clearErrors,
  } = useForm();

  const onSubmit = async (values) => {
    const res = await loginApi(values.email, values.password);
    if (res.data) {
      notify(
        "success",
        "Login successful!",
        "Welcome back!",
        "var(--color-silver-tree)",
      );
      await getUserProfile();
      navigate("/dashboard");
    } else {
      if (res.code === 403) {
        notify(
          "error",
          "Login failed!",
          "Email address has not been verified. Please check your email for the verification code",
          "var(--color-crimson-red)",
          "top-center",
        );
        setEmail(values.email);
        await resendEmailCodeApi(values.email);
        return navigate("/verify-email");
      }
      if (res.code === 400) {
        setError("custom_error", {
          type: "custom",
          message: "Invalid email or password",
        });
        return;
      }
      notify(
        "error",
        "Login failed!",
        "Something went wrong",
        "var(--color-crimson-red)",
      );
    }
  };

  const handleLoginSocialMedia = async (api) => {
    await api();
    await getProfile();
    navigate("/dashboard");
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
        className="w-full max-w-96 rounded-[6px] bg-white/60 px-5 py-4 text-center shadow-[0px_4px_20px_rgba(99,104,209,0.4)] md:px-8 md:py-7"
      >
        <h1 className="font-heading text-indigo text-2xl font-bold md:text-[32px]">
          Sign In
        </h1>

        {/* Sign in form */}
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 mb-3"
        >
          <div className="flex flex-col items-center gap-4">
            <TextInput
              type="email"
              placeholder="Email"
              {...register("email", { required: "Email is required" })}
              errorMessage={errors.email}
            />
            <TextInput
              type="password"
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
              errorMessage={errors.password}
            />
            {errors.custom_error && (
              <span className="font-body text-crimson-red w-full text-left text-xs font-medium md:text-sm">
                {errors.custom_error.message}
              </span>
            )}
            <div className="mb-2 flex w-full items-center justify-between">
              <Checkbox
                label="Remember me"
                onChange={() => alert("remember")}
              />
              <Link
                to="/forgot-password"
                className="font-body text-indigo text-xs font-medium md:text-sm"
              >
                Forgot password?
              </Link>
            </div>
            <PrimaryButton
              color="blue"
              label="Sign In"
              type="submit"
              onClick={() => clearErrors()}
            />
          </div>
        </form>

        {/* Sign up link */}
        <p className="font-body text-ebony-clay text-xs md:text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="font-body text-indigo font-medium">
            Sign up
          </Link>
        </p>

        {/* Social media authentication */}
        <div className="mt-5">
          <p className="font-body text-silver-chalice before:bg-silver-chalice/50 after:bg-silver-chalice/50 flex items-center gap-2 text-xs font-light before:block before:h-[1px] before:w-1/2 after:block after:h-[1px] after:w-1/2">
            OR
          </p>
          <div className="mt-5 flex justify-center gap-5">
            <IconButton
              onClick={() => handleLoginSocialMedia(loginGoogleApi)}
              src={googleIconButton}
            />
            <IconButton
              onClick={() => handleLoginSocialMedia(loginFacebookApi)}
              src={facebookIconButton}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
