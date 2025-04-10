import IconButton from "../../components/ui/buttons/IconButton";
import TextInput from "../../components/ui/inputs/TextInput";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton";
import { useNavigate } from "react-router";
import circleArrowLeftIcon from "../../assets/icons/circle-arrow-left-icon.svg";
import circleArrowLeftIconDark from "../../assets/icons/circle-arrow-left-icon-dark.svg";
import { motion } from "framer-motion";
import { fadeIn } from "../../utils/motion";
import { useForm } from "react-hook-form";
import { forgotPasswordApi } from "../../services/api.service";
import { useContext, useState } from "react";
import { EmailVerificationContext } from "../../components/context/EmailVerificationContext";
import notify from "../../components/ui/CustomToast";
import { ThemeContext } from "../../components/context/ThemeContext";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [isSend, setIsSend] = useState(false);

  const { setEmail } = useContext(EmailVerificationContext);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm();

  const onSubmit = async (values) => {
    setIsSend(true);
    const res = await forgotPasswordApi(values.email);
    setIsSend(false);
    if (res.data) {
      setEmail(values.email);
      navigate("/reset-password");
    } else {
      if (res.code === 400) {
        setError(
          "email",
          {
            type: "custom",
            message: "Email is not registered. Please check again!",
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
        "Failed to send the verification code",
        "var(--color-crimson-red)",
      );
    }
  };

  const { theme } = useContext(ThemeContext);

  return (
    <div className="flex h-screen items-center justify-center bg-[radial-gradient(50%_50%_at_50%_50%,_#DAD7FC_0%,_#EDEBFE_50%,_#FFFFFF_100%)] px-6 dark:bg-[radial-gradient(50%_50%_at_50%_50%,_#4C3D99_0%,_rgba(43,35,101,0.5)_50%,_rgba(10,9,48,0)_100%)]">
      {/* Back button */}
      <motion.div
        variants={fadeIn("right", 0.2)}
        initial="hidden"
        viewport={{ once: true }}
        whileInView="show"
        whileHover={{ boxShadow: "0px 6px 20px rgba(39,35,64,0.1)" }}
        className="absolute top-6 left-6 h-12 rounded-full md:top-10 md:left-[60px]"
      >
        <IconButton
          onClick={() => {
            navigate(-1);
          }}
          src={
            theme === "light" ? circleArrowLeftIcon : circleArrowLeftIconDark
          }
        />
      </motion.div>

      <motion.div
        variants={fadeIn("up", 0.4)}
        initial="hidden"
        viewport={{ once: true }}
        whileInView="show"
        className="border-hawkes-blue/50 w-full max-w-96 rounded-md border bg-white/60 px-5 py-4 text-center md:px-8 md:py-7 dark:bg-[#FFFFFF]/5"
      >
        <div>
          <h1 className="font-heading text-indigo text-2xl font-bold md:text-[32px]">
            Forgot Password
          </h1>
          <p className="font-body text-gravel mt-3 text-sm md:text-base">
            Enter your email to reset password
          </p>
        </div>

        {/* Forgot password form */}
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="mt-10 mb-3"
        >
          <div className="flex flex-col items-center gap-5">
            <TextInput
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
              })}
              errorMessage={errors.email}
            />
            <PrimaryButton
              color="blue"
              label="Send code"
              type="submit"
              isProcessing={isSend}
            />
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
