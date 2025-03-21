import IconButton from "../../components/ui/buttons/IconButton";
import TextInput from "../../components/ui/inputs/TextInput";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton";
import { Link, useNavigate } from "react-router";
import circleArrowLeftIcon from "../../assets/icons/circle-arrow-left-icon.svg";
import { motion } from "framer-motion";
import { fadeIn } from "../../utils/motion";
import { useForm } from "react-hook-form";
import {
  forgotPasswordApi,
  resetPasswordApi,
} from "../../services/api.service";
import { useContext } from "react";
import { RecoveryContext } from "../../components/context/RecoveryContext";
import notify from "../../components/ui/CustomToast";

const ResetPassword = () => {
  const navigate = useNavigate();

  const { email } = useContext(RecoveryContext);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm();

  const onSubmit = async (values) => {
    const res = await resetPasswordApi(email, values.code, values.new_password);
    if (res.data) {
      notify(
        "success",
        "Password Updated!",
        "Your password has been successfully reset",
        "var(--color-silver-tree)",
      );
      navigate("/login");
    } else {
      if (res.code === 400) {
        setError(
          "code",
          {
            type: "custom",
            message: "Invalid or expired OTP",
          },
          {
            shouldFocus: true,
          },
        );
        return;
      }
      notify(
        "error",
        "Reset Failed",
        "Unable to reset your password",
        "var(--color-crimson-red)",
      );
    }
  };

  const handleResendCode = async () => {
    const res = await forgotPasswordApi(email);
    if (res.data) {
      notify(
        "success",
        "Code Resent",
        "A new verification code has been sent to your email. Please check your inbox",
        "var(--color-silver-tree)",
        "top-center",
      );
    } else {
      notify(
        "error",
        "Resend Failed",
        "Failed to resend the verification code",
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
        variants={fadeIn("right", 0.4)}
        initial="hidden"
        viewport={{ once: true }}
        whileInView="show"
        className="w-full max-w-96 rounded-[6px] bg-white/60 px-8 py-7 text-center shadow-[0px_4px_20px_rgba(99,104,209,0.4)]"
      >
        <div>
          <h1 className="font-heading text-indigo text-3xl font-bold md:text-[32px]">
            Check your email
          </h1>
          <p className="font-body text-gravel mt-3 text-base">
            We sent a code to <span className="font-semibold">{email}</span>
          </p>
        </div>

        {/* Reset password form */}
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="mt-10 mb-3"
        >
          <div className="flex flex-col items-center gap-5">
            <TextInput
              type="text"
              placeholder="6-digit code"
              {...register("code", {
                required: "Verification code is required",
                pattern: {
                  value: /^\d{6}$/,
                  message: "Verification code must be exactly 6 digits",
                },
              })}
              errorMessage={errors.code}
            />
            <TextInput
              type="password"
              placeholder="New password"
              {...register("new_password", {
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
              errorMessage={errors.new_password}
            />
            <p className="font-body text-ebony-clay text-xs md:text-sm">
              Didn't receive the email?{" "}
              <Link
                onClick={handleResendCode}
                className="font-body text-indigo font-medium"
              >
                Click to resend
              </Link>
            </p>
            <PrimaryButton color="blue" label="Reset password" type="submit" />
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
