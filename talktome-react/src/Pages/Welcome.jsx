import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Welcome = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate("/conversation");
    }, 4000);
  }, []);
  return (
    <div style={{ height: "100vh" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "black",
          width: "100%",
          height: "100%",
        }}
      >
        <span
          className="zoom-animation"
          style={{
            color: "white",
            fontFamily: "monospace",
            fontSize: "30px",
            animation: "zoomInOut 4s ease-in-out infinite",
          }}
        >
          Welcome to Talk to Me
        </span>
      </div>
    </div>
  );
};
