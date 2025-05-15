import { ChevronDown, ChevronUp } from "lucide-react";
import TextArea from "./inputs/TextArea";
import IconButton from "./buttons/IconButton";

const Summary = ({
  customStyle = "",
  showSummary,
  setShowSummary,
  isSummarizing,
  permission,
  register,
  registerField,
}) => {
  return (
    <div className={`${customStyle}`}>
      <IconButton
        onClick={() => setShowSummary(!showSummary)}
        icon={showSummary ? ChevronUp : ChevronDown}
        label="Summary"
        isProcessing={isSummarizing}
      />

      {showSummary && (
        <div className="mt-2 rounded-md border border-gray-200 p-3 dark:border-gray-100/20">
          <TextArea
            register={register(registerField)}
            disabled={isSummarizing || permission === "read"}
          />
        </div>
      )}
    </div>
  );
};

export default Summary;
