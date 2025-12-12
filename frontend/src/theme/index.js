import layout from "./layout";
import { colors } from "./colors";

const theme = {
  layout,
  colors,
  // Add component-specific theme values
  components: {
    button: {
      borderRadius: "0.5rem",
      textCase: "none",
    },
    navbar: {
      padding: "1rem",
    }
  }
};

export default theme;