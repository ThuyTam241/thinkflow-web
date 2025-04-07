const FileUploadInput = ({ src, disabled, ...props }) => {
  return (
    <label
      className={`cursor-pointer ${disabled ? "pointer-events-none cursor-not-allowed opacity-60" : ""}`}
    >
      <img src={src} alt="upload" />
      <input type="file" className="hidden" disabled={disabled} {...props} />
    </label>
  );
};

export default FileUploadInput;
