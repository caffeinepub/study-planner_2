export type LeaveReason =
  | "sick"
  | "family"
  | "personal"
  | "emergency"
  | "other";

export interface ReasonOption {
  value: LeaveReason;
  label: string;
  sentence: string;
}

export const LEAVE_REASONS: ReasonOption[] = [
  {
    value: "sick",
    label: "Sick Leave",
    sentence:
      "I am not feeling well and need to rest at home to recover. I have been advised by my doctor to take rest.",
  },
  {
    value: "family",
    label: "Family Function",
    sentence:
      "I need to attend an important family function that requires my presence. This is a significant family occasion that I cannot miss.",
  },
  {
    value: "personal",
    label: "Personal Work",
    sentence:
      "I have some urgent personal work that needs my immediate attention. This matter requires me to be away from school/college.",
  },
  {
    value: "emergency",
    label: "Emergency",
    sentence:
      "Due to an unforeseen emergency situation in my family, I need to take leave. This is an urgent matter that requires my immediate presence.",
  },
  {
    value: "other",
    label: "Other (Custom Input)",
    sentence: "",
  },
];

export function getReasonSentence(
  reason: LeaveReason,
  customReason?: string,
): string {
  if (reason === "other" && customReason) {
    return customReason.trim();
  }

  const reasonOption = LEAVE_REASONS.find((r) => r.value === reason);
  return reasonOption?.sentence || "";
}
