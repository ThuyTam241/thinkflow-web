import { useParams, useNavigate } from "react-router";
import { useEffect } from "react";
import { acceptSharedNoteApi } from "../../services/api.service";
import notify from "../../components/ui/CustomToast";
import { HashLoader } from "react-spinners";

const AcceptSharedNote = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const handleAcceptSharedNote = async () => {
    const sharedNote = await acceptSharedNoteApi(token);
    if (!sharedNote.data) {
      notify(
        "error",
        "Accept shared note failed",
        "",
        "var(--color-crimson-red)",
      );
      return;
    }
    sessionStorage.setItem("activeSharedNoteId", sharedNote.data.note.id);
    navigate("/workspace/notes/shared-notes");
  };

  useEffect(() => {
    handleAcceptSharedNote();
  }, [token]);

  return (
    <div className="flex h-screen items-center justify-center gap-5">
      <HashLoader color="#6b76f6" size={35} />
      <p className="text-indigo text-center text-2xl">
        Loading your shared note...
      </p>
    </div>
  );
};

export default AcceptSharedNote;
