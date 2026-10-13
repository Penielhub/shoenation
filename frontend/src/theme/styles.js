// shared sx styles for the pages that talk to the backend

// main call-to-action: black pill that turns yellow on hover, like the theme's buttons inverted
export const primaryButton = {
  bgcolor: "black",
  color: "white",
  borderColor: "black",
  "&:hover": { bgcolor: "rgb(255, 219, 48)", color: "black" },
  "&.Mui-disabled": { bgcolor: "rgb(200,200,200)", color: "white", borderColor: "rgb(200,200,200)" },
};

// rounded inputs to match the footer's email field
export const pillInput = {
  "& .MuiOutlinedInput-root": { borderRadius: 99, fontFamily: "Lato, sans-serif" },
  "& .MuiOutlinedInput-root.Mui-focused fieldset": { borderColor: "black" },
  "& label.Mui-focused": { color: "black" },
};
