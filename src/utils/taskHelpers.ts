export const taskStatusDisplay = (projectStatus: TaskStatus) => {
  switch (projectStatus) {
    case "Awaiting": {
      return "Awaiting approval";
    }

    case "Progress": {
      return "In progress";
    }

    case "Approved": {
      return "Approved by admins";
    }

    case "Rejected": {
      return "Rejected by admins";
    }

    default: {
      return "Unknown project status";
    }
  }
};
