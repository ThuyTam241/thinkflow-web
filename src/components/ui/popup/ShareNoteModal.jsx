import { useState } from "react";
import FormModal from "./FormModal";
import TextInput from "../inputs/TextInput";
import Avatar from "../Avatar";
import CustomSelect from "../CustomSelect";
import { Controller } from "react-hook-form";
import {
  createNoteShareLinkApi,
  deletePermissionApi,
  shareLinkToEmailApi,
  updatePermissionApi,
} from "../../../services/api.service";
import { fullName } from "../../../utils/userUtils";
import PrimaryButton from "../buttons/PrimaryButton";
import IconButton from "../buttons/IconButton";
import { Check, Copy } from "lucide-react";
import notify from "../CustomToast";

const ShareNoteModal = ({
  register,
  control,
  getValues,
  dirtyFields,
  noteDetail,
  setNoteDetail,
  showShareModal,
  setShowShareModal,
}) => {
  const [isCopying, setIsCopying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const permissionOptions = [
    { value: "read", label: "Can read" },
    { value: "write", label: "Can write" },
  ];

  const collaboratorPermissionOptions = [
    { value: "read", label: "Can read" },
    { value: "write", label: "Can write" },
    { value: "remove", label: "Remove" },
  ];

  const handleShareNote = async () => {
    setIsCopying(true);

    const permission = getValues("permission");
    const res = await createNoteShareLinkApi(noteDetail.id, permission);
    if (!res.data) {
      notify("error", "Share note failed", "", "var(--color-crimson-red)");
      return;
    }
    const sharedlink = res.data.url;
    await navigator.clipboard.writeText(sharedlink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    setIsCopying(false);
  };

  const handleShareNoteToEmail = async () => {
    setIsSharing(true);

    const permission = getValues("permission");
    const email = getValues("email").trim();
    const res = await shareLinkToEmailApi(noteDetail.id, email, permission);
    if (!res.data) {
      notify("error", "Share note failed", "", "var(--color-crimson-red)");
      return;
    }
    notify("success", "Note shared!", "", "var(--color-silver-tree)");

    setIsSharing(false);
  };

  const handleChangePermission = async (collaboratorId, newValue) => {
    if (newValue === "remove") {
      const removeRes = await deletePermissionApi(
        noteDetail.id,
        collaboratorId,
      );
      if (!removeRes.data) {
        notify(
          "error",
          "Update permission failed",
          "",
          "var(--color-crimson-red)",
        );
        return;
      }
      const newCollaborators = noteDetail.collaborators.filter(
        (collaborator) => collaborator.id !== collaboratorId,
      );
      setNoteDetail((prev) => ({
        ...prev,
        collaborators: newCollaborators,
      }));
    } else {
      const updateRes = await updatePermissionApi(
        noteDetail.id,
        collaboratorId,
        newValue,
      );
      if (!updateRes.data) {
        notify(
          "error",
          "Remove permission failed",
          "",
          "var(--color-crimson-red)",
        );
        return;
      }
    }
  };

  return (
    <FormModal
      isOpen={showShareModal}
      setIsOpen={setShowShareModal}
      title="Share This Note"
    >
      <div className="flex items-center justify-between">
        <span className="font-body text-gravel text-sm whitespace-nowrap">
          Who can access this link?
        </span>
        <Controller
          control={control}
          defaultValue="read"
          name="permission"
          render={({ field }) => (
            <CustomSelect
              {...field}
              customStyle={{
                width: "w-fit",
                text: "text-sm",
                padding: "px-2.5 py-[6px]",
                border: "border border-gray-200 dark:border-gray-100/20",
                borderFocused: "border border-gray-200 dark:border-gray-100/20",
                borderMenu: "border border-gray-200 dark:border-gray-100/20",
                paddingOption: "px-2 py-1.5",
              }}
              options={permissionOptions}
              value={permissionOptions.find((opt) => opt.value === field.value)}
              onChange={(selectedOption) =>
                field.onChange(selectedOption?.value)
              }
            />
          )}
        />
      </div>
      <div className="flex flex-col gap-2.5">
        <span className="font-body text-ebony-clay text-base font-semibold">
          Share note via e-mail
        </span>
        <TextInput placeholder="Email" {...register("email")} />
      </div>
      <div className="flex flex-col justify-center gap-3">
        <span className="font-body text-ebony-clay text-base font-semibold">
          {noteDetail.collaborators && noteDetail.collaborators.length > 0
            ? `${noteDetail.collaborators.length + 1} collaborators in this note`
            : "Not shared with anyone"}
        </span>
        {noteDetail.collaborators && noteDetail.collaborators.length > 0 && (
          <>
            <div className="no-scrollbar flex max-h-[228px] flex-col gap-3 overflow-y-auto">
              {/* Owner */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={noteDetail.owner.avatar?.url}
                    className="h-9 w-9 rounded-full"
                  />
                  <div className="font-body flex flex-col">
                    <span className="text-ebony-clay text-sm font-medium">
                      {fullName(noteDetail.owner)}
                    </span>
                    <span className="text-gravel text-xs">
                      {noteDetail.owner.email}
                    </span>
                  </div>
                </div>
                <div className="font-body text-ebony-clay text-sm">Owner</div>
              </div>

              {/* Other Collaborators */}
              {noteDetail.collaborators.map((collaborator) => (
                <div
                  key={collaborator.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={collaborator.avatar?.url}
                      className="h-9 w-9 rounded-full"
                    />
                    <div className="font-body flex flex-col">
                      <span className="text-ebony-clay text-sm font-medium">
                        {fullName(collaborator)}
                      </span>
                      <span className="text-gravel text-xs">
                        {collaborator.email}
                      </span>
                    </div>
                  </div>
                  <Controller
                    control={control}
                    defaultValue={collaborator.permission}
                    name={`permission-${collaborator.id}`}
                    render={({ field }) => (
                      <CustomSelect
                        {...field}
                        customStyle={{
                          width: "w-fit",
                          padding: "pl-3",
                          text: "text-sm",
                          border: "border-none",
                          borderFocused: "border-none",
                          borderMenu:
                            "border border-gray-200 dark:border-gray-100/20",
                          paddingOption: "px-2 py-1.5",
                        }}
                        options={collaboratorPermissionOptions}
                        value={collaboratorPermissionOptions.find(
                          (opt) => opt.value === field.value,
                        )}
                        onChange={(option) => {
                          const newValue = option?.value;
                          const fieldName = `permission-${collaborator.id}`;

                          if (!newValue) return;
                          field.onChange(newValue);

                          if (!dirtyFields[fieldName]) return;
                          if (!newValue || !dirtyFields[fieldName]) return;

                          handleChangePermission(collaborator.id, newValue);
                        }}
                      />
                    )}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="border-indigo w-[130px] rounded-md border px-4 py-2">
          <IconButton
            onClick={handleShareNote}
            customStyle="text-indigo stroke-[1.5]"
            colorLoad="var(--color-indigo)"
            icon={copied ? Check : Copy}
            label={copied ? "Copied!" : "Copy link"}
            isProcessing={isCopying}
          />
        </div>
        <PrimaryButton
          onClick={handleShareNoteToEmail}
          color="blue"
          label="Send"
          isProcessing={isSharing}
        />
      </div>
    </FormModal>
  );
};

export default ShareNoteModal;
