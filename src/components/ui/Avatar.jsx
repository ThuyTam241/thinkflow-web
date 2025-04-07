import blankAvatar from "../../assets/images/blank-avatar.jpg";

const Avatar = ({ src, className }) => {
  return (
    <img
      className={`${className}`}
      src={src || blankAvatar}
      alt="user-avatar"
    />
  );
};

export default Avatar;
