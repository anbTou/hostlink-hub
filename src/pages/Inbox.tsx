import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const InboxPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to main inbox by default
    navigate("/inbox/main", { replace: true });
  }, [navigate]);

  return null;
};

export default InboxPage;
