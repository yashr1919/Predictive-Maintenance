/**
 * Evaluates machine status strictly determined by Fault state.
 * @param {number} fault (0: Healthy, 0.5: Warning, 1: Critical)
 * @returns {object} { label, color }
 */
export const getStatusFromFault = (fault) => {
  if (fault === 1) {
    return { label: "Critical", color: "red" };
  } else if (fault === 0.5) {
    return { label: "Warning", color: "orange" };
  } else {
    // Default to strict 0 Healthy, or any other baseline
    return { label: "Healthy", color: "green" };
  }
};

/**
 * Returns descriptive condition explicitly tracking RUL.
 * (This does not override fault-based status as per requirements).
 * @param {number} rul 
 * @returns {string} 
 */
export const getRulCategory = (rul) => {
  if (rul > 60) {
    return "Good";
  } else if (rul > 30 && rul <= 60) {
    return "Moderate";
  } else {
    return "High Risk";
  }
};
