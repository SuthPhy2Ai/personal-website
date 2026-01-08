export const VALID_INVITATION_CODES = [
  "deepawdeepaw", // The required specific code
  "paw-quantum-2025",
  "e3-symmetry-alpha",
  "electron-spin-up",
  "density-functional-x",
  "schrodinger-cat-alive"
];

export const validateInvitationCode = (code: string): boolean => {
  return VALID_INVITATION_CODES.includes(code.trim());
};